'use client';

import React, { useState } from 'react';
import { SimulationScenario } from '../../lib/types';
import { SCENARIOS } from '../../data/attack-vectors';
import { IntentCharter } from '../console/IntentCharter';
import { VernierRadar } from '../console/VernierRadar';
import { BytecodeTrace } from '../console/BytecodeTrace';
import { ReceiptRail } from '../proof/ReceiptRail';
import { JudgeHumanMode } from '../console/JudgeHumanMode';
import { SurfaceTab } from '../navigation/ChromeHeader';
import { Button, Badge, Card, TabsList, TabsTrigger } from '../ui';
import { ArrowLeft, UserCheck, Binary, Sliders } from 'lucide-react';

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
  const [cockpitViewMode, setCockpitViewMode] = useState<'human' | 'auditor'>('human');
  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];
  const isCritical = activeScenario.riskLevel === 'CRITICAL';
  const isClean = activeScenario.riskLevel === 'CLEAN';

  return (
    <div className="py-8 px-4 lg:px-8 bg-[#090d16] flex-1 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Cockpit Bar: Back to Overview + Hero Metric + Scenario Switcher + View Mode Toggle */}
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
            {/* View Mode Switcher: Plain English (Judge) vs Deep Metrology (Auditor) */}
            <TabsList>
              <TabsTrigger
                active={cockpitViewMode === 'human'}
                onClick={() => setCockpitViewMode('human')}
                icon={<UserCheck className="size-3.5" />}
              >
                Plain English (Judge Mode)
              </TabsTrigger>
              <TabsTrigger
                active={cockpitViewMode === 'auditor'}
                onClick={() => setCockpitViewMode('auditor')}
                icon={<Binary className="size-3.5" />}
              >
                Deep Metrology (Auditor Mode)
              </TabsTrigger>
            </TabsList>

            {/* Scenario Switcher Tabs */}
            <TabsList>
              {SCENARIOS.map((s) => (
                <TabsTrigger
                  key={s.id}
                  active={s.id === selectedScenarioId}
                  onClick={() => onSelectScenario(s.id)}
                >
                  <span className={`inline-block size-1.5 rounded-full mr-1.5 ${
                    s.riskLevel === 'CRITICAL' ? 'bg-rose-500' : s.riskLevel === 'HIGH' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  {s.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Hero Metric Banner: Exactly ONE primary metric with context */}
        <Card className="p-4 flex flex-wrap items-center justify-between gap-4">
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
              <Badge variant={isCritical ? 'destructive' : isClean ? 'success' : 'warning'} dot dotPulse>
                {activeScenario.riskLevel} VERDICT
              </Badge>
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
        </Card>

        {/* Render either Judge Human Mode (Default) or Deep Metrology Mode */}
        {cockpitViewMode === 'human' ? (
          <JudgeHumanMode
            scenario={activeScenario}
            onNavigateTab={onNavigateTab}
            onSwitchToAuditorMode={() => setCockpitViewMode('auditor')}
          />
        ) : (
          /* 3-Column Working Cockpit Grid (Auditor Metrology Mode) */
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
        )}
      </div>
    </div>
  );
};
