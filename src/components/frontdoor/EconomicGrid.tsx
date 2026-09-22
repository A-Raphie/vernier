'use client';

import React from 'react';
import { DollarSign, Clock, Layers } from 'lucide-react';

export const EconomicGrid: React.FC = () => {
  return (
    <section className="py-14 px-4 lg:px-8 border-b border-[#1e293b] bg-[#090d16]">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
            Economic Friction
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans">
            Why Blind EVM Approvals Fail
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Capital Drained */}
          <div className="p-6 rounded border border-[#1e293b] bg-[#0e131f] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-medium tracking-wider">
                CAPITAL DRAIN
              </span>
              <DollarSign className="size-4 text-slate-500" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">
              $142,000,000+
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans text-pretty">
              Drained from Web3 users and autonomous agent treasuries in 2025 via blind permit approvals, unverified multicalls, and spoofed DEX routers.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-[#1e293b]">
              91% caused by unread calldata
            </div>
          </div>

          {/* Card 2: Simulation Latency */}
          <div className="p-6 rounded border border-[#1e293b] bg-[#0e131f] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-medium tracking-wider">
                EXECUTION LATENCY
              </span>
              <Clock className="size-4 text-slate-500" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">
              0.42 ms
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans text-pretty">
              Micro-calibrated pre-flight execution simulation completed entirely client-side without adding signing drag or blocking wallet extension responsiveness.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-[#1e293b]">
              Zero external RPC bottlenecks
            </div>
          </div>

          {/* Card 3: Storage Slot Precision */}
          <div className="p-6 rounded border border-[#1e293b] bg-[#0e131f] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-medium tracking-wider">
                PRECISION METROLOGY
              </span>
              <Layers className="size-4 text-slate-500" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">
              100% SSTORE
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans text-pretty">
              Complete storage slot differential map. Catches silent implementation pointer overwrites, proxy storage clashes, and hidden owner role reassignments.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-[#1e293b]">
              Calibrated down to single slot delta
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
