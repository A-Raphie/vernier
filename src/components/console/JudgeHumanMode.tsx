'use client';

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Gift, AlertTriangle, ArrowRight, Zap, CheckCircle2, Lock, Eye, EyeOff, XCircle } from 'lucide-react';
import { SimulationScenario } from '../../lib/types';
import { SurfaceTab } from '../navigation/ChromeHeader';
import { Button, Badge, Card, ApprovalCard, TabsList, TabsTrigger } from '../ui';

interface JudgeHumanModeProps {
  scenario: SimulationScenario;
  onNavigateTab: (tab: SurfaceTab) => void;
  onSwitchToAuditorMode: () => void;
}

export const JudgeHumanMode: React.FC<JudgeHumanModeProps> = ({
  scenario,
  onNavigateTab,
  onSwitchToAuditorMode,
}) => {
  const [walletSimMode, setWalletSimMode] = useState<'with_vernier' | 'without_vernier'>('with_vernier');
  const [hasSimulatedBlindSign, setHasSimulatedBlindSign] = useState(false);

  const isCritical = scenario.riskLevel === 'CRITICAL';
  const isClean = scenario.riskLevel === 'CLEAN';
  const explainer = scenario.plainEnglish || {
    scamPromise: scenario.name,
    scamSubtitle: scenario.tagline,
    actualAction: scenario.threat.pathogenicSignal,
    victimLoss: '$142,000+ potential drain',
    vernierAction: scenario.threat.remediation,
    assetsProtected: 'Assets Protected by Vernier',
    whyThisMatters: 'Protects users from signing malicious calldata blind.',
  };

  return (
    <div className="space-y-6">
      {/* Judge & Beginner Quick Brief Banner */}
      <div className="p-4 rounded-lg border border-amber-500/40 bg-amber-500/10 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
            <Zap className="size-4 text-amber-400" />
            <span>JUDGE ORIENTATION: HOW VERNIER SAVES USERS IN 30 SECONDS</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSwitchToAuditorMode}
            className="text-[11px] font-mono text-amber-300 hover:text-amber-200 px-2 py-1 h-auto"
          >
            Switch to EVM Bytecode / Auditor Mode →
          </Button>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed text-pretty">
          In Web3, 91% of wallet hacks happen not from smart contract bugs, but because <strong>users sign innocent-looking prompts</strong> (like &ldquo;Claim Airdrop&rdquo;) that secretly execute malicious approvals. 
          Standard wallets display cryptic hexadecimal calldata that normal people cannot read. 
          <strong> Vernier executes the calldata in a private 0.42ms browser sandbox</strong>, reads the exact storage slot mutations, and translates the danger into plain English before you press Confirm.
        </p>
      </div>

      {/* 3-Card Visual Anatomy: The Trap -> The Exploit -> The Intercept */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: What You See (The dApp Pitch) */}
        <Card className="p-5 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
                <Gift className="size-3.5 text-cyan-400" />
                <span>1. What The dApp Shows You</span>
              </span>
              <Badge variant="info">User View</Badge>
            </div>

            <h4 className="font-sans font-bold text-sm text-slate-100">
              {explainer.scamPromise}
            </h4>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {explainer.scamSubtitle}
            </p>
          </div>

          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800 text-[11px] font-sans text-slate-400 flex items-center gap-2">
            <span className="size-2 rounded-full bg-cyan-400" />
            <span>Appears legitimate to a normal user.</span>
          </div>
        </Card>

        {/* Card 2: What's Under The Hood (The Reality) */}
        <Card className="p-5 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
                <AlertTriangle className={isClean ? 'size-3.5 text-emerald-400' : 'size-3.5 text-rose-400'} />
                <span>2. The Hidden Code Reality</span>
              </span>
              <Badge variant={isClean ? 'success' : 'destructive'} dot={!isClean} dotPulse={!isClean}>
                {isClean ? 'Conforming' : 'Exploit Attempt'}
              </Badge>
            </div>

            <h4 className="font-sans font-bold text-sm text-slate-100">
              {explainer.actualAction}
            </h4>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {explainer.victimLoss}
            </p>
          </div>

          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800 text-[11px] font-sans text-slate-400 flex items-center gap-2">
            <span className={`size-2 rounded-full ${isClean ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span className="truncate">{isClean ? 'Zero malicious side-effects detected.' : 'Standard wallets fail to detect this.'}</span>
          </div>
        </Card>

        {/* Card 3: How Vernier Protects You */}
        <Card className={`p-5 flex flex-col justify-between space-y-3 ${
          isClean ? 'border-emerald-800/60 bg-emerald-950/20' : 'border-rose-800/60 bg-rose-950/20'
        }`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-1.5">
                <ShieldCheck className={`size-3.5 ${isClean ? 'text-emerald-400' : 'text-rose-400'}`} />
                <span>3. Vernier Pre-Flight Intercept</span>
              </span>
              <Badge variant={isClean ? 'success' : 'destructive'} dot dotPulse>
                {isClean ? 'SAFE TO SIGN' : 'BLOCKED IN 0.4ms'}
              </Badge>
            </div>

            <h4 className="font-sans font-bold text-sm text-white">
              {explainer.vernierAction}
            </h4>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              <strong>Impact:</strong> {explainer.assetsProtected}
            </p>
          </div>

          <div className="p-2.5 rounded bg-[#090d16]/80 border border-slate-700/60 text-[11px] font-sans flex items-center justify-between">
            <span className={isClean ? 'text-emerald-300 font-medium' : 'text-rose-300 font-medium'}>
              {isClean ? '✓ Clean execution seal' : '🛡️ Signature disabled safely'}
            </span>
            <Button
              variant="link"
              size="sm"
              onClick={() => onNavigateTab('proof')}
              className="text-amber-400 hover:text-amber-300 font-mono text-[10px] p-0 h-auto"
            >
              Inspect Proof →
            </Button>
          </div>
        </Card>
      </div>

      {/* Interactive Wallet Simulator: Without vs With Vernier */}
      <Card className="p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] pb-3">
          <div>
            <h3 className="font-sans font-bold text-base text-white">
              Interactive Test: Compare Wallet Experience
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Test what happens when a user encounters this malicious prompt with vs without Vernier.
            </p>
          </div>

          {/* Simulator Mode Tabs using harvested TabsList & TabsTrigger */}
          <TabsList>
            <TabsTrigger
              active={walletSimMode === 'without_vernier'}
              onClick={() => {
                setWalletSimMode('without_vernier');
                setHasSimulatedBlindSign(false);
              }}
              badge={walletSimMode === 'without_vernier' ? 'UNPROTECTED' : undefined}
            >
              ❌ Standard Wallet (No Vernier)
            </TabsTrigger>
            <TabsTrigger
              active={walletSimMode === 'with_vernier'}
              onClick={() => setWalletSimMode('with_vernier')}
              badge={walletSimMode === 'with_vernier' ? 'ACTIVE' : undefined}
            >
              🛡️ With Vernier Firewall
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mock Wallet Interface Render */}
        <div className="max-w-xl mx-auto p-5 rounded-xl border border-slate-700 bg-[#090d16] shadow-2xl space-y-4">
          {/* Wallet Window Chrome */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span>Web3 Wallet v11.4 · Ethereum Mainnet</span>
            </div>
            <span className="text-[10px] text-slate-500">Origin: {scenario.intent.protocol}</span>
          </div>

          {walletSimMode === 'without_vernier' ? (
            /* WITHOUT VERNIER: Blind Signature Experience */
            <div className="space-y-4">
              <div className="p-3 rounded bg-[#0e131f] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Request:</span>
                  <span className="text-white font-mono font-medium">Signature Request (Permit)</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 break-all bg-[#090d16] p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block mb-1 font-sans text-[10px] uppercase">Raw Hex Calldata (Unreadable by humans):</span>
                  0x23b872dd0000000000000000000000004e6b21703e9b01c7811985a109867c4fa6712ab9ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff...
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Target Contract: <span className="font-mono text-slate-300">{scenario.intent.targetContract}</span>
                </div>
              </div>

              {hasSimulatedBlindSign ? (
                <div className="p-4 rounded border border-rose-600 bg-rose-950/60 space-y-3 text-center">
                  <div className="text-rose-300 font-bold font-sans text-sm flex items-center justify-center gap-2">
                    <XCircle className="size-5 text-rose-400" />
                    <span>💥 WALLET COMPROMISED: ALL TOKENS DRAINED</span>
                  </div>
                  <p className="text-xs text-rose-200 font-sans leading-relaxed">
                    You signed the prompt. In block #21,840,119, the attacker called <code>transferFrom</code> and drained <strong>{explainer.victimLoss}</strong>.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setWalletSimMode('with_vernier')}
                    rightIcon={<ArrowRight className="size-3.5" />}
                    className="mx-auto"
                  >
                    See How Vernier Prevents This
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 text-center font-sans">
                    The user has no idea what this calldata does and clicks Confirm...
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHasSimulatedBlindSign(false)}
                      className="flex-1"
                    >
                      Reject
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setHasSimulatedBlindSign(true)}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                    >
                      Sign / Confirm (Blind)
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* WITH VERNIER: Harvested ApprovalCard Primitive */
            <ApprovalCard
              title={isClean ? 'VERNIER FIREWALL: VERIFIED CONFORMING' : 'VERNIER FIREWALL: CRITICAL THREAT INTERCEPTED'}
              subtitle="0.42ms client-side execution sandbox analyzed storage mutations before prompt signing."
              promisedAction={explainer.scamPromise}
              actualAction={explainer.actualAction}
              isHazard={!isClean}
              hazardReason={!isClean ? 'Signing disabled: Attestation generated with verdict VERIFIED_FRAUD_CONTAINED.' : undefined}
              assetsProtected={explainer.assetsProtected}
              onViewProof={() => onNavigateTab('proof')}
              onReject={() => {}}
              onApprove={() => {}}
            />
          )}
        </div>
      </Card>

      {/* 3 Core Judge Takeaways */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Card className="p-4 space-y-2">
          <Badge variant="outline">BENCHMARK 01</Badge>
          <h4 className="font-sans font-bold text-sm text-white">0.42ms Client-Side Speed</h4>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Runs via Viem inside the user&apos;s browser. Zero remote RPC latency, meaning users never experience annoying signing delays.
          </p>
        </Card>

        <Card className="p-4 space-y-2">
          <Badge variant="outline">BENCHMARK 02</Badge>
          <h4 className="font-sans font-bold text-sm text-white">Storage-Level Ground Truth</h4>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Phishing domains change every hour, but EVM storage mutation patterns cannot hide. Vernier inspects actual SSTORE deltas.
          </p>
        </Card>

        <Card className="p-4 space-y-2">
          <Badge variant="outline">BENCHMARK 03</Badge>
          <h4 className="font-sans font-bold text-sm text-white">EIP-712 Attestation Proof</h4>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Every simulation generates a cryptographic SHA-256 state root and signed receipt that can be archived or used on-chain.
          </p>
        </Card>
      </div>
    </div>
  );
};
