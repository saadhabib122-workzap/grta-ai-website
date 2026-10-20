const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const FILE = `file://${path.resolve(__dirname, '../index.html')}`;
const OUT  = path.resolve(__dirname, '../.tmp');

const SECTIONS = [
  { id: 'hero',     selector: '#hero' },
  { id: 'problem',  selector: '#problem' },
  { id: 'solution', selector: '#solution' },
  { id: 'proof',    selector: '#proof' },
  { id: 'access',   selector: '#access' },
  { id: 'footer',   selector: '.site-footer' },
];

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(FILE, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  });
  await new Promise(r => setTimeout(r, 400));

  for (const s of SECTIONS) {
    const el = await page.$(s.selector);
    if (!el) { console.warn(`  ⚠  ${s.id} not found`); continue; }
    const out = path.join(OUT, `mobile_${s.id}.png`);
    await el.screenshot({ path: out });
    console.log(`  ✓  ${s.id} → ${out}`);
  }

  await browser.close();
  console.log('\nDone.');
})();
