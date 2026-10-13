import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputCard } from './components/OutputCard';
import { rephraseText } from './services/api';
import { RephraseOutput } from './types';
import { Copy, Check, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RephraseOutput | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleRephrase = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text before clicking Rephrase All.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const output = await rephraseText(inputText);
      setResults(output);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred while rephrasing.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResults(null);
    setError(null);
  };

  const handleCopyAll = async () => {
    if (!results) return;

    const formattedCombined = [
      `--- 1. FORMAL ---\n${results.formal}`,
      `--- 2. CASUAL ---\n${results.casual}`,
      `--- 3. EMAIL FORMAT ---\n${results.email}`,
      `--- 4. SIMPLE ENGLISH ---\n${results.simple}`,
    ].join('\n\n');

    try {
      await navigator.clipboard.writeText(formattedCombined);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = formattedCombined;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Input Panel */}
        <section aria-label="Input Area">
          <InputPanel
            text={inputText}
            onChange={(val) => {
              setInputText(val);
              if (error) setError(null);
            }}
            onSubmit={handleRephrase}
            onClear={handleClear}
            isLoading={isLoading}
            error={error}
          />
        </section>

        {/* Results Toolbar */}
        <section aria-label="Rephrased Results" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Four Rephrased Variations
              </h2>
              <p className="text-xs text-slate-500">
                Generated concurrently using Google Gemini to ensure tone fidelity and factual consistency.
              </p>
            </div>

            {results && !isLoading && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    copiedAll
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 active:scale-95 shadow-xs'
                  }`}
                >
                  {copiedAll ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>All 4 Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy All Variations</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setResults(null)}
                  title="Reset variations"
                  className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 text-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 4 Result Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <OutputCard
              tone="formal"
              title="1. Formal"
              description="Polished, professional, and grammatically impeccable"
              content={results?.formal || ''}
              isLoading={isLoading}
            />

            <OutputCard
              tone="casual"
              title="2. Casual"
              description="Natural, friendly, and conversational English"
              content={results?.casual || ''}
              isLoading={isLoading}
            />

            <OutputCard
              tone="email"
              title="3. Email Format"
              description="Ready-to-send draft with subject line and structure"
              content={results?.email || ''}
              isLoading={isLoading}
            />

            <OutputCard
              tone="simple"
              title="4. Simple English"
              description="Direct, easy-to-read, and jargon-free"
              content={results?.simple || ''}
              isLoading={isLoading}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>RephraseMate &bull; Instant multi-tone rephraser</span>
          <span>Preserves exact facts, names, dates, and technical details</span>
        </div>
      </footer>
    </div>
  );
}
