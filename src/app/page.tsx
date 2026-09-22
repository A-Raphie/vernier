'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const consoleRef = useRef<HTMLDivElement>(null);

  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  // Whenever scenario changes, default the step index to the blocked step or middle
  useEffect(() => {
    const blockedIdx = activeScenario.opcodeTrace.findIndex((op) => op.isBlocked);
    if (blockedIdx !== -1) {
      setActiveStepIndex(blockedIdx);
    } else {
      setActiveStepIndex(activeScenario.opcodeTrace.length - 1);
    }
  }, [selectedScenarioId, activeScenario]);

  const handleScrollToConsole = () => {
    consoleRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
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
        className="py-14 px-4 lg:px-8 border-b border-[#1e293b] bg-[#090d16] flex-1"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Section Sub-header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-mono uppercase text-slate-400 font-medium tracking-wider">
                  SURFACE 2: WORKING COCKPIT & SCRUBBER
                </span>
              </div>
              <h2 className="text-2xl font-bold font-sans text-slate-100 mt-1">
                {activeScenario.name}
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5 text-pretty">
                {activeScenario.tagline}
              </p>
            </div>

            {/* Quick Scenario Selector (Clean pills, no emojis) */}
            <div className="flex items-center gap-1.5 p-1 rounded border border-[#1e293b] bg-[#0e131f]">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenarioId(s.id)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                    s.id === selectedScenarioId
                      ? 'bg-[#151c2e] text-slate-100 border border-slate-700 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`inline-block size-1.5 rounded-full mr-1.5 ${
                    s.riskLevel === 'CRITICAL' ? 'bg-rose-500' : s.riskLevel === 'HIGH' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  {s.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Column Working Console Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Intent Charter & Risk Index (3 cols) */}
            <div className="lg:col-span-3">
              <IntentCharter scenario={activeScenario} />
            </div>

            {/* Center Column: Vernier Time-Travel Caliper & Storage Inspector (6 cols) */}
            <div className="lg:col-span-6">
              <VernierRadar
                scenario={activeScenario}
                activeStepIndex={activeStepIndex}
                setActiveStepIndex={setActiveStepIndex}
              />
            </div>

            {/* Right Column: Bytecode Disassembly & Surface 3 Proof Rail (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <BytecodeTrace
                opcodes={activeScenario.opcodeTrace}
                activeStepIndex={activeStepIndex}
                onSelectStep={setActiveStepIndex}
              />
              <ReceiptRail scenario={activeScenario} />
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="py-8 px-4 lg:px-8 border-t border-[#1e293b] bg-[#090d16] text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">VERNIER</span>
            <span>• Built for 3rd-Web-Hack (Devpost 2026)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side Viem engine</span>
            <span>•</span>
            <span>100% Free Vercel deployment</span>
            <span>•</span>
            <span>Zero persistent daemons</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
