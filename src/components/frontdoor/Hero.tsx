'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, ArrowRight, Zap, RefreshCw, Lock } from 'lucide-react';
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
    <section className="relative pt-12 pb-14 px-4 lg:px-8 border-b border-[#1e293b] bg-radial from-[#0f172a]/40 via-[#0a0d14] to-[#0a0d14] overflow-hidden">
      {/* Background Vernier Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {/* Beat 1: Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/20 text-amber-400 font-mono text-xs tracking-wider uppercase">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>PRECISION EVM TRANSACTION FIREWALL • METROLOGY GRADE</span>
        </div>

        {/* Beat 2: Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 font-sans max-w-4xl mx-auto leading-[1.12]">
          Measure State Deltas <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-400">
            Before Your Wallet Signs.
          </span>
        </h1>

        {/* Beat 3: Body / Positioning */}
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-sans">
          Like Pierre Vernier’s 1631 micro-caliper scale, Vernier simulates contract bytecode, tracks storage slot shifts, and halts drainers before raw calldata touches the network.
        </p>

        {/* Beat 4: Interactive Scenario Selector & Console CTA */}
        <div className="pt-2 flex flex-col items-center gap-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Select Live Pre-Execution Benchmark:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {SCENARIOS.map((scenario) => {
              const isSelected = scenario.id === selectedScenarioId;
              const isCritical = scenario.riskLevel === 'CRITICAL';
              const isClean = scenario.riskLevel === 'CLEAN';

              return (
                <button
                  key={scenario.id}
                  onClick={() => onSelectScenario(scenario.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded border font-mono text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                      : 'border-[#1e293b] bg-[#0f172a] text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCritical
                        ? 'bg-rose-500 animate-pulse'
                        : isClean
                        ? 'bg-emerald-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span>{scenario.name}</span>
                  <span
                    className={`text-[10px] px-1 rounded ${
                      isCritical
                        ? 'bg-rose-950 text-rose-300'
                        : isClean
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    {scenario.riskScore}/100
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3">
            <button
              onClick={onLaunchConsole}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-amber-400/80 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-mono font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer"
            >
              <span>INSPECT IN COCKPIT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Beat 5: Trust Microcopy */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono border-t border-[#1e293b]/60 pt-6">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero Private Key Access</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Client-Side Viem Simulation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>0.4ms Trace Verification</span>
          </div>
        </div>
      </div>
    </section>
  );
};
