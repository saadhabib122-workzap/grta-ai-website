/**
 * add_illustration.js
 * Crops an image to its slot's exact ratio, converts to WebP and saves it as
 * public/illustrations/<slot>.<hash>.webp, recorded in lib/illustration-manifest.json.
 * The content hash in the name means a replaced image always gets a new URL,
 * so no browser or image-optimiser cache can show the old one.
 *
 * Usage: node tools/add_illustration.js <source image> <slot> [focusX=0.5] [focusY=0.5]
 *   focusX: which part to keep when trimming width. 0 = keep the left edge,
 *           1 = keep the right edge, 0.5 = trim evenly. focusY works the same vertically.
 * Also writes .tmp/illustrations/<slot>_preview.png for review.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const slots = require('../lib/illustration-slots.json');

const [, , src, slot, fx = '0.5', fy = '0.5'] = process.argv;
if (!src || !slots[slot]) {
  console.error(`Usage: node tools/add_illustration.js <image> <slot> [focusX] [focusY]\nSlots: ${Object.keys(slots).join(', ')}`);
  process.exit(1);
}

(async () => {
  const { ratio, width: maxW } = slots[slot];
  const target = ratio[0] / ratio[1];
  const img = sharp(src).rotate();
  const { width: w, height: h } = await img.metadata();

  // Largest window of the target ratio that fits, positioned by the focus point
  let cw = w, ch = Math.round(w / target);
  if (ch > h) { ch = h; cw = Math.round(h * target); }
  const left = Math.round((w - cw) * Math.min(1, Math.max(0, Number(fx))));
  const top = Math.round((h - ch) * Math.min(1, Math.max(0, Number(fy))));

  // Never upscale; cap at 2x the slot's display width
  const outW = Math.min(cw, maxW * 2);
  const outDir = path.resolve(__dirname, '../public/illustrations');
  fs.mkdirSync(outDir, { recursive: true });
  const pipeline = sharp(src).rotate().extract({ left, top, width: cw, height: ch }).resize({ width: outW });
  const buf = await pipeline.clone().webp({ quality: 86, effort: 6 }).toBuffer();
  const hash = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
  const name = `${slot}.${hash}.webp`;
  const out = path.join(outDir, name);

  // Remove earlier versions of this slot (hashed or plain), then write the new one
  for (const f of fs.readdirSync(outDir)) {
    if (f.startsWith(`${slot}.`) && f !== name) fs.rmSync(path.join(outDir, f));
  }
  fs.writeFileSync(out, buf);

  const manifestPath = path.resolve(__dirname, '../lib/illustration-manifest.json');
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  manifest[slot] = name;
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + '\n');

  const prevDir = path.resolve(__dirname, '../.tmp/illustrations');
  fs.mkdirSync(prevDir, { recursive: true });
  await pipeline.clone().png().toFile(path.join(prevDir, `${slot}_preview.png`));

  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`  ✓  ${slot}: ${w}×${h} → crop ${cw}×${ch} at (${left},${top}) → ${outW}px WebP, ${kb} KB`);
  console.log(`     ${out}`);
  if (outW < maxW) console.log(`     note: ${outW}px is below the ${maxW}px design width; fine on screen, slightly soft on very large displays`);
})();
