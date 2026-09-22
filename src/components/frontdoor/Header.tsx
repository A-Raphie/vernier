'use client';

import React from 'react';
import { Activity, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onScrollToConsole: () => void;
  activeScenarioName: string;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToConsole }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e293b] bg-[#090d16]/95 backdrop-blur px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Metrology Mark */}
        <div className="flex items-center gap-3">
          <div className="size-7 rounded bg-[#151c2e] border border-slate-700/80 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4v16" />
              <path d="M4 6h12" />
              <path d="M4 10h8" />
              <path d="M4 14h14" />
              <path d="M4 18h6" />
              <path d="M16 4v4" />
              <path d="M12 8v4" />
              <path d="M18 12v4" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold tracking-wider text-slate-100">VERNIER</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800/60 text-slate-300">
              v1.8
            </span>
          </div>
        </div>

        {/* Center: Real Telemetry Status Chips */}
        <div className="hidden md:flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-[#1e293b] bg-[#0e131f]">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">MAINNET</span>
            <span className="text-slate-500 tabular-nums">#21,894,102</span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-[#1e293b] bg-[#0e131f] text-slate-300">
            <Activity className="size-3 text-cyan-400" />
            <span>SIMULATION ENGINE: ACTIVE</span>
          </div>
        </div>

        {/* Right: Console CTA & Connected Address */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded border border-[#1e293b] bg-[#0e131f] font-mono text-xs text-slate-400">
            <div className="size-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">0xDA9...e6B3</span>
          </div>

          <button
            onClick={onScrollToConsole}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs font-medium tracking-wide transition-all cursor-pointer"
          >
            <span>CONSOLE</span>
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
