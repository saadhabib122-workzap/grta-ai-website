/**
 * build_motifs.js
 * Brand motifs and illustration placeholders, generated from tokens.
 * Usage: node brand/src/build_motifs.js
 * Output: brand/motifs/*.svg, brand/illustrations/placeholder-*.svg
 */

const fs = require('fs');
const path = require('path');
const C = require('../tokens.json').color;

const MOTIFS = path.resolve(__dirname, '../motifs');
const ILLU = path.resolve(__dirname, '../illustrations');
fs.mkdirSync(MOTIFS, { recursive: true });
fs.mkdirSync(ILLU, { recursive: true });

/* Deterministic pseudo-random so motifs are stable between builds */
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/* ── 1. Thread pattern: tileable constellation ─────────────── */
function threadPattern(size = 240, n = 12) {
  seed = 11;
  const pts = Array.from({ length: n }, () => [Math.round(rnd() * size), Math.round(rnd() * size)]);
  // toroidal nearest neighbours, so edges wrap across tile borders seamlessly
  const wrapD = (a, b) => { const d = b - a; return d > size / 2 ? d - size : d < -size / 2 ? d + size : d; };
  const edges = [];
  const seen = new Set();
  pts.forEach((p, i) => {
    pts.map((q, j) => [j, wrapD(p[0], q[0]), wrapD(p[1], q[1])])
      .filter(([j]) => j !== i)
      .sort((a, b) => Math.hypot(a[1], a[2]) - Math.hypot(b[1], b[2]))
      .slice(0, 2)
      .forEach(([j, dx, dy]) => {
        const key = [i, j].sort().join('-');
        if (seen.has(key)) return;
        seen.add(key);
        edges.push([p, [p[0] + dx, p[1] + dy]]);
      });
  });
  // draw the tile plus its 8 neighbours so every wrapped segment is complete
  const offs = [-1, 0, 1].flatMap((x) => [-1, 0, 1].map((y) => [x * size, y * size]));
  const lines = offs.flatMap(([ox, oy]) => edges.map(([a, b]) =>
    `<line x1="${a[0] + ox}" y1="${a[1] + oy}" x2="${b[0] + ox}" y2="${b[1] + oy}"/>`)).join('');
  const dots = offs.flatMap(([ox, oy]) => pts.map((p, i) =>
    `<circle cx="${p[0] + ox}" cy="${p[1] + oy}" r="${i % 4 === 0 ? 2.4 : 1.5}"/>`)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <g stroke="${C.fjord}" stroke-width="0.8" opacity="0.7">${lines}</g>
  <g fill="${C.fjord}">${dots}</g>
</svg>\n`;
}

/* ── 2. Coverage map: competency × team member ─────────────── */
function coverageMap() {
  const rows = ['Strategy', 'Economy', 'Legal', 'Operations', 'Supply chain', 'Customers', 'Tech &amp; data', 'Comms', 'Risk'];
  const levels = [ // 0 gap, 1 adequate, 2 strong  (per row: 5 people)
    [2, 1, 0, 0, 1], [1, 0, 2, 0, 0], [0, 0, 0, 0, 0], [0, 2, 1, 1, 0], [0, 2, 0, 1, 0],
    [1, 0, 0, 0, 2], [0, 1, 0, 2, 0], [1, 0, 0, 0, 2], [0, 0, 1, 1, 0],
  ];
  const col = [C.ember, C.fjord, C.moss];
  const cx = (j) => 150 + j * 34, cy = (i) => 40 + i * 30;
  let body = '';
  rows.forEach((r, i) => {
    body += `<text x="16" y="${cy(i) + 4}" font-family="Inter, sans-serif" font-size="12" fill="${C.ink}">${r}</text>`;
    const best = Math.max(...levels[i]);
    levels[i].forEach((v, j) => {
      body += v === 0
        ? `<circle cx="${cx(j)}" cy="${cy(i)}" r="5" fill="none" stroke="${C.line}" stroke-width="1.5"/>`
        : `<circle cx="${cx(j)}" cy="${cy(i)}" r="${v === 2 ? 9 : 6.5}" fill="${col[v]}"/>`;
    });
    body += `<circle cx="${cx(5) + 14}" cy="${cy(i)}" r="4" fill="${col[best]}"/>`;
    if (best === 0) body += `<text x="${cx(5) + 26}" y="${cy(i) + 4}" font-family="Geist Mono, monospace" font-size="10" fill="#C2410C">GAP</text>`;
  });
  const legend = [['Strong', C.moss], ['Adequate', C.fjord], ['Gap', C.ember]]
    .map(([l, c], k) => `<circle cx="${20 + k * 92}" cy="320" r="5" fill="${c}"/><text x="${30 + k * 92}" y="324" font-family="Geist Mono, monospace" font-size="10" fill="${C.stone}">${l.toUpperCase()}</text>`).join('');
  const heads = ['A', 'B', 'C', 'D', 'E'].map((h, j) => `<text x="${cx(j)}" y="16" text-anchor="middle" font-family="Geist Mono, monospace" font-size="10" fill="${C.stone}">${h}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 340" role="img" aria-label="Coverage map example">
  <rect width="380" height="340" rx="16" fill="${C.snow}"/>${heads}${body}${legend}
</svg>\n`;
}

/* ── 3. 20×20 slide stack ──────────────────────────────────── */
function slideStack(label = '20×20') {
  const sheet = (o, fill) => `<rect x="${12 + o}" y="${8 + o}" width="96" height="66" rx="6" fill="${fill}" stroke="${C.ink}" stroke-width="2"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 96" role="img" aria-label="${label} slide stack">
  ${sheet(12, C.birch)}${sheet(6, C.birch)}${sheet(0, C.snow)}
  <text x="60" y="47" text-anchor="middle" font-family="Schibsted Grotesk, sans-serif" font-weight="700" font-size="18" fill="${C.ink}">${label}</text>
  <rect x="24" y="58" width="72" height="3" rx="1.5" fill="${C.ember}"/>
</svg>\n`;
}

/* ── 4. Illustration placeholders ──────────────────────────────
   Soft silhouettes joined by threads, in brand colours. Each slot has a
   fixed aspect ratio so final art drops in without layout change. */
function person(x, y, s, body, head) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-34 90 C-34 40 -22 22 0 22 C22 22 34 40 34 90 Z" fill="${body}"/>
    <circle cx="0" cy="-4" r="20" fill="${head}"/>
  </g>`;
}
function placeholder(w, h, n, label) {
  seed = 3 + n;
  const bodies = [C.forest, C.moss, C.clay, '#3E5A4D', '#B98F70', '#88A6B5'];
  const heads = ['#C99B78', '#8A5E44', '#E3C2A4', '#6B4532', '#D6A985', '#A97A5A'];
  const baseY = h * 0.56;
  const span = w * 0.6;
  const people = Array.from({ length: n }, (_, i) => {
    const x = w * 0.2 + (span / (n - 1 || 1)) * i;
    const y = baseY + (i % 2 ? h * 0.04 : -h * 0.02);
    return { x, y };
  });
  const s = Math.min(w, h) / 360;
  const threads = people.flatMap((p, i) => people.slice(i + 1, i + 3).map((q) =>
    `<path d="M${p.x} ${p.y - 4 * s} Q${(p.x + q.x) / 2} ${p.y - h * 0.22} ${q.x} ${q.y - 4 * s}" />`)).join('');
  const nodes = people.map((p) => `<circle cx="${p.x}" cy="${p.y - 4 * s}" r="${3.5 * s}" fill="${C.fjord}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <rect width="${w}" height="${h}" fill="${C.birch}"/>
  <ellipse cx="${w / 2}" cy="${h * 0.86}" rx="${w * 0.42}" ry="${h * 0.07}" fill="#E9DFCF"/>
  ${people.map((p, i) => person(p.x, p.y, s, bodies[i % bodies.length], heads[i % heads.length])).join('')}
  <rect x="${w * 0.1}" y="${h * 0.76}" width="${w * 0.8}" height="${h * 0.1}" rx="${h * 0.02}" fill="#B9946E"/>
  <rect x="${w * 0.08}" y="${h * 0.74}" width="${w * 0.84}" height="${h * 0.05}" rx="${h * 0.025}" fill="#C9A882"/>
  <g fill="none" stroke="${C.fjord}" stroke-width="${1.6 * s}" opacity="0.9">${threads}</g>
  ${nodes}
  <text x="${w - Math.max(28, w * 0.03)}" y="${h - Math.max(24, h * 0.035)}" text-anchor="end" font-family="Geist Mono, monospace" font-size="${Math.max(10, 11 * s)}" fill="${C.stone}" opacity="0.7">${label}</text>
</svg>\n`;
}

const motifs = {
  'threads-pattern.svg': threadPattern(),
  'coverage-map.svg': coverageMap(),
  'slide-stack.svg': slideStack(),
};
for (const [n, s] of Object.entries(motifs)) fs.writeFileSync(path.join(MOTIFS, n), s);

const slots = {
  'placeholder-wide-16x10.svg': [1600, 1000, 5, 'PLACEHOLDER · 16:10'],
  'placeholder-square-1x1.svg': [1000, 1000, 3, 'PLACEHOLDER · 1:1'],
  'placeholder-portrait-4x5.svg': [800, 1000, 2, 'PLACEHOLDER · 4:5'],
  'placeholder-banner-3x1.svg': [1800, 600, 6, 'PLACEHOLDER · 3:1'],
};
for (const [n, args] of Object.entries(slots)) fs.writeFileSync(path.join(ILLU, n), placeholder(...args));

console.log(`  ✓  ${Object.keys(motifs).length} motifs, ${Object.keys(slots).length} placeholders`);
