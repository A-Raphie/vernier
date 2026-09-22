'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { RiskLevel } from '../../lib/types';
import { Badge, Card } from '../ui';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  vectors: string[];
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, vectors }) => {
  const isCritical = level === 'CRITICAL';
  const isHigh = level === 'HIGH';
  const isClean = level === 'CLEAN';

  const badgeVariant = isClean ? 'success' : isHigh ? 'warning' : 'destructive';
  const textColor = isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-emerald-400';
  const barColor = isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-400' : 'bg-emerald-400';

  // 10-step segmented bar
  const totalSegments = 10;
  const activeSegments = Math.round((score / 100) * totalSegments);

  return (
    <Card className="p-4 space-y-3.5 bg-[#0e131f]">
      {/* Risk Index Header */}
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
          {isClean ? (
            <ShieldCheck className="size-3.5 text-emerald-400" />
          ) : (
            <ShieldAlert className="size-3.5 text-rose-400" />
          )}
          <span>SECURITY RISK INDEX</span>
        </div>
        <Badge variant={badgeVariant} size="sm" dot={!isClean} dotPulse={isCritical}>
          {level} RISK
        </Badge>
      </div>

      {/* Numerical Score & Assessment */}
      <div className="flex items-baseline justify-between pt-1">
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className={`text-2xl font-bold tabular-nums ${textColor}`}>
            {score}
          </span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          {isClean ? 'SAFE EXECUTION' : isHigh ? 'POTENTIAL EXPOSURE' : 'MALICIOUS CALIBRATION'}
        </span>
      </div>

      {/* Segmented Precision Risk Bar */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-10 gap-1.5 h-2">
          {Array.from({ length: totalSegments }).map((_, idx) => {
            const isActive = idx < activeSegments;
            return (
              <div
                key={idx}
                className={`rounded-sm transition-colors duration-200 ${
                  isActive
                    ? barColor
                    : 'bg-slate-800/80'
                }`}
              />
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-500 tabular-nums">
          <span>0 (CLEAN)</span>
          <span>50 (CAUTION)</span>
          <span>100 (CRITICAL)</span>
        </div>
      </div>

      {/* Threat Vectors List */}
      <div className="pt-2 border-t border-slate-800 space-y-1.5">
        {vectors.length > 0 ? (
          vectors.map((vec, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[11px] font-mono text-rose-300">
              <AlertTriangle className="size-3 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-snug text-pretty">{vec}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
            <span>Parameters conform cleanly to declared intent charter</span>
          </div>
        )}
      </div>
    </Card>
  );
};
