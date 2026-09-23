const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.type(), msg.text()));

  await page.goto('https://6ab3cbdd748989c92553ea1e--tryvernier.netlify.app/#cockpit', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Connect Wallet")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Sandbox Reviewer Account")');
  await page.waitForTimeout(1000);

  await page.click('button:has-text("Live Caliper")');
  await page.waitForTimeout(600);

  const signBtn = await page.$('button:has-text("Test Wallet EIP-712 Signature")');
  console.log('Sign button found:', Boolean(signBtn));
  if (signBtn) {
    console.log('Clicking sign button...');
    await signBtn.click();
    await page.waitForTimeout(2000);
    const telemetry = await page.innerText('div:has-text("Caliper Telemetry")');
    console.log('\n--- Telemetry after click ---');
    console.log(telemetry);
  }
  await browser.close();
})().catch(console.error);
