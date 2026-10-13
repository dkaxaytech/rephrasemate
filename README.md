# RephraseMate ✍️🤖

> **RephraseMate** is a full-stack, web-based AI Rephrase Agent that takes any sentence, paragraph, or draft and automatically generates four distinct variations simultaneously:
> 1. **Formal** — Polished, professional English suitable for reports, executives, and academic writing.
> 2. **Casual** — Friendly, natural conversational English for team messaging and chat.
> 3. **Email Format** — A ready-to-send email with an appropriate Subject line and formatted body.
> 4. **Simple English** — Clear, jargon-free English that anyone can understand.

---

## 🚀 Features

- **Concurrent 4-Tone Generation**: Generates Formal, Casual, Email, and Simple English versions in a single structured Gemini API request.
- **Strict Factual Preservation**: Preserves 100% of facts, names, dates, times, numerical data, technical terms, and URLs.
- **Non-Conversational Agent**: Rephrases the text from the author's viewpoint without answering or replying to questions in the text.
- **One-Click Copy & Copy All**: Individual copy buttons with visual feedback tooltips, plus a combined "Copy All Variations" action.
- **Safe & Private Architecture**:
  - `GEMINI_API_KEY` is kept strictly on the Node.js Express backend and never exposed to the client.
  - User text is never saved or logged in server console outputs.
  - 5,000-character input validation and 64KB JSON body limits.
- **Responsive & Modern UI**: Built with React 19, Tailwind CSS v4, and Lucide icons.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion
- **Backend**: Node.js, Express 4, tsx, dotenv
- **AI Engine**: Google Gen AI SDK (`@google/genai`) using `gemini-3.8-flash` (with automatic fallback to `gemini-3.1-flash-lite`)

---

## 📦 Local Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/rephrasemate.git
cd rephrasemate
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Open `.env` and add your Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```
*(Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 4. Run in development mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production build
```bash
npm run build
npm start
```

---

## 📤 Pushing This Project to GitHub

Follow these simple steps in your terminal to publish the project to your GitHub account:

### Step 1: Initialize Git and Commit
```bash
git init
git add .
git commit -m "Initial commit: RephraseMate AI Agent"
```

### Step 2: Create a New Repository on GitHub
1. Go to [GitHub New Repository](https://github.com/new).
2. Set the repository name to `rephrasemate`.
3. Choose **Public** or **Private**.
4. **Do NOT** check "Add a README" or ".gitignore" (these already exist in the project).
5. Click **Create repository**.

### Step 3: Link and Push
Replace `<YOUR_GITHUB_USERNAME>` with your GitHub username:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/rephrasemate.git
git push -u origin main
```

---

## 🌐 Deploying to a Live Public URL from GitHub

Because RephraseMate has a secure Express backend that calls the Gemini API, deploy it on a platform that supports Node.js web services:

### Option A: Render (Recommended - Free Tier)
1. Go to [Render.com](https://render.com) and log in with your GitHub account.
2. Click **New +** → **Web Service**.
3. Select your `rephrasemate` GitHub repository.
4. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - Key: `GEMINI_API_KEY`
   - Value: `your-actual-gemini-api-key`
   - Key: `NODE_ENV`
   - Value: `production`
6. Click **Deploy Web Service**. You will receive a live `https://rephrasemate.onrender.com` URL!

### Option B: Railway
1. Go to [Railway.app](https://railway.app) and click **New Project** → **Deploy from GitHub repo**.
2. Select your `rephrasemate` repository.
3. In the project settings, add the environment variable `GEMINI_API_KEY`.
4. Railway will automatically detect `package.json`, build, and assign a public domain.

---

## 📄 License

Apache-2.0
