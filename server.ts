import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini Client with server-side API Key and User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('[Warning] GEMINI_API_KEY is not defined in environment variables.');
}

async function createServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Enforce sensible payload size limit (max 64KB JSON)
  app.use(express.json({ limit: '64kb' }));

  // Enable CORS so GitHub Pages or external frontends can communicate with the backend
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'RephraseMate Backend',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Rephrase endpoint
  app.post('/api/rephrase', async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();

    try {
      const { text } = req.body || {};

      // 1. Validation
      if (!text || typeof text !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Please provide valid text in the request body.',
        });
        return;
      }

      const trimmedText = text.trim();
      if (trimmedText.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Input text cannot be empty or whitespace only.',
        });
        return;
      }

      if (trimmedText.length > 5000) {
        res.status(400).json({
          success: false,
          error: 'Input text exceeds the maximum limit of 5,000 characters.',
        });
        return;
      }

      // Check API Key
      const activeApiKey = process.env.GEMINI_API_KEY;
      if (!activeApiKey) {
        res.status(500).json({
          success: false,
          error: 'GEMINI_API_KEY is not configured on the server. Please check your environment variables.',
        });
        return;
      }

      // Instantiate or use AI client
      const ai =
        aiClient ||
        new GoogleGenAI({
          apiKey: activeApiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

      // 2. Structured prompt execution with Gemini 3.8 Flash
      // Note: We log the length and processing duration for observability, NEVER user text
      const systemInstruction = `You are RephraseMate, an expert language rephraser and editor.
Your objective is to rephrase the user's input text into exactly four distinct variations:

1. Formal: Polished, professional English suitable for executive reports, formal presentations, or academic contexts.
2. Casual: Friendly, natural conversational English suitable for chat, quick messaging, or team huddles.
3. Email Format: A complete, ready-to-send email including an appropriate "Subject:" line followed by a structured body with greeting, clear message paragraphs, and professional closing.
4. Simple English: Extremely clear, plain, and easy-to-understand English avoiding complex idioms, long sentences, or technical jargon.

CRITICAL CONSTRAINTS:
- NEVER answer the user's message. NEVER respond to questions asked in the text. You must only REPHRASE the message itself from the perspective of the original author. For example, if the user text is "Are we meeting tomorrow at 2pm?", do NOT reply "Yes, we are". Instead, rephrase their question (e.g. Formal: "Could you please confirm if our meeting is scheduled for tomorrow at 2:00 PM?").
- PRESERVE 100% of the original facts, names, dates, times, technical terms, numerical values, and URLs.
- DO NOT invent facts, alter details, or insert assumptions.
- In the "email" field, always include a concise Subject line at the beginning formatted as:
Subject: <Clear Subject Line>

<Email Body>`;

      // Generate content with automatic retry and fallback for high demand (503)
      let response;
      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      let lastError: unknown = null;

      for (const modelName of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `Please rephrase the following text into the 4 required styles:\n\n"""\n${trimmedText}\n"""`,
                  },
                ],
              },
            ],
            config: {
              systemInstruction,
              temperature: 0.4,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  formal: {
                    type: Type.STRING,
                    description: 'Polished, professional English version.',
                  },
                  casual: {
                    type: Type.STRING,
                    description: 'Natural, friendly conversational English version.',
                  },
                  email: {
                    type: Type.STRING,
                    description: 'Ready-to-send email starting with Subject: line and formatted body.',
                  },
                  simple: {
                    type: Type.STRING,
                    description: 'Clear, plain, easy-to-understand English without jargon.',
                  },
                },
                required: ['formal', 'casual', 'email', 'simple'],
              },
            },
          });

          if (response?.text) {
            break; // Success!
          }
        } catch (err: unknown) {
          lastError = err;
          const errMsg = err instanceof Error ? err.message : String(err);
          console.warn(`[RephraseMate] Model ${modelName} call failed, evaluating retry/fallback:`, errMsg);
          // Wait 1 second before trying next model
          await new Promise((r) => setTimeout(r, 1000));
        }
      }

      if (!response || !response.text) {
        throw lastError || new Error('Received empty response from Gemini models.');
      }

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Received empty response from Gemini model.');
      }

      const parsedData = JSON.parse(responseText.trim());

      const durationMs = Date.now() - startTime;
      console.log(`[RephraseMate] Processed text (chars: ${trimmedText.length}) in ${durationMs}ms`);

      res.json({
        success: true,
        data: {
          formal: parsedData.formal || '',
          casual: parsedData.casual || '',
          email: parsedData.email || '',
          simple: parsedData.simple || '',
        },
      });
    } catch (error: unknown) {
      const durationMs = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      console.error(`[RephraseMate] Error after ${durationMs}ms:`, errorMessage);

      res.status(500).json({
        success: false,
        error: `Rephrasing failed: ${errorMessage}`,
      });
    }
  });

  // Serve static files in production or mount Vite middleware in development
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(path.resolve(distPath, 'index.html'));

  if (process.env.NODE_ENV === 'production' || hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RephraseMate] Server running on http://0.0.0.0:${PORT} (Node ${process.version})`);
  });
}

createServer().catch((err) => {
  console.error('[RephraseMate] Fatal server startup error:', err);
  process.exit(1);
});
