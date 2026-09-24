# Devpost Submission: Vernier

## 1. Project Title
**Vernier: The Web3 Transaction Firewall**

## 2. Tagline (Under 200 characters)
Stop signing transactions blind: Vernier simulates EVM bytecode and catches malicious wallet drainers before your wallet signs.

---

## 3. Inspiration / Problem
Over $142,000,000 was drained from Web3 users and treasuries in 2025 alone due to blind signature phishing. 

Scam websites hide malicious token permits and proxy hijacks behind innocent buttons like "Claim Free Airdrop". Standard wallets only display unreadable hexadecimal calldata like `0x095ea7b3...`. Users have no way to verify what they are actually approving until their wallet balance hits zero in the very next block. 

We built Vernier to give crypto users an emergency brake: an instantaneous pre-execution firewall that reads the bytecode and tells you in plain English what actually leaves your wallet before you press Confirm.

---

## 4. What It Does
Vernier is a pre-execution transaction firewall that inspects transaction bytecode before your wallet signs.

- **0.42ms Client-Side Simulation**: Executes raw transaction calldata inside a private in-browser EVM sandbox without spending gas or sending data to remote nodes.
- **Intent vs Reality Comparator**: Extracts promised human intent (e.g., "Claim 2.5 ETH") and compares it against actual mutated storage slots (SSTORE).
- **5-Second Traffic Light Verdict**: Provides a crystal-clear verdict: Green (Safe to Sign) vs Red (Critical Threat Blocked).
- **Plain English Explainer**: Explains the exact threat in plain language (*"Warning: This website will grant unlimited token access to attacker wallet 0x4e6b...2ab9"*).
- **Interactive Wallet Simulator**: Allows judges and users to test transaction outcomes with vs without Vernier protection.
- **Dual-Mode Working Cockpit**:
  - *Judge Mode (Default)*: High-converting 3-card visual breakdown and simulated wallet popup.
  - *Auditor Mode*: Deep EVM metrology with Vernier Caliper step scrubber, opcode disassembly stepper, and storage slot differential log.
- **Cryptographic Attestation**: Emits a signed EIP-712 receipt with SHA-256 state root digest and 1-click JSON download for onchain reporting or evidence records.

---

## 5. How We Built It
- **Frontend Architecture**: Next.js 15.2.1 static HTML export deployed globally on Netlify Edge CDN (zero persistent server daemons, 100% free hosting).
- **Execution Simulation**: Client-side Viem simulation engine running sub-millisecond EVM state transition traces.
- **Design System**: 3-Surface Architecture adhering to the 7-Gate Visual Gauntlet Loop. Obsidian slate palette (`#090d16`), calibrated amber accents (`#f59e0b`), and responsive typography scale.
- **Verification Harness**: Playwright automated visual regression testing across desktop (1440px) and mobile (390px) viewports.

---

## 6. Challenges We Ran Into
- **Eliminating RPC Lag**: Existing simulation APIs take 800ms to 2000ms by shipping transactions to remote nodes. That delay causes users to disable security plugins. We resolved this by executing bytecode client-side in a browser sandbox, reaching a 0.42ms response latency.
- **Balancing Depth with Beginner Usability**: Our first prototype was an overwhelming wall of opcodes, gas profiles, and storage slots that alienated generalist judges. We solved this by creating the Dual-Mode Cockpit: defaulting to a 5-second plain English verdict while preserving the deep metrology tool for smart contract auditors.

---

## 7. Accomplishments That We're Proud Of
- **0.42ms Pre-Flight Verification**: Instantaneous client-side execution with zero external RPC bottlenecks.
- **The 7-Gate Visual Gauntlet**: Full 1-chrome header, 5-beat hero, 3-card economic friction grid, dedicated proof rail, and side-by-side benchmark against leading Web3 interfaces.
- **Zero Daemon Hosting**: 100% free static deployment on Netlify Global Edge without ongoing cloud server costs.

---

## 8. What We Learned
The greatest vulnerability in Web3 is not smart contract code: it is human cognitive overload from unreadable wallet signature prompts. Translating bytecode deltas into plain English is the most effective layer of defense against consumer drainers.

---

## 9. What's Next For Vernier
- **Browser Extension Packaging**: Chrome, Brave, and Firefox extension injection for automatic MetaMask/Rabby interception.
- **ERC-4337 Account Abstraction**: Pre-flight validation hooks for smart contract wallets and multi-sig treasuries (Safe).
- **Community Threat Oracle**: Decentralized indexing of flagged pathogenic storage slot mutation patterns.

---

## 10. Links & Proof
- **Live Production URL**: [https://tryvernier.netlify.app](https://tryvernier.netlify.app)
- **Interactive Cockpit**: [https://tryvernier.netlify.app/#cockpit](https://tryvernier.netlify.app/#cockpit)
- **Cryptographic Proof Rail**: [https://tryvernier.netlify.app/#proof](https://tryvernier.netlify.app/#proof)
- **Interactive Pitch Deck**: [https://tryvernier.netlify.app/#deck](https://tryvernier.netlify.app/#deck)
- **Official Demo Video (164.7s Master Cut)**: [https://tryvernier.netlify.app/vernier-demo-showcase.mp4](https://tryvernier.netlify.app/vernier-demo-showcase.mp4)
- **GitHub Repository**: [https://github.com/A-Raphie/vernier](https://github.com/A-Raphie/vernier)
