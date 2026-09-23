const { chromium } = require('playwright');
const path = require('path');

const ASSETS_DIR = '/Users/raphie/Documents/Hackathons/vernier/demo/assets';
const BASE_URL = 'https://tryvernier.netlify.app';

async function capture() {
  console.log('Launching browser for 1920x1080 capture...');
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  // 1. Scene 1: Front Door Hero & Blind Signing contrast
  console.log('Capturing scene1_frontdoor_hero.png...');
  await page.goto(`${BASE_URL}/#overview`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ASSETS_DIR, 'scene1_frontdoor_hero.png') });

  // 2. Scene 2: 3-Card Friction Grid & Open Cockpit
  console.log('Capturing scene2_friction_grid.png...');
  await page.evaluate(() => window.scrollBy({ top: 460, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ASSETS_DIR, 'scene2_friction_grid.png') });

  // Reset scroll
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

  // 3. Scene 3: Cockpit PhishDrop & Auditor Trace
  console.log('Capturing scene3_cockpit_phishdrop.png...');
  await page.goto(`${BASE_URL}/#cockpit`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  // Click Auditor Trace toggle if present
  const auditorBtn = await page.$('button:has-text("Auditor Trace")');
  if (auditorBtn) {
    await auditorBtn.click();
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: path.join(ASSETS_DIR, 'scene3_cockpit_phishdrop.png') });

  // 4. Scene 4: Cockpit Live Caliper Simulator with Connected Wallet simulation
  console.log('Capturing scene4_live_caliper.png...');
  // Click Live Caliper tab
  await page.click('button:has-text("Live Caliper")');
  await page.waitForTimeout(400);
  // Click Permit2 Drain preset
  await page.click('button:has-text("Permit2 Drain")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ASSETS_DIR, 'scene4_live_caliper.png') });

  // 5. Scene 5: Proof & Evidence Rail
  console.log('Capturing scene5_proof_rail.png...');
  await page.goto(`${BASE_URL}/#proof`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ASSETS_DIR, 'scene5_proof_rail.png') });

  // 6. Scene 6: Pitch Deck (Slide 1 and Roadmap Slide 6)
  console.log('Capturing scene6_deck_overview.png and scene6_deck_roadmap.png...');
  await page.goto(`${BASE_URL}/#deck`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ASSETS_DIR, 'scene6_deck_overview.png') });
  
  // Advance to slide 6 (Roadmap)
  for (let s = 1; s < 6; s++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
  }
  await page.screenshot({ path: path.join(ASSETS_DIR, 'scene6_deck_roadmap.png') });

  await browser.close();
  console.log('All 6 scene assets captured in 1920x1080!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
