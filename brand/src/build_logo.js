/**
 * build_logo.js
 * Generates the GR/TA block mark and lockups as font-independent SVG.
 * Usage: node brand/src/build_logo.js
 * Output: brand/logo/*.svg
 */

const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');
const tokens = require('../tokens.json');

const C = tokens.color;
const OUT = path.resolve(__dirname, '../logo');
fs.mkdirSync(OUT, { recursive: true });

/* ── Letter geometry ──────────────────────────────────────────
   100×100 block, 2×2 grid of 34×34 letter cells, 6-unit gutters.
   Letters are strokes (weight 8.5) clipped to their cell so every
   outer edge is flat and aligned to the grid. */
const W = 8.5;
const h = W / 2;
const cells = {
  G: { x: 14, y: 14 },
  R: { x: 52, y: 14 },
  T: { x: 14, y: 52 },
  A: { x: 52, y: 52 },
};
const S = 34; // cell size

function letterPaths() {
  const g = cells.G, r = cells.R, t = cells.T, a = cells.A;
  const L = (c) => c.x + h, Rr = (c) => c.x + S - h, T = (c) => c.y + h, B = (c) => c.y + S - h;
  const rad = 9; // bowl / arch radius
  return {
    // G: square-shouldered, open top-right, inward bar
    G: `M${Rr(g)} ${g.y - 2} V${T(g)} H${L(g) + rad} Q${L(g)} ${T(g)} ${L(g)} ${T(g) + rad} V${B(g) - rad} Q${L(g)} ${B(g)} ${L(g) + rad} ${B(g)} H${Rr(g)} V${g.y + 17} H${g.x + 19}`,
    // R: stem, rounded bowl, diagonal leg
    R: `M${L(r)} ${r.y + S + 2} V${T(r)} H${Rr(r) - rad} Q${Rr(r)} ${T(r)} ${Rr(r)} ${T(r) + rad - 1} V${r.y + 11} Q${Rr(r)} ${r.y + 19.5} ${Rr(r) - rad} ${r.y + 19.5} H${L(r)} M${r.x + 20} ${r.y + 19.5} L${r.x + S + 4} ${r.y + S + 4}`,
    // T: full-width bar, centred stem
    T: `M${t.x - 2} ${T(t)} H${t.x + S + 2} M${t.x + S / 2} ${T(t)} V${t.y + S + 2}`,
    // A: rounded arch, crossbar
    A: `M${L(a)} ${a.y + S + 2} V${T(a) + rad} Q${L(a)} ${T(a)} ${L(a) + rad} ${T(a)} H${Rr(a) - rad} Q${Rr(a)} ${T(a)} ${Rr(a)} ${T(a) + rad} V${a.y + S + 2} M${L(a)} ${a.y + 21} H${Rr(a)}`,
  };
}

/* Each letter is clipped to its own cell, so strokes never bleed into a neighbour. */
function markGroup({ block, letters, idp }) {
  const p = letterPaths();
  const defs = Object.entries(cells)
    .map(([k, c]) => `<clipPath id="${idp}-${k}"><rect x="${c.x}" y="${c.y}" width="${S}" height="${S}"/></clipPath>`)
    .join('');
  const letterEls = Object.keys(cells)
    .map((k) => `<path clip-path="url(#${idp}-${k})" d="${p[k]}"/>`)
    .join('');
  return `<defs>${defs}</defs>
  ${block ? `<rect width="100" height="100" rx="12" fill="${block}"/>` : ''}
  <g fill="none" stroke="${letters}" stroke-width="${W}" stroke-linejoin="round" stroke-linecap="butt">${letterEls}</g>`;
}

function mark(opts, title = 'GRTA') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${title}">
  <title>${title}</title>
  ${markGroup({ ...opts, idp: opts.idp || 'm' })}
</svg>\n`;
}

/* ── Living mark: a luminous thread runs through the gutters ── */
function livingMark() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="GRTA">
  <title>GRTA</title>
  <style>
    .thread { stroke-dasharray: 240; stroke-dashoffset: 240; animation: draw 2.4s cubic-bezier(.6,0,.2,1) .2s forwards; }
    .node { opacity: 0; transform-origin: 50px 50px; animation: pulse 2.4s ease-out 1.6s infinite; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    @keyframes pulse { 0% { opacity: 0; transform: scale(.4); } 30% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @media (prefers-reduced-motion: reduce) { .thread { animation: none; stroke-dashoffset: 0; } .node { animation: none; opacity: 1; } }
  </style>
  ${markGroup({ block: C.ink, letters: C.ember, idp: 'lm' })}
  <path class="thread" d="M50 4 V96 M4 50 H96" fill="none" stroke="${C.fjord}" stroke-width="1.2" stroke-linecap="round"/>
  <circle class="node" cx="50" cy="50" r="3" fill="${C.fjord}"/>
  <circle cx="50" cy="50" r="1.8" fill="${C.snow}"/>
</svg>\n`;
}

/* ── Lockup: mark + "grta.ai" as outlined text ── */
const fontFile = require.resolve('@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-700-normal.woff');
const font = opentype.parse(fs.readFileSync(fontFile).buffer.slice(0));

function wordPath(text, x, baseline, size) {
  const p = font.getPath(text, x, baseline, size, { kerning: true });
  p.fill = null;
  const bbox = p.getBoundingBox();
  return { d: p.toPathData(2), width: bbox.x2 - x };
}

function lockup({ block, letters, word, idp }) {
  const size = 56;
  const w = wordPath('grta.ai', 128, 70, size);
  const total = Math.ceil(128 + w.width + 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} 100" role="img" aria-label="grta.ai">
  <title>grta.ai</title>
  ${markGroup({ block, letters, idp })}
  <path d="${w.d}" fill="${word}"/>
</svg>\n`;
}

const files = {
  'grta-mark.svg':          mark({ block: C.ink,    letters: C.ember }),
  'grta-mark-reversed.svg': mark({ block: C.birch,  letters: C.ink }),
  'grta-mark-forest.svg':   mark({ block: C.forest, letters: C.snow }),
  'grta-mark-white.svg':    mark({ block: null,     letters: '#FFFFFF' }),
  'grta-mark-ink.svg':      mark({ block: null,     letters: C.ink }),
  'grta-mark-living.svg':   livingMark(),
  'grta-lockup.svg':        lockup({ block: C.ink,    letters: C.ember, word: C.ink,   idp: 'lk' }),
  'grta-lockup-white.svg':  lockup({ block: C.snow,   letters: C.ink,   word: '#FFFFFF', idp: 'lw' }),
  'grta-lockup-forest.svg': lockup({ block: C.forest, letters: C.snow,  word: C.forest, idp: 'lf' }),
};

for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), svg);
  console.log(`  ✓  ${name}`);
}
