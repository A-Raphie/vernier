import { http, createConfig, createConnector } from 'wagmi';
import { mainnet, sepolia, base, arbitrum } from 'wagmi/chains';
import { injected } from '@wagmi/connectors/injected';
import { custom } from 'viem';

const SANDBOX_ACCOUNT = '0x4E6b21703E9B01c7811985a109867c4FA6712AB9' as const;
const STORAGE_KEY = 'vernier_sandbox_connected';

// Custom sandbox connector for instant demo & reviewer accounts
export const sandboxConnector = createConnector((config) => ({
  id: 'mock',
  name: 'Sandbox Reviewer Account',
  type: 'mock',
  async connect() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    return {
      accounts: [SANDBOX_ACCOUNT] as any,
      chainId: 11155111, // Sepolia testnet
    };
  },
  async disconnect() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
  async getAccounts() {
    return [SANDBOX_ACCOUNT];
  },
  async getChainId() {
    return 11155111;
  },
  async getProvider() {
    return custom({
      async request({ method, params }) {
        if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
          return [SANDBOX_ACCOUNT];
        }
        if (method === 'eth_chainId') return '0xaa36a7'; // Sepolia
        if (method === 'eth_getBalance') return '0x2098490a2a4b80000'; // 2.350 ETH
        if (method === 'eth_signTypedData_v4' || method === 'personal_sign') {
          return '0x992b821434316824982348923489234892348923489234892348923489234892348923489234892348923489234892348923489234892348923489234891b';
        }
        return null;
      },
    })({ retryCount: 0 });
  },
  async isAuthorized() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    }
    return false;
  },
  onAccountsChanged() {},
  onChainChanged() {},
  onDisconnect() {},
}));

export const config = createConfig({
  chains: [mainnet, sepolia, base, arbitrum],
  connectors: [
    injected(),
    sandboxConnector,
  ],
  transports: {
    [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    [base.id]: http('https://base-rpc.publicnode.com'),
    [arbitrum.id]: http('https://arbitrum-one-rpc.publicnode.com'),
  },
});
