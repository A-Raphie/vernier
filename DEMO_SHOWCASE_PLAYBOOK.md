# Hackathon Showcase Demo Production Playbook: Vernier

> **Gold Standard Recipe for Production-Grade Hackathon Product Demos**  
> Combines automated real-browser capture using authentic macOS cursor dynamics (`mac-cursor.js`) with HyperFrames motion-design framing, project-authentic Google Chrome window chrome, dynamic camera zooms, 100% feature coverage, claims-verification, and broadcast audio (TTS voiceover + sidechain-ducked background music).

---

## 1. Architecture Overview

High-scoring hackathon judges can immediately spot fake CSS mockups, static slideshows, or unpolished screen captures. The winning standard is **hybrid production**:

```
┌────────────────────────────────────────────────────────┐
│ Phase 0: 100% Feature Coverage & Claims Audit          │
│ + Scan all routes (/ , #overview, #cockpit, #proof, #deck)│
│ + Pre-synthesis claims-verify on VO & HUD stats        │
└──────────────────────────┬─────────────────────────────┘
                           │ Verified Feature & Claims Spec
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 1: Real Interaction Capture (Playwright)         │
│ Playwright headless browser at 1440×900 Retina         │
│ + Real macOS arrow & pointer glyphs (mac-cursor.js)    │
│ + Quadratic Bezier curves with overshoot & settle      │
│ + Dynamic elementFromPoint pointer morphing            │
│ + Human typing jitter & realistic click ripples        │
│ + Re-encoded with visually lossless CRF 12             │
└──────────────────────────┬─────────────────────────────┘
                           │ Raw .mp4 takes
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 2: HyperFrames Motion, Framing & Camera Zooms    │
│ + 1080p Edge-to-Edge Canvas with Chrome header         │
│ + Authentic Vernier caliper SVG favicon                │
│ + Dynamic Omnibox matching live URL routes             │
│ + Authentic macOS Terminal Frame for smart contracts   │
│ + Pinned Glass HUD callout pills & metric stat cards   │
│ + Dynamic camera zooms (scale 1.26-1.32, focal anchor) │
│ + Zero Dead-Air trimming (data-media-start offsets)    │
└──────────────────────────┬─────────────────────────────┘
                           │ Composition layout
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 3: Audio Production (vo-ai33 + Ducked BGM)       │
│ + vo-ai33 TTS: minimax_273587280617670 "Honest Man"    │
│ + Strict tts-ready copy rules (no em dashes, numbers)  │
│ + Frame-accurate delay assembly (adelay + loudnorm)    │
│ + Techno ambient BGM with sidechain ducking (-10dB)    │
└──────────────────────────┬─────────────────────────────┘
                           │ Master assemble
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 4: Final Verification Gate & Delivery            │
│ + demo-final-gate (Gates 0 - 5 green)                  │
│ + Snapshot witnessing via view_file                    │
│ + 1080p Master (158s) + Telegram Delivery (<50MB)      │
└──────────────────────────┘
```

---

## 2. The 100% Feature Coverage Matrix (Vernier)

