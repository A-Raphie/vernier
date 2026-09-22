'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, FileCode, Check, Copy, Lock, CheckCircle2 } from 'lucide-react';
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    setTimeout(() => setActionConfirmed(false), 3500);
  };

  return (
    <div className="p-4 rounded border border-[#1e293b] bg-[#0e131f] space-y-3">
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
        <div className="flex items-center gap-2">
          <Lock className="size-3.5 text-slate-400" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
            CRYPTOGRAPHIC PROOF
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300 font-semibold">
          EIP-712
        </span>
      </div>

      {/* Proof Hash Fields */}
      <div className="space-y-2 font-mono text-xs bg-[#090d16] p-3 rounded border border-slate-800">
        <div>
          <div className="text-[10px] text-slate-500 uppercase">State Transition Root</div>
          <div className="text-slate-300 truncate text-[11px]">{scenario.receipt.stateRoot}</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-500 uppercase">Attestation Verdict</div>
          <div className={isHazard ? 'text-rose-400 font-semibold text-[11px]' : 'text-emerald-400 font-semibold text-[11px]'}>
            {scenario.receipt.eip712Attestation}
          </div>
        </div>

        <div className="flex justify-between border-t border-slate-800 pt-1.5 text-[11px]">
          <span className="text-slate-500">Block Hash:</span>
          <span className="text-slate-400">{scenario.receipt.simulatedBlockHash}</span>
        </div>

        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Capital Protected:</span>
          <span className="text-amber-400 font-medium tabular-nums">{scenario.receipt.gasSaved}</span>
        </div>
      </div>

      {/* Single Primary Action CTA */}
      <div className="space-y-2 pt-1">
        {isHazard ? (
          <button
            onClick={handlePrimaryAction}
            className="w-full py-2.5 px-4 rounded border border-rose-600 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <ShieldAlert className="size-3.5" />
            <span>{actionConfirmed ? 'TRANSACTION HALTED & ISOLATED' : 'HALT TRANSACTION & ISOLATE'}</span>
          </button>
        ) : (
          <button
            onClick={handlePrimaryAction}
            className="w-full py-2.5 px-4 rounded border border-emerald-600 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <CheckCircle2 className="size-3.5" />
            <span>{actionConfirmed ? 'BROADCAST DISPATCHED TO MEMPOOL' : 'APPROVE & BROADCAST TRANSACTION'}</span>
          </button>
        )}

        {/* Secondary Action */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-2 px-3 rounded border border-slate-800 bg-[#090d16] hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <FileCode className="size-3.5" />
          <span>VIEW SIGNED ATTESTATION RECEIPT</span>
        </button>
      </div>

      {/* Attestation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0e131f] border border-slate-800 rounded-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-200">
                <ShieldCheck className="size-4 text-amber-400" />
                <span>SIGNED EIP-712 ATTESTATION RECEIPT</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-200 text-xs font-mono cursor-pointer"
              >
                ESC
              </button>
            </div>

            <pre className="p-3 rounded bg-[#090d16] border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-64 leading-relaxed">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 bg-[#090d16] hover:bg-slate-800 text-xs font-mono text-slate-200 cursor-pointer"
              >
                {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                <span>{copied ? 'COPIED' : 'COPY RECEIPT JSON'}</span>
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 rounded border border-slate-700 bg-slate-800 text-slate-200 font-mono text-xs font-semibold hover:bg-slate-700 cursor-pointer"
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
