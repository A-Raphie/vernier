# Task Breakdown: Vernier

## Phase 1: Environment & Project Scaffolding
- [ ] Initialize Next.js 16 app with TypeScript and TailwindCSS v4 in `/Users/raphie/Documents/Hackathons/vernier`.
- [ ] Configure `src/app/globals.css` with Swiss Metrology design tokens and typography.
- [ ] Install dependencies (`lucide-react`, `viem`, `clsx`, `tailwind-merge`, `canvas-confetti`).

## Phase 2: Engine & Threat Benchmark Datasets
- [ ] Implement `src/lib/simulation-engine.ts` (calldata decoder, state transition simulator, storage delta calculator).
- [ ] Implement `src/lib/threat-detector.ts` (Permit2 drain heuristic, unbounded allowance flag, delegatecall hazard check).
- [ ] Implement `src/data/attack-vectors.ts` (3 realistic pre-configured scenarios: Permit2 Drain, Malicious Delegatecall, Legitimate Uniswap V3 Swap).

## Phase 3: Surface 1 — High-Authority Front Door
- [ ] Implement `src/components/frontdoor/Header.tsx` (1-chrome-row header with caliper mark, live EVM block pulse, status pill).
- [ ] Implement `src/components/frontdoor/Hero.tsx` (5-beat hero with crisp positioning copy and scenario selector).
- [ ] Implement `src/components/frontdoor/EconomicGrid.tsx` (3-card economic friction metrics: \$142M lost, 0.4ms latency, 100% coverage).

## Phase 4: Surface 2 — Working Cockpit & Vernier Radar
- [ ] Implement `src/components/console/IntentCharter.tsx` (human-readable intent vs raw calldata, contract safety verification).
- [ ] Implement `src/components/console/RiskGauge.tsx` (analog-calibrated SVG meter with amber/crimson/emerald threat level).
- [ ] Implement `src/components/console/VernierRadar.tsx` (interactive sliding caliper radar, storage slot shifts, gas delta graph, alert banner).
- [ ] Implement `src/components/console/BytecodeTrace.tsx` (opcode step-by-step disassembly stream with highlighted blocked call).

## Phase 5: Surface 3 — Cryptographic Proof Rail
- [ ] Implement `src/components/proof/ReceiptRail.tsx` (SHA-256 state root, EIP-712 attestation, primary CTA `HALT TRANSACTION` / `APPROVE & BROADCAST`).
- [ ] Implement exportable JSON proof modal.

## Phase 6: Visual Gauntlet Verification & Verification Loop
- [ ] Run zero-error clean build (`bun run build` / `npm run build`).
- [ ] Launch local server and test via Chrome DevTools MCP.
- [ ] Capture high-res desktop & mobile screenshots.
- [ ] Run 7-Gate Visual Gauntlet comparison against winsznx reference index.
