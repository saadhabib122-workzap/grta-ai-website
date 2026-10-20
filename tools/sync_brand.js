/**
 * sync_brand.js
 * Copies generated brand assets into public/ and app/ for the website.
 * Runs automatically before `npm run dev` and `npm run build`.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const B = (...p) => path.join(ROOT, 'brand', ...p);
const P = (...p) => path.join(ROOT, 'public', ...p);

const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
};

/* Logos and motifs */
for (const f of fs.readdirSync(B('logo'))) copy(B('logo', f), P('brand', f));
for (const f of fs.readdirSync(B('motifs'))) copy(B('motifs', f), P('brand', f));

/* Illustration placeholders (final art goes in public/illustrations/<slot>.webp) */
for (const f of fs.readdirSync(B('illustrations'))) copy(B('illustrations', f), P('illustrations', 'placeholders', f));

/* Icon sprite: accent strokes use a CSS variable so they work through <use> */
const sprite = fs.readFileSync(B('icons', 'sprite.svg'), 'utf8')
  .replace(/ class="a"/g, ' stroke="var(--icon-accent, currentColor)"')
  .replace(' style="display:none"', '');
fs.writeFileSync(P('brand', 'icons.svg'), sprite);

/* Metadata files picked up by Next.js file conventions */
copy(B('export', 'favicon.ico'), path.join(ROOT, 'app', 'favicon.ico'));
copy(B('export', 'favicon.svg'), path.join(ROOT, 'app', 'icon.svg'));
copy(B('export', 'apple-touch-icon.png'), path.join(ROOT, 'app', 'apple-icon.png'));
copy(B('export', 'og-default.png'), path.join(ROOT, 'app', 'opengraph-image.png'));

fs.mkdirSync(P('illustrations'), { recursive: true });
console.log('  ✓  brand assets synced to public/ and app/');
