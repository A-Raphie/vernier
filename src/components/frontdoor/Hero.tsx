'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Lock, Cpu } from 'lucide-react';
import { SCENARIOS } from '../../data/attack-vectors';

interface HeroProps {
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  onLaunchConsole: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedScenarioId,
  onSelectScenario,
  onLaunchConsole,
}) => {
  return (
    <section className="relative pt-16 pb-16 px-4 lg:px-8 border-b border-[#1e293b] bg-[#090d16]">
      <div className="relative max-w-4xl mx-auto text-center space-y-7">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700/80 bg-[#151c2e] text-slate-300 font-mono text-xs">
          <span className="size-1.5 rounded-full bg-amber-400" />
          <span>PRECISION EVM TRANSACTION FIREWALL</span>
        </div>

        {/* Headline: Clean, solid, high-authority (NO rainbow gradient text) */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-sans text-balance leading-[1.12]">
          Measure state deltas <br />
          before your wallet signs.
        </h1>

        {/* Body Copy */}
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed text-pretty font-sans">
          Like Pierre Vernier’s 1631 micro-caliper scale, Vernier simulates contract bytecode, tracks storage slot shifts, and halts drainers before raw calldata touches the network.
        </p>

        {/* Scenario Switcher */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Select Pre-Execution Attack Benchmark:
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {SCENARIOS.map((scenario) => {
              const isSelected = scenario.id === selectedScenarioId;
              const isCritical = scenario.riskLevel === 'CRITICAL';
              const isClean = scenario.riskLevel === 'CLEAN';

              return (
                <button
                  key={scenario.id}
                  onClick={() => onSelectScenario(scenario.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded border font-mono text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-amber-500/70 bg-[#151c2e] text-slate-100 shadow-sm'
                      : 'border-[#1e293b] bg-[#0e131f] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      isCritical
                        ? 'bg-rose-500'
                        : isClean
                        ? 'bg-emerald-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span>{scenario.name}</span>
                  <span
                    className={`text-[10px] px-1 py-0.5 rounded font-mono tabular-nums ${
                      isCritical
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-900/60'
                        : isClean
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-900/60'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-900/60'
                    }`}
                  >
                    {scenario.riskScore}/100
                  </span>
                </button>
              );
            })}
          </div>

          {/* Primary Action Button */}
          <div className="pt-4">
            <button
              onClick={onLaunchConsole}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded border border-amber-500/80 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-semibold text-xs tracking-wider transition-colors cursor-pointer shadow-sm"
            >
              <span>INSPECT IN COCKPIT</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-mono border-t border-[#1e293b]/70 pt-6">
          <div className="flex items-center gap-1.5">
            <Lock className="size-3.5 text-slate-400" />
            <span>Zero private key access</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-slate-400" />
            <span>Client-side Viem simulation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="size-3.5 text-slate-400" />
            <span className="tabular-nums">0.4ms verification latency</span>
          </div>
        </div>
      </div>
    </section>
  );
};
