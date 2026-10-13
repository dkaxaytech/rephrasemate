import React, { useState } from 'react';
import { Copy, Check, Briefcase, MessageCircle, Mail, Sparkles } from 'lucide-react';
import { ToneType } from '../types';

interface OutputCardProps {
  tone: ToneType;
  title: string;
  description: string;
  content: string;
  isLoading?: boolean;
}

const toneConfig: Record<
  ToneType,
  {
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
  }
> = {
  formal: {
    icon: Briefcase,
    accentColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-50 border-indigo-200',
    badgeText: 'text-indigo-700',
    borderColor: 'border-indigo-100 hover:border-indigo-300',
  },
  casual: {
    icon: MessageCircle,
    accentColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-100 hover:border-emerald-300',
  },
  email: {
    icon: Mail,
    accentColor: 'text-blue-600',
    badgeBg: 'bg-blue-50 border-blue-200',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-100 hover:border-blue-300',
  },
  simple: {
    icon: Sparkles,
    accentColor: 'text-amber-600',
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-100 hover:border-amber-300',
  },
};

export const OutputCard: React.FC<OutputCardProps> = ({
  tone,
  title,
  description,
  content,
  isLoading = false,
}) => {
  const [copied, setCopied] = useState(false);
  const config = toneConfig[tone];
  const Icon = config.icon;

  const handleCopy = async () => {
    if (!content || isLoading) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = content ? content.length : 0;

  return (
    <div
      className={`bg-white rounded-2xl border ${config.borderColor} shadow-xs transition-all duration-200 flex flex-col h-full`}
    >
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${config.badgeBg} border ${config.accentColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              {title}
            </h3>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          disabled={isLoading || !content}
          type="button"
          aria-label={`Copy ${title} version`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            copied
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="space-y-3 py-2 animate-pulse">
            <div className="h-4 bg-slate-200/80 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200/80 rounded w-4/6"></div>
            <div className="h-4 bg-slate-200/80 rounded w-full"></div>
            <div className="h-4 bg-slate-200/80 rounded w-3/4"></div>
          </div>
        ) : content ? (
          <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed selection:bg-indigo-100 font-normal">
            {content}
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic py-6 text-center">
            Click "Rephrase All" to generate this version.
          </div>
        )}

        {/* Card Footer: Metadata */}
        {content && !isLoading && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            <span>{charCount} chars</span>
          </div>
        )}
      </div>
    </div>
  );
};
