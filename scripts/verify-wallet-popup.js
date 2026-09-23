const { chromium } = require('playwright');
const path = require('path');

const URL = 'https://tryvernier.netlify.app';
const ARTIFACTS_DIR = '/Users/raphie/.gemini/antigravity/brain/2acec0f8-2c9f-48d5-bc5e-d3fe24384a81';

async function main() {
  console.log(`[VERIFICATION] Launching Chromium against ${URL}...`);
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`[Browser Console Error]`, msg.text());
  });

  await page.goto(URL, { waitUntil: 'networkidle' });

  // 1. Verify Document Title
  const title = await page.title();
  console.log(`Page Title: "${title}"`);
  const hasEmDash = title.includes('—');
  console.log(`Has Em Dash: ${hasEmDash} (Must be false)`);

  // 2. Click Connect Wallet to open RainbowKit Popup
  console.log('Finding Connect Wallet button...');
  const connectBtn = page.getByRole('button', { name: /Connect Wallet/i });
  await connectBtn.waitFor({ state: 'visible' });
  await connectBtn.click();
  await page.waitForTimeout(1000);

  // Take screenshot of RainbowKit modal popup
  const modalScreenshotPath = path.join(ARTIFACTS_DIR, 'rainbowkit_wallet_popup_live.png');
  await page.screenshot({ path: modalScreenshotPath });
  console.log(`Saved RainbowKit Modal Screenshot to: ${modalScreenshotPath}`);

  // 3. Test Sandbox Pass
  console.log('Testing Sandbox Pass connection...');
  // Close modal with Escape or clicking backdrop
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  const sandboxBtn = page.getByRole('button', { name: /Sandbox Pass/i });
  if (await sandboxBtn.isVisible()) {
    await sandboxBtn.click();
    await page.waitForTimeout(1500);

    const connectedScreenshotPath = path.join(ARTIFACTS_DIR, 'wallet_connected_live.png');
    await page.screenshot({ path: connectedScreenshotPath });
    console.log(`Saved Connected State Screenshot to: ${connectedScreenshotPath}`);
  }

  await browser.close();
  console.log('[VERIFICATION] Completed successfully!');
}

main().catch(err => {
  console.error('[VERIFICATION FAILED]', err);
  process.exit(1);
});
