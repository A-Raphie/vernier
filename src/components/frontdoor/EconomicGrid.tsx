'use client';

import React from 'react';
import { DollarSign, Clock, Layers, ShieldAlert, CheckCircle, Scale } from 'lucide-react';

export const EconomicGrid: React.FC = () => {
  return (
    <section className="py-12 px-4 lg:px-8 border-b border-[#1e293b] bg-[#0a0d14]">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-1.5">
          <span className="font-mono text-xs uppercase tracking-widest text-amber-400">
            Economic Friction & Attack Surface
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans">
            Why Blind EVM Approvals Fail
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Economic Loss */}
          <div className="p-5 rounded-lg border border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-[#0f172a] space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-rose-400 font-semibold tracking-wider">
                CAPITAL DRAIN
              </span>
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100">
              $142,000,000+
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Drained from Web3 users and autonomous agent treasuries in 2025 via blind permit approvals, unverified multicalls, and spoofed DEX routers.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-rose-300/80 border-t border-rose-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>91% caused by unread calldata</span>
            </div>
          </div>

          {/* Card 2: Simulation Speed */}
          <div className="p-5 rounded-lg border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-[#0f172a] space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                EXECUTION LATENCY
              </span>
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100">
              0.42 ms
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Micro-calibrated pre-flight execution simulation completed entirely client-side without adding signing drag or blocking wallet extension responsiveness.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-cyan-300/80 border-t border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Zero external RPC bottlenecks</span>
            </div>
          </div>

          {/* Card 3: Storage Slot Precision */}
          <div className="p-5 rounded-lg border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-[#0f172a] space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
                PRECISION METROLOGY
              </span>
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100">
              100% SSTORE
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Complete storage slot differential map. Catches silent implementation pointer overwrites, proxy storage clashes, and hidden owner role reassignments.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-amber-300/80 border-t border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Calibrated down to single slot delta</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
