'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Printer,
  ExternalLink,
  Lock,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../ui/button';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: '3RD-WEB-HACK 2026 · HACKATHON ENTRY',
    title: 'Vernier: The Web3 Transaction Firewall',
    subtitle: 'Stop signing transactions blind. Vernier simulates the damage first in 0.42ms.',
    content: (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-mono text-slate-300">Live at https://tryvernier.netlify.app</span>
          </div>
          <p className="text-base text-slate-300 leading-relaxed font-sans">
            Named after Pierre Vernier’s 1631 precision caliper, Vernier is an in-browser transaction intent firewall. 
            It executes raw contract bytecode and measures storage slot mutations down to the single gas unit before your wallet ever signs.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 font-mono text-center">
          <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
            <div className="text-2xl font-bold text-white tracking-tight">0.42ms</div>
            <div className="text-xs text-slate-400 mt-1">Simulation Latency</div>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
            <div className="text-2xl font-bold text-white tracking-tight">100%</div>
            <div className="text-xs text-slate-400 mt-1">Client-Side Private</div>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
            <div className="text-2xl font-bold text-white tracking-tight">$142M+</div>
            <div className="text-xs text-slate-400 mt-1">Target Attack Surface</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    badge: 'THE UNSOLVED PROBLEM',
    title: 'The $142M Blind-Signing Epidemic',
    subtitle: 'Web3 security tools fail because they are slow, centralized, and unintelligible to humans.',
    content: (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-semibold">
              <ShieldAlert className="size-4" />
              <span>THE THREAT</span>
            </div>
            <h4 className="text-white font-semibold text-sm">Obfuscated Calldata Drainers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scam sites hide infinite token approvals (`type(uint256).max`) and proxy upgrades behind innocent buttons like “Claim 2.5 ETH Airdrop”. Standard wallets only show meaningless hex: `0x095ea7b3...`.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-semibold">
              <Lock className="size-4" />
              <span>EXISTING SOLUTIONS FAIL</span>
            </div>
            <h4 className="text-white font-semibold text-sm">RPC Latency & Privacy Leaks</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Existing simulation APIs take 800ms–2000ms by shipping raw transactions to centralized third-party servers. This leaks user IPs, broadcasts unconfirmed intents, and introduces unacceptable lag.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-slate-800/80 font-mono text-xs text-slate-300 flex items-center justify-between">
          <span>Root Cause:</span>
          <span className="text-slate-400">Users cannot see storage deltas before signing.</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    badge: 'OUR SOLUTION',
    title: 'Instant In-Browser EVM Pre-Execution',
    subtitle: 'The 5-Second Traffic Light Rule: Total clarity for beginners, deep metrology for auditors.',
    content: (
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
            <div className="text-amber-400 font-bold">1. Zero RPC Leak</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Executes locally in WebAssembly memory in 0.42ms. Zero remote node communication.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
            <div className="text-amber-400 font-bold">2. Intent Contrast</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Compares website promise (*Claim Airdrop*) against simulated execution (*$142,000 drained*).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
            <div className="text-amber-400 font-bold">3. Dual Cockpit</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Simple Traffic Light for judges; deep opcode & storage delta trace for security engineers.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-center gap-3">
          <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
          <span className="text-xs text-emerald-200 font-mono">
            Halts dangerous signatures before they reach private keys.
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    badge: 'TECHNICAL INNOVATION',
    title: 'Architecture & Cryptographic Verification',
    subtitle: 'A full-stack client caliper with EIP-712 cryptographic attestation digests.',
    content: (
      <div className="space-y-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-2">
          <div className="text-slate-400 uppercase tracking-wider text-[10px]">EVM Caliper Pipeline</div>
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Raw Calldata</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Opcode Trace</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Storage Diffs</div>
            <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">EIP-712 Digest</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase">Safety Verification Gates</span>
            <div className="text-white font-semibold">3-Gate Automated Evaluation</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Gas discrepancy (+310% anomaly), unbounded allowance recipient, and unverified bytecode detection.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase">Cryptographic Proof Rail</span>
            <div className="text-white font-semibold">SHA-256 State Root Attestation</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Emits signed, downloadable JSON receipts compliant with ERC-4337 and EIP-712 standards.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    badge: 'BENCHMARKS & LIVE IMPACT',
    title: 'Demonstrated Attack Vector Containment',
    subtitle: 'Tested against real-world mainnet exploits across $142M+ in historical drain volume.',
    content: (
      <div className="space-y-4">
        <div className="space-y-2 font-mono text-xs">
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between">
            <span className="text-white font-medium">1. Permit2 Infinite Allowance Drainer</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px]">
              BLOCKED ($142k Saved)
            </span>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between">
            <span className="text-white font-medium">2. ERC-1967 Proxy Delegatecall Slot Overwrite</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px]">
              BLOCKED ($850k Saved)
            </span>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between">
            <span className="text-white font-medium">3. Canonical Uniswap V3 Token Swap</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
              VERIFIED CONFORMING
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 font-mono text-xs flex items-center justify-between text-slate-300">
          <span>Latency Benchmark:</span>
          <span className="text-emerald-400 font-bold">0.42ms client-side vs 1,450ms traditional RPC</span>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    badge: 'FUTURE SCOPE & ROADMAP',
    title: 'What Comes Next for Vernier',
    subtitle: 'From web caliper to universal Web3 defense standard.',
    content: (
      <div className="space-y-4 font-mono text-xs">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
            <div className="text-white font-semibold">Q4 2026</div>
            <div className="text-amber-400 font-medium">Browser Extension</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Auto-inject into MetaMask, Rabby, and Coinbase Wallet requests before popup render.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
            <div className="text-white font-semibold">Q1 2027</div>
            <div className="text-amber-400 font-medium">ERC-4337 Module</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Pre-flight validation hook for smart accounts, Safe multisigs, and autonomous AI agents.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
            <div className="text-white font-semibold">Q2 2027</div>
            <div className="text-amber-400 font-medium">Threat Oracle</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Decentralized registry of flagged pathogenic storage slot mutation patterns.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-300">Live Production URL:</span>
          <a
            href="https://tryvernier.netlify.app"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:text-slate-200 underline font-semibold flex items-center gap-1"
          >
            <span>tryvernier.netlify.app</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    ),
  },
];

export const Surface4PitchDeck: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = SLIDES[currentSlideIndex];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-5xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Slide Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-slate-400" />
          <span className="text-slate-400 uppercase tracking-wider font-semibold">
            Pitch Deck Presentation
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            Slide {currentSlideIndex + 1} of {SLIDES.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="size-3 text-slate-400" />}
            className="hidden sm:inline-flex text-xs font-mono border-slate-800 text-slate-400 hover:text-white"
          >
            Print / PDF
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="size-8 border-slate-800"
            >
              <ChevronLeft className="size-4 text-slate-300" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              aria-label="Next slide"
              className="size-8 border-slate-800"
            >
              <ChevronRight className="size-4 text-slate-300" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0e131f] border border-[#1e293b] shadow-2xl flex-1 flex flex-col justify-between my-auto">
        <div className="space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
            {currentSlide.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            {currentSlide.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            {currentSlide.subtitle}
          </p>
        </div>

        <div className="py-6 sm:py-8">
          {currentSlide.content}
        </div>

        {/* Slide Progress Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 font-mono text-[11px] text-slate-500">
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`h-1 rounded-full transition-all ${
                  i === currentSlideIndex ? 'w-8 bg-white' : 'w-3 bg-slate-800 hover:bg-slate-700'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <span>Use ← → keys to navigate</span>
        </div>
      </div>
    </div>
  );
};
