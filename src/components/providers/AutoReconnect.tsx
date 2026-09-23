'use client';

import { useEffect } from 'react';
import { useAccount, useConnect, useReconnect } from 'wagmi';

export function AutoReconnect() {
  const { isConnected } = useAccount();
  const { reconnect } = useReconnect();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (isConnected) return;
    let dead = false;

    const adopt = async () => {
      if (dead) return;
      try {
        if (typeof window === 'undefined') return;
        const eth = (window as any).ethereum;
        if (!eth?.request) return;
        const accts = await eth.request({ method: 'eth_accounts' });
        if (dead || !accts?.length) return;
        reconnect();
        const connector = connectors.find((c) => c.id === 'injected');
        if (connector) await connect({ connector });
      } catch {
        /* wallet not granting yet */
      }
    };

    adopt();
    const t = setInterval(adopt, 2500);
    if (typeof window !== 'undefined' && (window as any).ethereum?.on) {
      (window as any).ethereum.on('accountsChanged', adopt);
    }
    return () => {
      dead = true;
      clearInterval(t);
    };
  }, [isConnected, reconnect, connect, connectors]);

  return null;
}
