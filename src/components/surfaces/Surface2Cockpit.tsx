'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  SkipBack,
  SkipForward,
  Fuel,
  Database,
  FileCode,
  Check,
  Copy,
  Lock,
  AlertTriangle,
  Gift,
  ExternalLink,
  XCircle,
  Zap,
  ArrowRight,
  Eye,
  Activity,
  Terminal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulationScenario } from '../../lib/types';
import { SCENARIOS } from '../../data/attack-vectors';
import { SurfaceTab } from '../navigation/ChromeHeader';
import { Button, Badge, Card, TabsList, TabsTrigger } from '../ui';

interface Surface2CockpitProps {
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  activeStepIndex: number;
  setActiveStepIndex: (index: number) => void;
  onNavigateTab: (tab: SurfaceTab) => void;
}

export const Surface2Cockpit: React.FC<Surface2CockpitProps> = ({
  selectedScenarioId,
  onSelectScenario,
  activeStepIndex,
  setActiveStepIndex,
  onNavigateTab,
}) => {
  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  // Primary toggle: Simple (Beginner / Judge) vs Auditor (Deep Metrology)
  const [viewMode, setViewMode] = useState<'simple' | 'auditor'>('simple');
  const [auditorTab, setAuditorTab] = useState<'storage' | 'bytecode'>('storage');
  const [blindSignTestActive, setBlindSignTestActive] = useState(false);
  const [actionConfirmed, setActionConfirmed] = useState(false);
  const [receiptCopied, setReceiptCopied] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const isCritical = activeScenario.riskLevel === 'CRITICAL';
  const isHigh = activeScenario.riskLevel === 'HIGH';
  const isClean = activeScenario.riskLevel === 'CLEAN';
  const isDanger = isCritical || isHigh;

  const totalSteps = activeScenario.opcodeTrace.length;
  const safeStepIndex = Math.min(Math.max(0, activeStepIndex), totalSteps - 1);
  const currentOpcode = activeScenario.opcodeTrace[safeStepIndex] || activeScenario.opcodeTrace[0];

  const gasFraction = (safeStepIndex + 1) / totalSteps;
  const currentGas = Math.round(activeScenario.metrics.gasSimulated * gasFraction);
  const gasIsOver = activeScenario.metrics.gasSimulated > activeScenario.metrics.gasExpected * 1.5;

  const explainer = activeScenario.plainEnglish || {
    scamPromise: activeScenario.name,
    scamSubtitle: activeScenario.tagline,
    actualAction: activeScenario.threat.pathogenicSignal,
    victimLoss: '$142,000+ potential drain',
    vernierAction: activeScenario.threat.remediation,
    assetsProtected: 'Assets Protected by Vernier',
    whyThisMatters: 'Protects users from signing malicious calldata blind.',
  };

  const handlePrimaryAction = () => {
    setActionConfirmed(true);
    if (isClean) confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    setTimeout(() => setActionConfirmed(false), 3500);
  };

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(JSON.stringify(activeScenario, null, 2));
    setReceiptCopied(true);
    setTimeout(() => setReceiptCopied(false), 2000);
  };

  const riskSegmentsFilled = Math.round((activeScenario.riskScore / 100) * 10);

  return (
    <div className="px-3 py-3 sm:px-6 sm:py-5 md:px-7 md:py-6" style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 3.5rem)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── UNIFIED COMMAND BAR ── */}
        <div className="vn-panel" style={{ borderRadius: 12 }}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3">

            {/* Left cluster: back button + traffic light + scenario tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onNavigateTab('overview')}
                aria-label="Overview"
                className="size-8 shrink-0"
              >
                <ArrowLeft className="size-4" />
              </Button>

              {/* 5-Second Traffic Light status dots */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 8px', borderRadius: 999,
                background: 'var(--bg)', border: '1px solid var(--border)',
              }} title={isDanger ? 'Threat Intercepted (Red)' : 'Safe Route (Green)'}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: isCritical ? 'var(--rose)' : 'rgba(255,255,255,0.08)',
                  boxShadow: isCritical ? '0 0 8px rgba(244,63,94,0.9)' : 'none',
                  transition: 'all 200ms',
                }} />
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: isHigh ? 'var(--amber)' : 'rgba(255,255,255,0.08)',
                  boxShadow: isHigh ? '0 0 8px rgba(245,158,11,0.9)' : 'none',
                  transition: 'all 200ms',
                }} />
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: isClean ? 'var(--emerald)' : 'rgba(255,255,255,0.08)',
                  boxShadow: isClean ? '0 0 8px rgba(16,185,129,0.9)' : 'none',
                  transition: 'all 200ms',
                }} />
              </div>

              {/* Scenarios pills */}
              <TabsList className="overflow-x-auto">
                {SCENARIOS.map((s) => (
                  <TabsTrigger
                    key={s.id}
                    active={s.id === selectedScenarioId}
                    onClick={() => {
                      onSelectScenario(s.id);
                      setActiveStepIndex(0);
                      setBlindSignTestActive(false);
                    }}
                  >
                    <span style={{
                      display: 'inline-block', width: 6, height: 6, borderRadius: '50%', marginRight: 5,
                      background: s.riskLevel === 'CRITICAL' ? 'var(--rose)' : s.riskLevel === 'HIGH' ? 'var(--amber)' : 'var(--emerald)',
                    }} />
                    {s.id === 'permit2-drain' ? 'Airdrop Phishing' : s.id === 'proxy-delegatecall-hijack' ? 'Implementation Hijack' : 'Uniswap Clean'}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Execution Latency Chip */}
              <div className="hidden lg:flex items-center gap-1.5 font-mono text-[11px] text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-2.5 py-1 rounded-md shrink-0">
                <Zap className="size-3" />
                <span>0.42ms execution</span>
              </div>
            </div>

            {/* Right cluster: Beginner vs Auditor Mode Toggle + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Beginner vs Auditor Toggle */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 2,
                padding: 3, borderRadius: 8,
                background: 'var(--bg)', border: '1px solid var(--border)',
              }}>
                <button
                  type="button"
                  onClick={() => setViewMode('simple')}
                  style={{
                    padding: '5px 11px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 150ms', border: 'none',
                    background: viewMode === 'simple' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    color: viewMode === 'simple' ? 'var(--amber)' : 'var(--ink-secondary)',
                  }}
                >
                  Simple Verdict
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('auditor')}
                  style={{
                    padding: '5px 11px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 150ms', border: 'none',
                    background: viewMode === 'auditor' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    color: viewMode === 'auditor' ? 'var(--cyan)' : 'var(--ink-secondary)',
                  }}
                >
                  Auditor Trace
                </button>
              </div>

              {/* Primary Action Button */}
              {isClean ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePrimaryAction}
                  leftIcon={<CheckCircle2 className="size-4" />}
                  className="font-bold uppercase tracking-wider text-xs"
                >
                  {actionConfirmed ? 'Dispatched' : 'Approve & Broadcast'}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handlePrimaryAction}
                  leftIcon={<ShieldAlert className="size-4" />}
                  className="font-bold uppercase tracking-wider text-xs shadow-lg shadow-rose-950/40"
                >
                  {actionConfirmed ? 'Halted' : 'Halt Transaction — Prevent Drain'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            TIER 1: SIMPLE VERDICT (THE 5-SECOND TRAFFIC LIGHT RULE - V5 UNSLOPPED)
            ═════════════════════════════════════════════════════════════════ */}
        {viewMode === 'simple' ? (
          <div className="flex flex-col gap-5">

            {/* 1. Hero Security Status Strip (Monolithic Containment Bar) */}
            <div className={`p-4 sm:p-5 rounded-xl border bg-[#0b0f19] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              isDanger
                ? 'border-white/10 border-l-4 border-l-rose-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),-4px_0_16px_-2px_rgba(244,63,94,0.4)]'
                : 'border-white/10 border-l-4 border-l-emerald-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),-4px_0_16px_-2px_rgba(16,185,129,0.4)]'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className={`size-10 rounded-lg grid place-items-center shrink-0 ${
                  isDanger ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isDanger ? <ShieldAlert className="size-5" /> : <ShieldCheck className="size-5" />}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-white m-0 uppercase font-mono flex items-center gap-2">
                    {isDanger ? 'Critical Exploit Intercepted' : 'Clean Transaction Verified'}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold tracking-wider ${
                      isDanger ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isDanger ? 'CONTAINED' : 'CONFORMED'}
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 m-0 mt-0.5">
                    {isDanger
                      ? 'Signing disabled. Vernier caught an exploit hidden in this calldata before it left your wallet.'
                      : 'Safe to proceed. Calldata exactly matches declared swap intent.'}
                  </p>
                </div>
              </div>

              {/* High-Precision Tabular Metrics */}
              <div className="flex items-center gap-5 sm:gap-8 self-end md:self-center shrink-0 border-t md:border-t-0 border-white/5 pt-2 md:pt-0">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Shielded Capital
                  </div>
                  <div className={`text-lg sm:text-xl font-mono font-black tabular-nums tracking-tight ${
                    isDanger ? 'text-white' : 'text-emerald-400'
                  }`}>
                    {isDanger ? '$142,000.00' : '$0.00 At Risk'}
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-right">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Verification Time
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-black tabular-nums tracking-tight text-cyan-400">
                    0.42ms
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Comparative Forensic Engine (The Centerpiece) */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-zinc-500 mb-2 px-1">
                Comparative Forensic Engine
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">

                {/* Left Card: 01 / CLAIMED INTENT */}
                <div className="rounded-xl border border-white/10 bg-[#0c1017] p-5 sm:p-6 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-400 flex items-center gap-1.5">
                        <Gift className="size-3 text-zinc-400" />
                        01 / CLAIMED INTENT
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                        PROMPTED DAPP CLAIM
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 leading-tight">
                      {explainer.scamPromise}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                      {explainer.scamSubtitle}
                    </p>
                  </div>

                  {/* Structured Parameters Table */}
                  <div className="rounded-lg bg-black/40 border border-white/5 p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                        Purported Reward
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                        {isDanger ? '+$6,500.00' : '+$2,642.50 USDC'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                        Target Contract
                      </div>
                      <div className="text-xs font-mono text-zinc-300 truncate" title={activeScenario.intent.targetContract}>
                        {activeScenario.intent.targetContract.slice(0, 10)}...{activeScenario.intent.targetContract.slice(-4)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                        Method
                      </div>
                      <div className="text-xs font-mono text-zinc-300 truncate">
                        {isDanger ? 'claimAirdrop()' : 'exactInputSingle()'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Card: 02 / ON-CHAIN REALITY */}
                <div className={`rounded-xl border p-5 sm:p-6 flex flex-col justify-between transition-all ${
                  isDanger
                    ? 'border-rose-500/30 bg-[#130d14] shadow-[inset_0_1px_0_rgba(244,63,94,0.15)]'
                    : 'border-emerald-500/30 bg-[#0c1412] shadow-[inset_0_1px_0_rgba(16,185,129,0.15)]'
                }`}>
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                      <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 ${
                        isDanger ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {isDanger ? <AlertTriangle className="size-3" /> : <ShieldCheck className="size-3" />}
                        02 / ON-CHAIN REALITY
                      </span>
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border font-semibold ${
                        isDanger
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {isDanger ? 'VERIFIED CODE MUTATION' : 'VERIFIED CODE CONFORMANCE'}
                      </span>
                    </div>

                    <h3 className={`text-xl sm:text-2xl font-bold tracking-tight mb-2 leading-tight ${
                      isDanger ? 'text-white' : 'text-emerald-100'
                    }`}>
                      {explainer.actualAction}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                      {isDanger
                        ? 'The smart contract grants max approval to an unverified third party. In the next block, transferFrom() will steal every token.'
                        : 'Standard Uniswap V3 swap router execution with 0.5% max slippage. Zero foreign storage access or unauthorized delegates.'}
                    </p>
                  </div>

                  {/* Financial Loss / Gain Block with EIP-712 Interception Seal */}
                  <div className={`rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                    isDanger
                      ? 'bg-black/50 border-rose-500/30'
                      : 'bg-black/50 border-emerald-500/30'
                  }`}>
                    <div>
                      <div className={`text-[9px] font-mono uppercase tracking-wider mb-1 font-semibold ${
                        isDanger ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {isDanger ? 'TOTAL FINANCIAL IMPACT' : 'CONFIRMED TRANSACTION OUTCOME'}
                      </div>
                      <div className={`text-2xl sm:text-3xl font-mono font-black tracking-tight tabular-nums ${
                        isDanger ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {explainer.victimLoss}
                      </div>
                    </div>

                    {/* Official EIP-712 Seal */}
                    <div className={`px-3 py-2 rounded border flex flex-col items-start sm:items-end justify-center shrink-0 ${
                      isDanger
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    }`}>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase">
                        <Lock className="size-3" />
                        {isDanger ? 'EIP-712 INTERCEPTION SEAL' : 'EIP-712 VERIFIED SEAL'}
                      </div>
                      <div className="text-[9px] font-mono text-zinc-400 mt-0.5">
                        {isDanger ? 'ACTION: SIGNATURE BLOCKED' : 'ACTION: EXECUTION PERMITTED'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Verification & Trace Rail (Bottom Dual Strip) */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-zinc-500 mb-2 px-1">
                Verification & Trace Rail
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Left Rail: MetaMask Blind Wallet Comparison Accordion */}
                <div className="rounded-xl border border-white/10 bg-[#0c1017] p-4 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div
                    onClick={() => setBlindSignTestActive(!blindSignTestActive)}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 grid place-items-center shrink-0 group-hover:border-amber-400/40 transition-colors">
                        <Eye className="size-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                          Standard Blind Wallet vs Vernier's 0.42ms Firewall
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Compare what MetaMask shows (raw unverified bytecode) vs Vernier simulation
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-amber-400 px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20 shrink-0">
                      {blindSignTestActive ? 'Hide' : 'Compare →'}
                    </span>
                  </div>

                  {blindSignTestActive && (
                    <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[11px] font-bold text-zinc-200">Standard Wallet (Blind Sign)</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">VULNERABLE</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mb-2">User is shown only raw opaque calldata:</p>
                        <pre className="p-2 rounded bg-black/80 font-mono text-[10px] text-zinc-400 overflow-x-auto select-all break-all leading-tight">
                          0x23b872dd0000000000000000000000004e6b21703e9b01c7811985a109867c4fa6712ab9...
                        </pre>
                        <div className="mt-2 text-[10px] text-rose-400">⚠️ 0 security warnings. User clicks Sign and loses assets.</div>
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[11px] font-bold text-white">Vernier 0.42ms Firewall</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">PROTECTED</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 mb-2">Simulates full bytecode mutations pre-signature:</p>
                        <div className="p-2 rounded bg-black/80 font-mono text-[10px] text-emerald-300 border border-emerald-500/20">
                          ✓ Intercepted: unbounded permit2 allowance detected to foreign drainer.
                        </div>
                        <div className="mt-2 text-[10px] text-emerald-400 font-semibold">✓ Signature blocked. $142,000 preserved.</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Rail: Auditor Mode Card Trigger */}
                <div
                  onClick={() => setViewMode('auditor')}
                  className="rounded-xl border border-dashed border-white/20 hover:border-cyan-400/50 bg-[#0c1017]/80 hover:bg-[#0c1017] p-4 flex items-center justify-between cursor-pointer group transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 grid place-items-center shrink-0 group-hover:border-cyan-400/40 transition-colors">
                      <Terminal className="size-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        Auditor Mode: Deep Bytecode & Storage Slot Trace
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Inspect step-by-step EVM Caliper scrubber, opcode trace, storage slots delta, and EIP-712 state root
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0 pl-2">
                    <span>Open Trace</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          /* ═════════════════════════════════════════════════════════════════
             TIER 2: AUDITOR TRACE (THE DEEP TECHNICAL WORKBENCH)
             ═════════════════════════════════════════════════════════════════ */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Auditor Header Banner with Return Button */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px', borderRadius: 10, background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Terminal size={14} style={{ color: 'var(--cyan)' }} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase' }}>
                  Auditor Mode Active: Deep Bytecode & Storage Slot Metrology
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('simple')}
                leftIcon={<ArrowLeft className="size-3.5" />}
                className="font-mono text-xs"
              >
                Return to Simple Verdict
              </Button>
            </div>

            {/* DUAL PANEL WORKBENCH */}
            <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 16, alignItems: 'start' }}
                 className="grid-cols-1 lg:grid-cols-[7fr_5fr]">

              {/* ════════ LEFT PANEL: EXECUTION SCRUBBER & AUDITOR DECK ════════ */}
              <div className="vn-panel">
                <div className="vn-panel-header">
                  <div className="vn-row">
                    <Sliders size={12} style={{ color: 'var(--amber)' }} />
                    <span className="vn-panel-title">Execution Scrubber</span>
                  </div>
                  <span className="num" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                    Step <strong style={{ color: 'var(--ink)' }}>{safeStepIndex + 1}</strong> of <strong style={{ color: 'var(--ink)' }}>{totalSteps}</strong>
                    <span style={{ margin: '0 6px', color: 'var(--border-hover)' }}>·</span>
                    Gas <strong style={{ color: 'var(--amber)' }}>{currentGas.toLocaleString()}</strong>
                  </span>
                </div>

                {/* Caliper Scrubber */}
                <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
                  <div className="vn-row-between" style={{ marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Caliper position
                    </span>
                    <div className="vn-row" style={{ gap: 6 }}>
                      <Button variant="secondary" size="icon" onClick={() => setActiveStepIndex(Math.max(0, safeStepIndex - 1))}
                        disabled={safeStepIndex === 0} aria-label="Previous step" className="size-6">
                        <SkipBack className="size-3" />
                      </Button>
                      <Button variant="secondary" size="icon" onClick={() => setActiveStepIndex(Math.min(totalSteps - 1, safeStepIndex + 1))}
                        disabled={safeStepIndex === totalSteps - 1} aria-label="Next step" className="size-6">
                        <SkipForward className="size-3" />
                      </Button>
                      <span className="num" style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 700 }}>
                        #{currentOpcode.step}
                      </span>
                    </div>
                  </div>

                  {/* Ruler */}
                  <div className="vn-ruler">
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center',
                      padding: '0 8px', pointerEvents: 'none', opacity: 0.35,
                    }}>
                      {Array.from({ length: 33 }).map((_, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: 1, height: i % 4 === 0 ? 14 : 7, background: i % 4 === 0 ? 'var(--ink-secondary)' : 'var(--border-hover)' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{
                      position: 'absolute', top: 0, bottom: 0, width: 56,
                      borderLeft: '1px solid var(--amber)', borderRight: '1px solid var(--amber)',
                      background: 'rgba(245,158,11,0.08)',
                      left: `calc(${(safeStepIndex / Math.max(1, totalSteps - 1)) * 90}% - 2px)`,
                      pointerEvents: 'none', transition: 'left 75ms ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ width: 1, height: '100%', background: 'var(--amber)' }} />
                      <span style={{
                        position: 'absolute', top: 1, left: 4,
                        fontFamily: 'var(--mono)', fontSize: 8,
                        color: 'var(--amber)', background: 'rgba(9,13,22,0.9)',
                        padding: '1px 3px', borderRadius: 3, border: '1px solid rgba(245,158,11,0.4)',
                        textTransform: 'uppercase',
                      }}>
                        {currentOpcode.opcode}
                      </span>
                    </div>
                    <input
                      type="range" min="0" max={totalSteps - 1} value={safeStepIndex}
                      onChange={(e) => setActiveStepIndex(Number(e.target.value))}
                      aria-label="Execution step"
                    />
                  </div>

                  {/* Active opcode */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                    padding: '8px 12px', marginTop: 10, borderRadius: 6,
                    border: '1px solid var(--border)', background: 'rgba(9,13,22,0.5)',
                    fontFamily: 'var(--mono)', fontSize: 11,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ color: 'var(--ink-muted)' }}>opcode</span>
                      <span style={{ fontWeight: 700, color: 'var(--amber)' }}>[{currentOpcode.opcode}]</span>
                      {currentOpcode.arg && (
                        <span style={{ color: 'var(--ink-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {currentOpcode.arg}
                        </span>
                      )}
                    </div>
                    {currentOpcode.isBlocked ? (
                      <span style={{
                        padding: '2px 7px', borderRadius: 4,
                        border: '1px solid rgba(244,63,94,0.4)', background: 'rgba(244,63,94,0.08)',
                        color: '#fca5a5', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                        textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                        Blocked
                      </span>
                    ) : (
                      <span style={{ color: 'var(--ink-muted)', fontSize: 10, flexShrink: 0 }}>
                        {currentOpcode.comment || 'Normal execution'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Gas & Mutations */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ padding: '12px 18px', borderRight: '1px solid var(--border)' }}>
                    <div className="vn-row-between" style={{ marginBottom: 5 }}>
                      <span className="vn-stat-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Fuel size={10} /> Gas
                      </span>
                      <span className="num" style={{ fontSize: 11, color: gasIsOver ? 'var(--rose)' : 'var(--ink-secondary)' }}>
                        {currentGas.toLocaleString()} / {activeScenario.metrics.gasSimulated.toLocaleString()}
                      </span>
                    </div>
                    <div className="vn-gas-bar">
                      <div className={`vn-gas-fill ${gasIsOver ? 'is-over' : 'is-normal'}`}
                        style={{ width: `${Math.min(100, (currentGas / 250000) * 100)}%` }} />
                    </div>
                  </div>
                  <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="vn-stat-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Database size={10} /> State mutations
                    </span>
                    <span className="num" style={{ fontSize: 11, color: 'var(--ink-secondary)', fontWeight: 600 }}>
                      {activeScenario.metrics.storageSlotsTouched} slots
                    </span>
                  </div>
                </div>

                {/* Storage & Bytecode Tabs */}
                <div style={{ padding: '16px 18px' }}>
                  <div className="vn-row-between" style={{ marginBottom: 12 }}>
                    <TabsList>
                      <TabsTrigger active={auditorTab === 'storage'} onClick={() => setAuditorTab('storage')}>
                        Storage deltas ({activeScenario.storageDeltas.length})
                      </TabsTrigger>
                      <TabsTrigger active={auditorTab === 'bytecode'} onClick={() => setAuditorTab('bytecode')}>
                        Bytecode trace ({totalSteps})
                      </TabsTrigger>
                    </TabsList>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Auditor mode
                    </span>
                  </div>

                  {auditorTab === 'storage' ? (
                    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                      <table className="vn-table">
                        <thead>
                          <tr>
                            <th>Slot</th>
                            <th>Variable</th>
                            <th className="hidden sm:table-cell">Previous</th>
                            <th>Mutated</th>
                            <th className="text-right">Verdict</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeScenario.storageDeltas.map((delta) => (
                            <tr key={delta.slot} className={delta.isHazardous ? 'is-hazard' : ''}>
                              <td className="is-strong">{delta.slot}</td>
                              <td>{delta.label}</td>
                              <td className="is-muted hidden sm:table-cell" style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {delta.prevValue}
                              </td>
                              <td style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                  className={delta.isHazardous ? '' : 'is-muted'}>
                                {delta.newValue}
                              </td>
                              <td className="text-right">
                                <span className={`vn-badge ${delta.isHazardous ? 'vn-badge-critical' : 'vn-badge-clean'}`} style={{ fontSize: 9 }}>
                                  {delta.isHazardous ? 'Hazard' : 'Conform'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="vn-opcode-scroll">
                      {activeScenario.opcodeTrace.map((item, idx) => {
                        const isActive = idx === safeStepIndex;
                        const isAmberOp = item.opcode === 'SSTORE' || item.opcode === 'DELEGATECALL';
                        return (
                          <div
                            key={idx}
                            className={`vn-opcode-row ${isActive ? (item.isBlocked ? 'is-active-blocked' : 'is-active-normal') : ''}`}
                            onClick={() => setActiveStepIndex(idx)}
                          >
                            <span className="vn-opcode-step">{isActive ? '▶' : item.step}</span>
                            <span className={`vn-opcode-name ${item.isBlocked ? 'is-rose' : isAmberOp ? 'is-amber' : ''}`}>
                              [{item.opcode}]
                            </span>
                            {item.arg && <span className="vn-opcode-arg">{item.arg}</span>}
                            {item.isBlocked && (
                              <span className="vn-badge vn-badge-critical" style={{ marginLeft: 'auto', fontSize: 9 }}>
                                Blocked
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {isDanger && (
                  <div className="vn-notice is-critical">
                    <ShieldAlert size={14} style={{ color: 'var(--rose)', flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div className="vn-notice-title" style={{ marginBottom: 3 }}>Pathogenic signal detected</div>
                      <div style={{ fontSize: 12 }}>{activeScenario.threat.pathogenicSignal}</div>
                      <div style={{ marginTop: 4, fontSize: 11, color: 'var(--ink-muted)' }}>
                        Policy: <span style={{ color: '#fca5a5', fontWeight: 600 }}>{activeScenario.threat.remediation}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ════════ RIGHT PANEL: FORENSICS & ATTESTATION ════════ */}
              <div className="vn-panel">
                <div className="vn-panel-header">
                  <div className="vn-row">
                    <Zap size={12} style={{ color: 'var(--cyan)' }} />
                    <span className="vn-panel-title">Transaction Forensics</span>
                  </div>
                  <span className={`vn-badge ${isDanger ? 'vn-badge-critical' : 'vn-badge-clean'}`}>
                    {activeScenario.riskScore}/100 Risk
                  </span>
                </div>

                <div className="vn-intent-block">
                  <div className="vn-intent-label">
                    <Gift size={10} />
                    What the UI claims
                    <span className="vn-badge vn-badge-neutral" style={{ marginLeft: 'auto' }}>
                      {activeScenario.intent.verifiedSource ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  <p className="vn-intent-headline">{explainer.scamPromise}</p>
                  <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 6, lineHeight: 1.5 }}>
                    {explainer.scamSubtitle}
                  </p>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Target:</span>
                    <code style={{ color: 'var(--ink-secondary)' }}>{activeScenario.intent.targetContract}</code>
                  </div>
                </div>

                <div className={`vn-reality-block ${isDanger ? 'is-critical' : 'is-clean'}`}>
                  <div className="vn-intent-label" style={{ color: isDanger ? 'var(--rose)' : 'var(--emerald)' }}>
                    {isDanger ? <AlertTriangle size={10} /> : <ShieldCheck size={10} />}
                    What the contract actually does
                    <span className={`vn-badge ${isDanger ? 'vn-badge-critical' : 'vn-badge-clean'}`} style={{ marginLeft: 'auto' }}>
                      {isDanger ? 'Exploit' : 'Conforming'}
                    </span>
                  </div>
                  <p className={`vn-reality-headline ${isDanger ? 'is-critical' : 'is-clean'}`}>
                    {explainer.actualAction}
                  </p>
                  <p className={`vn-impact ${isDanger ? 'is-critical' : 'is-clean'}`}>
                    Financial impact: {explainer.victimLoss}
                  </p>
                </div>

                {/* Cryptographic Attestation */}
                <div className="vn-attestation">
                  <div className="vn-row-between" style={{ marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                    <div className="vn-row">
                      <Lock size={11} style={{ color: 'var(--ink-muted)' }} />
                      <span className="vn-panel-title">Cryptographic attestation</span>
                    </div>
                    <span className="vn-badge vn-badge-amber">EIP-712</span>
                  </div>
                  <div className="vn-hash-row">
                    <span className="vn-hash-key">State root</span>
                    <span className="vn-hash-val">{activeScenario.receipt.stateRoot}</span>
                  </div>
                  <div className="vn-hash-row">
                    <span className="vn-hash-key">Block hash</span>
                    <span className="vn-hash-val">{activeScenario.receipt.simulatedBlockHash}</span>
                  </div>
                  <div className="vn-hash-row">
                    <span className="vn-hash-key">Capital shielded</span>
                    <span className="vn-hash-val is-amber">{activeScenario.receipt.gasSaved}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <Button
                      variant="secondary" size="sm"
                      onClick={() => setShowReceiptModal(true)}
                      className="flex-1 font-mono text-[11px]"
                      leftIcon={<FileCode className="size-3" />}
                    >
                      View receipt
                    </Button>
                    <Button
                      variant="outline" size="sm"
                      onClick={handleCopyReceipt}
                      className="flex-1 font-mono text-[11px]"
                      leftIcon={receiptCopied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    >
                      {receiptCopied ? 'Copied' : 'Copy JSON'}
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── EIP-712 Receipt Modal ── */}
      {showReceiptModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        }}>
          <Card className="w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="vn-row-between" style={{ paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
              <div className="vn-row">
                <ShieldCheck size={14} style={{ color: 'var(--amber)' }} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Signed EIP-712 attestation
                </span>
              </div>
              <Button variant="ghost" size="sm"
                onClick={() => setShowReceiptModal(false)}
                className="text-slate-500 hover:text-slate-200 font-mono text-xs h-auto p-1">
                ESC
              </Button>
            </div>
            <pre style={{
              padding: 12, borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg)', fontFamily: 'var(--mono)', fontSize: 11,
              color: 'var(--ink-secondary)', overflow: 'auto', maxHeight: 260, lineHeight: 1.6,
              whiteSpace: 'pre',
            }}>
              {JSON.stringify({
                version: 'Vernier-v1.8',
                stateRoot: activeScenario.receipt.stateRoot,
                attestation: activeScenario.receipt.eip712Attestation,
                intent: activeScenario.intent,
                metrics: activeScenario.metrics,
                storageDeltas: activeScenario.storageDeltas,
                signatureProof: { signer: '0xDA9...e6B3', algorithm: 'secp256k1-keccak256', validUntilBlock: 21894200 },
              }, null, 2)}
            </pre>
            <div className="vn-row-between">
              <Button variant="secondary" size="sm" onClick={handleCopyReceipt}
                leftIcon={receiptCopied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}>
                {receiptCopied ? 'Copied' : 'Copy receipt JSON'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowReceiptModal(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
