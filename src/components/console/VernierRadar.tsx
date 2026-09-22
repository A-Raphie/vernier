import React, { useState } from 'react';
import { Sliders, Fuel, Database, ShieldAlert, SkipBack, SkipForward } from 'lucide-react';
import { SimulationScenario } from '../../lib/types';
import { Button, Badge, Card } from '../ui';

interface VernierRadarProps {
  scenario: SimulationScenario;
  activeStepIndex: number;
  setActiveStepIndex: (index: number) => void;
}

export const VernierRadar: React.FC<VernierRadarProps> = ({
  scenario,
  activeStepIndex,
  setActiveStepIndex,
}) => {
  const totalSteps = scenario.opcodeTrace.length;
  const safeIndex = Math.min(Math.max(0, activeStepIndex), totalSteps - 1);
  const currentOpcode = scenario.opcodeTrace[safeIndex] || scenario.opcodeTrace[0];
  const isHazardStep = currentOpcode.isBlocked || (safeIndex === totalSteps - 1 && scenario.riskScore > 40);

  const isCritical = scenario.riskLevel === 'CRITICAL';
  const isHigh = scenario.riskLevel === 'HIGH';

  const handlePrev = () => {
    setActiveStepIndex(Math.max(0, safeIndex - 1));
  };

  const handleNext = () => {
    setActiveStepIndex(Math.min(totalSteps - 1, safeIndex + 1));
  };

  // Calculate cumulative gas simulated up to this step
  const gasFraction = (safeIndex + 1) / totalSteps;
  const currentGas = Math.round(scenario.metrics.gasSimulated * gasFraction);

  return (
    <Card className="flex flex-col gap-4 p-5">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e293b] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="size-3.5 text-amber-400" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
            EXECUTION STEP SCRUBBER
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>STEP <strong className="text-slate-200 tabular-nums">{safeIndex + 1}</strong> OF <strong className="text-slate-200 tabular-nums">{totalSteps}</strong></span>
          <span>GAS: <strong className="text-amber-300 tabular-nums">{currentGas.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Signature Move: Functional Vernier Caliper Scrubber */}
      <div className="p-3.5 rounded border border-slate-800 bg-[#090d16] space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="text-slate-300 font-medium">
            CALIPER STEP CONTROLS
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handlePrev}
              disabled={safeIndex === 0}
              aria-label="Previous execution step"
              className="size-7"
            >
              <SkipBack className="size-3" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleNext}
              disabled={safeIndex === totalSteps - 1}
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
          {/* Static Graduated Metric Scale */}
          <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none opacity-40">
            {Array.from({ length: 37 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-[1px] ${i % 5 === 0 ? 'h-4 bg-slate-400' : 'h-2 bg-slate-600'}`} />
                {i % 10 === 0 && <span className="text-[7px] font-mono text-slate-400">{i}</span>}
              </div>
            ))}
          </div>

          {/* Interactive Range Slider */}
          <input
            type="range"
            min="0"
            max={totalSteps - 1}
            value={safeIndex}
            onChange={(e) => setActiveStepIndex(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
            aria-label="Vernier Step Scrubber"
          />

          {/* Sliding Caliper Vernier Cursor */}
          <div
            className="absolute top-0 bottom-0 w-20 border-x border-amber-400/80 bg-amber-500/10 flex items-center justify-center pointer-events-none transition-all duration-75"
            style={{ left: `calc(${(safeIndex / Math.max(1, totalSteps - 1)) * 92}% - 4px)` }}
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
            <span className="text-slate-400 text-[11px]">
              {currentOpcode.comment || 'Normal instruction execution'}
            </span>
          )}
        </div>
      </div>

      {/* Gas Profile & Storage Shift Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gas Consumption Meter */}
        <div className="p-3.5 rounded border border-slate-800 bg-[#090d16] flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Fuel className="size-3.5 text-slate-400" />
              <span>GAS CONSUMPTION PROFILE</span>
            </span>
            <span className="text-slate-200 font-bold tabular-nums">
              {currentGas.toLocaleString()} / {scenario.metrics.gasSimulated.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full h-2 bg-slate-800 rounded overflow-hidden">
              <div
                className={`h-full rounded transition-all duration-150 ${
                  scenario.metrics.gasSimulated > scenario.metrics.gasExpected * 1.5
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${(currentGas / 250000) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Expected Baseline: <span className="tabular-nums">{scenario.metrics.gasExpected.toLocaleString()}</span></span>
              <span className={scenario.metrics.gasSimulated > scenario.metrics.gasExpected ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                {scenario.metrics.gasSimulated > scenario.metrics.gasExpected ? '+' : ''}
                {(((scenario.metrics.gasSimulated - scenario.metrics.gasExpected) / scenario.metrics.gasExpected) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* State Machine Status */}
        <div className="p-3.5 rounded border border-slate-800 bg-[#090d16] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Database className="size-3.5 text-slate-400" />
              <span>STATE MUTATIONS</span>
            </span>
            <span className="text-slate-200 font-bold tabular-nums">
              {scenario.metrics.storageSlotsTouched} SLOTS
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Simulation State:</span>
              <span className="text-slate-200 font-medium">REPLAY ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>Security Verdict:</span>
              <span className={isCritical ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {scenario.riskLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabular Storage Slot Differential Inspector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>STORAGE SLOT DIFFERENTIAL LOG</span>
          <span className="text-[10px] text-slate-500">EVM WORD DELTAS</span>
        </div>

        <div className="border border-slate-800 rounded overflow-hidden">
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
              {scenario.storageDeltas.map((delta) => (
                <tr
                  key={delta.slot}
                  className={delta.isHazardous ? 'bg-rose-950/20 text-slate-200' : 'text-slate-300'}
                >
                  <td className="py-2 px-3 font-semibold text-slate-200">{delta.slot}</td>
                  <td className="py-2 px-3 text-slate-300">{delta.label}</td>
                  <td className="py-2 px-3 text-slate-500 hidden sm:table-cell truncate max-w-[130px]">
                    {delta.prevValue}
                  </td>
                  <td className="py-2 px-3 font-semibold truncate max-w-[150px]">
                    {delta.newValue}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {delta.isHazardous ? (
                      <Badge variant="destructive" size="sm">
                        HAZARD
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        CONFORM
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pathogenic Call Alert Banner */}
      {(isCritical || isHigh) && (
        <div className="p-4 rounded border border-rose-800/80 bg-rose-950/20 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wide">
            <ShieldAlert className="size-4 text-rose-500" />
            <span>PATHOGENIC SIGNAL DETECTED</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed text-pretty">
            {scenario.threat.pathogenicSignal}
          </p>
          <div className="text-[11px] font-mono text-slate-400 border-t border-rose-900/40 pt-2">
            Policy Action: <span className="font-semibold text-rose-300">{scenario.threat.remediation}</span>
          </div>
        </div>
      )}
    </Card>
  );
};
