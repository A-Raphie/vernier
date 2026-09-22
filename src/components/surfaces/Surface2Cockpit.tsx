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
                    {s.id === 'permit2-drain' ? 'Airdrop Scam' : s.id === 'proxy-delegatecall-hijack' ? 'Fake Proxy' : 'Uniswap Swap'}
                  </TabsTrigger>
                ))}
              </TabsList>
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
                  Auditor Mode
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
                  {actionConfirmed ? 'Halted' : 'Halt Transaction'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            TIER 1: SIMPLE VERDICT (THE 5-SECOND TRAFFIC LIGHT RULE)
            ═════════════════════════════════════════════════════════════════ */}
        {viewMode === 'simple' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* 1. Visceral Traffic Light Alert Banner */}
            <div style={{
              padding: '18px 24px', borderRadius: 14,
              border: isDanger ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
              background: isDanger
                ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(9, 13, 22, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(9, 13, 22, 0.95) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 280 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                  background: isDanger ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: isDanger ? 'var(--rose)' : 'var(--emerald)',
                }}>
                  {isDanger ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: isDanger ? 'var(--rose)' : 'var(--emerald)', marginBottom: 2,
                  }}>
                    {isDanger ? 'Critical Drain Intercepted' : 'Clean Transaction Verified'}
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                    {isDanger
                      ? 'Signing disabled. Vernier caught an exploit hidden in this calldata.'
                      : 'Safe to proceed. Calldata exactly matches declared swap intent.'}
                  </h2>
                </div>
              </div>

              {/* Key Quick Facts */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
                    Shielded Capital
                  </div>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 800,
                    color: isDanger ? '#fca5a5' : 'var(--emerald)',
                  }}>
                    {isDanger ? '$142,000.00' : '$0.00 At Risk'}
                  </div>
                </div>
                <div style={{ height: 32, width: 1, background: 'var(--border)' }} />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
                    Simulated In
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 800, color: 'var(--cyan)' }}>
                    0.42ms
                  </div>
                </div>
              </div>
            </div>

            {/* 2. The 3-Second Visceral Contrast (Promise vs Reality) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">

              {/* Left Card: What the Website Promised */}
              <div className="vn-panel" style={{ display: 'flex', flexDirection: 'column', borderRadius: 14 }}>
                <div className="vn-panel-header">
                  <div className="vn-row" style={{ gap: 8 }}>
                    <Gift size={14} style={{ color: 'var(--ink-secondary)' }} />
                    <span className="vn-panel-title">1. What The Website Promised</span>
                  </div>
                  <span className="vn-badge vn-badge-neutral">DApp Claim</span>
                </div>
                <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
                      {explainer.scamPromise}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
                      {explainer.scamSubtitle}
                    </p>
                  </div>

                  <div style={{
                    padding: '12px 14px', borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
                        Expected Wallet Balance
                      </span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--emerald)' }}>
                        {isDanger ? '+$6,500.00 Promised' : 'Receive 2,642.50 USDC'}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-muted)' }}>
                      Target: <code style={{ color: 'var(--ink-secondary)' }}>{activeScenario.intent.targetContract}</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Divider: Intercept Indicator */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: isDanger ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: isDanger ? '1px solid var(--rose)' : '1px solid var(--emerald)',
                  display: 'grid', placeItems: 'center',
                  color: isDanger ? 'var(--rose)' : 'var(--emerald)',
                  fontWeight: 800, fontSize: 11, fontFamily: 'var(--mono)',
                }}>
                  VS
                </div>
              </div>

              {/* Right Card: What Actually Happens */}
              <div className="vn-panel" style={{
                display: 'flex', flexDirection: 'column', borderRadius: 14,
                border: isDanger ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                background: isDanger ? 'rgba(244, 63, 94, 0.03)' : 'rgba(16, 185, 129, 0.03)',
              }}>
                <div className="vn-panel-header" style={{
                  background: isDanger ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                }}>
                  <div className="vn-row" style={{ gap: 8 }}>
                    {isDanger ? <AlertTriangle size={14} style={{ color: 'var(--rose)' }} /> : <ShieldCheck size={14} style={{ color: 'var(--emerald)' }} />}
                    <span className="vn-panel-title" style={{ color: isDanger ? '#fca5a5' : '#6ee7b7' }}>
                      2. What Actually Executes
                    </span>
                  </div>
                  <span className={`vn-badge ${isDanger ? 'vn-badge-critical' : 'vn-badge-clean'}`}>
                    {isDanger ? '🚨 Malicious Code' : '✓ Clean Route'}
                  </span>
                </div>
                <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{
                      fontSize: 19, fontWeight: 700, margin: '0 0 8px',
                      color: isDanger ? '#fca5a5' : '#6ee7b7',
                    }}>
                      {explainer.actualAction}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
                      {isDanger
                        ? 'The smart contract grants max approval to an unverified third party. In the next block, transferFrom() will steal every token.'
                        : 'Standard Uniswap V3 swap router execution with 0.5% max slippage. Zero foreign storage access.'}
                    </p>
                  </div>

                  <div style={{
                    padding: '12px 14px', borderRadius: 8,
                    background: isDanger ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                    border: isDanger ? '1px solid rgba(244, 63, 94, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase',
                        color: isDanger ? '#fca5a5' : '#6ee7b7', fontWeight: 600,
                      }}>
                        Actual Financial Outcome
                      </span>
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 800,
                        color: isDanger ? 'var(--rose)' : 'var(--emerald)',
                      }}>
                        {explainer.victimLoss}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: isDanger ? '#fca5a5' : 'var(--emerald)' }}>
                      Policy: <strong>{activeScenario.threat.remediation}</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. Interactive MetaMask Blind Sign Simulator (Why Users Need Vernier) */}
            <div className="vn-panel" style={{ borderRadius: 14, overflow: 'hidden' }}>
              <div style={{
                padding: '14px 20px', background: 'rgba(11, 15, 25, 0.8)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                borderBottom: blindSignTestActive ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Eye size={16} style={{ color: 'var(--amber)' }} />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>
                      Educational Simulator: What MetaMask Shows Without Vernier
                    </span>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-muted)' }}>
                      See how standard wallets deceive users by displaying harmless UI while asking to sign unreadable hex.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBlindSignTestActive(!blindSignTestActive)}
                  className="font-mono text-xs"
                >
                  {blindSignTestActive ? 'Hide MetaMask View' : 'Compare with MetaMask'}
                </Button>
              </div>

              {blindSignTestActive && (
                <div style={{ padding: '20px 24px', background: 'rgba(9, 13, 22, 0.6)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid-cols-1 md:grid-cols-2">
                    {/* Normal Wallet Simulation */}
                    <div style={{
                      padding: 16, borderRadius: 10,
                      background: '#1a1f2c', border: '1px solid #334155',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>
                          Standard Wallet Prompt (Blind Sign)
                        </span>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#ef4444', color: '#fff', fontWeight: 700 }}>
                          VULNERABLE
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>
                        Without Vernier, you are shown only raw unverified calldata:
                      </p>
                      <pre style={{
                        padding: 10, borderRadius: 6, background: '#0f172a',
                        fontFamily: 'var(--mono)', fontSize: 10, color: '#cbd5e1',
                        wordBreak: 'break-all', whiteSpace: 'pre-wrap', maxHeight: 80, overflowY: 'auto',
                      }}>
                        0x23b872dd0000000000000000000000004e6b21703e9b01c7811985a109867c4fa6712ab9ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff...
                      </pre>
                      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: '#ef4444' }}>⚠️ 0 warnings shown</span>
                        <span style={{ fontSize: 10, color: '#94a3b8', fontStyle: 'italic' }}>User signs & loses $142,000</span>
                      </div>
                    </div>

                    {/* Vernier Active Simulation */}
                    <div style={{
                      padding: 16, borderRadius: 10,
                      background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>
                          Vernier Pre-Execution Intercept
                        </span>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald)', fontWeight: 700 }}>
                          PROTECTED
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--ink-secondary)', marginBottom: 8 }}>
                        Vernier simulates state mutations in a sandboxed EVM in 0.42ms:
                      </p>
                      <div style={{
                        padding: 10, borderRadius: 6, background: 'rgba(9, 13, 22, 0.9)',
                        border: '1px solid var(--border)', fontSize: 11, color: 'var(--ink)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--rose)', fontWeight: 700, marginBottom: 4 }}>
                          <XCircle size={14} /> Signature disabled automatically
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--ink-muted)' }}>
                          Identified type(uint256).max approval redirecting to drainer recipient.
                        </div>
                      </div>
                      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: 'var(--emerald)', fontWeight: 600 }}>✓ $142,000 Saved</span>
                        <span style={{ fontSize: 10, color: 'var(--cyan)', fontFamily: 'var(--mono)' }}>0.42ms EVM Caliper</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Secondary Auditor Drawer Teaser (Never blocking front door) */}
            <div
              onClick={() => setViewMode('auditor')}
              style={{
                padding: '16px 20px', borderRadius: 12, cursor: 'pointer',
                background: 'rgba(15, 23, 42, 0.4)', border: '1px dashed var(--border-hover)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 150ms ease',
              }}
              className="hover:border-slate-500 hover:bg-slate-900/50"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Terminal size={18} style={{ color: 'var(--cyan)' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                    Need low-level proof? Switch to Auditor Mode
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                    Inspect step-by-step EVM Caliper scrubber, bytecode opcode trace, storage slots delta, and EIP-712 state root attestation.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--cyan)', fontSize: 12, fontWeight: 600 }}>
                <span>Open Auditor Trace</span>
                <ArrowRight size={14} />
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
