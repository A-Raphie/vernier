'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { RiskLevel } from '../../lib/types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  vectors: string[];
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, vectors }) => {
  const rotationAngle = -90 + (score / 100) * 180;

  const isCritical = level === 'CRITICAL';
  const isHigh = level === 'HIGH';
  const isClean = level === 'CLEAN';

  const strokeColor = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981';
  const textColor = isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-emerald-400';
  const badgeBorder = isCritical
    ? 'border-rose-800/80 bg-rose-950/40 text-rose-300'
    : isHigh
    ? 'border-amber-800/80 bg-amber-950/40 text-amber-300'
    : 'border-emerald-800/80 bg-emerald-950/40 text-emerald-300';

  return (
    <div className="flex flex-col items-center p-4 rounded border border-[#1e293b] bg-[#0e131f] space-y-3">
      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between w-full">
        <span>SECURITY RISK INDEX</span>
        <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-semibold ${badgeBorder}`}>
          {level}
        </span>
      </div>

      {/* SVG Analog-Calibrated Gauge */}
      <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Outer Arc Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray="251.3"
            strokeDashoffset={251.3 - (251.3 * (score / 100))}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />

          {/* Precision Metrology Tick Marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = (-180 + (tick / 100) * 180) * (Math.PI / 180);
            const x1 = 100 + 74 * Math.cos(angle);
            const y1 = 100 + 74 * Math.sin(angle);
            const x2 = 100 + 86 * Math.cos(angle);
            const y2 = 100 + 86 * Math.sin(angle);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#475569"
                strokeWidth="1"
              />
            );
          })}

          {/* Needle */}
          <g
            style={{
              transform: `rotate(${rotationAngle}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <polygon points="98.5,100 101.5,100 100,32" fill={strokeColor} />
            <circle cx="100" cy="100" r="5" fill="#0e131f" stroke={strokeColor} strokeWidth="1.5" />
          </g>
        </svg>

        {/* Center Readout */}
        <div className="absolute bottom-0 text-center">
          <div className={`text-xl font-mono font-bold tabular-nums ${textColor}`}>
            {score}<span className="text-xs text-slate-500 font-normal">/100</span>
          </div>
        </div>
      </div>

      {/* Threat Vectors List */}
      <div className="w-full pt-2 border-t border-[#1e293b] space-y-1.5">
        {vectors.length > 0 ? (
          vectors.map((vec, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[11px] font-mono text-rose-300">
              <AlertTriangle className="size-3 text-rose-400 shrink-0 mt-0.5" />
              <span>{vec}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
            <span>Parameters conform cleanly to intent charter</span>
          </div>
        )}
      </div>
    </div>
  );
};
