'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Gift, 
  ArrowRight, 
  XCircle, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Flame,
  FileCode 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulationScenario } from '../../lib/types';
import { SurfaceTab } from '../navigation/ChromeHeader';
import { Button, Badge, Card, TabsList, TabsTrigger } from '../ui';

interface UnifiedVerdictCardProps {
  scenario: SimulationScenario;
  onNavigateTab: (tab: SurfaceTab) => void;
}

export const UnifiedVerdictCard: React.FC<UnifiedVerdictCardProps> = ({
  scenario,
  onNavigateTab,
}) => {
  const [testMode, setTestMode] = useState<'protected' | 'blind'>('protected');
  const [hasSimulatedBlindSign, setHasSimulatedBlindSign] = useState(false);
  const [actionConfirmed, setActionConfirmed] = useState(false);

  const isCritical = scenario.riskLevel === 'CRITICAL';
  const isHigh = scenario.riskLevel === 'HIGH';
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

  const handlePrimaryAction = () => {
    setActionConfirmed(true);
    if (isClean) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
    setTimeout(() => setActionConfirmed(false), 3500);
  };

  return (
    <Card
      className={`p-5 sm:p-6 space-y-5 transition-all duration-200 ${
        isClean
          ? 'border-emerald-800/80 bg-gradient-to-b from-[#0a1813] to-[#0e131f]'
          : 'border-rose-700/80 bg-gradient-to-b from-[#190a12] to-[#0e131f]'
      }`}
    >
      {/* 5-Second Traffic Light Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          {/* Traffic Light Physical Indicator */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#090d16] border border-slate-800">
            <span
              className={`size-2.5 rounded-full transition-all duration-200 ${
                isCritical
                  ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                  : 'bg-rose-950 opacity-40'
              }`}
              title="Critical Threat"
            />
            <span
              className={`size-2.5 rounded-full transition-all duration-200 ${
                isHigh
                  ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                  : 'bg-amber-950 opacity-40'
              }`}
              title="High Risk"
            />
            <span
              className={`size-2.5 rounded-full transition-all duration-200 ${
                isClean
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'bg-emerald-950 opacity-40'
              }`}
              title="Clean Conforming"
            />
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider flex items-center gap-2">
              <span>VISCERAL 5-SECOND TRAFFIC LIGHT VERDICT</span>
              <span>•</span>
              <span className="text-cyan-400">0.42ms CLIENT-SIDE</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-sans text-white mt-0.5">
              {isClean ? 'Safe to Sign · Conforming Transaction' : 'Critical Threat Intercepted · Malicious Prompt'}
            </h3>
          </div>
        </div>

        {/* Threat Badge & Primary Action */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant={isClean ? 'success' : 'destructive'}
            size="lg"
            dot
            dotPulse
            className="font-bold tracking-wide"
          >
            {isClean ? 'SAFE TO SIGN' : 'CRITICAL DRAIN BLOCKED IN 0.42ms'}
          </Badge>

          {isClean ? (
            <Button
              variant="primary"
              size="default"
              onClick={handlePrimaryAction}
              leftIcon={<CheckCircle2 className="size-4" />}
              className="font-bold uppercase tracking-wider"
            >
              {actionConfirmed ? 'BROADCAST DISPATCHED' : 'APPROVE & BROADCAST'}
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="default"
              onClick={handlePrimaryAction}
              leftIcon={<ShieldAlert className="size-4" />}
              className="font-bold uppercase tracking-wider shadow-lg"
            >
              {actionConfirmed ? 'TRANSACTION HALTED & ISOLATED' : 'HALT TRANSACTION & ISOLATE'}
            </Button>
          )}
        </div>
      </div>

      {/* Mode Switcher inside card: With Vernier vs Without Vernier */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090d16]/80 p-2.5 rounded-lg border border-slate-800">
        <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
          <Zap className="size-3.5 text-amber-400" />
          <span>Interactive Contrast: Test wallet experience with vs without Vernier firewall</span>
        </div>

        <TabsList>
          <TabsTrigger
            active={testMode === 'protected'}
            onClick={() => setTestMode('protected')}
            badge={testMode === 'protected' ? 'ACTIVE' : undefined}
          >
            🛡️ Protected by Vernier
          </TabsTrigger>
          <TabsTrigger
            active={testMode === 'blind'}
            onClick={() => {
              setTestMode('blind');
              setHasSimulatedBlindSign(false);
            }}
            badge={testMode === 'blind' ? 'BLIND' : undefined}
          >
            ❌ Without Vernier (Blind Sign)
          </TabsTrigger>
        </TabsList>
      </div>

      {testMode === 'protected' ? (
        /* PROTECTED MODE: Visceral Side-by-Side Contrast (What You See vs Calldata Reality) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Left: What The Website Promises */}
          <div className="p-4 rounded-lg border border-slate-800 bg-[#090d16] flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
                  <Gift className="size-3.5 text-cyan-400" />
                  <span>1. What The dApp Prompts You</span>
                </span>
                <Badge variant="info" size="sm">User View</Badge>
              </div>

              <h4 className="font-sans font-bold text-base text-slate-100">
                {explainer.scamPromise}
              </h4>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {explainer.scamSubtitle}
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#0e131f] border border-slate-800/80 text-[11px] font-sans text-slate-400 flex items-center gap-2">
              <span className="size-2 rounded-full bg-cyan-400" />
              <span>Target: <code className="font-mono text-slate-300">{scenario.intent.targetContract}</code></span>
            </div>
          </div>

          {/* Card Right: The Calldata Reality */}
          <div
            className={`p-4 rounded-lg border flex flex-col justify-between space-y-3 ${
              isClean
                ? 'border-emerald-800/80 bg-emerald-950/30'
                : 'border-rose-800/80 bg-rose-950/30'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-1.5">
                  {isClean ? (
                    <ShieldCheck className="size-3.5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="size-3.5 text-rose-400" />
                  )}
                  <span>2. Calldata Reality (Firewall Ground Truth)</span>
                </span>
                <Badge variant={isClean ? 'success' : 'destructive'} size="sm" dot={!isClean}>
                  {isClean ? 'Conforming' : 'Exploit Attempt'}
                </Badge>
              </div>

              <h4
                className={`font-sans font-bold text-base ${
                  isClean ? 'text-emerald-200' : 'text-rose-200'
                }`}
              >
                {explainer.actualAction}
              </h4>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                <strong>Financial Impact:</strong> {explainer.victimLoss}
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#090d16]/80 border border-slate-800 text-[11px] font-sans flex items-center justify-between">
              <span className={isClean ? 'text-emerald-300 font-medium' : 'text-rose-300 font-medium'}>
                {isClean ? '✓ Zero malicious side effects detected' : '🛡️ Signature disabled: Max approval prevented'}
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
          </div>
        </div>
      ) : (
        /* BLIND MODE: What happens without Vernier */
        <div className="p-5 rounded-lg border border-rose-800 bg-[#090d16] space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <XCircle className="size-4" />
              <span>Standard Wallet Experience (No Pre-Flight Sandbox)</span>
            </span>
            <span className="text-slate-500">Unprotected</span>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-300">
              Without Vernier, wallets display raw hexadecimal calldata that is impossible for normal humans to decipher:
            </div>
            <div className="p-3 rounded bg-[#0e131f] border border-slate-800 font-mono text-xs text-slate-400 break-all leading-relaxed">
              <span className="text-slate-500 block mb-1 text-[10px] uppercase font-sans">Raw Calldata:</span>
              0x23b872dd0000000000000000000000004e6b21703e9b01c7811985a109867c4fa6712ab9ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff...
            </div>
          </div>

          {hasSimulatedBlindSign ? (
            <div className="p-4 rounded border border-rose-600 bg-rose-950/70 text-center space-y-2">
              <div className="text-rose-300 font-bold font-sans text-sm flex items-center justify-center gap-2">
                <XCircle className="size-5 text-rose-400" />
                <span>💥 WALLET COMPROMISED: ALL TOKENS DRAINED</span>
              </div>
              <p className="text-xs text-rose-200 font-sans">
                You clicked Confirm. In the next block, the attacker executed transferFrom and drained <strong>{explainer.victimLoss}</strong>.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setTestMode('protected')}
                rightIcon={<ArrowRight className="size-3.5" />}
                className="mt-2"
              >
                Restore Vernier Protection
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 pt-2">
              <span className="text-xs text-slate-400 font-sans">
                The user cannot tell what this prompt does and clicks Confirm...
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTestMode('protected')}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setHasSimulatedBlindSign(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Sign / Confirm (Blind)
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
