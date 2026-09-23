const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { injectCursor, moveCursor, clickCursor, typeCursor } = require('./mac-cursor');

const OUTPUT_DIR = path.resolve(__dirname, '../videos/vernier-showcase/media');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const TARGET_URL = 'https://tryvernier.netlify.app';

async function recordScene(name, durationMs, actionFn) {
  const finalMp4 = path.join(OUTPUT_DIR, `${name}.mp4`);
  if (fs.existsSync(finalMp4)) {
    console.log(`⏩ Scene ${name} already exists, skipping...`);
    return;
  }
  console.log(`\n========================================`);
  console.log(`🎬 Recording Scene: ${name}...`);
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

  const page = await context.newPage();
  try {
    await actionFn(page);
    await page.waitForTimeout(durationMs);
  } catch (err) {
    console.error(`Error in scene ${name}:`, err);
    throw err;
  } finally {
    await context.close();
    await browser.close();
  }

  const files = fs.readdirSync(sceneDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    files.sort((a, b) => fs.statSync(path.join(sceneDir, b)).mtimeMs - fs.statSync(path.join(sceneDir, a)).mtimeMs);
    const rawPath = path.join(sceneDir, files[0]);
    const finalMp4 = path.join(OUTPUT_DIR, `${name}.mp4`);
    execSync(`ffmpeg -y -i "${rawPath}" -c:v libx264 -pix_fmt yuv420p -crf 14 -preset medium -r 30 "${finalMp4}"`, { stdio: 'ignore' });
    console.log(`✅ Saved MP4: ${finalMp4}`);
    fs.rmSync(sceneDir, { recursive: true, force: true });
  }
}

