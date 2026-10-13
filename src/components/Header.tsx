import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">RephraseMate</h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2 py-0.5 rounded-full">
                AI Agent
              </span>
            </div>
            <p className="text-xs text-slate-500">Transform any thought into 4 distinct, polished tones simultaneously</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-md text-slate-600 border border-slate-200">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Gemini 3.8 Flash
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-md text-slate-600 border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Facts Preserved
          </span>
        </div>
      </div>
    </header>
  );
};
