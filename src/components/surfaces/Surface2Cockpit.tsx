'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  SkipBack, 
  SkipForward, 
  Fuel, 
  Database, 
  FileCode, 
  Check, 
  Copy, 
  Lock, 
  AlertTriangle, 
  Gift, 
  ExternalLink, 
  Terminal, 
  XCircle, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulationScenario } from '../../lib/types';
import { SCENARIOS } from '../../data/attack-vectors';
import { SurfaceTab } from '../navigation/ChromeHeader';
import { Button, Badge, Card, TabsList, TabsTrigger } from '../ui';

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

  // Auditor inspector tab state
  const [auditorTab, setAuditorTab] = useState<'storage' | 'bytecode'>('storage');

  // Forensics simulation mode
  const [forensicsMode, setForensicsMode] = useState<'protected' | 'blind'>('protected');
  const [hasSimulatedBlindSign, setHasSimulatedBlindSign] = useState(false);

  // Primary action confirmation feedback
  const [actionConfirmed, setActionConfirmed] = useState(false);

  // EIP-712 Receipt copy state & modal
  const [receiptCopied, setReceiptCopied] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const isCritical = activeScenario.riskLevel === 'CRITICAL';
  const isHigh = activeScenario.riskLevel === 'HIGH';
  const isClean = activeScenario.riskLevel === 'CLEAN';

  const totalSteps = activeScenario.opcodeTrace.length;
  const safeStepIndex = Math.min(Math.max(0, activeStepIndex), totalSteps - 1);
  const currentOpcode = activeScenario.opcodeTrace[safeStepIndex] || activeScenario.opcodeTrace[0];

  // Cumulative gas simulated up to this step
  const gasFraction = (safeStepIndex + 1) / totalSteps;
  const currentGas = Math.round(activeScenario.metrics.gasSimulated * gasFraction);

  const explainer = activeScenario.plainEnglish || {
    scamPromise: activeScenario.name,
    scamSubtitle: activeScenario.tagline,
    actualAction: activeScenario.threat.pathogenicSignal,
    victimLoss: '$142,000+ potential drain',
    vernierAction: activeScenario.threat.remediation,
    assetsProtected: 'Assets Protected by Vernier',
    whyThisMatters: 'Protects users from signing malicious calldata blind.',
  };

  const handlePrimaryAction = () => {
    setActionConfirmed(true);
    if (isClean) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
    setTimeout(() => setActionConfirmed(false), 3500);
  };

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(JSON.stringify(activeScenario, null, 2));
    setReceiptCopied(true);
    setTimeout(() => setReceiptCopied(false), 2000);
  };

  const handlePrevStep = () => {
    setActiveStepIndex(Math.max(0, safeStepIndex - 1));
  };

  const handleNextStep = () => {
    setActiveStepIndex(Math.min(totalSteps - 1, safeStepIndex + 1));
  };

  return (
    <div className="py-6 px-4 lg:px-8 bg-[#090d16] min-h-[calc(100vh-3.5rem)] flex-1 space-y-5">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* 1. TOP COMMAND BAR (Unified Verdict + Scenarios + Single Primary CTA) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-[#0e131f] shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigateTab('overview')}
              aria-label="Return to Overview"
              title="Return to Overview"
              className="size-8 shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>

            {/* Traffic Light Physical Status Dots */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#090d16] border border-slate-800 shrink-0">
              <span
                className={`size-2.5 rounded-full transition-all duration-200 ${
                  isCritical
                    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                    : 'bg-rose-950 opacity-40'
                }`}
                title="Critical Threat"
              />
              <span
                className={`size-2.5 rounded-full transition-all duration-200 ${
                  isHigh
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : 'bg-amber-950 opacity-40'
                }`}
                title="High Risk"
              />
              <span
                className={`size-2.5 rounded-full transition-all duration-200 ${
                  isClean
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                    : 'bg-emerald-950 opacity-40'
                }`}
                title="Clean Conforming"
              />
            </div>

            {/* Scenario Switcher Tabs */}
            <TabsList className="overflow-x-auto">
              {SCENARIOS.map((s) => (
                <TabsTrigger
                  key={s.id}
                  active={s.id === selectedScenarioId}
                  onClick={() => {
                    onSelectScenario(s.id);
                    setActiveStepIndex(0);
                    setForensicsMode('protected');
                  }}
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

            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs font-mono text-slate-400">
              <span className="text-white font-semibold truncate max-w-xs">{activeScenario.name}</span>
              <span>•</span>
              <span className="text-cyan-400 tabular-nums">0.42ms Local Viem Sandbox</span>
            </div>
          </div>

          {/* Right Status Pill + Single Primary CTA Button */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 justify-between md:justify-end">
            <Badge
              variant={isClean ? 'success' : 'destructive'}
              size="lg"
              dot
              dotPulse
              className="font-bold tracking-wide shrink-0"
            >
              {isClean ? 'SAFE TO SIGN' : 'CRITICAL DRAIN INTERCEPTED'}
            </Badge>

            {isClean ? (
              <Button
                variant="primary"
                size="default"
                onClick={handlePrimaryAction}
                leftIcon={<CheckCircle2 className="size-4" />}
                className="font-bold uppercase tracking-wider w-full sm:w-auto"
              >
                {actionConfirmed ? 'BROADCAST DISPATCHED' : 'APPROVE & BROADCAST'}
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="default"
                onClick={handlePrimaryAction}
                leftIcon={<ShieldAlert className="size-4" />}
                className="font-bold uppercase tracking-wider shadow-lg w-full sm:w-auto"
              >
                {actionConfirmed ? 'TRANSACTION HALTED & ISOLATED' : 'HALT TRANSACTION & ISOLATE'}
              </Button>
            )}
          </div>
        </div>

        {/* 2. DUAL-PANEL WORKBENCH (Left: EVM Caliper Execution Engine | Right: Forensics & Attestation) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* LEFT PANEL (7 cols): Execution Metrology, Caliper Scrubber & Auditor Inspector */}
          <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0e131f] flex flex-col overflow-hidden shadow-sm">
            {/* Header: Title + Step/Gas Metrics */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-slate-800 bg-[#0b0f19]">
              <div className="flex items-center gap-2">
                <Sliders className="size-3.5 text-amber-400" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
                  CALIBRATED EXECUTION SCRUBBER
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <span>STEP <strong className="text-slate-200 tabular-nums">{safeStepIndex + 1}</strong> OF <strong className="text-slate-200 tabular-nums">{totalSteps}</strong></span>
                <span>•</span>
                <span>GAS: <strong className="text-amber-300 tabular-nums">{currentGas.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Caliper Scrubber Controls & Ruler */}
            <div className="p-4 space-y-3 border-b border-slate-800 bg-[#090d16]">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-slate-300 font-medium">CALIPER STEP CONTROLS</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handlePrevStep}
                    disabled={safeStepIndex === 0}
                    aria-label="Previous execution step"
                    className="size-7"
                  >
                    <SkipBack className="size-3" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleNextStep}
                    disabled={safeStepIndex === totalSteps - 1}
                    aria-label="Next execution step"
                    className="size-7"
                  >
                    <SkipForward className="size-3" />
                  </Button>
                  <span className="font-mono text-amber-300 tabular-nums font-semibold ml-1">
                    OPCODE #{currentOpcode.step}
                  </span>
                </div>
              </div>

              {/* Physical Vernier Metric Ruler */}
              <div className="relative w-full h-9 bg-[#0e131f] rounded border border-slate-800 overflow-hidden flex items-center select-none">
                <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none opacity-40">
                  {Array.from({ length: 37 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-[1px] ${i % 5 === 0 ? 'h-4 bg-slate-400' : 'h-2 bg-slate-600'}`} />
                      {i % 10 === 0 && <span className="text-[7px] font-mono text-slate-400">{i}</span>}
                    </div>
                  ))}
                </div>

                <input
                  type="range"
                  min="0"
                  max={totalSteps - 1}
                  value={safeStepIndex}
                  onChange={(e) => setActiveStepIndex(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
                  aria-label="Vernier Step Scrubber"
                />

                <div
                  className="absolute top-0 bottom-0 w-20 border-x border-amber-400/80 bg-amber-500/10 flex items-center justify-center pointer-events-none transition-all duration-75"
                  style={{ left: `calc(${(safeStepIndex / Math.max(1, totalSteps - 1)) * 92}% - 4px)` }}
                >
                  <div className="w-[1.5px] h-full bg-amber-400" />
                  <div className="absolute -top-0.5 px-1 rounded bg-amber-950 text-[8px] font-mono text-amber-200 border border-amber-500/50 uppercase">
                    {currentOpcode.opcode}
                  </div>
                </div>
              </div>

              {/* Active Opcode Inspector Bar */}
              <div className="flex items-center justify-between text-xs font-mono px-3 py-2 rounded border border-slate-800 bg-[#0e131f]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">ACTIVE OPCODE:</span>
                  <span className="font-bold text-amber-300">[{currentOpcode.opcode}]</span>
                  {currentOpcode.arg && <span className="text-slate-300 font-normal">{currentOpcode.arg}</span>}
                </div>
                {currentOpcode.isBlocked ? (
                  <span className="px-1.5 py-0.5 rounded border border-rose-800 bg-rose-950/60 text-[10px] text-rose-300 font-bold">
                    INTERCEPTED BY FIREWALL
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px] truncate max-w-xs">
                    {currentOpcode.comment || 'Normal instruction execution'}
                  </span>
                )}
              </div>
            </div>

            {/* Telemetry Strip: Gas Baseline + State Slots Touched */}
            <div className="grid grid-cols-2 divide-x divide-slate-800 border-b border-slate-800 bg-[#0e131f] text-xs font-mono">
              <div className="p-3 space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1.5"><Fuel className="size-3 text-slate-400" /> Cumulative Gas</span>
                  <span className="text-slate-200 font-semibold tabular-nums">{currentGas.toLocaleString()} / {activeScenario.metrics.gasSimulated.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-150 ${
                      activeScenario.metrics.gasSimulated > activeScenario.metrics.gasExpected * 1.5 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(currentGas / 250000) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400 text-[11px]"><Database className="size-3 text-slate-400" /> State Mutations</span>
                <span className="text-slate-200 font-semibold tabular-nums">{activeScenario.metrics.storageSlotsTouched} SLOTS TOUCHED</span>
              </div>
            </div>

            {/* Auditor Deck: Tabs between Storage Slot Deltas & Bytecode Disassembly */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger
                    active={auditorTab === 'storage'}
                    onClick={() => setAuditorTab('storage')}
                  >
                    Storage Slot Deltas ({activeScenario.storageDeltas.length})
                  </TabsTrigger>
                  <TabsTrigger
                    active={auditorTab === 'bytecode'}
                    onClick={() => setAuditorTab('bytecode')}
                  >
                    EVM Bytecode Trace ({totalSteps})
                  </TabsTrigger>
                </TabsList>
                <span className="text-[10px] font-mono text-slate-500 uppercase">AUDITOR REPLAY ENGINE</span>
              </div>

              {auditorTab === 'storage' ? (
                /* Tab 1: Storage Slot Differential Table */
                <div className="border border-slate-800 rounded-lg overflow-hidden overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-[#090d16] text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">SLOT</th>
                        <th className="py-2 px-3">VARIABLE</th>
                        <th className="py-2 px-3 hidden sm:table-cell">PREVIOUS</th>
                        <th className="py-2 px-3">MUTATED</th>
                        <th className="py-2 px-3 text-right">VERDICT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-[#0e131f]">
                      {activeScenario.storageDeltas.map((delta) => (
                        <tr
                          key={delta.slot}
                          className={delta.isHazardous ? 'bg-rose-950/20 text-slate-200' : 'text-slate-300'}
                        >
                          <td className="py-2 px-3 font-semibold text-slate-200">{delta.slot}</td>
                          <td className="py-2 px-3 text-slate-300">{delta.label}</td>
                          <td className="py-2 px-3 text-slate-500 hidden sm:table-cell truncate max-w-[120px]">
                            {delta.prevValue}
                          </td>
                          <td className="py-2 px-3 font-semibold truncate max-w-[140px]">
                            {delta.newValue}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {delta.isHazardous ? (
                              <Badge variant="destructive" size="sm">HAZARD</Badge>
                            ) : (
                              <Badge variant="success" size="sm">CONFORM</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Tab 2: EVM Bytecode Trace */
                <div className="h-60 overflow-y-auto font-mono text-xs space-y-0.5 bg-[#090d16] p-2 rounded-lg border border-slate-800">
                  {activeScenario.opcodeTrace.map((item, idx) => {
                    const isActive = idx === safeStepIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveStepIndex(idx)}
                        className={`w-full text-left flex items-center gap-2 py-1 px-1.5 rounded transition-colors cursor-pointer ${
                          isActive
                            ? item.isBlocked
                              ? 'bg-rose-950/60 border border-rose-700/80 text-rose-200 font-bold'
                              : 'bg-amber-950/40 border border-amber-500/50 text-amber-200 font-semibold'
                            : 'hover:bg-slate-800/40 text-slate-400 border border-transparent'
                        }`}
                      >
                        <span className={`text-[10px] w-6 shrink-0 tabular-nums ${isActive ? 'text-amber-400 font-bold' : 'text-slate-600'}`}>
                          {isActive ? '▶' : item.step}
                        </span>
                        <span
                          className={`shrink-0 font-medium ${
                            item.isBlocked
                              ? 'text-rose-400'
                              : item.opcode === 'SSTORE' || item.opcode === 'DELEGATECALL'
                              ? 'text-amber-400'
                              : 'text-slate-200'
                          }`}
                        >
                          [{item.opcode}]
                        </span>
                        {item.arg && (
                          <span className="text-slate-400 truncate text-[11px] max-w-[140px]">
                            {item.arg}
                          </span>
                        )}
                        {item.isBlocked && (
                          <Badge variant="destructive" size="sm" className="ml-auto text-[9px] py-0 px-1">
                            <ShieldAlert className="size-2.5 mr-0.5" />
                            BLOCKED
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pathogenic Signal Banner (if threat intercepted) */}
            {(isCritical || isHigh) && (
              <div className="p-3.5 border-t border-rose-800/60 bg-rose-950/20 text-xs font-mono space-y-1">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <ShieldAlert className="size-3.5 text-rose-500" />
                  <span>PATHOGENIC SIGNAL: {activeScenario.threat.pathogenicSignal}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Firewall Policy: <span className="text-rose-300 font-semibold">{activeScenario.threat.remediation}</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL (5 cols): Forensics, Risk Index & Cryptographic Evidence Rail */}
          <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0e131f] flex flex-col overflow-hidden shadow-sm space-y-0">
            {/* Header: Forensics Title + Simulation Mode Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-slate-800 bg-[#0b0f19]">
              <div className="flex items-center gap-2">
                <Zap className="size-3.5 text-cyan-400" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
                  TRANSACTION FORENSICS
                </span>
              </div>

              <TabsList>
                <TabsTrigger
                  active={forensicsMode === 'protected'}
                  onClick={() => setForensicsMode('protected')}
                  badge={forensicsMode === 'protected' ? 'ACTIVE' : undefined}
                >
                  Protected
                </TabsTrigger>
                <TabsTrigger
                  active={forensicsMode === 'blind'}
                  onClick={() => {
                    setForensicsMode('blind');
                    setHasSimulatedBlindSign(false);
                  }}
                  badge={forensicsMode === 'blind' ? 'BLIND' : undefined}
                >
                  Blind Sign
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Forensics Body */}
            {forensicsMode === 'protected' ? (
              <div className="p-4 space-y-4">
                {/* 1. Forensics Diff: Prompted Intent vs Mutation Reality */}
                <div className="space-y-3">
                  {/* Prompted Intent */}
                  <div className="space-y-1.5 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
                        <Gift className="size-3 text-cyan-400" />
                        <span>PROMPTED INTENT</span>
                      </span>
                      <Badge variant="outline" size="sm">UI Claim</Badge>
                    </div>

                    <h4 className="font-sans font-bold text-sm text-white">
                      {explainer.scamPromise}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {explainer.scamSubtitle}
                    </p>

                    <div className="text-[11px] font-mono text-slate-400 pt-1 flex items-center justify-between">
                      <span>Target: <code className="text-slate-300">{activeScenario.intent.targetContract}</code></span>
                      {activeScenario.intent.verifiedSource ? (
                        <Badge variant="success" size="sm">VERIFIED</Badge>
                      ) : (
                        <Badge variant="destructive" size="sm">UNVERIFIED</Badge>
                      )}
                    </div>
                  </div>

                  {/* Mutation Reality */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-1.5">
                        {isClean ? <ShieldCheck className="size-3.5 text-emerald-400" /> : <AlertTriangle className="size-3.5 text-rose-400" />}
                        <span>MUTATION REALITY</span>
                      </span>
                      <Badge variant={isClean ? 'success' : 'destructive'} size="sm">
                        {isClean ? 'Conforming' : 'Exploit Attempt'}
                      </Badge>
                    </div>

                    <h4 className={`font-sans font-bold text-sm ${isClean ? 'text-emerald-200' : 'text-rose-200'}`}>
                      {explainer.actualAction}
                    </h4>

                    <p className="text-xs text-slate-300">
                      <strong>Financial Impact:</strong> <span className="tabular-nums font-semibold">{explainer.victimLoss}</span>
                    </p>

                    <div className="text-[11px] font-mono pt-1 text-slate-400">
                      <span className={isClean ? 'text-emerald-300' : 'text-rose-300'}>
                        {isClean ? '✓ Zero malicious side effects detected' : '🛡️ Signature disabled: Max approval prevented'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Security Risk Index */}
                <div className="p-3 rounded-lg border border-slate-800 bg-[#090d16] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">SECURITY RISK INDEX</span>
                    <Badge variant={isClean ? 'success' : isHigh ? 'warning' : 'destructive'} size="sm">
                      {activeScenario.riskLevel} RISK
                    </Badge>
                  </div>

                  <div className="flex items-baseline justify-between font-mono">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-xl font-bold tabular-nums ${isClean ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {activeScenario.riskScore}
                      </span>
                      <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {isClean ? 'SAFE EXECUTION' : isHigh ? 'CAUTION ADVISED' : 'MALICIOUS CALIBRATION'}
                    </span>
                  </div>

                  {/* 10-Segment Progress Meter */}
                  <div className="grid grid-cols-10 gap-1 h-1.5">
                    {Array.from({ length: 10 }).map((_, idx) => {
                      const active = idx < Math.round((activeScenario.riskScore / 100) * 10);
                      return (
                        <div
                          key={idx}
                          className={`rounded-sm transition-colors ${
                            active
                              ? isClean ? 'bg-emerald-400' : isHigh ? 'bg-amber-400' : 'bg-rose-500'
                              : 'bg-slate-800'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Vectors list */}
                  <div className="space-y-1 pt-1">
                    {activeScenario.threat.vectors.length > 0 ? (
                      activeScenario.threat.vectors.map((vec, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[10px] font-mono text-rose-300">
                          <AlertTriangle className="size-3 text-rose-400 shrink-0 mt-0.5" />
                          <span>{vec}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                        <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                        <span>Parameters conform cleanly to declared intent charter</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Cryptographic Proof & Receipt Rail */}
                <div className="p-3 rounded-lg border border-slate-800 bg-[#090d16] space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                      <Lock className="size-3 text-slate-400" />
                      <span>CRYPTOGRAPHIC ATTESTATION</span>
                    </div>
                    <Badge variant="outline">EIP-712</Badge>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">State Transition Root:</span>
                      <span className="text-slate-300 truncate max-w-[160px]">{activeScenario.receipt.stateRoot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Block Hash:</span>
                      <span className="text-slate-400">{activeScenario.receipt.simulatedBlockHash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capital Shielded:</span>
                      <span className="text-amber-400 font-medium tabular-nums">{activeScenario.receipt.gasSaved}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowReceiptModal(true)}
                      className="flex-1 text-[11px] font-mono"
                      leftIcon={<FileCode className="size-3" />}
                    >
                      VIEW RECEIPT
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyReceipt}
                      className="flex-1 text-[11px] font-mono text-slate-400 hover:text-slate-200"
                      leftIcon={receiptCopied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    >
                      {receiptCopied ? 'COPIED' : 'COPY JSON'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Blind Mode Experience */
              <div className="p-4 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <XCircle className="size-4" />
                    <span>Unprotected Standard Wallet (Blind Sign)</span>
                  </span>
                  <Badge variant="destructive" size="sm">Blind</Badge>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-400 block text-[11px]">Without Vernier, you are prompted to sign raw unverified calldata:</span>
                  <div className="p-3 rounded bg-[#090d16] border border-slate-800 text-slate-400 break-all leading-relaxed text-[11px]">
                    0x23b872dd0000000000000000000000004e6b21703e9b01c7811985a109867c4fa6712ab9ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff...
                  </div>
                </div>

                {hasSimulatedBlindSign ? (
                  <div className="p-3.5 rounded border border-rose-600 bg-rose-950/60 text-center space-y-2">
                    <div className="text-rose-300 font-bold flex items-center justify-center gap-2">
                      <ShieldAlert className="size-4 text-rose-400" />
                      <span>CRITICAL EXPLOIT EXECUTED: ASSETS DRAINED</span>
                    </div>
                    <p className="text-xs text-rose-200 font-sans">
                      You clicked Confirm. In the next block, the attacker executed transferFrom and drained <strong className="tabular-nums">{explainer.victimLoss}</strong>.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setForensicsMode('protected')}
                      rightIcon={<ArrowRight className="size-3" />}
                      className="mt-1"
                    >
                      Restore Vernier Protection
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <span className="text-slate-500 text-[11px] font-sans">
                      Clicking Confirm signs blind calldata...
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setForensicsMode('protected')}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setHasSimulatedBlindSign(true)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                      >
                        Sign Blind
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EIP-712 Signed Attestation Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-200">
                <ShieldCheck className="size-4 text-amber-400" />
                <span>SIGNED EIP-712 ATTESTATION RECEIPT</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReceiptModal(false)}
                className="text-slate-500 hover:text-slate-200 text-xs font-mono h-auto p-1"
              >
                ESC
              </Button>
            </div>

            <pre className="p-3 rounded bg-[#090d16] border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-64 leading-relaxed">
              {JSON.stringify(
                {
                  version: 'Vernier-v1.8',
                  stateRoot: activeScenario.receipt.stateRoot,
                  attestation: activeScenario.receipt.eip712Attestation,
                  intent: activeScenario.intent,
                  metrics: activeScenario.metrics,
                  storageDeltas: activeScenario.storageDeltas,
                  signatureProof: {
                    signer: '0xDA9...e6B3',
                    algorithm: 'secp256k1-keccak256',
                    validUntilBlock: 21894200,
                  },
                },
                null,
                2
              )}
            </pre>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyReceipt}
                leftIcon={receiptCopied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
              >
                {receiptCopied ? 'COPIED' : 'COPY RECEIPT JSON'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReceiptModal(false)}
              >
                CLOSE
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
