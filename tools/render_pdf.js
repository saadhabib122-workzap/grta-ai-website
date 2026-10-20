/**
 * render_pdf.js
 * Renders an HTML document to an A4 PDF, plus per-page PNG previews for review.
 * Usage: node tools/render_pdf.js <input.html> <output.pdf>
 * Previews: .tmp/pdf_preview/page_<n>.png
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('Usage: node tools/render_pdf.js <input.html> <output.pdf>');
  process.exit(1);
}

const PREVIEW_DIR = path.resolve(__dirname, '../.tmp/pdf_preview');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(`file://${path.resolve(input)}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  await page.pdf({
    path: path.resolve(output),
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log(`  ✓  PDF → ${path.resolve(output)}`);

  /* Rasterise the PDF pages for visual review, using Chrome's built-in pdf.js-free path:
     reload the PDF bytes into a page via pdf.js from CDN. */
  fs.rmSync(PREVIEW_DIR, { recursive: true, force: true });
  fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  const data = fs.readFileSync(path.resolve(output)).toString('base64');
  const viewer = await browser.newPage();
  await viewer.setContent(`<html><body style="margin:0;background:#888">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      window.renderAll = async (b64) => {
        const doc = await pdfjsLib.getDocument({ data: atob(b64) }).promise;
        for (let i = 1; i <= doc.numPages; i++) {
          const p = await doc.getPage(i);
          const vp = p.getViewport({ scale: 1.6 });
          const c = document.createElement('canvas');
          c.width = vp.width; c.height = vp.height; c.id = 'p' + i;
          c.style.display = 'block'; c.style.marginBottom = '8px';
          document.body.appendChild(c);
          await p.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
        }
        return doc.numPages;
      };
    </script></body></html>`, { waitUntil: 'networkidle0' });
  const pages = await viewer.evaluate((b) => window.renderAll(b), data);
  for (let i = 1; i <= pages; i++) {
    const el = await viewer.$(`#p${i}`);
    await el.screenshot({ path: path.join(PREVIEW_DIR, `page_${i}.png`) });
  }
  console.log(`  ✓  ${pages} page previews → ${PREVIEW_DIR}`);

  await browser.close();
})();
