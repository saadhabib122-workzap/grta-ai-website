/**
 * build_guidelines.js
 * Assembles brand/guidelines.html from the real asset files (logo, icons, motifs,
 * tokens), so the guidelines can never drift from the assets.
 * Usage: node brand/src/build_guidelines.js   (then render with tools/render_pdf.js)
 */

const fs = require('fs');
const path = require('path');
const tokens = require('../tokens.json');

const ROOT = path.resolve(__dirname, '..');
const C = tokens.color;
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
const inline = (markup, attrs) => markup.replace(/<\?xml[^>]*>/, '').replace('<svg ', `<svg ${attrs} `);
const resolve = (v) => String(v).replace(/\{color\.(\w+)\}/g, (_, k) => C[k]);

/* Unique clip ids per inlined logo, so repeated marks don't collide */
let uid = 0;
const logo = (file, attrs) => {
  uid++;
  return inline(read('logo', file), attrs).replace(/id="(\w+)-/g, `id="$1${uid}-`).replace(/url\(#(\w+)-/g, `url(#$1${uid}-`);
};

const icons = require('../icons/index.json');

/* Show the real hero art once it exists; fall back to the placeholder */
const illustrationManifest = (() => { try { return require('../../lib/illustration-manifest.json'); } catch { return {}; } })();
const heroArt = illustrationManifest['home-hero'] ? `../public/illustrations/${illustrationManifest['home-hero']}` : 'illustrations/placeholder-wide-16x10.svg';
const iconSvg = (n) => inline(read('icons', `${n}.svg`), 'width="28" height="28"');

const swatch = (name, hex, role, dark) => `
  <div class="sw"><div class="chip" style="background:${hex}"></div>
  <div class="sw-i"><b>${name}</b><span class="mono">${hex}</span><span>${role}</span></div></div>`;

const roles = {
  birch: 'Page background', snow: 'Cards, raised surfaces', ink: 'Text, logo block', forest: 'Primary brand, buttons',
  moss: 'Secondary, icons, tags', ember: 'Logo letters, rare accent', fjord: 'Threads, data, glow', clay: 'Illustration warmth',
  stone: 'Secondary text', line: 'Borders, dividers',
};

const typeRows = [
  ['display', 'Display', 'People move work forward.', 'display'],
  ['h1', 'H1', 'The right people, at the right time.', 'display'],
  ['h2', 'H2', 'From problem to plan, together.', 'display'],
  ['h3', 'H3', 'Gap detection taps you on the shoulder.', 'display'],
  ['lead', 'Lead', 'GRTA helps HR and project teams bring the right people together around a real problem.', 'body'],
  ['body', 'Body', 'Write a messy paragraph about what you need. GRTA turns it into a clear brief, spots what is missing, and suggests people who can help. You decide.', 'body'],
  ['label', 'Label', 'COVERAGE · 0.92', 'mono'],
];
const pxSize = { display: 88, h1: 64, h2: 44, h3: 24, lead: 20, body: 16, label: 12 };

const groups = Object.entries(icons).reduce((acc, [n, g]) => ((acc[g] = acc[g] || []).push(n), acc), {});

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>GRTA Brand Guidelines</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
${read('tokens.css')}
@page { size: A4 landscape; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: var(--font-body); color: var(--c-ink); background: #fff; font-size: 11pt; line-height: 1.5; }
.page { width: 297mm; height: 210mm; padding: 16mm 18mm; position: relative; overflow: hidden; break-after: page; background: var(--c-snow); }
.page.birch { background: var(--c-birch); }
.page.forest { background: var(--c-forest); color: var(--c-snow); }
.page.ink { background: var(--c-ink); color: var(--c-snow); }
h1, h2, h3 { font-family: var(--font-display); letter-spacing: -0.02em; line-height: 1.05; }
h2 { font-size: 30pt; font-weight: 700; margin-bottom: 3mm; }
h3 { font-size: 13pt; font-weight: 700; margin-bottom: 2mm; }
p { max-width: 150mm; margin-bottom: 2.5mm; }
.mono { font-family: var(--font-mono); font-size: 8.5pt; }
.label { font-family: var(--font-mono); font-size: 7.5pt; letter-spacing: .14em; text-transform: uppercase; color: var(--c-moss); display: block; margin-bottom: 3mm; }
.forest .label, .ink .label { color: var(--c-fjord); }
.head { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1.5px solid currentColor; padding-bottom: 3mm; margin-bottom: 7mm; }
.head .no { font-family: var(--font-mono); font-size: 9pt; color: var(--c-stone); }
.forest .head .no, .ink .head .no { color: var(--c-fjord); }
.lede { font-size: 13pt; color: var(--c-stone); max-width: 190mm; margin-bottom: 7mm; }
.forest .lede, .ink .lede { color: #C9D3CC; }
.grid { display: grid; gap: 6mm; }
.g2 { grid-template-columns: 1fr 1fr; } .g3 { grid-template-columns: repeat(3, 1fr); } .g4 { grid-template-columns: repeat(4, 1fr); } .g5 { grid-template-columns: repeat(5, 1fr); }
.tile { border-radius: 4mm; padding: 6mm; display: flex; flex-direction: column; justify-content: space-between; gap: 4mm; }
.tile .cap { font-family: var(--font-mono); font-size: 7.5pt; letter-spacing: .1em; text-transform: uppercase; opacity: .75; }
.card { background: var(--c-snow); border: 1px solid var(--c-line); border-radius: 4mm; padding: 5mm; }
.birch .card { background: var(--c-snow); }
ul.clean { list-style: none; } ul.clean li { padding: 1.6mm 0; border-bottom: 1px solid var(--c-line); font-size: 10pt; }
ul.clean li b { font-weight: 600; }
.dont li::before { content: "✕  "; color: #C2410C; font-weight: 600; }
.do li::before { content: "✓  "; color: var(--c-moss); font-weight: 600; }
.sw { border-radius: 3mm; overflow: hidden; border: 1px solid var(--c-line); background: var(--c-snow); }
.sw .chip { height: 26mm; }
.sw-i { padding: 3mm 4mm; display: flex; flex-direction: column; gap: .5mm; font-size: 9pt; }
.sw-i b { font-family: var(--font-display); font-size: 12pt; }
.sw-i .mono { color: var(--c-stone); }
.type-row { display: grid; grid-template-columns: 30mm 1fr 52mm; gap: 6mm; align-items: baseline; padding: 1.8mm 0; border-bottom: 1px solid var(--c-line); }
.type-row .spec { font-family: var(--font-mono); font-size: 7.5pt; color: var(--c-stone); }
.icon .a, svg .a { stroke: var(--c-ember); }
.ic { display: flex; flex-direction: column; align-items: center; gap: 1.5mm; font-family: var(--font-mono); font-size: 6.5pt; color: var(--c-stone); text-align: center; }
.btn { display: inline-flex; align-items: center; gap: 2.5mm; border-radius: 999px; padding: 3mm 6mm; font-weight: 600; font-size: 10pt; font-family: var(--font-body); }
.btn svg { width: 16px; height: 16px; }
.btn.primary { background: var(--c-forest); color: var(--c-snow); }
.btn.secondary { background: transparent; color: var(--c-ink); border: 1.5px solid var(--c-ink); }
.btn.ghost { color: var(--c-forest); padding-left: 0; }
.tag { display: inline-block; font-family: var(--font-mono); font-size: 7.5pt; letter-spacing: .08em; text-transform: uppercase; color: #55704F; background: #E7EDE2; border-radius: 999px; padding: 1mm 3mm; margin: 0 1.5mm 1.5mm 0; }
.tag.ember { color: #C2410C; background: #FBE5DA; }
.tag.fjord { color: #3F6577; background: #E2ECF1; }
.foot { position: absolute; left: 18mm; right: 18mm; bottom: 9mm; display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 7pt; color: var(--c-stone); letter-spacing: .08em; }
.forest .foot, .ink .foot { color: #8FA39A; }
</style></head><body>

<!-- 1 · Cover -->
<section class="page birch">
  <div style="position:absolute;inset:0;background:url('motifs/threads-pattern.svg');opacity:.55;-webkit-mask-image:linear-gradient(110deg,transparent 35%,#000 75%)"></div>
  <div style="position:relative;height:100%;display:flex;flex-direction:column;align-items:flex-start">
    ${logo('grta-lockup.svg', 'height="44"')}
    <div style="margin-top:auto">
      <span class="label">Brand guidelines · v1 · October 2026</span>
      <h1 style="font-size:66pt;font-weight:800;letter-spacing:-.03em;line-height:.98">People move<br><span style="color:var(--c-forest)">work forward.</span></h1>
      <p class="lede" style="margin-top:6mm">Nordic Futurism: warm people, luminous threads.</p>
    </div>
  </div>
</section>

<!-- 2 · Concept -->
<section class="page">
  <div class="head"><h2>The idea</h2><span class="no">01 · CONCEPT</span></div>
  <p class="lede">GRTA is about people finding each other. The brand keeps people and relationships in front, and shows the technology only as the connections between them.</p>
  <div class="grid g3">
    <div class="card"><h3>Warm people</h3><p>Tactile, calm, real. Natural materials, daylight, generous space. The first thing you notice is always a person.</p></div>
    <div class="card"><h3>Luminous threads</h3><p>Our futurism is quiet: fine fjord-blue lines and nodes that link people. They are how we draw Collective Intelligence.</p></div>
    <div class="card"><h3>Nordic clarity</h3><p>Few colours, short sentences, lots of white space. Nothing shouts. Trust comes from calm.</p></div>
  </div>
  <div style="margin-top:9mm"><span class="label">Brand attributes</span>
    <div style="display:flex;gap:4mm;flex-wrap:wrap;font-family:var(--font-display);font-size:22pt;font-weight:700">
      <span>Human</span><span style="color:var(--c-fjord)">·</span><span>Connected</span><span style="color:var(--c-fjord)">·</span><span>Calm</span><span style="color:var(--c-fjord)">·</span><span>Clear</span><span style="color:var(--c-fjord)">·</span><span style="color:var(--c-forest)">Quietly ahead</span>
    </div>
  </div>
  <div class="card" style="margin-top:9mm;background:var(--c-birch);display:grid;grid-template-columns:auto 1fr;gap:10mm;align-items:center">
    <div style="font-family:var(--font-display);font-weight:800;font-size:30pt;letter-spacing:-.02em;white-space:nowrap">AI + BI + <span style="color:var(--c-forest)">CI</span> = DI</div>
    <p style="margin:0;max-width:none">Artificial Intelligence and Business Intelligence are only half the picture. Add the <b>Collective Intelligence</b> of your people and you get <b>Decision Intelligence</b>: better decisions, made faster, by the right people.</p>
  </div>
  <div class="foot"><span>GRTA BRAND GUIDELINES</span><span>AI + BI + CI = DI</span></div>
</section>

<!-- 3 · Logo -->
<section class="page">
  <div class="head"><h2>The GR/TA mark</h2><span class="no">02 · LOGO</span></div>
  <div class="grid" style="grid-template-columns: 1.1fr 1fr; gap: 10mm">
    <div class="tile" style="background:var(--c-birch);align-items:center;justify-content:center;min-height:110mm">
      ${logo('grta-mark.svg', 'width="210" height="210"')}
    </div>
    <div>
      <p>Four letters, two by two, on one block. A redraw of the original GRTA mark: geometric letters on an even grid, so it stays crisp from a 1024 px app icon down to a 32 px favicon.</p>
      <ul class="clean" style="margin-top:4mm">
        <li><b>Primary:</b> Ember letters on an Ink block. Use wherever possible.</li>
        <li><b>Lockup:</b> mark + “grta.ai” for headers and documents.</li>
        <li><b>Mono:</b> one colour on photos, partner materials and embossing.</li>
        <li><b>Living mark:</b> a thread of light traces the gutters between the letters. Loader and hero intro only.</li>
        <li><b>Clear space:</b> at least one letter cell (a third of the mark) on every side.</li>
        <li><b>Minimum size:</b> 24 px on screen, 8 mm in print. Below that, use the favicon render.</li>
      </ul>
    </div>
  </div>
  <div class="foot"><span>GRTA BRAND GUIDELINES</span><span>brand/logo/</span></div>
</section>

<!-- 4 · Logo variants -->
<section class="page">
  <div class="head"><h2>Variants &amp; lockups</h2><span class="no">02 · LOGO</span></div>
  <div class="grid g4" style="margin-bottom:6mm">
    <div class="tile" style="background:var(--c-birch)"><span class="cap">Primary</span>${logo('grta-mark.svg', 'width="96" height="96"')}</div>
    <div class="tile" style="background:var(--c-birch)"><span class="cap">Forest</span>${logo('grta-mark-forest.svg', 'width="96" height="96"')}</div>
    <div class="tile" style="background:var(--c-birch)"><span class="cap">Ink, no block</span>${logo('grta-mark-ink.svg', 'width="96" height="96"')}</div>
    <div class="tile" style="background:var(--c-ink);color:var(--c-snow)"><span class="cap">White, no block</span>${logo('grta-mark-white.svg', 'width="96" height="96"')}</div>
  </div>
  <div class="grid g2">
    <div class="tile" style="background:var(--c-birch)"><span class="cap">Lockup · primary</span>${logo('grta-lockup.svg', 'height="60"')}</div>
    <div class="tile" style="background:var(--c-forest);color:var(--c-snow)"><span class="cap">Lockup · on forest</span>${logo('grta-lockup-white.svg', 'height="60"')}</div>
  </div>
  <div class="grid g2" style="margin-top:6mm">
    <ul class="clean do"><li>Keep the block square and the letters ember or one solid colour</li><li>Place on Birch, Snow, Forest or Ink</li></ul>
    <ul class="clean dont"><li>Recolour individual letters, add gradients, shadows or outlines</li><li>Rotate, stretch, or rebuild the mark in a typeface</li></ul>
  </div>
  <div class="foot"><span>GRTA BRAND GUIDELINES</span><span>brand/logo/ · brand/export/</span></div>
</section>

<!-- 5 · Colour -->
<section class="page">
  <div class="head"><h2>Colour</h2><span class="no">03 · COLOUR</span></div>
  <p class="lede" style="margin-bottom:5mm">A warm paper base, forest green for the brand, and ember used like a spice: the logo letters plus at most one accent per screen.</p>
  <div class="grid g5" style="gap:4mm">
    ${Object.entries(C).map(([n, h]) => swatch(n[0].toUpperCase() + n.slice(1), h, roles[n] || '')).join('')}
  </div>
  <div style="display:flex;height:9mm;border-radius:2mm;overflow:hidden;margin-top:6mm">
    <div style="flex:46;background:${C.birch};border:1px solid ${C.line}"></div><div style="flex:20;background:${C.snow};border:1px solid ${C.line}"></div>
    <div style="flex:16;background:${C.forest}"></div><div style="flex:9;background:${C.ink}"></div><div style="flex:4;background:${C.moss}"></div>
    <div style="flex:3;background:${C.fjord}"></div><div style="flex:2;background:${C.ember}"></div>
  </div>
  <p class="mono" style="margin-top:2mm;color:var(--c-stone)">PROPORTION ON A TYPICAL PAGE · EMBER ≤ 5%</p>
  <div class="foot"><span>GRTA BRAND GUIDELINES</span><span>brand/tokens.json</span></div>
</section>

<!-- 6 · Themes -->
<section class="page">
  <div class="head"><h2>Light &amp; Nordic night</h2><span class="no">03 · COLOUR</span></div>
  <p class="lede">Every colour on the site is a semantic token with a light and a dark value. All text pairs pass WCAG AA, checked by script on every build.</p>
  <div class="grid g2">
    ${['light', 'dark'].map((m) => {
      const t = Object.fromEntries(Object.entries(tokens.theme[m]).map(([k, v]) => [k, resolve(v)]));
      return `<div class="tile" style="background:${t.bg};color:${t.text};border:1px solid ${t.border}">
        <span class="cap">${m === 'light' ? 'Light' : 'Nordic night'}</span>
        <div style="background:${t.surface};border:1px solid ${t.border};border-radius:3mm;padding:5mm">
          <div style="font-family:var(--font-display);font-weight:700;font-size:17pt;margin-bottom:1.5mm">Projects like this need change management.</div>
          <div style="color:${t['text-muted']};font-size:10pt;margin-bottom:4mm">You haven't asked for any. Add it to the brief?</div>
          <span style="display:inline-block;background:${t.brand};color:${t['brand-text']};border-radius:999px;padding:2mm 5mm;font-weight:600;font-size:9.5pt">Add change management</span>
          <span style="display:inline-block;color:${t['accent-text']};font-family:var(--font-mono);font-size:8pt;margin-left:3mm">GAP DETECTED</span>
          <svg width="100%" height="34" viewBox="0 0 300 34" style="margin-top:4mm;display:block"><path d="M4 26 C80 2 140 2 200 18 S280 30 296 8" fill="none" stroke="${t.thread}" stroke-width="1.5"/><circle cx="4" cy="26" r="3.5" fill="${t.thread}"/><circle cx="200" cy="18" r="3.5" fill="${t.thread}"/><circle cx="296" cy="8" r="3.5" fill="${t.accent}"/></svg>
        </div>
        <div class="mono" style="color:${t['text-muted']};display:grid;grid-template-columns:repeat(3,1fr);gap:1.2mm 3mm;font-size:7.5pt">${Object.entries(t).map(([k, v]) => `<span style="white-space:nowrap"><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${v};border:1px solid ${t.border};vertical-align:-1px;margin-right:4px"></span>${k} ${v}</span>`).join('')}</div>
      </div>`;
    }).join('')}
  </div>
  <div class="foot"><span>GRTA BRAND GUIDELINES</span><span>brand/tokens.css</span></div>
</section>

<!-- 7 · Typography -->
<section class="page">
  <div class="head"><h2>Typography</h2><span class="no">04 · TYPE</span></div>
  <div class="grid g3" style="margin-bottom:5mm">
    <div class="card"><span class="label">Display</span><div style="font-family:var(--font-display);font-weight:800;font-size:22pt;line-height:1">Schibsted Grotesk</div><p style="font-size:9pt;color:var(--c-stone);margin-top:2mm">Made for a Norwegian newspaper group. Headlines, numbers, the wordmark.</p></div>
    <div class="card"><span class="label">Body</span><div style="font-family:var(--font-body);font-size:22pt;line-height:1">Inter</div><p style="font-size:9pt;color:var(--c-stone);margin-top:2mm">Everything people read for longer than a line.</p></div>
    <div class="card"><span class="label">Data</span><div style="font-family:var(--font-mono);font-size:20pt;line-height:1.1">Geist Mono</div><p style="font-size:9pt;color:var(--c-stone);margin-top:2mm">Labels, scores, coverage values. The machine's quiet voice.</p></div>
  </div>
  ${typeRows.map(([k, name, sample, fam]) => {
    const t = tokens.type[k];
    const size = Math.min(pxSize[k], 34);
    return `<div class="type-row"><span class="label" style="margin:0">${name}</span>
      <div style="font-family:var(--font-${fam});font-size:${size}px;font-weight:${t.weight};letter-spacing:${t.tracking};line-height:${t.line};${k === 'label' ? 'text-transform:uppercase;color:var(--c-moss)' : ''}">${sample}</div>
      <span class="spec">${pxSize[k]}px max · ${t.weight} · ${t.line}${pxSize[k] > 34 ? ' · shown smaller' : ''}</span></div>`;
  }).join('')}
  <div class="foot"><span>GRTA BRAND GUIDELINES</span><span>FLUID SIZES: SEE tokens.json</span></div>
</section>

<!-- 8 · Icons -->
<section class="page">
  <div class="head"><h2>Icons</h2><span class="no">05 · ICONS</span></div>
  <p class="lede" style="margin-bottom:5mm">24 px grid, 1.5 px stroke, round ends. One optional ember stroke per icon carries the meaning.</p>
  ${['competency', 'capability', 'ui'].map((g) => `
    <span class="label">${g === 'competency' ? 'The 9 HIIT competencies' : g === 'capability' ? 'Product capabilities' : 'Interface'}</span>
    <div style="display:grid;grid-template-columns:repeat(13,1fr);gap:3mm;margin-bottom:5mm">
      ${groups[g].map((n) => `<div class="ic">${iconSvg(n)}<span>${n}</span></div>`).join('')}
    </div>`).join('')}
  <div class="foot"><span>GRTA BRAND GUIDELINES</span><span>brand/icons/sprite.svg</span></div>
</section>

<!-- 9 · Motifs -->
<section class="page birch">
  <div class="head"><h2>Motifs</h2><span class="no">06 · MOTIFS</span></div>
  <div class="grid g3">
    <div class="card" style="padding:0;overflow:hidden"><div style="height:62mm;background:var(--c-birch) url('motifs/threads-pattern.svg')"></div>
      <div style="padding:5mm"><h3>Threads</h3><p style="font-size:9.5pt">The constellation pattern. Behind heroes and dark sections, faded at the edges. Never behind body text.</p></div></div>
    <div class="card" style="padding:0;overflow:hidden"><div style="height:62mm;display:flex;align-items:center;justify-content:center;background:var(--c-birch)">${inline(read('motifs', 'coverage-map.svg'), 'height="220"')}</div>
      <div style="padding:5mm"><h3>Coverage map</h3><p style="font-size:9.5pt">Strong, adequate, gap: moss, fjord, ember. The visual language of team quality across the site and product.</p></div></div>
    <div class="card" style="padding:0;overflow:hidden"><div style="height:62mm;display:flex;align-items:center;justify-content:center;background:var(--c-birch)">${inline(read('motifs', 'slide-stack.svg'), 'width="190"')}</div>
      <div style="padding:5mm"><h3>20×20 stack</h3><p style="font-size:9.5pt">Stands for the HIIT Engine's 20 slides × 20 seconds format wherever presentations appear.</p></div></div>
  </div>
  <div class="foot"><span>GRTA BRAND GUIDELINES</span><span>brand/motifs/</span></div>
</section>

<!-- 10 · Illustration -->
<section class="page">
  <div class="head"><h2>Illustration: stop-motion clay</h2><span class="no">07 · ILLUSTRATION</span></div>
  <div class="grid" style="grid-template-columns:1.25fr 1fr;gap:8mm">
    <div>
      <img src="${heroArt}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:4mm;display:block">
      <p class="mono" style="color:var(--c-stone);margin-top:2mm">${illustrationManifest['home-hero'] ? 'HOME HERO · THE CAST TOGETHER' : 'PLACEHOLDER UNTIL FINAL ART · SAME RATIO, SAME FILENAME'}</p>
    </div>
    <div>
      <p>Handmade plasticine characters with big expressive eyes, sculpted hair and knitted clothes, in cozy sunlit Scandinavian studios. Like a still from a stop-motion film. Very faint threads of light hint at what GRTA does.</p>
      <span class="label" style="margin-top:4mm">The cast</span>
      <ul class="clean">
        <li><b>Ingrid</b>, HR lead · <b>Kofi</b>, project lead</li>
        <li><b>Mei</b>, data scientist · <b>Lars</b>, the wildcard</li>
        <li><b>Amara</b>, student · <b>Sofia</b>, 7×7 guide</li>
      </ul>
      <div class="grid g2" style="margin-top:4mm;gap:3mm">
        <ul class="clean do"><li>Fingerprints, yarn, golden light</li><li>Warm smiles, people first</li></ul>
        <ul class="clean dont"><li>Smooth realistic 3D, gloss</li><li>Robots, brains, neon</li></ul>
      </div>
    </div>
  </div>
  <div class="foot"><span>GRTA BRAND GUIDELINES</span><span>brand/illustration-bible.md</span></div>
</section>

<!-- 11 · Voice + UI -->
<section class="page">
  <div class="head"><h2>Voice &amp; first components</h2><span class="no">08 · VOICE · UI</span></div>
  <div class="grid g2" style="gap:10mm">
    <div>
      <ul class="clean">
        <li><b>Human:</b> “Find the people who can help.” Not “Leverage human capital.”</li>
        <li><b>Clear:</b> one idea per sentence. No em dashes.</li>
        <li><b>Calm:</b> confident, never hype. No exclamation marks.</li>
        <li><b>Honest about AI:</b> “GRTA suggests. You decide.”</li>
        <li><b>Concrete:</b> a real example beats an adjective.</li>
      </ul>
      <p style="margin-top:5mm;font-family:var(--font-display);font-size:18pt;font-weight:700;line-height:1.2">“This one may look unusual. Here's why we think Lars could help.”</p>
    </div>
    <div class="card" style="background:var(--c-birch)">
      <span class="label">Buttons</span>
      <div style="display:flex;gap:3mm;flex-wrap:wrap;align-items:center;margin-bottom:6mm">
        <span class="btn primary">Book a demo ${iconSvg('arrow-right').replace('width="28" height="28"', '')}</span>
        <span class="btn secondary">Try the Lab</span>
        <span class="btn ghost">See how it works ${iconSvg('arrow-right').replace('width="28" height="28"', '')}</span>
      </div>
      <span class="label">Tags</span>
      <div style="margin-bottom:5mm"><span class="tag">Strong</span><span class="tag fjord">Adequate</span><span class="tag ember">Gap</span><span class="tag">Supply chain</span></div>
      <span class="label">Person card</span>
      <div style="background:var(--c-snow);border:1px solid var(--c-line);border-radius:4mm;padding:4mm;display:flex;gap:4mm;align-items:center">
        <div style="width:13mm;height:13mm;border-radius:50%;background:${C.clay};flex:none"></div>
        <div style="flex:1"><div style="font-weight:600">Lars Holm</div><div style="font-size:9pt;color:var(--c-stone)">Operations analyst · Logistics</div></div>
        <div style="text-align:right"><div class="mono" style="color:var(--c-moss)">FIT 0.87</div><span class="tag ember" style="margin:1mm 0 0">Wildcard</span></div>
      </div>
    </div>
  </div>
  <div class="foot"><span>GRTA BRAND GUIDELINES</span><span>brand/voice-and-tone.md</span></div>
</section>

<!-- 12 · Back -->
<section class="page forest">
  <div style="position:absolute;inset:0;background:url('motifs/threads-pattern.svg');opacity:.4;-webkit-mask-image:radial-gradient(ellipse at 85% 50%,#000 10%,transparent 65%)"></div>
  <div style="position:relative;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:8mm">
    ${logo('grta-mark-living.svg', 'width="120" height="120"')}
    <div style="font-family:var(--font-display);font-size:40pt;font-weight:800;letter-spacing:-.03em;line-height:1">Be GRTA together.</div>
    <div style="color:#C9D3CC;font-size:13pt">AI connects data. GRTA connects people.</div>
  </div>
</section>

</body></html>`;

fs.writeFileSync(path.join(ROOT, 'guidelines.html'), html);
console.log(`  ✓  ${path.join(ROOT, 'guidelines.html')}`);
