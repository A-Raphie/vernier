'use client';

import React from 'react';
import { SimulationScenario } from '../../lib/types';
import { SCENARIOS } from '../../data/attack-vectors';
import { IntentCharter } from '../console/IntentCharter';
import { VernierRadar } from '../console/VernierRadar';
import { BytecodeTrace } from '../console/BytecodeTrace';
import { ReceiptRail } from '../proof/ReceiptRail';
import { UnifiedVerdictCard } from '../console/UnifiedVerdictCard';
import { SurfaceTab } from '../navigation/ChromeHeader';
import { Button, Badge, Card, TabsList, TabsTrigger } from '../ui';
import { ArrowLeft, Cpu } from 'lucide-react';

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

  return (
    <div className="py-8 px-4 lg:px-8 bg-[#090d16] flex-1 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Cockpit Header: Back Button + Scenario Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigateTab('overview')}
              title="Return to Overview"
            >
              <ArrowLeft className="size-4" />
            </Button>
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

          <div className="flex flex-wrap items-center gap-3">
            {/* Scenario Switcher Tabs */}
            <TabsList>
              {SCENARIOS.map((s) => (
                <TabsTrigger
                  key={s.id}
                  active={s.id === selectedScenarioId}
                  onClick={() => onSelectScenario(s.id)}
                >
                  <span
                    className={`inline-block size-1.5 rounded-full mr-1.5 ${
                      s.riskLevel === 'CRITICAL'
                        ? 'bg-rose-500'
                        : s.riskLevel === 'HIGH'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  {s.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <Badge variant="outline" className="hidden sm:inline-flex">
              <Cpu className="size-3 text-cyan-400 mr-1" />
              0.42ms Local Viem Sandbox
            </Badge>
          </div>
        </div>

        {/* BEAT 1: 5-Second Traffic Light Verdict (The Human / Judge Layer) */}
        <UnifiedVerdictCard
          scenario={activeScenario}
          onNavigateTab={onNavigateTab}
        />

        {/* BEAT 2: Ground-Truth Execution & Auditor Evidence (The Metrology & Proof Layer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Physical Vernier Caliper Scrubber & Storage Slot Deltas (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <VernierRadar
              scenario={activeScenario}
              activeStepIndex={activeStepIndex}
              setActiveStepIndex={setActiveStepIndex}
            />
          </div>

          {/* Right Column: Intent Charter + Bytecode Trace + Cryptographic Attestation (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <IntentCharter scenario={activeScenario} />
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

