const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { injectCursor, moveCursor, clickCursor } = require('./mac-cursor');

const OUTPUT_DIR = path.resolve(__dirname, '../videos/vernier-showcase/media');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Point directly to live production deployment
const TARGET_URL = 'https://tryvernier.netlify.app';

async function recordSceneClean(name, targetDurationSec, options, setupFn, actionFn) {
  if (typeof options === 'function') {
    actionFn = setupFn;
    setupFn = options;
    options = {};
  }

  console.log(`\n========================================`);
  console.log(`🎬 Recording Synced Scene: ${name} (Target: ${targetDurationSec.toFixed(1)}s)...`);
  console.log(`========================================`);
  const sceneDir = path.join(OUTPUT_DIR, `raw-${name}`);
  if (!fs.existsSync(sceneDir)) fs.mkdirSync(sceneDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: sceneDir,
      size: { width: 1440, height: 900 }
    }
  });

  if (options.clearStorage) {
    await context.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  if (options.initStorage) {
    await context.addInitScript((storage) => {
      for (const [k, v] of Object.entries(storage)) {
        localStorage.setItem(k, v);
      }
    }, options.initStorage);
  }

  const page = await context.newPage();
  const videoCreationTime = Date.now();

  try {
    // 1. SETUP: Navigate, scroll, or switch tabs
    await setupFn(page);
    // Inject clean custom cursor
    await injectCursor(page);
    // Allow rendering to settle into a static, clean frame
    await page.waitForTimeout(600);

    const actionStartTime = Date.now();
    const trimOffsetSec = (actionStartTime - videoCreationTime) / 1000;
    console.log(`[${name}] Setup complete in ${trimOffsetSec.toFixed(2)}s. Commencing choreographed actions...`);

    // 2. ACTION: Run beat-synced cursor movements and clicks
    await actionFn(page);

    // Ensure we hold final frame to strictly meet targetDurationSec + 0.5s padding
    const actionElapsedSec = (Date.now() - actionStartTime) / 1000;
    const remainingSec = targetDurationSec - actionElapsedSec + 0.5;
    if (remainingSec > 0) {
      console.log(`[${name}] Holding final frame for ${remainingSec.toFixed(2)}s to complete duration...`);
      await page.waitForTimeout(remainingSec * 1000);
    }
    console.log(`[${name}] Actions completed.`);

    await context.close();
    await browser.close();

    // 3. PRECISION TRIM
    const files = fs.readdirSync(sceneDir).filter(f => f.endsWith('.webm'));
    if (files.length === 0) throw new Error(`No webm video recorded for ${name}`);
    
    files.sort((a, b) => fs.statSync(path.join(sceneDir, b)).mtimeMs - fs.statSync(path.join(sceneDir, a)).mtimeMs);
    const rawWebm = path.join(sceneDir, files[0]);
    const finalMp4 = path.join(OUTPUT_DIR, `clean-${name}.mp4`);

    console.log(`[${name}] Trimming from ${trimOffsetSec.toFixed(2)}s for duration ${targetDurationSec.toFixed(2)}s (CRF 15)...`);
    execSync(`ffmpeg -y -ss ${trimOffsetSec} -i "${rawWebm}" -t ${targetDurationSec} -c:v libx264 -pix_fmt yuv420p -crf 15 -preset medium -r 30 "${finalMp4}"`, { stdio: 'ignore' });

    // 4. VERIFY FRAME 0
    const frame0Check = path.join(OUTPUT_DIR, `check-${name}-frame0.png`);
    execSync(`ffmpeg -y -ss 0 -i "${finalMp4}" -vframes 1 "${frame0Check}"`, { stdio: 'ignore' });
    const frame0Size = fs.statSync(frame0Check).size;
    console.log(`✅ [${name}] Saved ${finalMp4} | Frame 0 size: ${frame0Size} bytes`);
    if (frame0Size < 20000) {
      console.warn(`⚠️ WARNING: [${name}] Frame 0 size is unusually small (${frame0Size} bytes), may be blank!`);
    }

    fs.rmSync(sceneDir, { recursive: true, force: true });
    if (fs.existsSync(frame0Check)) fs.unlinkSync(frame0Check);
  } catch (err) {
    console.error(`Error in scene ${name}:`, err);
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
    throw err;
  }
}

