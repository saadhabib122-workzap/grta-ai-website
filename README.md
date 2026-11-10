# GRTA website

One page that makes people trust GRTA before, during or after a conversation with us.
Next.js 16 · Tailwind CSS 4 · next-intl · hosted on Vercel.

## Fix a typo or change a line (no developer needed)

All words on the site live in one file: [`messages/en.json`](messages/en.json).

1. Open the file on GitHub and click the pencil icon (Edit).
2. Change the text between the quotes. Keep the quotes, commas and brackets as they are.
3. Click **Commit changes**. Vercel puts the change live in about a minute.

If the site does not update, the change broke the file's format: open the commit on GitHub, check the red cross next to it, and undo the last edit.

## Page structure

`/` is the whole site, in this order: What GRTA does (with the before-and-after hero), How it works (ABCD), What you get, Greater together, Customer cases, Who we are, Security and compliance, Getting started with the news sign-up. `/legal` holds the privacy notice and terms.

Every call to action opens the same contact form. Contact requests and news sign-ups both go to the team's Google Sheet; the `mode` column says which is which (`demo`, `contact`, `cocreate`, `news`).

## Placeholders to replace

| What | Where |
|---|---|
| Short team profiles | `team.people` in `messages/en.json` (photos live in `public/team/`) |
| Platform screenshot | The "Screenshot of the GRTA platform coming soon" frame in `app/[locale]/page.tsx` |
| Log in link | Left out until the platform is confirmed invite-only; add it to `components/layout/Nav.tsx` |

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

No keys are needed. Optional settings are in `.env.example` (copy to `.env.local`):

| Variable | What it does |
|---|---|
| `LEAD_SHEET_URL` | The Google Sheet (Apps Script) that receives contact requests and news sign-ups |
| `NEXT_PUBLIC_SITE_URL` | The public address, used for link previews |

Visitor numbers come from Vercel Web Analytics: switch it on under the project's **Analytics** tab in Vercel.

## Where things live

| Path | |
|---|---|
| `messages/en.json` | **All copy.** |
| `app/[locale]/page.tsx` | The one page and its sections |
| `components/home/BeforeAfter.tsx` | The "switch on GRTA" hero visual |
| `components/contact/` | Contact form, modal and news sign-up |
| `app/api/lead/route.ts` | Sends form submissions to the Google Sheet |
| `content/legal.ts` | Privacy notice and terms |
| `brand/` | Logo, colours and icons. Colours live in `brand/tokens.json`; rebuild with `node brand/src/build_tokens.js` |

## Checks

```bash
npm run typecheck
npm run lint
npm run build
node tools/review_screenshot.js http://localhost:3000 /,/legal 1440,390 light   # screenshots → .tmp/review
```

On Windows Git Bash, prefix the review command with `MSYS_NO_PATHCONV=1`.

## Danish

Language switching is built in. To launch Danish, translate `messages/da.json` (any missing key falls back to English) and add `'da'` to `locales` in `i18n/routing.ts`.
