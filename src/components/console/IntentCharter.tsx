'use client';

import React from 'react';
import { ExternalLink, CheckCircle, AlertCircle, Compass } from 'lucide-react';
import { SimulationScenario } from '../../lib/types';
import { RiskGauge } from './RiskGauge';

interface IntentCharterProps {
  scenario: SimulationScenario;
}

export const IntentCharter: React.FC<IntentCharterProps> = ({ scenario }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Intent Charter Box */}
      <div className="p-4 rounded border border-[#1e293b] bg-[#0e131f] space-y-3">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
          <div className="flex items-center gap-2">
            <Compass className="size-3.5 text-amber-400" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
              INTENT CHARTER
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">PARSER v4.1</span>
        </div>

        <div className="p-3 rounded border border-slate-800 bg-[#090d16] space-y-1.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">
            Declared Human Intent
          </div>
          <div className="font-mono text-xs text-slate-100 font-semibold leading-snug">
            {scenario.intent.humanReadable}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Protocol: <span className="text-slate-200">{scenario.intent.protocol}</span>
          </div>
        </div>

        {/* Target Contract Verification */}
        <div className="p-3 rounded border border-slate-800 bg-[#090d16] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">Target Contract</span>
            {scenario.intent.verifiedSource ? (
              <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-800/60 bg-emerald-950/30 text-emerald-300">
                <CheckCircle className="size-2.5 text-emerald-400" />
                VERIFIED
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border border-rose-800/60 bg-rose-950/30 text-rose-300">
                <AlertCircle className="size-2.5 text-rose-400" />
                UNVERIFIED
              </span>
            )}
          </div>

          <div className="flex items-center justify-between font-mono text-xs text-slate-300 bg-[#0e131f] px-2.5 py-1.5 rounded border border-slate-800">
            <span className="truncate">{scenario.intent.targetContract}</span>
            <ExternalLink className="size-3 text-slate-500 hover:text-slate-300 cursor-pointer shrink-0 ml-2" />
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex justify-between">
            <span>Name: {scenario.intent.contractName}</span>
            <span>Value: {scenario.intent.amount}</span>
          </div>
        </div>
      </div>

      {/* Security Risk Index Gauge */}
      <RiskGauge
        score={scenario.riskScore}
        level={scenario.riskLevel}
        vectors={scenario.threat.vectors}
      />
    </div>
  );
};
