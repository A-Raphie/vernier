const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { injectCursor, moveCursor, clickCursor } = require('./mac-cursor');

const OUTPUT_DIR = path.resolve(__dirname, '../videos/vernier-showcase/media');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const TARGET_URL = 'https://tryvernier.netlify.app';
const TARGET_DURATION = 23.6;

async function recordScene3Rabby() {
  console.log(`\n========================================`);
  console.log(`🎬 Recording Scene 3 with Real Rabby Wallet Flow (Target: ${TARGET_DURATION}s)...`);
  console.log(`========================================`);

  const sceneDir = path.join(OUTPUT_DIR, 'raw-scene3-rabby');
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
  const videoCreationTime = Date.now();

  try {
    // Ensure window.ethereum is recognized so RainbowKit modal is bypassed
    await page.addInitScript(() => {
      window.ethereum = {
        isRabby: true,
        request: async ({ method }) => {
          if (method === 'eth_requestAccounts') return ['0x4E6b21703E9B01c7811985a109867c4FA6712AB9'];
          return [];
        }
      };
    });

    // 1. SETUP
    await page.goto(`${TARGET_URL}/#overview`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('header button', { timeout: 10000 });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    // Inject custom mac cursor
    await injectCursor(page);

    // Inject Rabby Popup DOM into page
    await page.evaluate(() => {
      const rabbyContainer = document.createElement('div');
      rabbyContainer.id = '__rabby_popup_window';
      rabbyContainer.style.cssText = `
        position: fixed;
        top: 18px;
        right: 28px;
        width: 384px;
        height: 560px;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 25px 65px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.15), 0 10px 25px rgba(0, 0, 0, 0.4);
        z-index: 2147483640;
        display: none;
        flex-direction: column;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #111827;
        opacity: 0;
        transform: translateY(-10px) scale(0.97);
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      `;

      rabbyContainer.innerHTML = `
        <!-- Rabby Top Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px 10px; border-bottom: 1px solid #f1f5f9;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <!-- Rabby Blue Bunny SVG -->
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .83-.67 1.5-1.5 1.5S10 17.33 10 16.5V11c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5.5zm4-2c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V13c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v1.5z" fill="#3b82f6"/>
              <circle cx="8" cy="11" r="1.5" fill="#3b82f6"/>
              <path d="M7 6c1.5-2 4-2 5 0l1 2c-2 .5-4 .5-6 0l1-2z" fill="#3b82f6"/>
            </svg>
            <span style="font-size: 14px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em;">Connect to Dapp</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px; padding: 3px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9999px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <polygon points="12 2 19 13 12 17 5 13 12 2" fill="#627eea"/>
              <polygon points="12 17 19 13 12 22 5 13 12 17" fill="#454a75"/>
            </svg>
            <span style="font-size: 11px; font-weight: 600; color: #334155;">Ethereum</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <!-- Dapp Info Box -->
        <div style="margin: 12px 16px; padding: 14px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
          <div style="width: 44px; height: 44px; margin: 0 auto 8px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4v16"/><path d="M4 6h12"/><path d="M4 10h8"/><path d="M4 14h14"/><path d="M4 18h6"/><path d="M16 4v4"/><path d="M12 8v4"/><path d="M18 12v4"/>
            </svg>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a;">tryvernier.netlify.app</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">https://tryvernier.netlify.app</div>

          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px;">
            <span style="color: #64748b;">Listed by</span>
            <span style="display: inline-flex; align-items: center; gap: 4px; color: #d97706; font-weight: 600;">
              None <span style="background: #fef3c7; border-radius: 4px; padding: 0 4px; font-size: 10px;">!</span>
            </span>
          </div>
          <div style="margin-top: 6px; display: flex; justify-content: space-between; font-size: 11px;">
            <span style="color: #64748b;">Site popularity</span>
            <span style="display: inline-flex; align-items: center; gap: 4px; color: #d97706; font-weight: 600;">
              Very Low <span style="background: #fef3c7; border-radius: 4px; padding: 0 4px; font-size: 10px;">!</span>
            </span>
          </div>
          <div style="margin-top: 6px; display: flex; justify-content: space-between; font-size: 11px;">
            <span style="color: #64748b;">My mark</span>
            <span style="color: #3b82f6; font-weight: 500; cursor: pointer;">No mark ✎</span>
          </div>
        </div>

        <!-- Account Target -->
        <div style="padding: 0 16px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 6px;">
            <span style="color: #64748b; font-weight: 500;">Connect Address</span>
            <div style="display: flex; align-items: center; gap: 4px; background: #eff6ff; padding: 2px 8px; border-radius: 6px; border: 1px solid #bfdbfe;">
              <span style="font-size: 10px; background: #3b82f6; color: white; padding: 0 3px; border-radius: 2px; font-weight: 700;">A</span>
              <span style="font-size: 11px; font-weight: 600; color: #1e40af;">Seed Phrase 1 #1</span>
              <span style="font-size: 10px; color: #64748b;">(0x4E6b...2AB9)</span>
            </div>
          </div>
        </div>

        <!-- Security Warning Alert Box -->
        <div id="__rabby_alert_box" style="margin: 4px 16px 14px; padding: 10px 12px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 11px; transition: all 0.2s;">
          <div style="display: flex; align-items: center; gap: 6px; color: #92400e;">
            <span style="font-size: 12px; font-weight: 700; color: #d97706;">⚠️</span>
            <span style="font-weight: 500;">Please process the alert before signing</span>
          </div>
          <button id="__rabby_ignore_btn" style="background: none; border: none; font-size: 11px; font-weight: 700; color: #d97706; text-decoration: underline; cursor: pointer; padding: 2px 4px;">Ignore all</button>
        </div>

        <!-- Action Buttons -->
        <div style="margin-top: auto; padding: 14px 16px 18px; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #f1f5f9;">
          <button id="__rabby_connect_submit_btn" style="width: 100%; padding: 12px; background: #bfdbfe; color: #ffffff; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.2s, transform 0.1s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);">
            Connect
          </button>
          <button id="__rabby_cancel_btn" style="width: 100%; padding: 10px; background: #f8fafc; color: #3b82f6; border: 1px solid #bfdbfe; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer;">
            Cancel
          </button>
        </div>
      `;

      document.body.appendChild(rabbyContainer);

      window.__showRabby = () => {
        rabbyContainer.style.display = 'flex';
        requestAnimationFrame(() => {
          rabbyContainer.style.opacity = '1';
          rabbyContainer.style.transform = 'translateY(0) scale(1)';
        });
      };

      window.__hideRabby = () => {
        rabbyContainer.style.opacity = '0';
        rabbyContainer.style.transform = 'translateY(-10px) scale(0.97)';
        setTimeout(() => { rabbyContainer.style.display = 'none'; }, 250);
      };

      window.__clearRabbyAlert = () => {
        const box = document.getElementById('__rabby_alert_box');
        if (box) box.style.display = 'none';
        const btn = document.getElementById('__rabby_connect_submit_btn');
        if (btn) {
          btn.style.background = '#3b82f6';
          btn.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
        }
      };
    });

    await page.waitForTimeout(600);
    const actionStartTime = Date.now();
    const trimOffsetSec = (actionStartTime - videoCreationTime) / 1000;

    // 2. CHOREOGRAPHED SCENE 3 BEATS
    // 0s - 1.5s: Glides to Connect Wallet button
    console.log('[Scene 3] Gliding to Connect Wallet...');
    const connectBtn = page.locator('button:has-text("Connect Wallet")').first();
    await clickCursor(page, connectBtn, { steps: 14 });

    // 1.5s: Show Rabby Popup Window
    console.log('[Scene 3] Showing authentic Rabby Wallet popup...');
    await page.evaluate(() => window.__showRabby());
    // Hold 1.8s so viewer appreciates the authentic Rabby interface
    await page.waitForTimeout(1800);

    // 3.3s - 4.8s: Glides into Rabby Popup to "Ignore all"
    console.log('[Scene 3] Gliding to Rabby "Ignore all" security bypass...');
    const ignoreBtn = page.locator('#__rabby_ignore_btn');
    await clickCursor(page, ignoreBtn, { steps: 14 });
    await page.evaluate(() => window.__clearRabbyAlert());
    await page.waitForTimeout(800);

    // 5.6s - 6.8s: Glides down to Rabby "Connect" button
    console.log('[Scene 3] Gliding to Rabby "Connect" button...');
    const rabbySubmitBtn = page.locator('#__rabby_connect_submit_btn');
    await clickCursor(page, rabbySubmitBtn, { steps: 14 });
    await page.waitForTimeout(300);

    // 7.1s: Hide Rabby Popup & simulate smooth dismiss
    await page.evaluate(() => window.__hideRabby());
    await page.waitForTimeout(400);

    // Update dApp state to connected instantly in-place (no reload flicker!)
    await page.evaluate(() => {
      localStorage.setItem('vernier_sandbox_connected', 'true');
      window.dispatchEvent(new Event('vernier:connect'));
    });
    await page.waitForTimeout(600);

    // 8.5s - 12.0s (58.3s - 61.8s): Move to connected account chip
    console.log('[Scene 3] Gliding to connected account chip...');
    const accountPill = page.locator('button:has-text("0x4E6b"), button:has-text("0x7864")').first();
    await moveCursor(page, 1220, 28, { steps: 16 });
    await page.waitForTimeout(600);

    // 12.0s: Click account pill to open dropdown
    console.log('[Scene 3] Opening account dropdown...');
    await clickCursor(page, accountPill, { steps: 8 });
    await page.waitForTimeout(1500);

    // 13.5s: Copy address
    console.log('[Scene 3] Clicking copy address icon...');
    const copyBtn = page.locator('button[title="Copy full address"]').first();
    if (await copyBtn.count() > 0) {
      await clickCursor(page, copyBtn, { steps: 10 });
      await page.waitForTimeout(1200);
    }

    // 14.5s: Close dropdown by clicking neutral backdrop
    console.log('[Scene 3] Closing dropdown via backdrop click...');
    await moveCursor(page, 720, 260, { steps: 12 });
    await page.locator('.fixed.inset-0').click();
    await page.waitForTimeout(600);

    // 16.5s - 19.5s (66.3s - 69.3s): Glides smoothly to "OPEN WORKING COCKPIT"
    console.log('[Scene 3] Gliding to OPEN WORKING COCKPIT...');
    const cockpitBtn = page.locator('button:has-text("OPEN WORKING COCKPIT")').first();
    const btnBox = await cockpitBtn.boundingBox();
    if (btnBox) {
      await moveCursor(page, btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2, { steps: 18 });
    } else {
      await moveCursor(page, 405, 595, { steps: 18 });
    }
    await page.waitForTimeout(600);

    // 19.5s: Click OPEN WORKING COCKPIT
    console.log('[Scene 3] Clicking OPEN WORKING COCKPIT -> Transitions to Cockpit!');
    await clickCursor(page, cockpitBtn, { steps: 10 });
    await page.waitForTimeout(1500);

    // Hold through end of beat (23.6s total)
    const actionElapsedSec = (Date.now() - actionStartTime) / 1000;
    const remainingSec = TARGET_DURATION - actionElapsedSec + 0.5;
    if (remainingSec > 0) {
      console.log(`[Scene 3] Holding cockpit view for ${remainingSec.toFixed(2)}s to finish beat...`);
      await page.waitForTimeout(remainingSec * 1000);
    }

    await context.close();
    await browser.close();

    // 3. PRECISION TRIM
    const files = fs.readdirSync(sceneDir).filter(f => f.endsWith('.webm'));
    if (files.length === 0) throw new Error('No webm video recorded for Scene 3');

    files.sort((a, b) => fs.statSync(path.join(sceneDir, b)).mtimeMs - fs.statSync(path.join(sceneDir, a)).mtimeMs);
    const rawWebm = path.join(sceneDir, files[0]);
    const finalMp4 = path.join(OUTPUT_DIR, 'clean-scene3.mp4');

    console.log(`[Scene 3] Trimming ${finalMp4} from ${trimOffsetSec.toFixed(2)}s for duration ${TARGET_DURATION}s...`);
    execSync(`ffmpeg -y -ss ${trimOffsetSec} -i "${rawWebm}" -t ${TARGET_DURATION} -c:v libx264 -pix_fmt yuv420p -crf 15 -preset medium -r 30 "${finalMp4}"`, { stdio: 'inherit' });

    // 4. EXTRACT FRAMES FOR VISUAL QA
    const qaFrames = [1.0, 2.5, 4.5, 6.0, 9.0, 13.0, 18.0, 22.0];
    const qaDir = path.resolve(__dirname, '../scratch/scene3_qa');
    if (!fs.existsSync(qaDir)) fs.mkdirSync(qaDir, { recursive: true });

    for (const t of qaFrames) {
      const out = path.join(qaDir, `frame_${t.toFixed(1)}s.png`);
      execSync(`ffmpeg -y -ss ${t} -i "${finalMp4}" -vframes 1 "${out}"`, { stdio: 'ignore' });
      console.log(`Extracted QA Frame @ ${t}s -> ${out}`);
    }

    fs.rmSync(sceneDir, { recursive: true, force: true });
    console.log(`\n🎉 Scene 3 Rabby recording completed successfully: ${finalMp4}`);
  } catch (err) {
    console.error('Error recording Scene 3:', err);
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
    throw err;
  }
}

recordScene3Rabby().catch(err => {
  console.error(err);
  process.exit(1);
});
