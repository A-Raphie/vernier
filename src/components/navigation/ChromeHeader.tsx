'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button, Badge, TabsList, TabsTrigger } from '../ui';

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
            className="flex items-center gap-2.5 cursor-pointer text-left focus:outline-none"
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
          <Badge variant="default" className="hidden sm:inline-flex">
            v1.8 · EIP-712
          </Badge>
        </div>

        {/* Cluster 2 (Center): Plain-Noun Navigation Tabs */}
        <TabsList>
          <TabsTrigger
            active={activeTab === 'overview'}
            onClick={() => onTabChange('overview')}
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            active={activeTab === 'cockpit'}
            onClick={() => onTabChange('cockpit')}
          >
            <span>Cockpit</span>
            <span className="size-1.5 rounded-full bg-amber-400" />
          </TabsTrigger>

          <TabsTrigger
            active={activeTab === 'proof'}
            onClick={() => onTabChange('proof')}
          >
            Proof
          </TabsTrigger>
        </TabsList>

        {/* Cluster 3 (Right): Live Provenance Pill + Single Compact Action */}
        <div className="flex items-center gap-3">
          <Badge variant="secondary" dot dotPulse className="hidden md:inline-flex py-1 px-2.5">
            <span className="text-slate-400">Live EVM ·</span>
            <span className="text-slate-200 tabular-nums font-medium">$142M Shielded</span>
          </Badge>

          {activeTab === 'cockpit' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTabChange('proof')}
              rightIcon={<ChevronRight className="size-3.5 text-slate-400" />}
            >
              VIEW PROOF
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onTabChange('cockpit')}
              rightIcon={<ChevronRight className="size-3.5" />}
            >
              OPEN COCKPIT
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