async function runAll() {
  const scenesToRun = process.argv[2] ? process.argv[2].split(',') : ['1', '2', '3', '4', '5', '6', '7'];
  console.log(`Running scenes: ${scenesToRun.join(', ')}`);

  // ── SCENE 1: Hook & Front Door (0.0s – 24.0s, duration 24.0s) ──
  if (scenesToRun.includes('1')) {
    await recordSceneClean(
      'scene1',
      24.0,
      {},
      async (page) => {
        await page.goto(`${TARGET_URL}/#overview`, { waitUntil: 'networkidle' });
        await page.evaluate(() => window.scrollTo(0, 0));
      },
      async (page) => {
        // 0s - 4.5s: Steady hero view on problem headline
        await moveCursor(page, 720, 220, { steps: 12 });
        await page.waitForTimeout(4000);

        // 4.5s - 9.5s: Moves to hero description over "Claim Airdrop"
        await moveCursor(page, 520, 480, { steps: 20 });
        await page.waitForTimeout(4500);

        // 9.5s - 15.5s: Sweeps header live telemetry badge
        await moveCursor(page, 1140, 30, { steps: 22 });
        await page.waitForTimeout(4500);

        // 15.5s - 24.0s: Glides to "OPEN WORKING COCKPIT" and scrolls
        await moveCursor(page, 390, 560, { steps: 20 });
        await page.waitForTimeout(1500);
        await page.evaluate(() => window.scrollBy({ top: 320, behavior: 'smooth' }));
        await page.waitForTimeout(6500);
      }
    );
  }

  // ── SCENE 2: Benchmark Contrast (24.0s – 49.8s, duration 25.8s) ──
  if (scenesToRun.includes('2')) {
    await recordSceneClean(
      'scene2',
      25.8,
      {},
      async (page) => {
        await page.goto(`${TARGET_URL}/#overview`, { waitUntil: 'networkidle' });
        // Scroll directly so benchmark card is centered — NO hero flash!
        await page.evaluate(() => window.scrollTo(0, 560));
      },
      async (page) => {
        // 0s - 7.0s (24.0s - 31.0s): Hover "Airdrop Phishing" tab
        await moveCursor(page, 480, 270, { steps: 16 });
        await page.waitForTimeout(6500);

        // 7.0s - 14.0s (31.0s - 38.0s): Highlight "1. PROMISED BY WEBSITE: Claim 2.5 ETH"
        await moveCursor(page, 380, 360, { steps: 16 });
        await page.waitForTimeout(6500);

        // 14.0s - 19.5s (38.0s - 43.5s): Move to "2. VERNIER FIREWALL VERDICT: CRITICAL THREAT BLOCKED"
        await moveCursor(page, 620, 360, { steps: 16 });
        await page.waitForTimeout(4500);

        // 19.5s - 25.8s (43.5s - 49.8s): CLICK "Uniswap Clean" exactly at 19.5s!
        const cleanTab = page.locator('button:has-text("Uniswap Clean")').first();
        await clickCursor(page, cleanTab, { steps: 14 });
        await page.waitForTimeout(1500);

        // Hover verified safe status
        await moveCursor(page, 620, 360, { steps: 14 });
        await page.waitForTimeout(4500);
      }
    );
  }

  // ── SCENE 3: Connect Wallet & Cockpit Entrance (49.8s – 73.4s, duration 23.6s) ──
  if (scenesToRun.includes('3')) {
    await recordSceneClean(
      'scene3',
      23.6,
      { clearStorage: true },
      async (page) => {
        await page.goto(`${TARGET_URL}/#overview`, { waitUntil: 'networkidle' });
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
          window.scrollTo(0, 0);
        });
        await page.locator('button:has-text("Connect Wallet")').first().waitFor({ state: 'visible', timeout: 5000 });
      },
      async (page) => {
        // 0s - 1.7s (49.8s - 51.5s): Move to "Connect Wallet"
        const connectBtn = page.locator('button:has-text("Connect Wallet")').first();
        await clickCursor(page, connectBtn, { steps: 16 }); // Clicks at ~1.7s!
        await page.waitForTimeout(1500);

        // 1.7s - 6.7s (51.5s - 56.5s): Hover in modal over options
        await moveCursor(page, 720, 410, { steps: 16 });
        await page.waitForTimeout(2800);

        // 6.7s (56.5s): Click "Sandbox Reviewer Account"
        const sandboxBtn = page.locator('button:has-text("Sandbox Reviewer Account")').first();
        await clickCursor(page, sandboxBtn, { steps: 14 }); // Clicks at 6.7s!
        await page.waitForTimeout(3500);

        // 12.7s (62.5s): Click account chip to open dropdown
        const accountChip = page.locator('button:has-text("0x4E6b")').first();
        await clickCursor(page, accountChip, { steps: 14 }); // Clicks at ~12.7s!
        await page.waitForTimeout(1500);

        // 14.7s (64.5s): Copy address in dropdown
        const copyAddrBtn = page.locator('button[title="Copy full address"]').first();
        if (await copyAddrBtn.count() > 0) {
          await clickCursor(page, copyAddrBtn, { steps: 12 });
          await page.waitForTimeout(1000);
        }

        // Close dropdown
        await clickCursor(page, page.locator('header').first(), { steps: 10 });
        await page.waitForTimeout(1200);

        // 19.7s (69.5s): Click "OPEN WORKING COCKPIT"
        const cockpitBtn = page.locator('button:has-text("OPEN WORKING COCKPIT")').first();
        await clickCursor(page, cockpitBtn, { steps: 16 }); // Clicks at ~19.7s!
        await page.waitForTimeout(3500);
      }
    );
  }

  // ── SCENE 4: Working Cockpit & Live EVM Caliper (73.4s – 103.9s, duration 30.5s) ──
  if (scenesToRun.includes('4')) {
    await recordSceneClean(
      'scene4',
      30.5,
      { initStorage: { vernier_sandbox_connected: 'true' } },
      async (page) => {
        // Direct mount into Cockpit surface with connected wallet
        await page.goto(`${TARGET_URL}/#overview`, { waitUntil: 'networkidle' });
        const cockpitNav = page.locator('button:has-text("Cockpit")').first();
        await cockpitNav.click();
        await page.locator('button:has-text("Live Caliper")').first().waitFor({ state: 'visible', timeout: 5000 });
      },
      async (page) => {
        // 0s - 7.1s (73.4s - 80.5s): Sweep cockpit header & telemetry
        await moveCursor(page, 720, 180, { steps: 20 });
        await page.waitForTimeout(6000);

        // 7.1s (80.5s): Click "Live Caliper" tab in cockpit bar
        const liveCaliperTab = page.locator('button:has-text("Live Caliper")').first();
        await clickCursor(page, liveCaliperTab, { steps: 14 }); // Clicks at 7.1s!
        await page.waitForTimeout(2000);

        // 7.1s - 14.1s: Move to Attack Scenarios
        await moveCursor(page, 450, 420, { steps: 16 });
        await page.waitForTimeout(4000);

        // 14.1s (87.5s): Click preset "Fake PhishDrop v2"
        const presetBtn = page.locator('button:has-text("Fake PhishDrop v2")').first();
        await clickCursor(page, presetBtn, { steps: 14 }); // Clicks at ~14.1s!
        await page.waitForTimeout(4500);

        // 20.6s (94.0s): Click "RUN LIVE EVM PRE-EXECUTION SIMULATION"
        const runBtn = page.locator('button:has-text("RUN LIVE EVM PRE-EXECUTION SIMULATION"), button:has-text("Executing Caliper Simulation")').first();
        await clickCursor(page, runBtn, { steps: 14 }); // Clicks at ~20.6s!
        await page.waitForTimeout(2000);

        // 22.6s - 30.5s (96.0s - 103.9s): Highlight HAZARD INTERCEPTED & +310% Gas Delta
        await moveCursor(page, 950, 420, { steps: 18 });
        await page.waitForTimeout(2500);
        await moveCursor(page, 890, 520, { steps: 16 });
        await page.waitForTimeout(5000);
      }
    );
  }

  // ── SCENE 5: EIP-712 Signing & Clean Swap (103.9s – 131.7s, duration 27.8s) ──
  if (scenesToRun.includes('5')) {
    await recordSceneClean(
      'scene5',
      27.8,
      { initStorage: { vernier_sandbox_connected: 'true' } },
      async (page) => {
        // Direct mount into Cockpit -> Live Caliper with simulation already triggered
        await page.goto(`${TARGET_URL}/#overview`, { waitUntil: 'networkidle' });
        const cockpitNav = page.locator('button:has-text("Cockpit")').first();
        await cockpitNav.click();
        await page.locator('button:has-text("Live Caliper")').first().waitFor({ state: 'visible', timeout: 5000 });
        const liveCaliperTab = page.locator('button:has-text("Live Caliper")').first();
        await liveCaliperTab.click();
        await page.waitForTimeout(300);
        const presetBtn = page.locator('button:has-text("Fake PhishDrop v2")').first();
        await presetBtn.click();
        await page.waitForTimeout(300);
        const runBtn = page.locator('button:has-text("RUN LIVE EVM PRE-EXECUTION SIMULATION")').first();
        await runBtn.click();
        await page.locator('button:has-text("Test Wallet EIP-712 Signature")').first().waitFor({ state: 'visible', timeout: 5000 });
      },
      async (page) => {
        // 0s - 6.1s (103.9s - 110.0s): Move to "Test Wallet EIP-712 Signature"
        await moveCursor(page, 780, 850, { steps: 18 });
        await page.waitForTimeout(4500);

        // 6.1s (110.0s): Click "Test Wallet EIP-712 Signature"
        const signBtn = page.locator('button:has-text("Test Wallet EIP-712 Signature")').first();
        await clickCursor(page, signBtn, { steps: 14 }); // Clicks at 6.1s!
        await page.waitForTimeout(3000);

        // 11.1s - 17.6s (115.0s - 121.5s): Hover verified signature card & copy
        const copySigBtn = page.locator('button:has-text("Copy")').last();
        if (await copySigBtn.count() > 0) {
          await clickCursor(page, copySigBtn, { steps: 14 });
          await page.waitForTimeout(2500);
        }

        // 17.6s (121.5s): Switch to "Clean Swap"
        const cleanPatternBtn = page.locator('button:has-text("Clean Swap")').first();
        await clickCursor(page, cleanPatternBtn, { steps: 14 }); // Clicks at 17.6s!
        await page.waitForTimeout(1500);

        // 20.6s (124.5s): Click Run Simulation again -> Confetti explodes!
        const runBtn2 = page.locator('button:has-text("RUN LIVE EVM PRE-EXECUTION SIMULATION"), button:has-text("Executing Caliper Simulation")').first();
        await clickCursor(page, runBtn2, { steps: 14 }); // Clicks at 20.6s!
        // Confetti lands and holds through end of beat
        await page.waitForTimeout(6500);
      }
    );
  }

  // ── SCENE 6: Cryptographic Proof Rail (131.7s – 153.4s, duration 21.7s) ──
  if (scenesToRun.includes('6')) {
    await recordSceneClean(
      'scene6',
      21.7,
      { initStorage: { vernier_sandbox_connected: 'true' } },
      async (page) => {
        // Direct mount into Proof tab
        await page.goto(`${TARGET_URL}/#overview`, { waitUntil: 'networkidle' });
        const proofNav = page.locator('button:has-text("Proof")').first();
        await proofNav.click();
        await page.locator('button:has-text("DOWNLOAD (.JSON)")').first().waitFor({ state: 'visible', timeout: 5000 });
      },
      async (page) => {
        // 0s - 6.8s (131.7s - 138.5s): Sweep header & VERIFIED_FRAUD_CONTAINED
        await moveCursor(page, 720, 180, { steps: 18 });
        await page.waitForTimeout(5500);

        // 6.8s (138.5s): Click "DOWNLOAD (.JSON)"
        const downloadBtn = page.locator('button:has-text("DOWNLOAD (.JSON)"), button:has-text("Download JSON")').first();
        if (await downloadBtn.count() > 0) {
          await clickCursor(page, downloadBtn, { steps: 14 }); // Clicks at 6.8s!
          await page.waitForTimeout(3000);
        }

        // 12.8s (144.5s): Click "COPY RAW JSON"
        const copyJsonBtn = page.locator('button:has-text("COPY RAW JSON"), button:has-text("Copy Raw JSON")').first();
        if (await copyJsonBtn.count() > 0) {
          await clickCursor(page, copyJsonBtn, { steps: 14 }); // Clicks at 12.8s!
          await page.waitForTimeout(2500);
        }

        // Hover state root hash until end of beat
        await moveCursor(page, 480, 450, { steps: 16 });
        await page.waitForTimeout(5500);
      }
    );
  }

  // ── SCENE 7: Pitch Deck & Close (153.4s – 164.7s, duration 11.3s) ──
  if (scenesToRun.includes('7')) {
    await recordSceneClean(
      'scene7',
      11.3,
      {},
      async (page) => {
        // Direct mount into Deck tab, advance to Slide 6
        await page.goto(`${TARGET_URL}/#overview`, { waitUntil: 'networkidle' });
        const deckNav = page.locator('button:has-text("Deck")').first();
        await deckNav.click();
        await page.locator('button[aria-label*="Go to slide"]').first().waitFor({ state: 'visible', timeout: 5000 });
        const dots = page.locator('button[aria-label*="Go to slide"]');
        if (await dots.count() >= 6) {
          await dots.nth(5).click();
          await page.waitForTimeout(400);
        }
      },
      async (page) => {
        // 0s - 4.1s (153.4s - 157.5s): Sweep roadmap cards
        await moveCursor(page, 520, 540, { steps: 16 });
        await page.waitForTimeout(3500);

        // 4.1s (157.5s): Move to and hover over tryvernier.netlify.app live link
        await moveCursor(page, 720, 650, { steps: 18 });
        // Hold steady through final closing chords
        await page.waitForTimeout(7000);
      }
    );
  }
}

runAll().catch(err => {
  console.error('Recording Error:', err);
  process.exit(1);
});
