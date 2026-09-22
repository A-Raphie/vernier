'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, FileCode, Check, Copy, Download, Lock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulationScenario } from '../../lib/types';

interface ReceiptRailProps {
  scenario: SimulationScenario;
}

export const ReceiptRail: React.FC<ReceiptRailProps> = ({ scenario }) => {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionConfirmed, setActionConfirmed] = useState(false);

  const isHazard = scenario.riskScore > 40;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(scenario, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrimaryAction = () => {
    setActionConfirmed(true);
    if (!isHazard) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });
    }
    setTimeout(() => setActionConfirmed(false), 4000);
  };

  return (
    <div className="p-4 rounded-lg border border-[#1e293b] bg-[#0f172a] space-y-3">
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            CRYPTOGRAPHIC PROOF & ATTESTATION
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-bold">
          EIP-712 VERIFIED
        </span>
      </div>

      {/* Receipt Proof Fields */}
      <div className="space-y-2 font-mono text-xs bg-[#0a0d14] p-3 rounded border border-[#1e293b]">
        <div>
          <div className="text-[10px] text-slate-500 uppercase">SHA-256 State Transition Root</div>
          <div className="text-cyan-300 truncate">{scenario.receipt.stateRoot}</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-500 uppercase">EIP-712 Intent Attestation</div>
          <div className="text-emerald-300 font-semibold">{scenario.receipt.eip712Attestation}</div>
        </div>

        <div className="flex justify-between border-t border-[#1e293b] pt-1.5 text-[11px]">
          <span className="text-slate-400">Simulation Block:</span>
          <span className="text-slate-200">{scenario.receipt.simulatedBlockHash}</span>
        </div>

        <div className="flex justify-between text-[11px]">
          <span className="text-slate-400">Capital Protected:</span>
          <span className="text-amber-400 font-bold">{scenario.receipt.gasSaved}</span>
        </div>
      </div>

      {/* Primary Action Button (Single Primary CTA Rule) */}
      <div className="space-y-2 pt-1">
        {isHazard ? (
          <button
            onClick={handlePrimaryAction}
            className="w-full py-3 px-4 rounded-lg border border-rose-500/80 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>{actionConfirmed ? 'TRANSACTION HALTED & ISOLATED' : 'HALT TRANSACTION & ISOLATE'}</span>
          </button>
        ) : (
          <button
            onClick={handlePrimaryAction}
            className="w-full py-3 px-4 rounded-lg border border-emerald-500/80 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>{actionConfirmed ? 'BROADCAST DISPATCHED TO MEMPOOL' : 'APPROVE & BROADCAST TRANSACTION'}</span>
          </button>
        )}

        {/* Secondary Action: Export JSON Attestation Certificate */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-2 px-3 rounded border border-[#1e293b] bg-[#0a0d14] hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5 text-slate-400" />
          <span>VIEW SIGNED ATTESTATION RECEIPT</span>
        </button>
      </div>

      {/* Attestation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-100">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>CRYPTOGRAPHIC SIMULATION ATTESTATION (EIP-712)</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-100 text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <pre className="p-3.5 rounded bg-[#0a0d14] border border-[#1e293b] font-mono text-xs text-cyan-300 overflow-x-auto max-h-72">
              {JSON.stringify(
                {
                  version: 'Vernier-v1.8',
                  stateRoot: scenario.receipt.stateRoot,
                  attestation: scenario.receipt.eip712Attestation,
                  intent: scenario.intent,
                  metrics: scenario.metrics,
                  storageDeltas: scenario.storageDeltas,
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
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1e293b] bg-[#0a0d14] hover:bg-slate-800 text-xs font-mono text-slate-200 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED JSON' : 'COPY RECEIPT'}</span>
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 rounded border border-amber-500/60 bg-amber-500/20 text-amber-300 font-mono text-xs font-bold hover:bg-amber-500/30 cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
