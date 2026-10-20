/**
 * build_icons.js
 * GRTA line icon set: 24×24 grid, 1.5 stroke, round caps and joins, currentColor.
 * An optional accent element (class "a") takes the ember colour via CSS: .icon .a { stroke: var(--accent) }.
 * Usage: node brand/src/build_icons.js
 * Output: brand/icons/<name>.svg and brand/icons/sprite.svg
 */

const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '../icons');
fs.mkdirSync(OUT, { recursive: true });

/* Each icon: [group, svg body]. Use <path class="a"> for the one accent stroke. */
const icons = {
  /* ── The 9 HIIT competencies ── */
  'strategy':        ['competency', '<circle cx="11" cy="13" r="8.5"/><circle cx="11" cy="13" r="4.5"/><path class="a" d="M11 13l8.5-8.5M16.5 4.5h3v3"/>'],
  'economy':         ['competency', '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12 16V9M16 16v-6"/><path class="a" d="M7 8l4-3 4 2 5-4"/>'],
  'legal':           ['competency', '<path d="M12 3.5v17M7 20.5h10"/><path d="M5 7.5h14"/><path d="M5 7.5l-2.5 6a2.5 2.5 0 0 0 5 0z"/><path d="M19 7.5l-2.5 6a2.5 2.5 0 0 0 5 0z"/><circle class="a" cx="12" cy="4" r="1"/>'],
  'operations':      ['competency', '<rect x="2.5" y="8.5" width="6" height="7" rx="1.2"/><rect x="15.5" y="8.5" width="6" height="7" rx="1.2"/><path class="a" d="M8.5 12h7M13 9.5l2.5 2.5-2.5 2.5"/><path d="M5.5 8.5V5h13v3.5"/>'],
  'supply-chain':    ['competency', '<rect x="2.5" y="6.5" width="11" height="9" rx="1.5"/><path d="M13.5 9.5h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/><path class="a" d="M5.5 11h5"/>'],
  'customers':       ['competency', '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.5a6.5 6.5 0 0 1 3 5.5"/><circle class="a" cx="9" cy="8" r=".9"/>'],
  'technology-data': ['competency', '<ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/><path class="a" d="M15 18.5h2"/>'],
  'communication':   ['competency', '<path d="M4 4.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-9l-5 4v-4H4A1.5 1.5 0 0 1 2.5 15V6A1.5 1.5 0 0 1 4 4.5z"/><path class="a" d="M7 9.5h10M7 12.5h6"/>'],
  'risk-security':   ['competency', '<path d="M12 2.5l8 3v6c0 4.7-3.4 8.6-8 10-4.6-1.4-8-5.3-8-10v-6z"/><path class="a" d="M8.5 12l2.5 2.5 4.5-5"/>'],

  /* ── Product capabilities ── */
  'brief':           ['capability', '<path d="M6 2.5h8.5l4 4V20a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 20V4A1.5 1.5 0 0 1 6 2.5z"/><path d="M14 2.5v4.5h4.5"/><path d="M8 12h8M8 15.5h8M8 8.5h3"/><path class="a" d="M8 19h4"/>'],
  'gap':             ['capability', '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect class="a" x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke-dasharray="2.2 2"/>'],
  'translate':       ['capability', '<path d="M3 6.5h9M7.5 4v2.5M5 6.5c.8 3 2.8 5.3 6 6.5M10 6.5c-.8 3-2.8 5.3-6 6.5"/><path class="a" d="M13 20.5l4-10 4 10M14.5 17h5"/>'],
  'match':           ['capability', '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/><path class="a" d="M12 6.8a6 6 0 0 1 0 10.4 6 6 0 0 1 0-10.4z"/>'],
  'coverage':        ['capability', '<circle cx="5" cy="5" r="1.6"/><circle cx="12" cy="5" r="1.6"/><circle cx="19" cy="5" r="1.6"/><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/><circle cx="5" cy="19" r="1.6"/><circle cx="12" cy="19" r="1.6"/><circle class="a" cx="19" cy="19" r="1.6"/>'],
  'variants':        ['capability', '<rect x="2.5" y="7" width="5.5" height="10" rx="1.2"/><rect x="9.25" y="4" width="5.5" height="16" rx="1.2"/><rect class="a" x="16" y="7" width="5.5" height="10" rx="1.2"/>'],
  'wildcard':        ['capability', '<rect x="5" y="2.5" width="14" height="19" rx="2"/><path class="a" d="M12 7.5l1.3 3.2 3.2 1.3-3.2 1.3L12 16.5l-1.3-3.2L7.5 12l3.2-1.3z"/>'],
  'availability':    ['capability', '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/><path class="a" d="M9 15l2 2 4-4"/>'],
  'pulse':           ['capability', '<circle cx="12" cy="13" r="8"/><path d="M12 2.5v2.5M9.5 2.5h5"/><path class="a" d="M12 13V9M12 13l2.8 2.2"/>'],
  'scout':           ['capability', '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.3 15.3l5.2 5.2"/><path class="a" d="M10.5 7.5v6M7.5 10.5h6"/>'],
  'network-7x7':     ['capability', '<circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="3.5" r="1.3"/><circle cx="19.4" cy="7.8" r="1.3"/><circle cx="19.4" cy="16.2" r="1.3"/><circle cx="12" cy="20.5" r="1.3"/><circle cx="4.6" cy="16.2" r="1.3"/><circle cx="4.6" cy="7.8" r="1.3"/><path class="a" d="M12 9.5V4.8M14.2 10.8l4-2.3M14.2 13.2l4 2.3M12 14.5v4.7M9.8 13.2l-4 2.3M9.8 10.8l-4-2.3"/>'],
  'hiit':            ['capability', '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 3.5v2.5M10 3h4M18.5 7l1.3-1.3"/><path class="a" d="M12.8 9.5l-2.6 4.5h3.6l-2.6 4"/>'],
  'collective':      ['capability', '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="17" r="2"/><path d="M11 6.8L6 15.2M13 6.8l5 8.4M7 17h10"/><circle class="a" cx="12" cy="13" r="1.4"/>'],

  /* ── Interface ── */
  'arrow-right':     ['ui', '<path d="M4 12h16M14 6l6 6-6 6"/>'],
  'arrow-up-right':  ['ui', '<path d="M7 17L17 7M8 7h9v9"/>'],
  'check':           ['ui', '<path d="M4.5 12.5l5 5 10-11"/>'],
  'plus':            ['ui', '<path d="M12 5v14M5 12h14"/>'],
  'close':           ['ui', '<path d="M6 6l12 12M18 6L6 18"/>'],
  'menu':            ['ui', '<path d="M4 7h16M4 12h16M4 17h10"/>'],
  'play':            ['ui', '<circle cx="12" cy="12" r="9"/><path class="a" d="M10 8.5v7l5.5-3.5z"/>'],
  'mail':            ['ui', '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path class="a" d="M3 6.5l9 6.5 9-6.5"/>'],
  'lock':            ['ui', '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><circle class="a" cx="12" cy="15.5" r="1.2"/>'],
  'globe':           ['ui', '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>'],
  'spark':           ['ui', '<path class="a" d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z"/><path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>'],
  'theme':           ['ui', '<path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"/>'],
  'download':        ['ui', '<path d="M12 3.5v12M7 11l5 5 5-5M4.5 20.5h15"/>'],
};

const wrap = (body, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"${extra}>${body}</svg>\n`;

const symbols = [];
for (const [name, [, body]] of Object.entries(icons)) {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), wrap(body, ' class="icon"'));
  symbols.push(`  <symbol id="i-${name}" viewBox="0 0 24 24">${body}</symbol>`);
}

fs.writeFileSync(path.join(OUT, 'sprite.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\n${symbols.join('\n')}\n</svg>\n`);

fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(
  Object.fromEntries(Object.entries(icons).map(([n, [g]]) => [n, g])), null, 2) + '\n');

console.log(`  ✓  ${Object.keys(icons).length} icons + sprite.svg + index.json → ${OUT}`);
