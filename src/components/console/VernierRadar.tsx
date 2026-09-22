'use client';

import React, { useState } from 'react';
import { Radar, AlertOctagon, Sliders, Shield, Fuel, Database } from 'lucide-react';
import { SimulationScenario } from '../../lib/types';

interface VernierRadarProps {
  scenario: SimulationScenario;
}

export const VernierRadar: React.FC<VernierRadarProps> = ({ scenario }) => {
  const [caliperOffset, setCaliperOffset] = useState<number>(35);

  const isCritical = scenario.riskLevel === 'CRITICAL';
  const isHigh = scenario.riskLevel === 'HIGH';

  return (
    <div className="flex flex-col gap-4 p-5 rounded-lg border border-[#1e293b] bg-[#0f172a] shadow-xl">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e293b] pb-3">
        <div className="flex items-center gap-2">
          <Radar className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            EVM STATE DELTA & STORAGE SLOT RADAR
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>SLOTS TOUCHED: <strong className="text-cyan-300">{scenario.metrics.storageSlotsTouched}</strong></span>
          <span>SHIFTS: <strong className="text-amber-300">{scenario.metrics.stateShiftsCount}</strong></span>
        </div>
      </div>

      {/* Signature Move: Interactive Vernier Sliding Caliper Scale */}
      <div className="p-3.5 rounded border border-[#1e293b] bg-[#0a0d14] space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Sliders className="w-3.5 h-3.5" />
            <span>VERNIER PRECISION CALIPER SCALE</span>
          </div>
          <div className="text-slate-300">
            TOLERANCE OFFSET: <span className="font-bold text-amber-300 font-mono">{(caliperOffset * 0.025).toFixed(3)} μs</span>
          </div>
        </div>

        {/* Vernier Graduated Ticks Visualizer */}
        <div className="relative w-full h-8 bg-[#0f172a] rounded border border-slate-700/60 overflow-hidden flex items-center select-none">
          {/* Main Fixed Metric Ruler (0 to 100) */}
          <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none opacity-40">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-[1px] ${i % 5 === 0 ? 'h-4 bg-amber-400' : 'h-2 bg-slate-500'}`} />
                {i % 5 === 0 && <span className="text-[8px] font-mono text-slate-400">{i * 4}</span>}
              </div>
            ))}
          </div>

          {/* Sliding Auxiliary Vernier Scale Runner */}
          <div
            className="absolute top-0 bottom-0 w-16 border-x border-cyan-400 bg-cyan-500/15 flex items-center justify-center transition-all duration-75"
            style={{ left: `calc(${caliperOffset}% - 32px)` }}
          >
            <div className="w-0.5 h-full bg-cyan-400" />
            <div className="absolute -top-1 px-1 rounded bg-cyan-900 text-[8px] font-mono text-cyan-200 border border-cyan-400/50">
              SLOT {Math.floor(caliperOffset / 25)}
            </div>
          </div>

          {/* Interactive Range Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={caliperOffset}
            onChange={(e) => setCaliperOffset(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
            aria-label="Vernier Caliper Scale"
          />
        </div>
      </div>

      {/* Center Visualization: Radar Sweep & Storage Bar Shift */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Polar Coordinate Radar Screen */}
        <div className="relative h-48 rounded border border-[#1e293b] bg-[#0a0d14] flex items-center justify-center overflow-hidden">
          {/* Circular Rings */}
          <div className="absolute w-40 h-40 rounded-full border border-slate-700/40" />
          <div className="absolute w-28 h-28 rounded-full border border-slate-700/60" />
          <div className="absolute w-16 h-16 rounded-full border border-slate-700/80" />
          <div className="absolute w-full h-[1px] bg-slate-700/40" />
          <div className="absolute h-full w-[1px] bg-slate-700/40" />

          {/* Rotating Radar Sweep Cone */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 rounded-full animate-radar-sweep origin-center opacity-70">
              <div
                className="w-20 h-20 origin-bottom-right"
                style={{
                  background: isCritical
                    ? 'conic-gradient(from 0deg, rgba(239, 68, 68, 0.4) 0deg, transparent 60deg)'
                    : 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.4) 0deg, transparent 60deg)',
                }}
              />
            </div>
          </div>

          {/* Radar Blips */}
          {scenario.storageDeltas.map((delta, i) => {
            const angle = (i * 90 + caliperOffset * 1.5) * (Math.PI / 180);
            const radius = 35 + (i * 18);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={delta.slot}
                className={`absolute w-3 h-3 rounded-full flex items-center justify-center transition-transform duration-300 ${
                  delta.isHazardous
                    ? 'bg-rose-500 shadow-[0_0_8px_#ef4444] animate-ping'
                    : 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                }`}
                style={{ transform: `translate(${x}px, ${y}px)` }}
                title={`${delta.label} (${delta.slot})`}
              />
            );
          })}

          <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-500">
            POLAR STATE VECTOR
          </div>
          <div className="absolute top-2 right-2 text-[9px] font-mono text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>SWEEPING</span>
          </div>
        </div>

        {/* Gas & State Profile Chart */}
        <div className="p-3.5 rounded border border-[#1e293b] bg-[#0a0d14] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              <span>GAS PROFILE PROFILE DELTA</span>
            </span>
            <span className="text-slate-300 font-bold">
              {scenario.metrics.gasSimulated.toLocaleString()} units
            </span>
          </div>

          {/* Simulated vs Expected Gas Bars */}
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>SIMULATED EXECUTION</span>
                <span className={scenario.metrics.gasSimulated > scenario.metrics.gasExpected * 1.5 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  {scenario.metrics.gasSimulated.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-500 ${
                    scenario.metrics.gasSimulated > scenario.metrics.gasExpected * 1.5
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : 'bg-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, (scenario.metrics.gasSimulated / 250000) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>EXPECTED BENCHMARK</span>
                <span className="text-slate-400">{scenario.metrics.gasExpected.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded overflow-hidden">
                <div
                  className="h-full bg-slate-600 rounded"
                  style={{ width: `${Math.min(100, (scenario.metrics.gasExpected / 250000) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Gas Delta:</span>
            <span className={scenario.metrics.gasSimulated > scenario.metrics.gasExpected ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
              {scenario.metrics.gasSimulated > scenario.metrics.gasExpected ? '+' : ''}
              {(((scenario.metrics.gasSimulated - scenario.metrics.gasExpected) / scenario.metrics.gasExpected) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabular Storage Slot Differential Inspector */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>STORAGE SLOT DIFFERENTIAL LOG (SSTORE/SLOAD)</span>
        </div>

        <div className="border border-[#1e293b] rounded overflow-hidden">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-[#0a0d14] text-slate-400 border-b border-[#1e293b]">
              <tr>
                <th className="py-2 px-3">SLOT</th>
                <th className="py-2 px-3">VARIABLE / LABEL</th>
                <th className="py-2 px-3 hidden sm:table-cell">PREVIOUS STATE</th>
                <th className="py-2 px-3">MUTATED STATE</th>
                <th className="py-2 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60 bg-[#0f172a]/60">
              {scenario.storageDeltas.map((delta) => (
                <tr
                  key={delta.slot}
                  className={delta.isHazardous ? 'bg-rose-950/20 text-rose-200' : 'text-slate-300'}
                >
                  <td className="py-2 px-3 font-semibold text-cyan-300">{delta.slot}</td>
                  <td className="py-2 px-3">{delta.label}</td>
                  <td className="py-2 px-3 text-slate-500 hidden sm:table-cell truncate max-w-[140px]">
                    {delta.prevValue}
                  </td>
                  <td className="py-2 px-3 font-semibold truncate max-w-[160px]">
                    {delta.newValue}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {delta.isHazardous ? (
                      <span className="px-2 py-0.5 rounded border border-rose-500/40 bg-rose-950/40 text-[10px] text-rose-300 font-bold">
                        HAZARD
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/40 text-[10px] text-emerald-300">
                        CONFORM
                      </span>
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
        <div className="p-4 rounded-lg border border-rose-500/50 bg-rose-950/30 space-y-2 animate-pulse-glow">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wide">
            <AlertOctagon className="w-4 h-4 text-rose-500" />
            <span>BLOCKED MALICIOUS CALL: PATHOGENIC SIGNAL DETECTED</span>
          </div>
          <p className="text-xs text-rose-200/90 font-sans leading-relaxed">
            {scenario.threat.pathogenicSignal}
          </p>
          <div className="text-[11px] font-mono text-rose-300/80 border-t border-rose-500/30 pt-2">
            Remediation: <span className="font-semibold text-rose-200">{scenario.threat.remediation}</span>
          </div>
        </div>
      )}
    </div>
  );
};
