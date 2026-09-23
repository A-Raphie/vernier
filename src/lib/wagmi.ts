import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, base, arbitrum } from 'wagmi/chains';
import { injected } from '@wagmi/connectors/injected';

export const config = createConfig({
  chains: [mainnet, sepolia, base, arbitrum],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    [base.id]: http('https://base-rpc.publicnode.com'),
    [arbitrum.id]: http('https://arbitrum-one-rpc.publicnode.com'),
  },
});
