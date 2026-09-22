'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Lock, Cpu, ShieldAlert, CheckCircle2, ChevronRight, FileCode, Sliders } from 'lucide-react';
import { SCENARIOS } from '../../data/attack-vectors';
import { EconomicGrid } from '../frontdoor/EconomicGrid';
import { SurfaceTab } from '../navigation/ChromeHeader';
import { Button, Badge, TabsList, TabsTrigger, Card } from '../ui';

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
          <Badge variant="secondary" dot dotPulse className="px-3 py-1 text-xs">
            3RD-WEB-HACK 2026 · WEB3 TRANSACTION FIREWALL
          </Badge>

          {/* Beat 2: Two-Clause Headline (First clause 100%, second clause ~45% opacity) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-sans text-balance leading-[1.12]">
            <span className="text-white">Stop signing transactions blind.</span> <br />
            <span className="text-slate-500">Vernier simulates the damage first.</span>
          </h1>

          {/* Beat 3: Lede (52-65ch wide) */}
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed text-pretty font-sans">
            Scam websites hide wallet drainers behind innocent buttons like &ldquo;Claim Airdrop&rdquo;. 
            Vernier simulates raw bytecode in a private 0.42ms browser sandbox to show what actually leaves your wallet before you press Confirm.
          </p>

          {/* Beat 4: CTA Pair */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigateTab('cockpit')}
              rightIcon={<ArrowRight className="size-3.5" />}
            >
              OPEN WORKING COCKPIT
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigateTab('proof')}
              leftIcon={<FileCode className="size-3.5 text-slate-400" />}
            >
              VIEW ATTESTATION PROOF
            </Button>
          </div>

          {/* Beat 5: Live Signature Card (Operable Preview Card) */}
          <div className="pt-6 max-w-2xl mx-auto text-left">
            <Card className="p-5 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                  <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-semibold uppercase tracking-wider">LIVE SIGNATURE BENCHMARK</span>
                </div>

                {/* Scenario Toggle */}
                <TabsList className="p-0.5">
                  {SCENARIOS.map((s) => (
                    <TabsTrigger
                      key={s.id}
                      active={s.id === selectedScenarioId}
                      onClick={() => onSelectScenario(s.id)}
                      className="px-2 py-0.5 text-[11px]"
                    >
                      {s.name.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Intercept Data Summary: Promised vs Reality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded border border-slate-800/80 bg-[#090d16] space-y-1.5">
                  <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                    <span>1. PROMISED BY WEBSITE</span>
                  </div>
                  <div className="text-slate-100 font-bold truncate font-sans">
                    {activeScenario.plainEnglish?.scamPromise || activeScenario.intent.amount}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans line-clamp-2">
                    {activeScenario.plainEnglish?.scamSubtitle || activeScenario.intent.protocol}
                  </div>
                </div>

                <div className="p-3.5 rounded border border-slate-800/80 bg-[#090d16] space-y-1.5">
                  <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
                    <span>2. VERNIER FIREWALL VERDICT</span>
                    <span className="text-[10px] text-cyan-400 font-mono">0.42ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={isCritical ? 'destructive' : isClean ? 'success' : 'warning'}>
                      {isClean ? 'SAFE TO SIGN' : 'CRITICAL THREAT BLOCKED'}
                    </Badge>
                    <span className="text-[10px] text-slate-500 tabular-nums">
                      {activeScenario.metrics.storageSlotsTouched} slots touched
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans line-clamp-2">
                    {activeScenario.plainEnglish?.actualAction || 'Pathogenic SSTORE detected'}
                  </div>
                </div>
              </div>

              {/* Status Banner with direct CTA to Cockpit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 text-xs font-mono">
                <div className="flex items-center gap-2">
                  {isClean ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 font-sans">
                      <CheckCircle2 className="size-3.5" />
                      <span>Legitimate transaction · Safe to sign</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-400 font-sans">
                      <ShieldAlert className="size-3.5" />
                      <span>Drainer halted: {activeScenario.plainEnglish?.assetsProtected || 'Assets protected'}</span>
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateTab('cockpit')}
                  className="text-amber-400 hover:text-amber-300 ml-auto"
                  rightIcon={<ChevronRight className="size-3.5" />}
                >
                  SEE JUDGE WALKTHROUGH
                </Button>
              </div>
            </Card>
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

      {/* Beginner & Judge Friendly FAQ / Explainer Section */}
      <section className="py-14 px-4 lg:px-8 border-b border-[#1e293b] bg-[#0c101c]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              Explain Like I&apos;m 5
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              What does Vernier actually do?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-sans">
              Why this solves the #1 reason normal people and treasuries lose money in Web3.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-lg border border-slate-800 bg-[#090d16] space-y-2">
              <div className="text-amber-400 font-mono text-xs font-bold">THE PROBLEM</div>
              <h3 className="font-sans font-bold text-sm text-slate-100">Blind Signatures</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                When you interact with a dApp, your wallet only displays cryptic gibberish like <code className="text-slate-300">0x095ea7b3</code>. 
                You have to trust the website isn&apos;t stealing your tokens.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-800 bg-[#090d16] space-y-2">
              <div className="text-cyan-400 font-mono text-xs font-bold">THE SOLUTION</div>
              <h3 className="font-sans font-bold text-sm text-slate-100">0.4ms Local Simulation</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Before your wallet shows the &ldquo;Confirm&rdquo; button, Vernier spins up an instantaneous private EVM inside your browser. 
                It watches every balance and permission that would change.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-800 bg-[#090d16] space-y-2">
              <div className="text-emerald-400 font-mono text-xs font-bold">THE RESULT</div>
              <h3 className="font-sans font-bold text-sm text-slate-100">Plain English Verdicts</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Instead of confusing hex codes, you see: <em>&ldquo;Warning: This website claims to claim an airdrop, but it will empty your USDC balance.&rdquo;</em>
              </p>
            </div>
          </div>
        </div>
      </section>

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
