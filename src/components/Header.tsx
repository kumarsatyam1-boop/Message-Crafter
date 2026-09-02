import React from 'react';
import { TurtlemintLogo } from './TurtlemintLogo';
import { Sparkles, MessageSquare } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TurtlemintLogo />
          <div className="hidden sm:block h-5 w-px bg-slate-200" />
          <span className="hidden sm:inline-block text-xs font-semibold text-slate-500 tracking-wide uppercase">
            Message Crafter
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
            <span>Hindi & Hinglish to English</span>
          </div>
        </div>
      </div>
    </header>
  );
};
