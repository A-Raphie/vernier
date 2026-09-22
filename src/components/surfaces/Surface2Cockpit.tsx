'use client';

import React from 'react';
import { SimulationScenario } from '../../lib/types';
import { SCENARIOS } from '../../data/attack-vectors';
import { IntentCharter } from '../console/IntentCharter';
import { VernierRadar } from '../console/VernierRadar';
import { BytecodeTrace } from '../console/BytecodeTrace';
import { ReceiptRail } from '../proof/ReceiptRail';
import { SurfaceTab } from '../navigation/ChromeHeader';
import { ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Surface2CockpitProps {
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  activeStepIndex: number;
  setActiveStepIndex: (index: number) => void;
  onNavigateTab: (tab: SurfaceTab) => void;
}

export const Surface2Cockpit: React.FC<Surface2CockpitProps> = ({
  selectedScenarioId,
  onSelectScenario,
  activeStepIndex,
  setActiveStepIndex,
  onNavigateTab,
}) => {
  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];
  const isCritical = activeScenario.riskLevel === 'CRITICAL';
  const isClean = activeScenario.riskLevel === 'CLEAN';

  return (
    <div className="py-8 px-4 lg:px-8 bg-[#090d16] flex-1 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Cockpit Bar: Back to Overview + Hero Metric + Scenario Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('overview')}
              className="p-1.5 rounded border border-slate-800 bg-[#0e131f] hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              title="Return to Overview"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-400" />
                <span className="text-xs font-mono uppercase text-slate-400 font-medium tracking-wider">
                  SURFACE 2: WORKING COCKPIT
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-white mt-0.5">
                {activeScenario.name}
              </h2>
            </div>
          </div>

          {/* Scenario Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded border border-[#1e293b] bg-[#0e131f]">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectScenario(s.id)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  s.id === selectedScenarioId
                    ? 'bg-[#151c2e] text-white border border-slate-700 font-medium'
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

        {/* Hero Metric Banner: Exactly ONE primary metric with context */}
        <div className="p-4 rounded border border-[#1e293b] bg-[#0e131f] flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              PRIMARY HAZARD INDEX
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-mono tabular-nums ${
                isCritical ? 'text-rose-400' : isClean ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {activeScenario.riskScore}/100
              </span>
              <span className="text-xs font-mono text-slate-400">
                {activeScenario.riskLevel} VERDICT
              </span>
            </div>
          </div>

          <div className="hidden sm:block flex-1 max-w-xs">
            <div className="w-full h-2 bg-slate-800 rounded overflow-hidden">
              <div
                className={`h-full rounded transition-all duration-300 ${
                  isCritical ? 'bg-rose-500' : isClean ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${activeScenario.riskScore}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
            <span>Storage Slots: <strong className="text-slate-200 tabular-nums">{activeScenario.metrics.storageSlotsTouched}</strong></span>
            <span>•</span>
            <span>Simulation Latency: <strong className="text-cyan-400 tabular-nums">0.42ms</strong></span>
          </div>
        </div>

        {/* 3-Column Working Cockpit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Intent Charter & Risk Gauge (3 cols) */}
          <div className="lg:col-span-3">
            <IntentCharter scenario={activeScenario} />
          </div>

          {/* Center Column: Vernier Time-Travel Caliper & Storage Slot Inspector (6 cols) */}
          <div className="lg:col-span-6">
            <VernierRadar
              scenario={activeScenario}
              activeStepIndex={activeStepIndex}
              setActiveStepIndex={setActiveStepIndex}
            />
          </div>

          {/* Right Column: Bytecode Trace & Action Proof Rail (3 cols) */}
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
    </div>
  );
};
