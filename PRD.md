# Product Requirements Document (PRD): Vernier

## Executive Summary
**Vernier** is an EVM transaction intent firewall and pre-execution simulation sandbox. Like Pierre Vernier's 1631 sliding caliper that enabled microscopic precision between measurement divisions, Vernier simulates contract bytecode, tracks storage slot deltas, and measures state changes down to the single gas unit before a user or autonomous agent signs a transaction.

Built for **3rd-Web-Hack** on Devpost (deadline: Sunday, September 27, 2026 @ 8:00 AM GMT+1).

---

## 1. Problem Statement & Economic Friction
In 2025 alone, over **\$142M** was stolen through phishing drainers exploiting blind EVM contract approvals and obfuscated calldata. Users and autonomous AI agents sign transactions without knowing:
1. Which storage slots are being mutated.
2. Whether an infinite token approval (`type(uint256).max`) is disguised inside a multicall.
3. Whether a malicious `delegatecall` target will overwrite critical proxy state.
4. The exact balance changes that will occur post-execution.

Standard wallet popups only show raw hexadecimal calldata and an estimated gas limit. This leaves users completely vulnerable.

---

## 2. Core Value Proposition & Positioning
> *For Web3 users and autonomous agent operators who face wallet drains and blind contract approvals, Vernier is an EVM pre-execution sandbox and intent firewall that simulates state changes, inspects calldata, and verifies storage deltas down to the gas slot before the transaction can be signed.*

---

## 3. The 3-Surface Architecture
- **Surface 1: High-Authority Front Door**
  - Compact 1-chrome-row header with live EVM network pulse and status chip.
  - 5-beat hero with crisp positioning copy and zero fluff.
  - 3-card economic friction grid (\$142M drained, 0.4ms simulation latency, 100% bytecode coverage).
  - Quick scenario switcher (Permit2 Drain, Malicious Delegatecall, Legitimate Uniswap V3 Swap).
- **Surface 2: Working Cockpit & Vernier Radar**
  - Left Column: Intent Charter (human-readable decoded intent vs raw calldata, contract safety verification, analog-calibrated Security Risk Gauge).
  - Center Stage: EVM State Delta & Storage Slot Vernier Radar (polar coordinate transition radar, graduated metric scale bars, tabular storage slot diffs, gas delta curve, and pathogenic call alert banners).
  - Right Column: Bytecode Simulation Trace with opcode disassembly step-by-step.
- **Surface 3: Cryptographic Proof Rail**
  - SHA-256 State Root cryptographic hash.
  - EIP-712 Intent Signature Attestation (`[VERIFIED]`).
  - Single primary action CTA (`HALT TRANSACTION` for blocked threats; `APPROVE & BROADCAST` for clean calls).
  - Exportable JSON attestation certificate.

---

## 4. Technical Constraints (The Raphie Doctrine)
- **100% Free Hosting:** Static/serverless deployment on Vercel.
- **No Persistent Backend Daemons:** Client-side Viem simulation engine with offline attack benchmarks guarantees zero hosting costs and zero trial expirations during judging.
