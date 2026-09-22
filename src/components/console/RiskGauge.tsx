'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { RiskLevel } from '../../lib/types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  vectors: string[];
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, vectors }) => {
  // Map score (0 to 100) to gauge angle (-90deg to +90deg)
  const rotationAngle = -90 + (score / 100) * 180;

  const isCritical = level === 'CRITICAL';
  const isHigh = level === 'HIGH';
  const isClean = level === 'CLEAN';

  const strokeColor = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981';
  const textColor = isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-emerald-400';
  const badgeBg = isCritical ? 'bg-rose-950/80 border-rose-500/40 text-rose-300' : isHigh ? 'bg-amber-950/80 border-amber-500/40 text-amber-300' : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300';

  return (
    <div className="flex flex-col items-center p-4 rounded border border-[#1e293b] bg-[#0f172a]/60 space-y-3">
      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between w-full">
        <span>METROLOGY RISK INDEX</span>
        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${badgeBg}`}>
          {level}
        </span>
      </div>

      {/* SVG Analog-Calibrated Gauge */}
      <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Outer Arc Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Color Gradient Segments: Safe (Green), Caution (Amber), Critical (Red) */}
          <path
            d="M 20 100 A 80 80 0 0 1 70 36"
            fill="none"
            stroke="#10b981"
            strokeWidth="14"
            opacity="0.3"
          />
          <path
            d="M 70 36 A 80 80 0 0 1 130 36"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="14"
            opacity="0.3"
          />
          <path
            d="M 130 36 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#ef4444"
            strokeWidth="14"
            opacity="0.3"
          />

          {/* Active Colored Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={strokeColor}
            strokeWidth="14"
            strokeDasharray="251.3"
            strokeDashoffset={251.3 - (251.3 * (score / 100))}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Vernier Calibration Tick Marks */}
          {[0, 20, 40, 60, 80, 100].map((tick) => {
            const angle = (-180 + (tick / 100) * 180) * (Math.PI / 180);
            const x1 = 100 + 72 * Math.cos(angle);
            const y1 = 100 + 72 * Math.sin(angle);
            const x2 = 100 + 88 * Math.cos(angle);
            const y2 = 100 + 88 * Math.sin(angle);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#64748b"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Needle */}
          <g
            style={{
              transform: `rotate(${rotationAngle}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <polygon points="98,100 102,100 100,28" fill={strokeColor} />
            <circle cx="100" cy="100" r="6" fill="#0f172a" stroke={strokeColor} strokeWidth="2" />
          </g>
        </svg>

        {/* Numeric Score in Center */}
        <div className="absolute bottom-0 text-center">
          <div className={`text-2xl font-mono font-black ${textColor}`}>
            {score}<span className="text-xs text-slate-500 font-normal">/100</span>
          </div>
          <div className="text-[9px] font-mono text-slate-400 uppercase">
            {isClean ? 'CONFORMING' : 'HAZARD DELTA'}
          </div>
        </div>
      </div>

      {/* Detected Vectors List */}
      <div className="w-full pt-2 border-t border-[#1e293b]/60 space-y-1.5">
        {vectors.length > 0 ? (
          vectors.map((vec, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[11px] font-mono text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{vec}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Parameters verify cleanly against intent charter</span>
          </div>
        )}
      </div>
    </div>
  );
};
