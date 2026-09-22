'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, FileCode, Check, Copy, Lock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulationScenario } from '../../lib/types';
import { Button, Badge, Card } from '../ui';

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
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
        <div className="flex items-center gap-2">
          <Lock className="size-3.5 text-slate-400" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
            CRYPTOGRAPHIC PROOF
          </span>
        </div>
        <Badge variant="outline">EIP-712</Badge>
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

      {/* Single Primary Action CTA using harvested Button */}
      <div className="space-y-2 pt-1">
        {isHazard ? (
          <Button
            variant="destructive"
            size="default"
            onClick={handlePrimaryAction}
            className="w-full font-bold uppercase tracking-wider"
            leftIcon={<ShieldAlert className="size-3.5" />}
          >
            {actionConfirmed ? 'TRANSACTION HALTED & ISOLATED' : 'HALT TRANSACTION & ISOLATE'}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="default"
            onClick={handlePrimaryAction}
            className="w-full font-bold uppercase tracking-wider"
            leftIcon={<CheckCircle2 className="size-3.5" />}
          >
            {actionConfirmed ? 'BROADCAST DISPATCHED TO MEMPOOL' : 'APPROVE & BROADCAST TRANSACTION'}
          </Button>
        )}

        {/* Secondary Action using harvested Button */}
        <Button
          variant="secondary"
          size="default"
          onClick={() => setShowModal(true)}
          className="w-full text-slate-300"
          leftIcon={<FileCode className="size-3.5" />}
        >
          VIEW SIGNED ATTESTATION RECEIPT
        </Button>
      </div>

      {/* Attestation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-200">
                <ShieldCheck className="size-4 text-amber-400" />
                <span>SIGNED EIP-712 ATTESTATION RECEIPT</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-200 text-xs font-mono h-auto p-1"
              >
                ESC
              </Button>
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
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
              >
                {copied ? 'COPIED' : 'COPY RECEIPT JSON'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                CLOSE
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};
