# grta.ai

The GRTA website: **People move work forward.**
Next.js 16 · Tailwind CSS 4 · next-intl · Supabase · Claude API.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Everything works without any keys: the Lab uses its built-in engine and leads go to the existing Google Sheet. To switch on the rest, copy `.env.example` to `.env.local` and fill in what you have:

| Variable | Enables |
|---|---|
| `ANTHROPIC_API_KEY` | Claude-powered Lab results (Claude Sonnet 5.5) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Storing leads, pulses and opt-in Lab sessions (schema in `supabase/migrations/`) |
| `LEAD_SHEET_URL` | A different Google Sheet endpoint (defaults to the current one) |

## Pages

| Route | What |
|---|---|
| `/` | Home: hero, Pick your door (HR / Project teams), live demo, 9→3→1, how it learns, trust, contact |
| `/how-it-works` | The journey · The HIIT method · Rolling it out |
| `/lab` | Five demos as tabs: `#brief`, `#translate`, `#team`, `#hiit`, `#network` |
| `/partners` | Universities & research, Challenge Exchange |
| `/about` | AI + BI + CI = DI, story, Trust & GDPR |
| `/legal` | Privacy notice and terms (draft, needs legal review) |

"Book a demo" is a modal on every page (deep link: `/#book-a-demo`).

## Where things live

| Path | |
|---|---|
| `messages/en.json` | **All copy.** Edit words here, not in components. |
| `brand/` | Brand system: tokens, logo, icons, motifs, guidelines. Rebuild with `npm run brand:build`. |
| `public/illustrations/` | Drop final art here as `<slot>.webp` (names in `brand/illustration-bible.md`). It replaces the placeholder automatically; rebuild for production. |
| `lib/lab/` | Lab engines: competencies, Nordlys Group (fictional data), brief, translate, team matching, HIIT |
| `lib/ai/` | Claude client and prompts |
| `app/api/` | Lab, lead and pulse endpoints |
| `content/legal.ts` | Legal text |

## Checks

```bash
npm run typecheck
npm run lint
npm run build
node tools/review_screenshot.js http://localhost:3000 /,/lab 1440,390 light,dark   # per-section screenshots → .tmp/review
node tools/test_lab.js http://localhost:3000                                       # drives every Lab demo
```

On Windows Git Bash, prefix the review command with `MSYS_NO_PATHCONV=1` so `/` isn't rewritten into a Windows path.

## Danish

i18n is wired. To launch Danish, translate `messages/da.json` (any missing key falls back to English) and add `'da'` to `locales` in `i18n/routing.ts`.
