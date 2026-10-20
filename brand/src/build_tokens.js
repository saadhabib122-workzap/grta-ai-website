/**
 * build_tokens.js
 * Compiles brand/tokens.json → brand/tokens.css and checks WCAG contrast
 * for every text/background pair the site will use. Exits 1 on a failure.
 * Usage: node brand/src/build_tokens.js
 */

const fs = require('fs');
const path = require('path');
const tokens = require('../tokens.json');

const resolve = (v) => typeof v === 'string'
  ? v.replace(/\{color\.(\w+)\}/g, (_, k) => tokens.color[k])
  : v;

/* ── CSS ─────────────────────────────────────────────── */
const lines = [];
const block = (sel, obj, prefix) => {
  lines.push(`${sel} {`);
  for (const [k, v] of Object.entries(obj)) lines.push(`  --${prefix}${k}: ${resolve(v)};`);
  lines.push('}');
};

lines.push('/* Generated from brand/tokens.json by brand/src/build_tokens.js. Do not edit by hand. */');
lines.push(':root {');
for (const [k, v] of Object.entries(tokens.color)) lines.push(`  --c-${k}: ${v};`);
for (const [k, v] of Object.entries(tokens.font)) lines.push(`  --font-${k}: ${v};`);
for (const [k, t] of Object.entries(tokens.type)) {
  lines.push(`  --t-${k}-size: ${t.size}; --t-${k}-line: ${t.line}; --t-${k}-weight: ${t.weight}; --t-${k}-tracking: ${t.tracking};`);
}
for (const [k, v] of Object.entries(tokens.radius)) lines.push(`  --r-${k}: ${v};`);
for (const [k, v] of Object.entries(tokens.space)) lines.push(`  --s-${k}: ${v};`);
for (const [k, v] of Object.entries(tokens.shadow)) lines.push(`  --shadow-${k}: ${v};`);
for (const [k, v] of Object.entries(tokens.motion)) lines.push(`  --${k.startsWith('ease') ? '' : 'dur-'}${k}: ${v};`);
for (const [k, v] of Object.entries(tokens.layout)) lines.push(`  --layout-${k}: ${v};`);
lines.push('}');
block(':root, :root[data-theme="light"]', tokens.theme.light, '');
lines.push('@media (prefers-color-scheme: dark) {');
block('  :root:not([data-theme="light"])', tokens.theme.dark, '');
lines.push('}');
block(':root[data-theme="dark"]', tokens.theme.dark, '');

const cssOut = path.resolve(__dirname, '../tokens.css');
fs.writeFileSync(cssOut, lines.join('\n') + '\n');
console.log(`  ✓  ${cssOut}`);

/* ── Contrast ───────────────────────────────────────── */
const lum = (hex) => {
  const [r, g, b] = hex.replace('#', '').match(/../g).map((x) => {
    const c = parseInt(x, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/* [foreground, background, minimum] : 4.5 body text, 3 large text / UI */
const pairs = (t) => [
  ['text', 'bg', 4.5], ['text', 'surface', 4.5], ['text', 'surface-sunk', 4.5],
  ['text-muted', 'bg', 4.5], ['text-muted', 'surface', 4.5],
  ['brand-text', 'brand', 4.5], ['brand', 'bg', 4.5], ['brand', 'surface', 4.5],
  ['accent-text', 'bg', 4.5], ['accent-text', 'surface', 4.5],
  ['tag', 'surface', 4.5], ['tag', 'bg', 4.5],
  ['accent', 'bg', 3], ['thread', 'bg', 3], ['focus', 'bg', 3], ['focus', 'surface', 3],
].map(([f, b, min]) => ({ f, b, min, fg: resolve(t[f]), bg: resolve(t[b]) }));

let failed = 0;
for (const mode of ['light', 'dark']) {
  console.log(`\n  ${mode}`);
  for (const p of pairs(tokens.theme[mode])) {
    const r = ratio(p.fg, p.bg);
    const ok = r >= p.min;
    if (!ok) failed++;
    console.log(`  ${ok ? '✓' : '✗'}  ${p.f.padEnd(12)} on ${p.b.padEnd(13)} ${r.toFixed(2).padStart(5)} (min ${p.min})`);
  }
}

/* Fixed pairs used by the logo and dark sections */
console.log('\n  fixed');
for (const [f, b, min] of [['ember', 'ink', 3], ['snow', 'forest', 4.5], ['birch', 'forest', 4.5], ['fjord', 'ink', 3], ['snow', 'ink', 4.5]]) {
  const r = ratio(tokens.color[f], tokens.color[b]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`  ${ok ? '✓' : '✗'}  ${f.padEnd(12)} on ${b.padEnd(13)} ${r.toFixed(2).padStart(5)} (min ${min})`);
}

if (failed) { console.error(`\n  ${failed} pair(s) below WCAG AA`); process.exit(1); }
console.log('\n  All pairs meet WCAG AA.');
