/**
 * build_exports.js
 * Rasterises the logo and builds favicon.ico, apple-touch-icon and the default OG image.
 * Usage: node brand/src/build_exports.js
 * Output: brand/export/*
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const C = require('../tokens.json').color;

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'export');
fs.mkdirSync(OUT, { recursive: true });

const svg = (f) => fs.readFileSync(path.join(ROOT, 'logo', f), 'utf8');

async function renderSvg(page, markup, w, h, out, bg = 'transparent') {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0;background:${bg}">
    <div style="width:${w}px;height:${h}px">${markup.replace('<svg ', `<svg width="${w}" height="${h}" `)}</div></body></html>`);
  await page.screenshot({ path: out, omitBackground: bg === 'transparent', clip: { x: 0, y: 0, width: w, height: h } });
}

/* ICO container with embedded PNGs (supported by all modern browsers) */
function buildIco(pngPaths) {
  const imgs = pngPaths.map((p) => ({ data: fs.readFileSync(p.file), size: p.size }));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(imgs.length, 4);
  let offset = 6 + 16 * imgs.length;
  const dir = imgs.map((img) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
    e.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(img.data.length, 8); e.writeUInt32LE(offset, 12);
    offset += img.data.length;
    return e;
  });
  return Buffer.concat([header, ...dir, ...imgs.map((i) => i.data)]);
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  /* Mark PNGs */
  const mark = svg('grta-mark.svg');
  for (const s of [16, 32, 48, 64, 128, 192, 256, 512, 1024]) {
    await renderSvg(page, mark, s, s, path.join(OUT, `grta-mark-${s}.png`));
  }
  /* Apple touch icon: no transparency, square corners (iOS rounds them) */
  const squareMark = mark.replace('rx="12"', 'rx="0"');
  await renderSvg(page, squareMark, 180, 180, path.join(OUT, 'apple-touch-icon.png'), C.ink);

  /* Lockups */
  for (const f of ['grta-lockup.svg', 'grta-lockup-forest.svg']) {
    const m = svg(f);
    const vbW = Number(m.match(/viewBox="0 0 (\d+) 100"/)[1]);
    await renderSvg(page, m, vbW * 4, 400, path.join(OUT, f.replace('.svg', '-1200w.png').replace('1200w', `${vbW * 4}w`)));
  }

  /* favicon.ico (16, 32, 48) */
  const ico = buildIco([16, 32, 48].map((size) => ({ size, file: path.join(OUT, `grta-mark-${size}.png`) })));
  fs.writeFileSync(path.join(OUT, 'favicon.ico'), ico);
  fs.copyFileSync(path.join(ROOT, 'logo', 'grta-mark.svg'), path.join(OUT, 'favicon.svg'));

  /* Default OG image 1200×630 */
  const lockup = svg('grta-lockup.svg').replace('<svg ', '<svg height="56" ');
  const pattern = fs.readFileSync(path.join(ROOT, 'motifs', 'threads-pattern.svg'), 'utf8');
  const patternUrl = `data:image/svg+xml;base64,${Buffer.from(pattern).toString('base64')}`;
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(`<html><head>
    <link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@800&family=Inter:wght@400&display=swap" rel="stylesheet">
    </head><body style="margin:0">
    <div style="width:1200px;height:630px;background:${C.birch};position:relative;overflow:hidden;font-family:Inter">
      <div style="position:absolute;right:-40px;top:0;bottom:0;width:520px;background:url(${patternUrl});opacity:.9;
        -webkit-mask-image:linear-gradient(to left,#000 40%,transparent)"></div>
      <div style="position:absolute;left:80px;top:72px">${lockup}</div>
      <div style="position:absolute;left:80px;bottom:96px;width:760px">
        <div style="font-family:'Schibsted Grotesk';font-weight:800;font-size:92px;line-height:.98;letter-spacing:-.03em;color:${C.ink}">
          People move<br><span style="color:${C.forest}">work forward.</span></div>
        <div style="margin-top:28px;font-size:26px;color:${C.stone}">The right people, around the right problem, at the right time.</div>
      </div>
      <div style="position:absolute;right:80px;bottom:96px;width:14px;height:14px;border-radius:50%;background:${C.ember}"></div>
    </div></body></html>`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await page.screenshot({ path: path.join(OUT, 'og-default.png') });

  await browser.close();
  console.log(`  ✓  exports → ${OUT}`);
  console.log(fs.readdirSync(OUT).map((f) => `     ${f}`).join('\n'));
})();