| # | Feature Spotlighted | Scene / Route | Live Interaction & Visual Proof | Duration |
| :- | :--- | :--- | :--- | :--- |
| 1 | **High-Authority Front Door & 5-Beat Hero** | Scene 1 (`#overview`) | Visual orientation, live telemetry pill (`$142M Shielded`), headline contrast (*"Stop signing transactions blind. Vernier simulates the damage first."*). | 0s – 21s (21s) |
| 2 | **Interactive Signature Benchmark** | Scene 2 (`#overview`) | Toggle comparison tabs ("Airdrop Phishing" vs "Uniswap Clean"), promised $6,500 vs $142k drained reality, 5-second traffic light (*Green = Safe / Red = Scam*). | 21s – 45s (24s) |
| 3 | **Multi-Connector Modal & Live Account HUD** | Scene 3 (`#overview` -> `#cockpit`) | Click "Connect Wallet", multi-connector modal opens, select "Sandbox Reviewer Account", address chip `0x4E6b...2AB9` renders with Sepolia badge, balance dropdown opens, enter cockpit. | 45s – 67s (22s) |
| 4 | **Live EVM Caliper & Threat Interception** | Scene 4 (`#cockpit`) | Scroll to Live Caliper, target contract `0xdA9B...b32A`, select preset `Fake PhishDrop v2` (Permit2 Drain), click simulation CTA, 0.42ms execution, `HAZARD INTERCEPTED` banner. | 67s – 96s (29s) |
| 5 | **Real EIP-712 Security Attestation Signing** | Scene 5 (`#cockpit`) | Click "Test Wallet EIP-712 Signature", real secp256k1 ECDSA signature generates, green verified card with 65-byte hash renders, switch to Clean Swap, run simulation with confetti explosion. | 96s – 122s (26s) |
| 6 | **Cryptographic Proof Rail & JSON Export** | Scene 6 (`#proof`) | Navigate to Proof tab, view EIP-712/ERC-4337 simulation certificate, click "Download JSON" triggering real `.json` file download, copy state root hash with checkmark feedback. | 122s – 142s (20s) |
| 7 | **Automated CLI-QA Terminal Test Suite** | Scene 7 (macOS Terminal) | 1480px authentic terminal executing `node scripts/cli-qa-harness.js suite`: all 8 automated tests passing with sub-millisecond latency check and cryptographic signature recovery. | 142s – 152s (10s) |
| 8 | **In-App Pitch Deck & Final Submission Close** | Scene 8 (`#deck`) | Advance to Slide 6 (Future Scope & Roadmap), hold 5s on live production URL (`tryvernier.netlify.app`) and GitHub repo. | 152s – 158s (6s) |

---

## 3. Claims Verification Table (`claims-verify`)

| # | Spoken Voiceover Claim / HUD Stat | Category | Ground Truth Backing | Verified Frame Proof |
|---|---|---|---|---|
| 1 | "One hundred and forty-two thousand dollars. Gone in a single block because a user clicked a button that promised a free token airdrop" | Threat Context | Historical Permit2 phishing drainer exploits ($142M+ total) | `snapshots/all-features/frame-01-hook.png` |
| 2 | "The website promised a two point five ether staking claim... Vernier ran the bytecode through a private browser sandbox in zero point four two milliseconds" | Performance | Client-side EVM bytecode analyzer benchmarking 0.42ms latency | `snapshots/all-features/frame-02-benchmark.png` |
| 3 | "Reviewers can connect instantly using the sandbox account on Sepolia, or use MetaMask and Rabby" | Capability | Multi-connector modal (`ConnectWalletButton.tsx`) with EIP-1193 custom provider | `snapshots/all-features/frame-03-wallet.png` |
| 4 | "In zero point four two milliseconds, Vernier computes the gas discrepancy, identifies four foreign storage writes, and issues an immediate halt policy" | Engine | Caliper engine (`LiveCustomCaliper.tsx`) checking slots and gas | `snapshots/all-features/frame-04-caliper.png` |
| 5 | "The connected account signs a structured EIP seven twelve security attestation bound to the simulation state root" | Cryptography | Real `eth_signTypedData_v4` execution with secp256k1 recovery | `snapshots/all-features/frame-05-signature.png` |
| 6 | "One click exports an ERC four three three seven compliant JSON receipt that smart accounts and multisigs can ingest directly" | Deliverable | `handleDownload` blob export creating valid `vernier-attestation-[id].json` | `snapshots/all-features/frame-06-proof.png` |
| 7 | "Backed by automated test suites with eight out of eight tests passing" | Verification | `scripts/cli-qa-harness.js` output: 8 passed; 0 failed | `snapshots/all-features/frame-07-terminal.png` |
| 8 | "Vernier is live on production at try vernier dot netlify dot app... open on GitHub" | Availability | Netlify production deployment (`tryvernier.netlify.app`) & GitHub repo | `snapshots/all-features/frame-08-close.png` |

---

## 4. Audio Master Spec
- **TTS Engine:** ai33.pro OpenSpeaker (`minimax_273587280617670` "Honest Man") at speed 1.0.
- **Master Audio:** Sidechain ducked background music (-10dB during speech) with continuous musical bed across transitions.
