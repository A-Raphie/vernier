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

  const [auditorTab, setAuditorTab] = useState<'storage' | 'bytecode'>('storage');
  const [forensicsMode, setForensicsMode] = useState<'protected' | 'blind'>('protected');
  const [hasSimulatedBlindSign, setHasSimulatedBlindSign] = useState(false);
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
    <div style={{ padding: '24px 28px', background: 'var(--bg)', minHeight: 'calc(100vh - 3.5rem)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── COMMAND BAR ── */}
        <div className="vn-panel" style={{ borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 12px' }}>

            {/* Left: back + dots + scenarios + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <Button
                variant="outline" size="icon"
                onClick={() => onNavigateTab('overview')}
                aria-label="Overview"
                className="size-7 shrink-0"
              >
                <ArrowLeft className="size-3.5" />
              </Button>

              {/* Traffic dots */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 8px', borderRadius: 999,
                background: 'var(--bg)', border: '1px solid var(--border)',
              }}>
                {[
                  { lit: isCritical, on: 'var(--rose)', shadow: '0 0 6px rgba(244,63,94,0.8)' },
                  { lit: isHigh,     on: 'var(--amber)', shadow: '0 0 6px rgba(245,158,11,0.8)' },
                  { lit: isClean,    on: 'var(--emerald)', shadow: '0 0 6px rgba(16,185,129,0.8)' },
                ].map((d, i) => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: d.lit ? d.on : 'rgba(255,255,255,0.06)',
                    boxShadow: d.lit ? d.shadow : 'none',
                    transition: 'all 200ms',
                  }} />
                ))}
              </div>

              {/* Scenario tabs */}
              <TabsList>
                {SCENARIOS.map((s) => (
                  <TabsTrigger
                    key={s.id}
                    active={s.id === selectedScenarioId}
                    onClick={() => {
                      onSelectScenario(s.id);
                      setActiveStepIndex(0);
                      setForensicsMode('protected');
                    }}
                  >
                    <span style={{
                      display: 'inline-block', width: 6, height: 6, borderRadius: '50%', marginRight: 4,
                      background: s.riskLevel === 'CRITICAL' ? 'var(--rose)' : s.riskLevel === 'HIGH' ? 'var(--amber)' : 'var(--emerald)',
                    }} />
                    {s.name.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Scenario name + benchmark */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                paddingLeft: 10, borderLeft: '1px solid var(--border)',
                fontFamily: 'var(--mono)', fontSize: 11,
              }} className="hidden lg:flex">
                <span style={{ color: 'var(--ink)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeScenario.name}
                </span>
                <span style={{ color: 'var(--ink-muted)' }}>·</span>
                <span style={{ color: 'var(--cyan)', flexShrink: 0 }}>0.42ms</span>
              </div>
            </div>

            {/* Right: status badge + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span className={`vn-badge ${isClean ? 'vn-badge-clean' : 'vn-badge-critical'}`}>
                {isClean ? 'Safe to sign' : 'Drain intercepted'}
              </span>
              {isClean ? (
                <Button
                  variant="primary" size="sm"
                  onClick={handlePrimaryAction}
                  leftIcon={<CheckCircle2 className="size-3.5" />}
                  className="font-bold uppercase tracking-wider"
                >
                  {actionConfirmed ? 'Dispatched' : 'Approve & Broadcast'}
                </Button>
              ) : (
                <Button
                  variant="destructive" size="sm"
                  onClick={handlePrimaryAction}
                  leftIcon={<ShieldAlert className="size-3.5" />}
                  className="font-bold uppercase tracking-wider"
                >
                  {actionConfirmed ? 'Halted' : 'Halt Transaction'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── DUAL PANEL WORKBENCH ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 16, alignItems: 'start' }}
             className="grid-cols-1 lg:grid-cols-[7fr_5fr]">

          {/* ════════════════ LEFT PANEL ════════════════ */}
          <div className="vn-panel">

            {/* Header */}
            <div className="vn-panel-header">
              <div className="vn-row">
                <Sliders size={12} style={{ color: 'var(--amber)' }} />
                <span className="vn-panel-title">Execution Scrubber</span>
              </div>
              <span className="num" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                Step <strong style={{ color: 'var(--ink)' }}>{safeStepIndex + 1}</strong>
                {' '}of <strong style={{ color: 'var(--ink)' }}>{totalSteps}</strong>
                <span style={{ margin: '0 6px', color: 'var(--border-hover)' }}>·</span>
                Gas <strong style={{ color: 'var(--amber)' }}>{currentGas.toLocaleString()}</strong>
              </span>
            </div>

            {/* Caliper scrubber */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
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
                {/* tick marks */}
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
                {/* sliding window */}
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

              {/* Active opcode bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '6px 10px', marginTop: 8, borderRadius: 6,
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
                    border: '1px solid rgba(244,63,94,0.4)',
                    background: 'rgba(244,63,94,0.08)',
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

            {/* Gas + mutations strip */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
              <div style={{ padding: '10px 14px', borderRight: '1px solid var(--border)' }}>
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
              <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="vn-stat-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Database size={10} /> State mutations
                </span>
                <span className="num" style={{ fontSize: 11, color: 'var(--ink-secondary)', fontWeight: 600 }}>
                  {activeScenario.metrics.storageSlotsTouched} slots
                </span>
              </div>
            </div>

            {/* Auditor deck */}
            <div style={{ padding: '12px 14px' }}>
              <div className="vn-row-between" style={{ marginBottom: 10 }}>
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

            {/* Pathogenic signal notice (bottom of left panel) */}
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

          {/* ════════════════ RIGHT PANEL ════════════════ */}
          <div className="vn-panel">

            {/* Header: forensics title + protected/blind toggle */}
            <div className="vn-panel-header">
              <div className="vn-row">
                <Zap size={12} style={{ color: 'var(--cyan)' }} />
                <span className="vn-panel-title">Transaction Forensics</span>
              </div>
              <TabsList>
                <TabsTrigger
                  active={forensicsMode === 'protected'}
                  onClick={() => setForensicsMode('protected')}
                  badge={forensicsMode === 'protected' ? 'Active' : undefined}
                >
                  Protected
                </TabsTrigger>
                <TabsTrigger
                  active={forensicsMode === 'blind'}
                  onClick={() => { setForensicsMode('blind'); setHasSimulatedBlindSign(false); }}
                  badge={forensicsMode === 'blind' ? 'Blind' : undefined}
                >
                  Blind sign
                </TabsTrigger>
              </TabsList>
            </div>

            {forensicsMode === 'protected' ? (
              <>
                {/* ── PROMPTED INTENT ── */}
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

                {/* ── MUTATION REALITY ── */}
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
                  {isDanger && (
                    <div style={{
                      marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(244,63,94,0.15)',
                      fontFamily: 'var(--mono)', fontSize: 11, color: '#fca5a5',
                    }}>
                      Signature disabled — max approval prevented
                    </div>
                  )}
                  {isClean && (
                    <div style={{
                      marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(16,185,129,0.15)',
                      fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--emerald)',
                    }}>
                      Zero malicious side effects detected
                    </div>
                  )}
                </div>

                {/* ── SECURITY RISK INDEX ── */}
                <div className="vn-risk-block">
                  <div className="vn-row-between" style={{ marginBottom: 8 }}>
                    <span className="vn-panel-title">Security risk index</span>
                    <span className={`vn-badge ${isDanger ? 'vn-badge-critical' : 'vn-badge-clean'}`}>
                      {activeScenario.riskLevel} risk
                    </span>
                  </div>
                  <div className="vn-row-between">
                    <span className={`vn-risk-score ${isDanger ? 'is-critical' : 'is-clean'}`}>
                      {activeScenario.riskScore}
                      <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--ink-muted)', marginLeft: 4 }}>/100</span>
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-muted)' }}>
                      {isDanger ? 'Malicious calibration' : 'Safe execution'}
                    </span>
                  </div>
                  <div className="vn-risk-segments">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <div key={idx} style={{
                        background: idx < riskSegmentsFilled
                          ? isDanger ? 'var(--rose)' : 'var(--emerald)'
                          : 'var(--border)',
                      }} />
                    ))}
                  </div>
                  <div>
                    {activeScenario.threat.vectors.length > 0 ? (
                      activeScenario.threat.vectors.map((vec, idx) => (
                        <div key={idx} className="vn-vector">
                          <AlertTriangle size={10} style={{ flexShrink: 0, marginTop: 1 }} />
                          <span>{vec}</span>
                        </div>
                      ))
                    ) : (
                      <div className="vn-vector is-clean">
                        <CheckCircle2 size={10} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>Parameters conform cleanly to declared intent</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── CRYPTOGRAPHIC ATTESTATION ── */}
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
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
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
              </>
            ) : (
              /* ── BLIND SIGN SIMULATOR ── */
              <div style={{ padding: 14 }} className="vn-stack">
                <div className="vn-row-between" style={{ paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <div className="vn-row">
                    <XCircle size={14} style={{ color: 'var(--rose)' }} />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: '#fca5a5' }}>
                      Unprotected wallet — blind sign
                    </span>
                  </div>
                  <span className="vn-badge vn-badge-critical">Blind</span>
                </div>

                <p style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                  Without Vernier, you're asked to sign raw unverified calldata:
                </p>
                <div style={{
                  padding: '10px 12px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-muted)',
                  wordBreak: 'break-all', lineHeight: 1.6,
                }}>
                  0x23b872dd0000000000000000000000004e6b21703e9b01c7811985a109867c4fa6712ab9ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff...
                </div>

                {hasSimulatedBlindSign ? (
                  <div style={{
                    padding: 14, borderRadius: 8,
                    border: '1px solid rgba(244,63,94,0.4)',
                    background: 'rgba(244,63,94,0.06)',
                  }} className="vn-stack">
                    <div className="vn-row">
                      <ShieldAlert size={14} style={{ color: 'var(--rose)' }} />
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Critical exploit executed
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#fca5a5', lineHeight: 1.5 }}>
                      You clicked Confirm. In the next block, the attacker ran transferFrom and drained{' '}
                      <strong>{explainer.victimLoss}</strong>.
                    </p>
                    <Button variant="primary" size="sm" onClick={() => setForensicsMode('protected')}
                      rightIcon={<ArrowRight className="size-3" />}>
                      Restore Vernier protection
                    </Button>
                  </div>
                ) : (
                  <div className="vn-row-between">
                    <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                      Signing confirms raw calldata to the contract...
                    </span>
                    <div className="vn-row" style={{ gap: 8 }}>
                      <Button variant="outline" size="sm" onClick={() => setForensicsMode('protected')}>
                        Cancel
                      </Button>
                      <Button variant="secondary" size="sm"
                        onClick={() => setHasSimulatedBlindSign(true)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                        Sign blind
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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
