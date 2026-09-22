'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Lock, Cpu, ShieldAlert, CheckCircle2, ChevronRight, FileCode, Sliders } from 'lucide-react';
import { SCENARIOS } from '../../data/attack-vectors';
import { EconomicGrid } from '../frontdoor/EconomicGrid';
import { SurfaceTab } from '../navigation/ChromeHeader';

interface Surface1FrontDoorProps {
  onNavigateTab: (tab: SurfaceTab) => void;
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
}

export const Surface1FrontDoor: React.FC<Surface1FrontDoorProps> = ({
  onNavigateTab,
  selectedScenarioId,
  onSelectScenario,
}) => {
  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];
  const isCritical = activeScenario.riskLevel === 'CRITICAL';
  const isClean = activeScenario.riskLevel === 'CLEAN';

  return (
    <div className="flex flex-col min-h-screen">
      {/* 5-Beat Hero */}
      <section className="pt-16 pb-20 px-4 lg:px-8 border-b border-[#1e293b] bg-[#090d16]">
        <div className="max-w-4xl mx-auto text-center space-y-7">
          {/* Beat 1: Monospace Protocol Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700/80 bg-[#151c2e] text-slate-300 font-mono text-xs">
            <span className="size-1.5 rounded-full bg-amber-400" />
            <span>3RD-WEB-HACK 2026 · EIP-712 PRE-EXECUTION FIREWALL STANDARD</span>
          </div>

          {/* Beat 2: Two-Clause Headline (First clause 100%, second clause ~45% opacity) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-sans text-balance leading-[1.12]">
            <span className="text-white">Measure state deltas</span> <br />
            <span className="text-slate-500">before your wallet signs.</span>
          </h1>

          {/* Beat 3: Lede (52-65ch wide) */}
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed text-pretty font-sans">
            Simulating EVM bytecode, storage slot mutations, and hidden wallet drainers before raw calldata touches the network.
          </p>

          {/* Beat 4: CTA Pair */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('cockpit')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded border border-amber-500/80 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-semibold text-xs tracking-wider transition-colors cursor-pointer shadow-sm"
            >
              <span>OPEN WORKING COCKPIT</span>
              <ArrowRight className="size-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('proof')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[#1e293b] bg-[#0e131f] hover:bg-[#151c2e] text-slate-300 font-mono text-xs tracking-wide transition-colors cursor-pointer"
            >
              <FileCode className="size-3.5 text-slate-400" />
              <span>VIEW ATTESTATION PROOF</span>
            </button>
          </div>

          {/* Beat 5: Live Signature Card (Operable Preview Card) */}
          <div className="pt-6 max-w-2xl mx-auto text-left">
            <div className="p-5 rounded-lg border border-slate-800 bg-[#0e131f] space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                  <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-semibold uppercase tracking-wider">LIVE SIGNATURE BENCHMARK</span>
                </div>

                {/* Scenario Toggle */}
                <div className="flex items-center gap-1 bg-[#090d16] p-0.5 rounded border border-slate-800">
                  {SCENARIOS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSelectScenario(s.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                        s.id === selectedScenarioId
                          ? 'bg-[#1e293b] text-white font-medium'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intercept Data Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded border border-slate-800/80 bg-[#090d16] space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">HUMAN INTENT PROMISE</div>
                  <div className="text-slate-200 font-semibold truncate">{activeScenario.intent.amount}</div>
                  <div className="text-[11px] text-slate-400">{activeScenario.intent.protocol}</div>
                </div>

                <div className="p-3 rounded border border-slate-800/80 bg-[#090d16] space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">VERNIER METROLOGY SCAN</div>
                  <div className="flex items-center justify-between">
                    <span className={isCritical ? 'text-rose-400 font-bold' : isClean ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {activeScenario.riskLevel} ({activeScenario.riskScore}/100)
                    </span>
                    <span className="text-[10px] text-slate-500 tabular-nums">
                      {activeScenario.metrics.storageSlotsTouched} slots touched
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {isClean ? 'Clean execution path' : 'Pathogenic SSTORE detected'}
                  </div>
                </div>
              </div>

              {/* Status Banner with direct CTA to Cockpit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 text-xs font-mono">
                <div className="flex items-center gap-2">
                  {isClean ? (
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="size-3.5" />
                      <span>Conforms to declared swap intent</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <ShieldAlert className="size-3.5" />
                      <span>Intercepted: SSTORE type(uint256).max</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onNavigateTab('cockpit')}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer ml-auto"
                >
                  <span>REPLAY IN COCKPIT</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
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

      {/* 3-Card Economic Friction Grid */}
      <EconomicGrid />

      {/* 4-Step Pipeline Architecture Section */}
      <section className="py-16 px-4 lg:px-8 border-b border-[#1e293b] bg-[#090d16]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400">
              Core Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              How Vernier Intercepts Calldata
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-sans">
              A 4-step execution sandbox that decodes, measures, and halts drainers before raw calldata touches the mempool.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            {/* Step 1 */}
            <div className="p-5 rounded border border-[#1e293b] bg-[#0e131f] space-y-2.5">
              <div className="text-[10px] text-amber-400 font-bold">01 / INTENT PARSER</div>
              <h3 className="font-sans font-bold text-sm text-slate-100">Decode Promises</h3>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                Extracts the human intent promised by the dApp UI and maps it to required method selectors.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded border border-[#1e293b] bg-[#0e131f] space-y-2.5">
              <div className="text-[10px] text-cyan-400 font-bold">02 / LOCAL FORK</div>
              <h3 className="font-sans font-bold text-sm text-slate-100">Client-Side Viem</h3>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                Executes transaction bytecode inside a private client-side EVM sandbox without spending gas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded border border-[#1e293b] bg-[#0e131f] space-y-2.5">
              <div className="text-[10px] text-amber-400 font-bold">03 / METROLOGY RADAR</div>
              <h3 className="font-sans font-bold text-sm text-slate-100">Slot-Level SSTORE</h3>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                Tracks state deltas across every 32-byte storage slot, flagging infinite approvals and proxy rewrites.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded border border-[#1e293b] bg-[#0e131f] space-y-2.5">
              <div className="text-[10px] text-emerald-400 font-bold">04 / ATTESTATION</div>
              <h3 className="font-sans font-bold text-sm text-slate-100">Cryptographic Seal</h3>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                Emits an EIP-712 signed receipt with SHA-256 state root before unlocking the broadcast action.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigateTab('cockpit')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-xs font-medium cursor-pointer transition-colors"
            >
              <span>TRY THE LIVE BENCHMARKS IN COCKPIT</span>
              <ArrowRight className="size-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 lg:px-8 border-t border-[#1e293b] bg-[#090d16] text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">VERNIER</span>
            <span>• Built for 3rd-Web-Hack (Devpost 2026)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side Viem engine</span>
            <span>•</span>
            <span>100% Free Netlify deployment</span>
            <span>•</span>
            <span>Zero persistent daemons</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
