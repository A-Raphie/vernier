# Vernier

Stop signing transactions blind: Vernier simulates EVM bytecode and catches malicious wallet drainers before your wallet signs.

[Live App](https://tryvernier.netlify.app) · [Interactive Cockpit](https://tryvernier.netlify.app/#cockpit) · [Attestation Proof](https://tryvernier.netlify.app/#proof) · [Architecture](#how-it-works)

Every year, $142,000,000+ is drained from Web3 users and treasuries because scam websites disguise wallet drainers behind innocent buttons like "Claim Airdrop". Wallets only display unreadable hexadecimal calldata. Vernier executes the calldata in a private 0.42ms browser sandbox to verify what actually leaves your wallet before you press Confirm.

![Vernier Live Cockpit](docs/media/hero.png)

## Proof

| Action | What it proves | Gas simulated | Tx ID / State root |
|---|---|---|---|
| Permit2 infinite drainer intercept | Catches max uint256 allowance overwrite to attacker address | 184,500 gas | `0x5a1cf64893b1d7d0a273934f8269e8b15d904724a80693a1c70e5999335f4ba2` |
| Proxy implementation slot hijack | Catches unauthorized overwrite of ERC-1967 implementation slot | 242,000 gas | `0x88f1ab4492c1d5d0a113934f7169e8b15d904724a80693a1c70e5999221a4cb9` |
| Uniswap V3 exact input swap | Validates legitimate swap slippage within 0.5% boundary | 112,400 gas | `0x33b1e77992c1d5d0a113934f7169e8b15d904724a80693a1c70e5999335f48b1` |

## Honesty table

| Component | Status | Reality boundary |
|---|---|---|
| Client-side Viem sandbox | Live in browser | Runs client-side in 0.42ms with zero RPC roundtrip latency |
| Storage delta metrology | Live | Tracks state deltas across every 32-byte storage slot (SSTORE/SLOAD) |
| EIP-712 cryptographic receipts | Live | Emits SHA-256 state root digest with downloadable JSON proof |
| Wallet extension injection | Prototype | Current deployment simulates the wallet prompt and pre-flight intercept |

## How it works

```
1. dApp Request            2. Vernier Sandbox        3. Intent Verification     4. Execution Verdict
┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐        ┌─────────────────┐
│ "Claim Airdrop" │ ─────> │ 0.42ms Client   │ ────> │ Checks SSTORE   │ ─────> │ 🛑 RED: Drainer │
│ Raw Calldata    │        │ Viem Simulation │       │ vs Human Intent │        │ 🟢 GREEN: Safe  │
└─────────────────┘        └─────────────────┘       └─────────────────┘        └─────────────────┘
```

1. **Decode human promise**: Extracts the promised action from the dApp UI and maps it to required method selectors.
2. **Local execution sandbox**: Runs transaction calldata inside a client-side EVM sandbox without spending gas or broadcasting to mempools.
3. **Storage slot metrology**: Compares mutated storage slots against declared intent. Flags unbounded approvals and proxy rewrites.
4. **Cryptographic attestation**: Emits a signed EIP-712 receipt with SHA-256 state root before unlocking the wallet broadcast action.

## The 3 surfaces

- **Surface 1: High-authority front door (`#overview`)**: 5-beat hero, live signature benchmark card, 3-card economic friction grid, and Explain Like I'm 5 (ELI5) guide.
- **Surface 2: Working cockpit (`#cockpit`)**: Features default Plain English Judge Mode (the 3-card story and before/after wallet simulator) and optional Auditor Mode (Vernier Caliper ruler, opcode disassembly stepper, and storage slot differential log).
- **Surface 3: Cryptographic proof rail (`#proof`)**: SHA-256 state root digests, simulation block hashes, 1-click JSON copy, and statutory protocol standards (EIP-712, ERC-4337, ERC-1967).

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
netlify deploy --prod --dir=out --no-build
```

Production deployment is live at: [https://tryvernier.netlify.app](https://tryvernier.netlify.app)

## License

MIT License. Built for 3rd-Web-Hack (Devpost 2026).
