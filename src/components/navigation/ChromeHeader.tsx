'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

export type SurfaceTab = 'overview' | 'cockpit' | 'proof';

interface ChromeHeaderProps {
  activeTab: SurfaceTab;
  onTabChange: (tab: SurfaceTab) => void;
}

export const ChromeHeader: React.FC<ChromeHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e293b] bg-[#090d16]/95 backdrop-blur px-4 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Cluster 1 (Left): Brand Wordmark + Version Tag */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-2.5 cursor-pointer text-left"
          >
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
            <span className="font-mono text-sm font-bold tracking-wider text-white">VERNIER</span>
          </button>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800/80 text-slate-300 hidden sm:inline-block">
            v1.8 · EIP-712
          </span>
        </div>

        {/* Cluster 2 (Center): Plain-Noun Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#0e131f] p-1 rounded-lg border border-[#1e293b]">
          <button
            onClick={() => onTabChange('overview')}
            className={`px-3 py-1 rounded font-mono text-xs transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#1e293b] text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onTabChange('cockpit')}
            className={`px-3 py-1 rounded font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cockpit'
                ? 'bg-[#1e293b] text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Cockpit</span>
            <span className="size-1.5 rounded-full bg-amber-400" />
          </button>

          <button
            onClick={() => onTabChange('proof')}
            className={`px-3 py-1 rounded font-mono text-xs transition-colors cursor-pointer ${
              activeTab === 'proof'
                ? 'bg-[#1e293b] text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Proof
          </button>
        </nav>

        {/* Cluster 3 (Right): Live Provenance Pill + Single Compact Action */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded border border-[#1e293b] bg-[#0e131f] font-mono text-xs text-slate-300">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Live EVM ·</span>
            <span className="text-slate-200 tabular-nums font-medium">$142M Shielded</span>
          </div>

          {activeTab === 'cockpit' ? (
            <button
              onClick={() => onTabChange('proof')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors cursor-pointer"
            >
              <span>VIEW PROOF</span>
              <ChevronRight className="size-3.5 text-slate-400" />
            </button>
          ) : (
            <button
              onClick={() => onTabChange('cockpit')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-500/80 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-sm"
            >
              <span>OPEN COCKPIT</span>
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
