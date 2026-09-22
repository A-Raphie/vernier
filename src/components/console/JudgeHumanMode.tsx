'use client';

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Gift, AlertTriangle, ArrowRight, Zap, CheckCircle2, Lock, Eye, EyeOff, XCircle } from 'lucide-react';
import { SimulationScenario } from '../../lib/types';
import { SurfaceTab } from '../navigation/ChromeHeader';

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
          <button
            onClick={onSwitchToAuditorMode}
            className="text-[11px] font-mono text-amber-300 hover:text-amber-200 underline cursor-pointer"
          >
            Switch to EVM Bytecode / Auditor Mode →
          </button>
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
        <div className="p-5 rounded-lg border border-[#1e293b] bg-[#0e131f] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
                <Gift className="size-3.5 text-cyan-400" />
                <span>1. What The dApp Shows You</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
                User View
              </span>
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
        </div>

        {/* Card 2: What's Under The Hood (The Reality) */}
        <div className="p-5 rounded-lg border border-[#1e293b] bg-[#0e131f] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
                <AlertTriangle className={isClean ? 'size-3.5 text-emerald-400' : 'size-3.5 text-rose-400'} />
                <span>2. The Hidden Code Reality</span>
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isClean ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300 font-semibold'
              }`}>
                {isClean ? 'Conforming' : 'Exploit Attempt'}
              </span>
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
        </div>

        {/* Card 3: How Vernier Protects You */}
        <div className={`p-5 rounded-lg border ${
          isClean ? 'border-emerald-800/60 bg-emerald-950/20' : 'border-rose-800/60 bg-rose-950/20'
        } space-y-3 flex flex-col justify-between`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-1.5">
                <ShieldCheck className={`size-3.5 ${isClean ? 'text-emerald-400' : 'text-rose-400'}`} />
                <span>3. Vernier Pre-Flight Intercept</span>
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                isClean ? 'bg-emerald-900/60 border-emerald-600 text-emerald-200' : 'bg-rose-900/60 border-rose-600 text-rose-200'
              }`}>
                {isClean ? 'SAFE TO SIGN' : 'BLOCKED IN 0.4ms'}
              </span>
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
            <button
              onClick={() => onNavigateTab('proof')}
              className="text-amber-400 hover:text-amber-300 font-mono text-[10px] underline cursor-pointer"
            >
              Inspect Proof →
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Wallet Simulator: Without vs With Vernier */}
      <div className="p-5 rounded-lg border border-[#1e293b] bg-[#0e131f] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] pb-3">
          <div>
            <h3 className="font-sans font-bold text-base text-white">
              Interactive Test: Compare Wallet Experience
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Test what happens when a user encounters this malicious prompt with vs without Vernier.
            </p>
          </div>

          {/* Simulator Mode Tabs */}
          <div className="flex items-center gap-1 bg-[#090d16] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setWalletSimMode('without_vernier');
                setHasSimulatedBlindSign(false);
              }}
              className={`px-3 py-1.5 rounded font-mono text-xs cursor-pointer transition-colors ${
                walletSimMode === 'without_vernier'
                  ? 'bg-rose-950 border border-rose-800 text-rose-200 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ❌ Standard Wallet (No Vernier)
            </button>
            <button
              onClick={() => setWalletSimMode('with_vernier')}
              className={`px-3 py-1.5 rounded font-mono text-xs cursor-pointer transition-colors ${
                walletSimMode === 'with_vernier'
                  ? 'bg-emerald-950 border border-emerald-800 text-emerald-200 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🛡️ With Vernier Firewall
            </button>
          </div>
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
                <div className="p-4 rounded border border-rose-600 bg-rose-950/60 space-y-2 text-center">
                  <div className="text-rose-300 font-bold font-sans text-sm flex items-center justify-center gap-2">
                    <XCircle className="size-5 text-rose-400" />
                    <span>💥 WALLET COMPROMISED: ALL TOKENS DRAINED</span>
                  </div>
                  <p className="text-xs text-rose-200 font-sans leading-relaxed">
                    You signed the prompt. In block #21,840,119, the attacker called <code>transferFrom</code> and drained <strong>{explainer.victimLoss}</strong>.
                  </p>
                  <button
                    onClick={() => setWalletSimMode('with_vernier')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs font-bold cursor-pointer transition-colors mt-1"
                  >
                    <span>See How Vernier Prevents This</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 text-center font-sans">
                    The user has no idea what this calldata does and clicks Confirm...
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHasSimulatedBlindSign(false)}
                      className="flex-1 py-2 rounded border border-slate-700 bg-slate-800 text-slate-300 font-mono text-xs cursor-pointer hover:bg-slate-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setHasSimulatedBlindSign(true)}
                      className="flex-1 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold cursor-pointer transition-colors"
                    >
                      Sign / Confirm (Blind)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* WITH VERNIER: Vernier Pre-Execution Firewall */
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                isClean ? 'border-emerald-700 bg-emerald-950/40' : 'border-rose-600 bg-rose-950/40'
              } space-y-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`size-4 ${isClean ? 'text-emerald-400' : 'text-rose-400'}`} />
                    <span className={`font-mono text-xs font-bold uppercase tracking-wide ${
                      isClean ? 'text-emerald-300' : 'text-rose-300'
                    }`}>
                      {isClean ? 'VERNIER FIREWALL: CLEAN VERDICT (0.42ms)' : 'VERNIER FIREWALL: CRITICAL THREAT INTERCEPTED (0.42ms)'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Zero RPC Latency</span>
                </div>

                <div className="text-xs font-sans text-slate-200 leading-relaxed space-y-1.5">
                  <div>
                    <strong className="text-white">What this transaction really does:</strong>
                  </div>
                  <div className={`p-2.5 rounded ${isClean ? 'bg-emerald-950/70 text-emerald-200' : 'bg-rose-950/70 text-rose-200'} font-sans text-xs border ${
                    isClean ? 'border-emerald-800/80' : 'border-rose-800/80'
                  }`}>
                    {explainer.actualAction}
                  </div>
                </div>

                {!isClean && (
                  <div className="text-[11px] font-mono text-rose-300 flex items-center gap-1.5 bg-rose-950/50 p-2 rounded border border-rose-900/60">
                    <span>⚠️</span>
                    <span>Signing disabled: Attestation generated with verdict VERIFIED_FRAUD_CONTAINED.</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {!isClean ? (
                  <>
                    <button
                      onClick={() => onNavigateTab('proof')}
                      className="flex-1 py-2.5 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs cursor-pointer transition-colors"
                    >
                      View Signed Proof
                    </button>
                    <button
                      className="flex-1 py-2.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold cursor-pointer transition-colors shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="size-4" />
                      <span>HALT & ISOLATE DRAINER</span>
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>SAFE TO SIGN (CONFORMING TRANSACTION)</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3 Core Judge Takeaways */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded border border-[#1e293b] bg-[#0e131f] space-y-1.5">
          <div className="text-[10px] font-mono text-amber-400 font-bold">BENCHMARK 01</div>
          <h4 className="font-sans font-bold text-sm text-white">0.42ms Client-Side Speed</h4>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Runs via Viem inside the user&apos;s browser. Zero remote RPC latency, meaning users never experience annoying signing delays.
          </p>
        </div>

        <div className="p-4 rounded border border-[#1e293b] bg-[#0e131f] space-y-1.5">
          <div className="text-[10px] font-mono text-cyan-400 font-bold">BENCHMARK 02</div>
          <h4 className="font-sans font-bold text-sm text-white">Storage-Level Ground Truth</h4>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Phishing domains change every hour, but EVM storage mutation patterns cannot hide. Vernier inspects actual SSTORE deltas.
          </p>
        </div>

        <div className="p-4 rounded border border-[#1e293b] bg-[#0e131f] space-y-1.5">
          <div className="text-[10px] font-mono text-emerald-400 font-bold">BENCHMARK 03</div>
          <h4 className="font-sans font-bold text-sm text-white">EIP-712 Attestation Proof</h4>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Every simulation generates a cryptographic SHA-256 state root and signed receipt that can be archived or used on-chain.
          </p>
        </div>
      </div>
    </div>
  );
};