async function runAll() {
  // TAKE 1: Hook & Front Door (Hero + Telemetry)
  await recordScene('scene1-hook', 2000, async (page) => {
    await page.goto(`${TARGET_URL}#overview`, { waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(1000);

    // Sweep across the live telemetry badge
    await moveCursor(page, 1140, 30, { steps: 20 });
    await page.waitForTimeout(1200);

    // Hover over the hero headline
    await moveCursor(page, 720, 220, { steps: 22 });
    await page.waitForTimeout(1500);

    // Move to subtitle lede
    await moveCursor(page, 720, 320, { steps: 18 });
    await page.waitForTimeout(1200);

    // Smooth scroll down to reveal the interactive benchmark card
    await page.evaluate(() => window.scrollBy({ top: 320, behavior: 'smooth' }));
    await page.waitForTimeout(2500);
  });

  // TAKE 2: Benchmark Contrast (Promised vs Reality + Uniswap Clean)
  await recordScene('scene2-benchmark', 2000, async (page) => {
    await page.goto(`${TARGET_URL}#overview`, { waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(600);

    // Scroll to benchmark card
    await page.evaluate(() => window.scrollBy({ top: 360, behavior: 'instant' }));
    await page.waitForTimeout(800);

    // Move to "1. PROMISED BY WEBSITE"
    await moveCursor(page, 520, 480, { steps: 18 });
    await page.waitForTimeout(1200);

    // Move to "2. VERNIER FIREWALL VERDICT: CRITICAL THREAT BLOCKED"
    await moveCursor(page, 760, 480, { steps: 18 });
    await page.waitForTimeout(1500);

    // Move to and click "Uniswap Clean" tab
    const cleanTab = page.locator('button:has-text("Uniswap Clean")').first();
    await clickCursor(page, cleanTab, { steps: 16 });
    await page.waitForTimeout(2000);

    // Move to the verified status
    await moveCursor(page, 760, 480, { steps: 16 });
    await page.waitForTimeout(2500);
  });

  // TAKE 3: Connect Wallet & Enter Cockpit
  await recordScene('scene3-wallet', 2000, async (page) => {
    // Start with fresh session (clear local storage)
    await page.goto(`${TARGET_URL}#overview`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.removeItem('vernier_sandbox_connected'));
    await page.reload({ waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(1000);

    // Move to Connect Wallet button in Chrome header
    const connectBtn = page.locator('button:has-text("Connect Wallet")').first();
    await clickCursor(page, connectBtn, { steps: 20 });
    await page.waitForTimeout(1200);

    // Modal appears: move over Browser Wallet
    await moveCursor(page, 720, 410, { steps: 16 });
    await page.waitForTimeout(800);

    // Move to Sandbox Reviewer Account
    const sandboxBtn = page.locator('button:has-text("Sandbox Reviewer Account")').first();
    await clickCursor(page, sandboxBtn, { steps: 16 });
    await page.waitForTimeout(1500);

    // Click connected account chip to open dropdown
    const accountChip = page.locator('button:has-text("0x4E6b")').first();
    await clickCursor(page, accountChip, { steps: 18 });
    await page.waitForTimeout(1200);

    // Copy address in dropdown
    const copyAddrBtn = page.locator('button[title="Copy full address"]').first();
    if (await copyAddrBtn.count() > 0) {
      await clickCursor(page, copyAddrBtn, { steps: 14 });
      await page.waitForTimeout(800);
    }

    // Click outside to close dropdown
    await clickCursor(page, page.locator('header').first(), { steps: 12 });
    await page.waitForTimeout(800);

    // Click OPEN WORKING COCKPIT
    const cockpitBtn = page.locator('button:has-text("OPEN WORKING COCKPIT")').first();
    await clickCursor(page, cockpitBtn, { steps: 18 });
    await page.waitForTimeout(2500);
  });

  // TAKE 4: Working Cockpit & Live EVM Caliper Threat Interception
  await recordScene('scene4-caliper', 2000, async (page) => {
    await page.goto(`${TARGET_URL}#cockpit`, { waitUntil: 'networkidle' });
    // Ensure wallet connected
    await page.evaluate(() => localStorage.setItem('vernier_sandbox_connected', 'true'));
    await page.reload({ waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(1000);

    // Click "Live Caliper" tab in cockpit bar
    const liveCaliperTab = page.locator('button:has-text("Live Caliper")').first();
    await clickCursor(page, liveCaliperTab, { steps: 18 });
    await page.waitForTimeout(1200);

    // Click preset "Fake PhishDrop v2"
    const presetBtn = page.locator('button:has-text("Fake PhishDrop v2")').first();
    await clickCursor(page, presetBtn, { steps: 16 });
    await page.waitForTimeout(1000);

    // Click "RUN LIVE EVM PRE-EXECUTION SIMULATION"
    const runBtn = page.locator('button:has-text("RUN LIVE EVM PRE-EXECUTION SIMULATION"), button:has-text("Executing Caliper Simulation")').first();
    await clickCursor(page, runBtn, { steps: 18 });
    await page.waitForTimeout(1500);

    // Highlight HAZARD INTERCEPTED telemetry
    await moveCursor(page, 1080, 520, { steps: 20 });
    await page.waitForTimeout(1500);

    // Hover over Gas Delta
    await moveCursor(page, 1180, 570, { steps: 16 });
    await page.waitForTimeout(2500);
  });

  // TAKE 5: Real EIP-712 Attestation Signing & Clean Swap Route
  await recordScene('scene5-signing', 2000, async (page) => {
    await page.goto(`${TARGET_URL}#cockpit`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.setItem('vernier_sandbox_connected', 'true'));
    await page.reload({ waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(1000);

    // Click "Live Caliper" tab in cockpit bar
    const liveCaliperTab = page.locator('button:has-text("Live Caliper")').first();
    await clickCursor(page, liveCaliperTab, { steps: 18 });
    await page.waitForTimeout(1200);

    // Click "Test Wallet EIP-712 Signature"
    const signBtn = page.locator('button:has-text("Test Wallet EIP-712 Signature")').first();
    await clickCursor(page, signBtn, { steps: 18 });
    await page.waitForTimeout(1800);

    // Hover over verified signature card
    await moveCursor(page, 1080, 780, { steps: 18 });
    await page.waitForTimeout(1200);

    // Copy signature
    const copySigBtn = page.locator('button:has-text("Copy")').last();
    if (await copySigBtn.count() > 0) {
      await clickCursor(page, copySigBtn, { steps: 14 });
      await page.waitForTimeout(800);
    }

    // Switch to Clean Swap
    const cleanPatternBtn = page.locator('button:has-text("Clean Swap")').first();
    await clickCursor(page, cleanPatternBtn, { steps: 18 });
    await page.waitForTimeout(800);

    // Click Run Simulation again -> Confetti!
    const runBtn = page.locator('button:has-text("RUN LIVE EVM PRE-EXECUTION SIMULATION"), button:has-text("Executing Caliper Simulation")').first();
    await clickCursor(page, runBtn, { steps: 18 });
    await page.waitForTimeout(3000);
  });

  // TAKE 6: Cryptographic Proof Rail & Export JSON
  await recordScene('scene6-proof', 2000, async (page) => {
    await page.goto(`${TARGET_URL}#proof`, { waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(1000);

    // Hover over EIP-712 Certificate header
    await moveCursor(page, 720, 160, { steps: 20 });
    await page.waitForTimeout(1000);

    // Click Download JSON
    const downloadBtn = page.locator('button:has-text("Download JSON")').first();
    if (await downloadBtn.count() > 0) {
      await clickCursor(page, downloadBtn, { steps: 18 });
      await page.waitForTimeout(1200);
    }

    // Hover over State Root hash
    await moveCursor(page, 640, 360, { steps: 18 });
    await page.waitForTimeout(1200);

    // Click Copy State Root
    const copyRootBtn = page.locator('button:has-text("Copy"), button[title*="Copy"]').first();
    if (await copyRootBtn.count() > 0) {
      await clickCursor(page, copyRootBtn, { steps: 14 });
      await page.waitForTimeout(2000);
    }
  });

  // TAKE 7: In-App Pitch Deck Presentation & Close
  await recordScene('scene7-deck', 2000, async (page) => {
    await page.goto(`${TARGET_URL}#deck`, { waitUntil: 'networkidle' });
    await injectCursor(page);
    await page.waitForTimeout(1000);

    // Advance to Slide 6 by clicking the 6th dot or next button
    const dots = page.locator('button[aria-label*="Go to slide"]');
    if (await dots.count() >= 6) {
      await clickCursor(page, dots.nth(5), { steps: 16 });
      await page.waitForTimeout(1500);
    }

    // Hover over Live Production URL link
    const prodLink = page.locator('a:has-text("tryvernier.netlify.app")').first();
    if (await prodLink.count() > 0) {
      await moveCursor(page, 820, 570, { steps: 18 });
      await page.waitForTimeout(2000);
    }

    // Hold steady on Slide 6
    await page.waitForTimeout(4000);
  });
}

runAll().catch(err => {
  console.error('Recording Error:', err);
  process.exit(1);
});
