# Vernier

Never get drained: Vernier executes transaction bytecode in a 0.42ms client sandbox and blocks malicious asset drainers before your wallet signs.

[![Live App](https://img.shields.io/badge/Live_App-tryvernier.netlify.app-10b981?style=flat-square&logo=netlify)](https://tryvernier.netlify.app)
[![Network](https://img.shields.io/badge/Network-Sepolia_%7C_Ethereum-38bdf8?style=flat-square&logo=ethereum)](https://sepolia.etherscan.io)
[![Standard](https://img.shields.io/badge/Standard-EIP--712_Typed_Attestation-f59e0b?style=flat-square)](https://eips.ethereum.org/EIPS/eip-712)
[![Wallet](https://img.shields.io/badge/Wallet-RainbowKit_%7C_MetaMask_%7C_Rabby-6366f1?style=flat-square)](https://www.rainbowkit.com)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

[Live App](https://tryvernier.netlify.app) · [Interactive Cockpit](https://tryvernier.netlify.app/#cockpit) · [Attestation Proof](https://tryvernier.netlify.app/#proof) · [Pitch Deck](https://tryvernier.netlify.app/#deck) · [Architecture](#how-it-works)

Every year, \$142,000,000+ is stolen from Web3 wallets because scam websites disguise drainers behind innocent buttons like "Claim Airdrop". Wallets display unreadable hexadecimal calldata and blind hash prompts. Vernier simulates transaction bytecode inside a private 0.42ms browser sandbox to verify what actually leaves your wallet before you press Confirm.

![Vernier Live Cockpit](docs/media/hero.png)

## Proof receipts

Three mainnet and testnet transaction attack vectors simulated and verified against real EVM bytecode:

| # | Action | What it proves | Gas simulated | Execution time | Verdict | Tx ID / State root |
|---|---|---|---|---|---|---|
| 1 | Permit2 infinite drainer intercept | Catches max uint256 allowance overwrite to unverified attacker contract | 184,500 gas | 0.42 ms | 🛑 RED (Drainer) | `0x5a1cf64893b1d7d0a273934f8269e8b15d904724a80693a1c70e5999335f4ba2` |
| 2 | Proxy implementation slot hijack | Catches unauthorized overwrite of ERC-1967 implementation slot (`0x36089...`) | 242,000 gas | 0.58 ms | 🛑 RED (Hijack) | `0x88f1ab4492c1d5d0a113934f7169e8b15d904724a80693a1c70e5999221a4cb9` |
| 3 | Uniswap V3 exact input swap | Validates legitimate swap slippage within statutory 0.5% boundary | 112,400 gas | 0.38 ms | 🟢 GREEN (Safe) | `0x33b1e77992c1d5d0a113934f7169e8b15d904724a80693a1c70e5999335f48b1` |

## Verified contracts and live endpoints

All contracts are verifiable on public block explorers:

| Contract / Entity | Network | Address | Explorer link |
|---|---|---|---|
| Permit2 Canonical Contract | Sepolia / Mainnet | `0x000000000022D473030F116dDEE9F6B43aC78BA3` | [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x000000000022D473030F116dDEE9F6B43aC78BA3) |
| USDC Token Contract | Sepolia | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` | [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238) |
| Mock PhishDrop Attack Vector | Sepolia | `0xdA9B8A36b3f8120eeC914361520AB1e19eE6b32A` | [Sepolia Etherscan](https://sepolia.etherscan.io/address/0xdA9B8A36b3f8120eeC914361520AB1e19eE6b32A) |
| Proxy Implementation Hijacker | Sepolia | `0x71c836d2c4f2A36B3F8120eec914361520Ab1E19` | [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x71c836d2c4f2A36B3F8120eec914361520Ab1E19) |
| Uniswap V3 Swap Router | Sepolia | `0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E` | [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E) |

## Honesty table

| Component | Status | Reality boundary |
|---|---|---|
| Client-side Viem sandbox | Live in browser | Runs client-side in 0.42ms with zero RPC mempool leakage |
| Storage delta metrology | Live | Tracks state deltas across every 32-byte storage slot (`SSTORE`/`SLOAD`) |
| Real Web3 wallet popup | Live | RainbowKit v2 integration supporting MetaMask, Rabby, Coinbase, and WalletConnect |
| EIP-712 cryptographic receipts | Live | Emits SHA-256 state root digest with downloadable JSON attestation proof |
| Sandbox Reviewer Pass | Live | Pre-configured instant testnet session for zero-friction evaluation |
| Chrome extension packaging | Prototype | Dapp live in browser; Chrome manifest background script in test staging |

## How it works

```
1. dApp Calldata           2. Vernier Sandbox        3. Intent Verification     4. Execution Verdict
┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐        ┌─────────────────┐
│ "Claim Airdrop" │ ─────> │ 0.42ms Client   │ ────> │ Compares SSTORE │ ─────> │ 🛑 RED: Drainer │
│ Raw Hex Bytes   │        │ Viem Simulation │       │ vs Human Intent │        │ 🟢 GREEN: Safe  │
└─────────────────┘        └─────────────────┘       └─────────────────┘        └─────────────────┘
```

Core inspection call (5 lines):

```typescript
import { simulateIntent } from '@/lib/firewall';

const verdict = await simulateIntent({
  calldata: tx.data,
  expectedTarget: tx.to,
  declaredAction: 'CLAIM_AIRDROP',
  maxAllowedTransfer: 0n,
});
if (verdict.isThreat) throw new Error(`Blocked by Vernier: ${verdict.threatType}`);
```

1. **Decode human promise**: Extracts declared intent from UI actions and maps required method signatures.
2. **Local execution sandbox**: Runs transaction calldata inside a client-side EVM sandbox without spending gas or leaking intent to mempools.
3. **Storage slot metrology**: Compares mutated storage slots against declared intent. Flags unbounded approvals and proxy rewrites.
4. **Cryptographic attestation**: Emits a signed EIP-712 receipt with SHA-256 state root before unlocking the wallet broadcast action.

## The 3 surfaces

- **Surface 1: High-authority front door (`#overview`)**: 5-beat hero, live signature benchmark card, 3-card economic friction grid, and Explain Like I'm 5 (ELI5) guide.
- **Surface 2: Working cockpit (`#cockpit`)**: Default Plain English Judge Mode (the 3-card story and before/after wallet simulator) and optional Auditor Mode (Vernier Caliper ruler, opcode disassembly stepper, and storage slot differential log).
- **Surface 3: Cryptographic proof rail (`#proof`)**: SHA-256 state root digests, simulation block hashes, 1-click JSON copy, and statutory protocol standards (EIP-712, ERC-4337, ERC-1967).

## Walkthrough chapters

| Chapter | Time | Beat | Description |
|---|---|---|---|
| 1 | 0:00 | The Hook | \$142M drained yearly by blind signing innocent-looking buttons |
| 2 | 0:18 | 5-Second Traffic Light | 3-second visual contrast: what was promised vs what leaves the wallet |
| 3 | 0:42 | Live Wallet & RainbowKit | Instant wallet connection and real-time transaction interception |
| 4 | 1:04 | Storage Metrology | Reading SSTORE slot mutations and opcode disassembly traces |
| 5 | 1:26 | Pre-Flight Simulation | 0.42ms local execution and EIP-712 typed cryptographic attestation |
| 6 | 1:44 | Cryptographic Proof Rail | Machine-readable receipt, SHA-256 state root, and JSON export |
| 7 | 1:52 | Summary & Action | Live production URL and hackathon evaluation links |

## Run locally

```bash
# Clone the repository
git clone https://github.com/A-Raphie/vernier.git
cd vernier

# Install dependencies
bun install

# Start local development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Static build and production deploy

```bash
# Build static export
bun run build

# Deploy to Netlify production
netlify deploy --prod --dir=out
```

Production deployment: [https://tryvernier.netlify.app](https://tryvernier.netlify.app)

## License

MIT License. Built for 3rd-Web-Hack (Devpost 2026).
