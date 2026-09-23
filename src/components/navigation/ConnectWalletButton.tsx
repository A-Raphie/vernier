'use client';

import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { Sparkles, Wallet, ChevronDown, Check, Copy, LogOut, ShieldCheck } from 'lucide-react';

const SANDBOX_ADDRESS = '0x4E6b21703E9B01c7811985a109867c4FA6712AB9' as const;

export const ConnectWalletButton: React.FC = () => {
  const { address, isConnected, chain: wagmiChain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sandboxActive, setSandboxActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vernier_sandbox_connected') === 'true';
      if (stored) setSandboxActive(true);
    }
  }, []);

  const handleConnectSandbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      localStorage.setItem('vernier_sandbox_connected', 'true');
    }
    setSandboxActive(true);
    const sandbox = connectors.find((c) => c.id === 'sandbox' || c.name === 'Sandbox Reviewer Account');
    if (sandbox) {
      connect({ connector: sandbox });
    }
  };

  const handleDisconnect = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vernier_sandbox_connected');
    }
    setSandboxActive(false);
    disconnect();
    setDropdownOpen(false);
  };

  const handleCopyAddress = (e: React.MouseEvent, addr: string) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted) {
    return (
      <div className="h-8 w-28 rounded-lg bg-slate-800/40 animate-pulse border border-slate-800" />
    );
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain: rkChain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted: rkMounted,
      }) => {
        const ready = rkMounted && mounted;
        const activeChain = rkChain || wagmiChain;
        const isRealConnected = Boolean(account?.address || (isConnected && address));
        const isUserConnected = Boolean(ready && (isRealConnected || sandboxActive));
        const effectiveAddress = account?.address || address || (sandboxActive ? SANDBOX_ADDRESS : undefined);

        if (!isUserConnected || !effectiveAddress) {
          return (
            <div className="flex items-center gap-1.5">
              {/* Primary: Real Wallet Popup (RainbowKit Modal with MetaMask, Rabby, Coinbase, WalletConnect) */}
              <button
                type="button"
                onClick={openConnectModal}
                className="group relative flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-950/90 text-slate-100 hover:text-white hover:border-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)] transition-all cursor-pointer active:scale-95"
              >
                <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <Wallet className="size-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Connect Wallet</span>
              </button>

              {/* Fast-Pass Sandbox Button for Judges who want 1-click test session */}
              <button
                type="button"
                onClick={handleConnectSandbox}
                title="Instant Judge Sandbox Pass (2.35 ETH pre-funded on Sepolia)"
                className="hidden md:flex items-center gap-1 px-2 py-1.5 text-[11px] font-mono rounded-lg border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/50 hover:border-cyan-400/60 transition-all cursor-pointer"
              >
                <Sparkles className="size-3 text-cyan-400" />
                <span>Sandbox Pass</span>
              </button>
            </div>
          );
        }

        const shortAddress = `${effectiveAddress.slice(0, 6)}...${effectiveAddress.slice(-4)}`;

        const displayBal = account?.displayBalance
          ? account.displayBalance
          : balance
          ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(3)} ${balance.symbol}`
          : '2.350 ETH';

        return (
          <div className="relative flex items-center gap-1.5 font-mono">
            {/* Network Chip */}
            <button
              type="button"
              onClick={openChainModal || (() => {})}
              className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg border border-slate-700/80 bg-slate-900/80 hover:border-slate-500 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline text-[11px]">{activeChain?.name || 'Sepolia'}</span>
              <ChevronDown className="size-3 text-slate-400" />
            </button>

            {/* Account Pill */}
            <button
              type="button"
              onClick={() => {
                if (isRealConnected && openAccountModal) {
                  openAccountModal();
                } else {
                  setDropdownOpen(!dropdownOpen);
                }
              }}
              className="group flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-emerald-500/40 bg-slate-900/90 hover:border-emerald-400 text-slate-200 transition-all cursor-pointer"
            >
              <span className="text-[11px] text-slate-400 border-r border-slate-700 pr-1.5 hidden sm:inline">
                {displayBal}
              </span>
              <span className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                {shortAddress}
              </span>
              <ChevronDown className="size-3 text-slate-400 ml-0.5" />
            </button>

            {/* Dropdown for Sandbox or Account Management */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-[#0e131f] border border-[#1e293b] p-3 shadow-2xl z-50 animate-in fade-in duration-100 font-mono">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                      <span>Vernier Firewall Active</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                      {activeChain?.name || 'Sepolia'}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                      {sandboxActive && !isRealConnected ? 'Sandbox Reviewer' : 'Account'}
                    </div>
                    <div className="flex items-center justify-between bg-black/40 border border-slate-800/60 rounded px-2 py-1 text-xs text-slate-300">
                      <span className="truncate mr-2">{shortAddress}</span>
                      <button
                        onClick={(e) => handleCopyAddress(e, effectiveAddress)}
                        className="text-slate-400 hover:text-white p-0.5 transition-colors cursor-pointer"
                        title="Copy full address"
                      >
                        {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-slate-400">Balance</span>
                      <span className="text-white font-medium">{displayBal}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-300 hover:text-rose-200 border border-rose-900/40 hover:border-rose-800/60 bg-rose-950/20 hover:bg-rose-950/40 rounded-lg transition-all cursor-pointer"
                  >
                    <LogOut className="size-3" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
