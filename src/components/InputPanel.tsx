import React, { useRef, useEffect } from 'react';
import { Send, X, AlertCircle } from 'lucide-react';
import { SamplePrompts } from './SamplePrompts';

interface InputPanelProps {
  text: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
  error?: string | null;
}

const MAX_CHARS = 5000;

export const InputPanel: React.FC<InputPanelProps> = ({
  text,
  onChange,
  onSubmit,
  onClear,
  isLoading,
  error,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const isOverLimit = charCount > MAX_CHARS;

  // Auto-resize textarea slightly as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 120), 320)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Command + Enter or Ctrl + Enter triggers submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && text.trim() && !isOverLimit) {
        onSubmit();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="rephrase-input" className="block text-sm font-semibold text-slate-800">
            Original Text
          </label>
          <p className="text-xs text-slate-500">
            Enter a sentence, paragraph, rough draft, or bullet points
          </p>
        </div>

        {text && (
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          id="rephrase-input"
          ref={textareaRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 'hey we need to postpone the client call to next friday cuz the deck isnt ready yet...'"
          disabled={isLoading}
          rows={4}
          className={`w-full p-3.5 sm:p-4 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/60 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
            isOverLimit
              ? 'border-red-300 focus:ring-red-200 focus:border-red-400 bg-red-50/20'
              : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white'
          }`}
        />
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Footer bar with Counter & Submit button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span>•</span>
          <span className={isOverLimit ? 'text-red-600 font-semibold' : ''}>
            {charCount} / {MAX_CHARS} characters
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !text.trim() || isOverLimit}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-[0.98] shadow-sm shadow-indigo-200 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Rephrasing in 4 tones...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Rephrase All</span>
                <span className="hidden md:inline-block text-[10px] opacity-75 font-normal ml-1 bg-white/20 px-1.5 py-0.5 rounded">
                  Ctrl+Enter
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      <SamplePrompts onSelect={onChange} disabled={isLoading} />
    </div>
  );
};
