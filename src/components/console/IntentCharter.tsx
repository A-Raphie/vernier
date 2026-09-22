'use client';

import React from 'react';
import { ExternalLink, CheckCircle, AlertCircle, FileText, Compass } from 'lucide-react';
import { SimulationScenario } from '../../lib/types';
import { RiskGauge } from './RiskGauge';

interface IntentCharterProps {
  scenario: SimulationScenario;
}

export const IntentCharter: React.FC<IntentCharterProps> = ({ scenario }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Intent Charter Box */}
      <div className="p-4 rounded-lg border border-[#1e293b] bg-[#0f172a] space-y-3">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              PENDING INTENT CHARTER
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">PARSER v4.1</span>
        </div>

        <div className="p-3 rounded border border-amber-500/20 bg-amber-950/10 space-y-1.5">
          <div className="text-[10px] font-mono text-amber-400/80 uppercase">
            Parsed Human-Readable Intent:
          </div>
          <div className="font-mono text-xs text-amber-200 font-semibold leading-snug">
            {scenario.intent.humanReadable}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Declared Protocol: <span className="text-slate-200">{scenario.intent.protocol}</span>
          </div>
        </div>

        {/* Target Contract Verification */}
        <div className="p-3 rounded border border-[#1e293b] bg-[#0a0d14] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">TARGET CONTRACT</span>
            {scenario.intent.verifiedSource ? (
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/30 text-emerald-300">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                VERIFIED SOURCE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/40 bg-rose-950/30 text-rose-300">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                UNVERIFIED PROXY
              </span>
            )}
          </div>

          <div className="flex items-center justify-between font-mono text-xs text-slate-200 bg-[#0f172a] px-2.5 py-1.5 rounded border border-[#1e293b]">
            <span className="truncate">{scenario.intent.targetContract}</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 cursor-pointer shrink-0 ml-2" />
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex justify-between">
            <span>Name: {scenario.intent.contractName}</span>
            <span>Value: {scenario.intent.amount}</span>
          </div>
        </div>
      </div>

      {/* Analog Metrology Risk Gauge */}
      <RiskGauge
        score={scenario.riskScore}
        level={scenario.riskLevel}
        vectors={scenario.threat.vectors}
      />
    </div>
  );
};
