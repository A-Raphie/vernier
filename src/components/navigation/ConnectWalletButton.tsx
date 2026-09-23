'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { Wallet, LogOut, Copy, Check, ChevronDown, ShieldCheck, X, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

export const ConnectWalletButton: React.FC = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasInjectedProvider, setHasInjectedProvider] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasInjectedProvider(Boolean((window as any).ethereum));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConnectInjected = () => {
    const connector = connectors.find((c) => c.id === 'injected');
    if (connector) {
      connect({ connector });
      setModalOpen(false);
    }
  };

  const handleConnectMock = () => {
    const connector = connectors.find((c) => c.id === 'mock') || connectors[0];
    if (connector) {
      connect({ connector });
      setModalOpen(false);
    }
  };

  const handleCopyAddress = () => {
    if (address && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected || !address) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setModalOpen(true)}
          disabled={isPending}
          className="text-xs font-mono border-slate-700 bg-slate-900/60 hover:border-slate-500 text-slate-200 hover:text-white transition-all shadow-sm"
          leftIcon={<Wallet className="size-3.5 text-slate-400" />}
        >
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </Button>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div
              className="fixed inset-0"
              onClick={() => setModalOpen(false)}
            />
            <div className="relative w-full max-w-sm rounded-2xl bg-[#0c101a] border border-slate-800 p-5 shadow-2xl z-10 font-mono space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-white">Connect to Vernier</span>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {/* 1. Real Injected Wallet */}
                <button
                  onClick={handleConnectInjected}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Wallet className="size-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        Browser Wallet
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {hasInjectedProvider ? 'MetaMask / Rabby / Phantom' : 'No extension detected'}
                      </div>
                    </div>
                  </div>
                  {hasInjectedProvider && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      Detected
                    </span>
                  )}
                </button>

                {/* 2. Sandbox Reviewer Account */}
                <button
                  onClick={handleConnectMock}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        Sandbox Reviewer Account
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Instant E2E session · Sepolia testnet
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                    Instant
                  </span>
                </button>
              </div>

              {connectError && (
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-[11px] text-rose-300 flex items-center gap-2">
                  <AlertCircle className="size-3.5 shrink-0" />
                  <span className="truncate">{connectError.message}</span>
                </div>
              )}

              <div className="text-[10px] text-slate-500 text-center pt-1 border-t border-slate-800/60">
                Client-side firewall · Private keys never exposed
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="relative inline-block text-left">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="text-xs font-mono border-slate-700 bg-slate-900/80 hover:border-slate-500 text-slate-200 transition-all flex items-center gap-1.5 px-2.5"
      >
        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-white">{shortAddress}</span>
        <ChevronDown className="size-3 text-slate-400 ml-0.5" />
      </Button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0e131f] border border-[#1e293b] p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 font-mono">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>Protected by Vernier</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                {chain?.name || 'Ethereum'}
              </span>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Account</div>
              <div className="flex items-center justify-between bg-black/40 border border-slate-800/60 rounded px-2 py-1 text-xs text-slate-300">
                <span className="truncate mr-2">{shortAddress}</span>
                <button
                  onClick={handleCopyAddress}
                  className="text-slate-400 hover:text-white p-0.5 transition-colors"
                  title="Copy full address"
                >
                  {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                </button>
              </div>

              {balance && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-400">Balance</span>
                  <span className="text-white font-medium">
                    {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {balance.symbol}
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                disconnect();
                setDropdownOpen(false);
              }}
              className="w-full text-xs text-rose-300 hover:text-rose-200 border-rose-900/40 hover:border-rose-800/60 bg-rose-950/20 hover:bg-rose-950/40 justify-center"
              leftIcon={<LogOut className="size-3" />}
            >
              Disconnect
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
