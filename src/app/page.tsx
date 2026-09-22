'use client';

import React, { useState, useRef } from 'react';
import { Header } from '../components/frontdoor/Header';
import { Hero } from '../components/frontdoor/Hero';
import { EconomicGrid } from '../components/frontdoor/EconomicGrid';
import { IntentCharter } from '../components/console/IntentCharter';
import { VernierRadar } from '../components/console/VernierRadar';
import { BytecodeTrace } from '../components/console/BytecodeTrace';
import { ReceiptRail } from '../components/proof/ReceiptRail';
import { SCENARIOS } from '../data/attack-vectors';

export default function VernierHome() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const consoleRef = useRef<HTMLDivElement>(null);

  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  const handleScrollToConsole = () => {
    consoleRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col">
      {/* 1-Chrome-Row Header */}
      <Header
        onScrollToConsole={handleScrollToConsole}
        activeScenarioName={activeScenario.name}
      />

      {/* Surface 1: High-Authority Front Door */}
      <Hero
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={setSelectedScenarioId}
        onLaunchConsole={handleScrollToConsole}
      />

      <EconomicGrid />

      {/* Surface 2: Working Cockpit & Surface 3: Cryptographic Proof Rail */}
      <section
        ref={consoleRef}
        className="py-12 px-4 lg:px-8 border-b border-[#1e293b] bg-radial from-[#0f172a]/50 to-[#0a0d14] flex-1"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                  SURFACE 2: WORKING COCKPIT & RADAR
                </span>
              </div>
              <h2 className="text-2xl font-bold font-sans text-slate-100 mt-1">
                {activeScenario.name}
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {activeScenario.tagline}
              </p>
            </div>

            {/* Quick Scenario Toggle in Console */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[#1e293b] bg-[#0a0d14]">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenarioId(s.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                    s.id === selectedScenarioId
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.riskLevel === 'CRITICAL' ? '⚠️ ' : s.riskLevel === 'HIGH' ? '⚡ ' : '🛡️ '}
                  {s.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Column Working Console Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Intent Charter & Risk Gauge (3 cols) */}
            <div className="lg:col-span-3">
              <IntentCharter scenario={activeScenario} />
            </div>

            {/* Center Column: Vernier Radar & Storage Slot Inspector (6 cols) */}
            <div className="lg:col-span-6">
              <VernierRadar scenario={activeScenario} />
            </div>

            {/* Right Column: Bytecode Trace & Surface 3 Proof Rail (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <BytecodeTrace opcodes={activeScenario.opcodeTrace} />
              <ReceiptRail scenario={activeScenario} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Metrology Provenance */}
      <footer className="py-8 px-4 lg:px-8 border-t border-[#1e293b] bg-[#0a0d14] text-center text-xs font-mono text-slate-500 space-y-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">VERNIER</span>
            <span>• Built for 3rd-Web-Hack (Devpost 2026)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-Side Viem Engine</span>
            <span>•</span>
            <span>100% Free Vercel Deployment</span>
            <span>•</span>
            <span>Zero Persistent Daemons</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
