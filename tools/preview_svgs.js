/**
 * preview_svgs.js
 * Renders every SVG in a folder onto one review sheet (large + small sizes).
 * Usage: node tools/preview_svgs.js <folder> [out.png]
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const dir = path.resolve(process.argv[2] || 'brand/logo');
const out = path.resolve(process.argv[3] || '.tmp/svg_preview.png');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg')).sort();

const cell = (f) => {
  const src = `file://${path.join(dir, f).replace(/\\/g, '/')}`;
  const dark = /white/.test(f);
  return `<figure style="background:${dark ? '#1F3D33' : '#F6F1E8'}">
    <img src="${src}" style="height:140px">
    <div class="sm"><img src="${src}" style="height:48px"><img src="${src}" style="height:24px"><img src="${src}" style="height:16px"></div>
    <figcaption>${f}</figcaption></figure>`;
};

(async () => {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 800, deviceScaleFactor: 1 });
  const sheet = path.join(path.dirname(out), '_svg_sheet.html');
  fs.writeFileSync(sheet, `<html><body style="margin:0;padding:20px;background:#fff;font:12px monospace">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">${files.map(cell).join('')}</div>
    <style>figure{margin:0;padding:20px;border-radius:12px;display:flex;flex-direction:column;align-items:flex-start;gap:12px}
    .sm{display:flex;gap:16px;align-items:center}figcaption{color:#5E5E57;background:#fff;padding:2px 6px;border-radius:4px}</style>
    </body></html>`);
  await page.goto('file:///' + sheet.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000)); // let living mark finish drawing
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
  console.log(`  ✓  ${files.length} SVGs → ${out}`);
})();
