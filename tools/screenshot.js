/**
 * screenshot.js
 * Full-page screenshot of any local HTML file or URL.
 * Usage: node tools/screenshot.js <file.html|url> <out.png> [width=1440] [light|dark]
 */

const puppeteer = require('puppeteer');
const path = require('path');

const [, , target, out, width = '1440', scheme = 'light'] = process.argv;
if (!target || !out) {
  console.error('Usage: node tools/screenshot.js <file.html|url> <out.png> [width] [light|dark]');
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: Number(width), height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
  const url = /^https?:/.test(target) ? target : 'file:///' + path.resolve(target).replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise((r) => setTimeout(r, 2800)); // let entry animations settle
  await page.screenshot({ path: path.resolve(out), fullPage: true });
  await browser.close();
  console.log(`  ✓  ${target} @${width} ${scheme} → ${out}`);
})();
