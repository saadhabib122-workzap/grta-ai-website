/**
 * Puppeteer only powers the local review tools (screenshots, PDFs).
 * Skip its Chrome download on Vercel, where it is never used.
 */
module.exports = { skipDownload: Boolean(process.env.VERCEL) };
