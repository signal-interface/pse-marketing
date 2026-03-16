const { chromium } = require('playwright');
const path = require('path');

const DEMO_URL = 'https://demo.payrollsynergyexperts.com';
const OUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');

const screenshots = [
  { name: 'dashboard-overview', navText: 'Dashboard', wait: 2000 },
  { name: 'compliance-scan', navText: 'Exceptions', wait: 2000 },
  { name: 'payroll-run', navText: 'Payroll Detail', wait: 2000 },
  { name: 'audit-trail', navText: 'Audit Ledger', wait: 2000 },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Load the SPA once
  console.log('Loading demo site...');
  await page.goto(DEMO_URL, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(3000);

  for (const shot of screenshots) {
    console.log(`Capturing ${shot.name} (clicking "${shot.navText}")...`);
    try {
      // Click the sidebar nav button by text
      const btn = page.locator(`nav button:has-text("${shot.navText}")`).first();
      await btn.click();
      await page.waitForTimeout(shot.wait);

      await page.screenshot({
        path: path.join(OUT_DIR, `${shot.name}.png`),
        fullPage: false,
      });
      console.log(`  ✓ ${shot.name}.png saved`);
    } catch (err) {
      console.error(`  ✗ ${shot.name} failed: ${err.message}`);
    }
  }

  await context.close();
  await browser.close();
  console.log('\nDone.');
})();
