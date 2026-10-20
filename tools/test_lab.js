/**
 * test_lab.js
 * Drives every Lab demo like a visitor and captures the result of each.
 * Usage: node tools/test_lab.js [baseUrl=http://localhost:3005] [width=1440]
 * Output: .tmp/lab/<tab>.png, plus a pass/fail line per demo.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const [, , base = 'http://localhost:3005', width = '1440'] = process.argv;
const OUT = path.resolve(__dirname, '../.tmp/lab');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.setViewport({ width: Number(width), height: 1000 });
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);

  const results = [];
  const check = (name, ok, detail = '') => { const line = `${ok ? '✓' : '✗'}  ${name}${detail ? ` · ${detail}` : ''}`; results.push(line); console.log(line); };
  const shot = async (name) => {
    const el = await page.$('[role="tabpanel"]:not([hidden])');
    await el.screenshot({ path: path.join(OUT, `${name}.png`) });
  };
  const tab = async (k) => { await page.$eval(`#lab-tab-${k}`, (b) => b.click()); await new Promise((r) => setTimeout(r, 400)); };

  await page.goto(`${base}/lab`, { waitUntil: 'networkidle0' });

  /* Brief */
  await page.$eval('#lab-panel-brief button[type="submit"]', (b) => b.click());
  await page.waitForFunction(() => document.querySelector('#lab-panel-brief')?.textContent?.includes('Before we match anyone') || document.querySelector('#lab-panel-brief')?.textContent?.includes('looks complete'), { timeout: 40000 });
  const gapBtn = await page.$('#lab-panel-brief li button');
  if (gapBtn) { await gapBtn.evaluate((b) => b.click()); await new Promise((r) => setTimeout(r, 300)); }
  const briefText = await page.$eval('#lab-panel-brief', (e) => e.textContent);
  check('Brief: structured brief + gap', /Your brief/.test(briefText) && /Roles/.test(briefText), (briefText.match(/AI engine|Built-in engine/) || ['?'])[0]);
  check('Brief: add gap to brief', /Added/.test(briefText) || !gapBtn);
  await shot('brief');

  /* Translate */
  await tab('translate');
  await page.$eval('#lab-panel-translate button[type="submit"]', (b) => b.click());
  await page.waitForFunction(() => document.querySelector('#lab-panel-translate')?.textContent?.includes('Translated by GRTA'), { timeout: 40000 });
  const tr = await page.$eval('#lab-panel-translate', (e) => e.textContent);
  check('Translate: items + share card', /confidence/.test(tr), (tr.match(/AI engine|Built-in engine/) || ['?'])[0]);
  await shot('translate');

  /* Team: uses the brief written above */
  await tab('team');
  const teamOpts = await page.$$eval('#team-brief option', (o) => o.map((x) => x.textContent));
  check('Team: brief from first tab offered', teamOpts.length === 4, teamOpts[0]);
  const members = await page.$$eval('#lab-panel-team ul li', (l) => l.length);
  check('Team: members listed', members >= 5, `${members} items`);
  await shot('team-mine');
  await page.select('#team-brief', 'launch');
  for (const v of ['Challenger', 'Innovation']) {
    const btns = await page.$$('#lab-panel-team [role="radio"]');
    for (const b of btns) if ((await b.evaluate((x) => x.textContent)) === v) await b.evaluate((x) => x.click());
    await new Promise((r) => setTimeout(r, 500));
  }
  const wild = await page.$eval('#lab-panel-team', (e) => e.textContent.includes('Wildcard'));
  check('Team: wildcard shown for launch brief', wild);
  await shot('team-launch-innovation');

  /* HIIT */
  await tab('hiit');
  await page.$eval('#lab-panel-hiit button[type="submit"]', (b) => b.click());
  await page.waitForFunction(() => document.querySelector('#lab-panel-hiit table'), { timeout: 40000 });
  const rows = await page.$$eval('#lab-panel-hiit tbody tr', (r) => r.length);
  check('HIIT: plan table', rows >= 4, `${rows} actions`);
  await new Promise((r) => setTimeout(r, 800));
  await shot('hiit');

  /* Network */
  await tab('network');
  await page.$eval('#org-size', (el) => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    set.call(el, '5000'); el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 3500));
  const net = await page.$eval('#lab-panel-network', (e) => e.textContent);
  check('Network: 5,000 people → stats', /5,000/.test(net) && /834/.test(net), '834 guides expected');
  await shot('network');

  /* Pulse */
  for (let i = 0; i < 5; i++) {
    const radios = await page.$$(`#lab-panel-network [role="radiogroup"]`);
    const btns = await radios[i].$$('button');
    await btns[3].evaluate((b) => b.click());
  }
  await page.$$eval('#lab-panel-network button', (bs) => Array.from(bs).find((b) => b.textContent.trim() === 'Send').click());
  await page.waitForFunction(() => document.querySelector('#lab-panel-network')?.textContent?.includes('exactly how GRTA learns'), { timeout: 10000 });
  check('Pulse: submits', true);

  console.log(results.every((r) => r.startsWith('✓')) ? '\n  All Lab demos pass.' : '\n  Some Lab demos failed.');
  if (errors.length) console.log('\n  Console errors:\n  ' + [...new Set(errors)].join('\n  '));
  await browser.close();
})().catch((e) => { console.error('✗  ' + e.message); process.exit(1); });
