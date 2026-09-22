'use client';

import React, { useState } from 'react';
import { SimulationScenario } from '../../lib/types';
import { SCENARIOS } from '../../data/attack-vectors';
import { SurfaceTab } from '../navigation/ChromeHeader';
import { Button, Badge, Card, TabsList, TabsTrigger } from '../ui';
import { ShieldCheck, Copy, Check, Download, ArrowLeft, Lock, FileCode, CheckCircle2 } from 'lucide-react';

interface Surface3ProofRailProps {
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  onNavigateTab: (tab: SurfaceTab) => void;
}

export const Surface3ProofRail: React.FC<Surface3ProofRailProps> = ({
  selectedScenarioId,
  onSelectScenario,
  onNavigateTab,
}) => {
  const [copied, setCopied] = useState(false);
  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  const payload = {
    version: 'Vernier-v1.8',
    standard: 'EIP-712 / ERC-4337 Pre-Execution Attestation',
    timestamp: activeScenario.receipt.timestamp,
    stateRoot: activeScenario.receipt.stateRoot,
    attestationVerdict: activeScenario.receipt.eip712Attestation,
    intent: activeScenario.intent,
    executionMetrics: activeScenario.metrics,
    storageDeltas: activeScenario.storageDeltas,
    simulationProof: {
      blockHash: activeScenario.receipt.simulatedBlockHash,
      signer: '0xDA9b8a36b3F8120eEc914361520Ab1E19Ee6b3',
      algorithm: 'secp256k1-keccak256',
      attestationValidUntilBlock: 21894200,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vernier-attestation-${activeScenario.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 px-4 lg:px-8 bg-[#090d16] flex-1 space-y-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Proof Bar: Back button + Title + Scenario Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigateTab('overview')}
              title="Return to Overview"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Lock className="size-3.5 text-amber-400" />
                <span className="text-xs font-mono uppercase text-slate-400 font-medium tracking-wider">
                  SURFACE 3: CRYPTOGRAPHIC PROOF RAIL
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-white mt-0.5">
                EIP-712 Simulation Attestation
              </h2>
            </div>
          </div>

          {/* Scenario Selector */}
          <TabsList>
            {SCENARIOS.map((s) => (
              <TabsTrigger
                key={s.id}
                active={s.id === selectedScenarioId}
                onClick={() => onSelectScenario(s.id)}
              >
                {s.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Verifiable Certificate Card */}
        <Card className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span className="font-mono text-xs font-semibold text-slate-200">
                  ATTESTATION DIGEST: {activeScenario.receipt.eip712Attestation}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Simulation Tx ID: {activeScenario.receipt.txId}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              >
                {copied ? 'COPIED JSON' : 'COPY RAW JSON'}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                leftIcon={<Download className="size-3.5" />}
              >
                DOWNLOAD (.JSON)
              </Button>
            </div>
          </div>

          {/* Key Attestation Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <Card className="p-4 space-y-1 bg-[#090d16]">
              <div className="text-[10px] text-slate-500 uppercase">SHA-256 STATE ROOT</div>
              <div className="text-slate-200 truncate">{activeScenario.receipt.stateRoot}</div>
            </Card>

            <Card className="p-4 space-y-1 bg-[#090d16]">
              <div className="text-[10px] text-slate-500 uppercase">SIMULATION BLOCK</div>
              <div className="text-slate-200">{activeScenario.receipt.simulatedBlockHash}</div>
            </Card>

            <Card className="p-4 space-y-1 bg-[#090d16]">
              <div className="text-[10px] text-slate-500 uppercase">CAPITAL PROTECTED</div>
              <div className="text-amber-400 font-bold tabular-nums">{activeScenario.receipt.gasSaved}</div>
            </Card>
          </div>

          {/* Raw Verifiable JSON Container */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileCode className="size-3.5 text-slate-500" />
                <span>EIP-712 SIGNED ATTESTATION PAYLOAD</span>
              </span>
              <span className="text-[10px] text-slate-500">secp256k1-keccak256</span>
            </div>

            <pre className="p-4 rounded bg-[#090d16] border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>

          {/* Protocol Standards Citation */}
          <div className="p-4 rounded border border-slate-800 bg-[#090d16] space-y-2 text-xs font-mono text-slate-400">
            <div className="text-slate-300 font-semibold uppercase">Statutory Protocol Standards Enforced:</div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400 font-sans">
              <li><strong>EIP-712:</strong> Typed structured data hashing and signing verification prevents parameter malleability.</li>
              <li><strong>ERC-4337:</strong> Client-side UserOperation pre-execution simulation validates storage slot collision limits.</li>
              <li><strong>ERC-1967:</strong> Standardized proxy implementation slot validation protects against malicious delegatecall hijacks.</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};
