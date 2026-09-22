# Task Breakdown: Vernier

## Phase 1: Environment & Project Scaffolding
- [x] Initialize Next.js app with TypeScript and Tailwind CSS in `/Users/raphie/Documents/Hackathons/vernier`.
- [x] Configure Swiss Metrology design tokens (`#090d16` obsidian, `#1e293b` slate border, `#f59e0b` amber, `#06b6d4` cyan).
- [x] Install dependencies (`lucide-react`, `viem`, `clsx`, `tailwind-merge`).

## Phase 2: Engine & Threat Benchmark Datasets
- [x] Implement simulation engine and storage delta data models in `src/lib/types.ts`.
- [x] Implement realistic pre-configured attack vectors in `src/data/attack-vectors.ts` (Permit2 Drain, Proxy Slot Hijack, Uniswap V3 Swap).
- [x] Add plain-English human translation fields (`scamPromise`, `actualAction`, `victimLoss`, `assetsProtected`) for judge orientation.

## Phase 3: Surface 1: High-Authority Front Door
- [x] Implement `src/components/navigation/ChromeHeader.tsx` (1-chrome-row header with 3 clean clusters: Brand, Tabs, Provenance pill + CTA).
- [x] Implement `src/components/surfaces/Surface1FrontDoor.tsx` (5-beat hero, live signature card, 3-card economic friction grid, and Explain Like I'm 5 guide).
- [x] Single primary CTA rule enforced with zero secondary status ribbons.

## Phase 4: Surface 2: Working Cockpit & Dual-Mode System
- [x] Implement `src/components/surfaces/Surface2Cockpit.tsx` with top-level View Mode Switcher.
- [x] Implement `src/components/console/JudgeHumanMode.tsx` (Default: 30s judge orientation, 3-card anatomy, interactive before/after wallet simulator, and core benchmarks).
- [x] Implement Auditor Mode tools: `IntentCharter`, `VernierRadar` with interactive Vernier Caliper step scrubber, `BytecodeTrace`, and `ReceiptRail`.

## Phase 5: Surface 3: Cryptographic Proof Rail
- [x] Implement `src/components/surfaces/Surface3ProofRail.tsx` (SHA-256 state root, simulation block hash, full EIP-712 signed payload, 1-click JSON copy, and statutory protocol standards).

## Phase 6: The Simple Ideology Encoding
- [x] Encode Rule 7 (The Simple Ideology) into Global Agent Rules (`~/.gemini/config/plugins/raphie-kit/rules/AGENTS.md`).
- [x] Encode Rule 5 into project-level `vernier/AGENTS.md`.
- [x] Ground marketing in visceral human copy: *"Stop signing transactions blind. Vernier simulates the damage first."*

## Phase 7: Netlify Global Edge Deployment
- [x] Configure `next.config.mjs` with `output: 'export'` and `trailingSlash: true`.
- [x] Configure `netlify.toml` with publish directory `out`.
- [x] Deploy to Netlify production at `https://tryvernier.netlify.app` with zero persistent daemon costs.
- [x] Verify live HTTP 200 and test hash-routing (`#overview`, `#cockpit`, `#proof`).

## Phase 8: Documentation & Hackathon Packaging
- [x] Write `README.md` following the strict `readme` skill standard (0 em-dashes, real proof table, live links).
- [x] Write `SUBMISSION.md` for Devpost 3rd-Web-Hack entry form.
- [x] Capture live desktop and mobile verification screenshots.
