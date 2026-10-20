/**
 * review_screenshot.js
 * Captures every <section> (plus nav and footer) of each route, per viewport and theme,
 * so each part of the site can be reviewed at readable size.
 *
 * Usage: node tools/review_screenshot.js [baseUrl=http://localhost:3005] [routes=/,/lab] [widths=1440,390] [themes=light]
 * Output: .tmp/review/<route>_<width>_<theme>_<nn>.png  and  <route>_<width>_<theme>_full.png
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const [, , base = 'http://localhost:3005', routesArg = '/', widthsArg = '1440,390', themesArg = 'light'] = process.argv;
const routes = routesArg.split(',');
const widths = widthsArg.split(',').map(Number);
const themes = themesArg.split(',');
const OUT = path.resolve(__dirname, '../.tmp/review');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const errors = [];

  for (const route of routes) {
    for (const width of widths) {
      for (const theme of themes) {
        const page = await browser.newPage();
        page.on('pageerror', (e) => errors.push(`${route} @${width}: ${e.message}`));
        page.on('console', (m) => { if (m.type() === 'error') errors.push(`${route} @${width} console: ${m.text()}`); });
        await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
        await page.evaluateOnNewDocument((t) => { try { localStorage.setItem('grta-theme', t); } catch {} }, theme);
        await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 60000 });
        await page.evaluateHandle('document.fonts.ready');
        await new Promise((r) => setTimeout(r, 1500));

        const slug = (route === '/' ? 'home' : route.replace(/^\//, '').replace(/[/#?]/g, '_')) + `_${width}_${theme}`;

        /* Horizontal overflow check */
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 1) errors.push(`${route} @${width}: horizontal overflow ${overflow}px`);

        const els = await page.$$('header, main section, footer');
        let n = 0;
        for (const el of els) {
          const box = await el.boundingBox();
          if (!box || box.height < 20) continue;
          await el.scrollIntoView();
          await new Promise((r) => setTimeout(r, 350));
          await el.screenshot({ path: path.join(OUT, `${slug}_${String(n++).padStart(2, '0')}.png`) });
        }
        await page.screenshot({ path: path.join(OUT, `${slug}_full.png`), fullPage: true });
        console.log(`  ✓  ${route} @${width} ${theme}: ${n} parts`);
        await page.close();
      }
    }
  }

  await browser.close();
  if (errors.length) {
    console.log('\n  Issues:');
    for (const e of [...new Set(errors)]) console.log('  ✗  ' + e);
  } else console.log('\n  No console errors or overflow.');
})();
