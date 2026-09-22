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

            {/* Left cluster: back button + minimal status pill + scenario tabs */}
            <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto max-w-full pb-1 sm:pb-0" style={{ minWidth: 0 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onNavigateTab('overview')}
                aria-label="Overview"
                className="size-8 shrink-0"
              >
                <ArrowLeft className="size-4" />
              </Button>

              {/* Status pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-300 shrink-0">
                <span className={`size-1.5 rounded-full ${isDanger ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                <span>{isDanger ? 'Threat Active' : 'Safe Route'}</span>
              </div>

              {/* Scenarios pills */}
              <TabsList className="overflow-x-auto shrink-0 flex-nowrap bg-black/40 border border-slate-800 p-0.5 rounded-lg">
                {SCENARIOS.map((s) => (
                  <TabsTrigger
                    key={s.id}
                    active={s.id === selectedScenarioId}
                    onClick={() => {
                      onSelectScenario(s.id);
                      setActiveStepIndex(0);
                      setBlindSignTestActive(false);
                    }}
                    className={s.id === selectedScenarioId ? '!bg-slate-800 !text-white !border-slate-700 shadow-sm' : '!text-slate-400 hover:!text-slate-200'}
                  >
                    <span style={{
                      display: 'inline-block', width: 5, height: 5, borderRadius: '50%', marginRight: 6,
                      background: s.riskLevel === 'CRITICAL' ? '#f43f5e' : s.riskLevel === 'HIGH' ? '#f59e0b' : '#10b981',
                    }} />
                    {s.id === 'permit2-drain' ? 'Airdrop Phishing' : s.id === 'proxy-delegatecall-hijack' ? 'Implementation Hijack' : 'Uniswap Clean'}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Execution Latency Chip */}
              <div className="hidden lg:flex items-center gap-1.5 font-mono text-[11px] text-slate-400 bg-slate-900/40 border border-slate-800 px-2.5 py-1 rounded-md shrink-0">
                <Zap className="size-3 text-slate-400" />
                <span>0.42ms execution</span>
              </div>
            </div>

            {/* Right cluster: Beginner vs Auditor Mode Toggle + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Beginner vs Auditor Toggle */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 2,
                padding: 2, borderRadius: 8,
                background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border)',
              }}>
                <button
                  type="button"
                  onClick={() => setViewMode('simple')}
                  style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 150ms', border: 'none',
                    background: viewMode === 'simple' ? '#1e293b' : 'transparent',
                    color: viewMode === 'simple' ? '#ffffff' : '#94a3b8',
                  }}
                >
                  Simple Verdict
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('auditor')}
                  style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 150ms', border: 'none',
                    background: viewMode === 'auditor' ? '#1e293b' : 'transparent',
                    color: viewMode === 'auditor' ? '#ffffff' : '#94a3b8',
                  }}
                >
                  Auditor Trace
                </button>
              </div>

              {/* Primary Action Button */}
              {isClean ? (
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="bg-white text-slate-950 hover:bg-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <CheckCircle2 className="size-3.5 text-slate-950" />
                  <span>{actionConfirmed ? 'Dispatched' : 'Approve & Broadcast'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="bg-white text-slate-950 hover:bg-slate-100 text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <ShieldAlert className="size-3.5 text-rose-600" />
                  <span>{actionConfirmed ? 'Halted' : 'Halt Execution'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            TIER 1: SIMPLE VERDICT (CALM MONOCHROME REFINED PATTERN)
            ═════════════════════════════════════════════════════════════════ */}
        {viewMode === 'simple' ? (
          <div className="vn-stack" style={{ gap: 16 }}>

            {/* 1. Verdict Strip (Clean Obsidian with White Tabular Metrics) */}
            <div className="vn-panel" style={{ padding: '20px 24px', borderRadius: 12 }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`size-2 rounded-full ${isDanger ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">Status</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                    {isDanger ? 'Phishing Drain Intercepted' : 'Clean Transaction Conformed'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                    {isDanger
                      ? 'Vernier simulated state mutations in 0.42ms and caught an unbounded token drain attempt.'
                      : 'Parameters conform cleanly to declared swap intent with zero foreign storage access.'}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0 self-start md:self-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight font-mono tabular-nums">
                      {isDanger ? '$142,000.00' : '$0.00'}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">Shielded</div>
                  </div>
                  <div style={{ height: 32, width: 1, background: 'var(--border)' }} />
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight font-mono tabular-nums">
                      0.42ms
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">Processing time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Core Side-by-Side Comparison */}
            <div className="vn-grid-2" style={{ gap: 16 }}>
              {/* Left Card: Promised by Website */}
              <div className="vn-panel" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 12 }}>
                <span className="label">Promised by Website</span>
                <div className="value-lg text-white">{explainer.scamPromise}</div>
                <blockquote className="excerpt">“{explainer.scamSubtitle}”</blockquote>
                
                <div className="vn-row" style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 12, overflow: 'hidden' }}>
                  <span style={{ color: 'var(--ink-muted)' }}>Target:</span>
                  <code style={{ fontFamily: 'var(--mono)', color: 'var(--ink-secondary)', wordBreak: 'break-all', fontSize: 11 }}>
                    {activeScenario.intent.targetContract}
                  </code>
                </div>
              </div>

              {/* Right Card: Simulated Execution */}
              <div className="vn-panel" style={{
                padding: 22, display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 12,
              }}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="label">Simulated Execution</span>
                  <span className={`tag ${isDanger ? 'tag-fail' : 'tag-pass'}`}>
                    {isDanger ? 'HAZARD DETECTED' : 'CONFORMING'}
                  </span>
                </div>
                <div className="value-lg" style={{ color: isDanger ? '#fda4af' : 'var(--ink)', fontSize: 22 }}>
                  {explainer.victimLoss}
                </div>
                <p style={{ fontSize: 13, color: 'var(--ink-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {explainer.actualAction}
                </p>

                <div className="vn-row" style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 12 }}>
                  <span style={{ color: 'var(--ink-muted)' }}>Policy:</span>
                  <span style={{ color: isDanger ? '#fca5a5' : 'var(--ink-secondary)', fontWeight: 500 }}>
                    {activeScenario.threat.remediation}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Safety Gate Stack (Clean Monochromatic Checklist) */}
            <div className="vn-panel" style={{ padding: 20, borderRadius: 12 }}>
              <div className="vn-row-between" style={{ marginBottom: 12 }}>
                <span className="label">Pre-Execution Safety Verification Gates</span>
                <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Evaluated inside isolated EVM caliper</span>
              </div>
              <div className="gates">
                {activeScenario.threat.vectors.length > 0 ? (
                  activeScenario.threat.vectors.map((vec, i) => (
                    <div key={i} className="gate">
                      <span className="gate-name">{vec}</span>
                      <span className="tag tag-fail">FAIL</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="gate">
                      <span className="gate-name">Price Slippage Boundary Conformance (0.50% max)</span>
                      <span className="tag tag-pass">PASS</span>
                    </div>
                    <div className="gate">
                      <span className="gate-name">Storage Delta State Shift Containment</span>
                      <span className="tag tag-pass">PASS</span>
                    </div>
                    <div className="gate">
                      <span className="gate-name">Allowance Recipient Verification</span>
                      <span className="tag tag-pass">PASS</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 4. Secondary Rails: Blind Wallet Comparison + Auditor Mode Trigger */}
            <div className="vn-row-between" style={{ padding: '6px 0', flexWrap: 'wrap', gap: 10 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBlindSignTestActive(!blindSignTestActive)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
                leftIcon={<Eye className="size-3.5 text-slate-400" />}
              >
                {blindSignTestActive ? 'Hide MetaMask blind sign comparison' : 'Compare with MetaMask blind sign →'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('auditor')}
                className="text-xs font-mono border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                leftIcon={<Terminal className="size-3.5 text-slate-400" />}
              >
                Open Auditor Caliper & Bytecode Trace →
              </Button>
            </div>

            {/* Interactive Blind Sign Drawer if toggled */}
            {blindSignTestActive && (
              <div className="vn-panel" style={{ padding: 18, borderRadius: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="grid-cols-1 md:grid-cols-2">
                  <div style={{ padding: 14, borderRadius: 8, background: '#0e131f', border: '1px solid #1e293b' }}>
                    <div className="vn-row-between" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#f8fafc' }}>Standard Wallet (MetaMask Blind Sign)</span>
                      <span className="tag tag-fail">VULNERABLE</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 6px' }}>User is prompted to sign unverified hex:</p>
                    <pre style={{
                      padding: 8, borderRadius: 4, background: '#070a10',
                      fontFamily: 'var(--mono)', fontSize: 10, color: '#cbd5e1',
                      wordBreak: 'break-all', whiteSpace: 'pre-wrap', maxHeight: 60, overflowY: 'auto',
                    }}>
                      0x23b872dd0000000000000000000000004e6b21703e9b01c7811985a109867c4fa6712ab9...
                    </pre>
                    <div style={{ marginTop: 8, fontSize: 11, color: '#fda4af' }}>
                      ⚠️ 0 warnings shown. User clicks Confirm and loses $142,000.
                    </div>
                  </div>

                  <div style={{ padding: 14, borderRadius: 8, background: '#0e131f', border: '1px solid #1e293b' }}>
                    <div className="vn-row-between" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Vernier Pre-Execution Intercept</span>
                      <span className="tag tag-pass">PROTECTED</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--ink-secondary)', margin: '0 0 6px' }}>Simulated on-chain in 0.42ms:</p>
                    <div style={{ padding: 8, borderRadius: 4, background: '#070a10', border: '1px solid var(--border)', fontSize: 11, color: '#cbd5e1' }}>
                      ✓ Pathogenic Permit2 allowance overwrite caught before signature.
                    </div>
                    <div style={{ marginTop: 8, fontSize: 11, color: '#a7f3d0', fontWeight: 600 }}>
                      ✓ Signature blocked automatically. $142,000 preserved.
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* ═════════════════════════════════════════════════════════════════
             TIER 2: AUDITOR TRACE (THE DEEP TECHNICAL WORKBENCH)
             ═════════════════════════════════════════════════════════════════ */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Auditor Header Banner with Return Button */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px', borderRadius: 10, background: '#0e131f',
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Terminal size={14} style={{ color: 'var(--ink-secondary)' }} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase' }}>
                  Auditor Mode Active: Deep Bytecode & Storage Slot Metrology
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('simple')}
                leftIcon={<ArrowLeft className="size-3.5" />}
                className="font-mono text-xs border-slate-700 hover:border-slate-600"
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
                    <Sliders size={12} style={{ color: 'var(--ink-muted)' }} />
                    <span className="vn-panel-title">Execution Scrubber</span>
                  </div>
                  <span className="num" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                    Step <strong style={{ color: 'var(--ink)' }}>{safeStepIndex + 1}</strong> of <strong style={{ color: 'var(--ink)' }}>{totalSteps}</strong>
                    <span style={{ margin: '0 6px', color: 'var(--border-hover)' }}>·</span>
                    Gas <strong style={{ color: 'var(--ink)' }}>{currentGas.toLocaleString()}</strong>
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
