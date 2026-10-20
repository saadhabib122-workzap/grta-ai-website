# Workflow: Build & Polish the Website

## Objective
Change the grta.ai site (Next.js) and ship it at production quality, reviewing every edit before moving on.

## Required Inputs
- Brand system in `brand/` (tokens, logo, icons, illustration bible, voice and tone)
- Copy in `messages/en.json`
- Final illustrations in `public/illustrations/<slot>.webp` when available

## Tools
- `npm run typecheck`, `npm run lint`, `npm run build`
- `tools/review_screenshot.js`: per-section screenshots for routes × widths × themes, plus console-error and horizontal-overflow checks
- `tools/test_lab.js`: drives every Lab demo end to end
- `tools/screenshot.js`: one full-page screenshot of any URL or file
- `tools/render_pdf.js`: HTML to PDF with page previews (plan, brand guidelines)
- `npm run brand:build`: regenerate all brand assets from `brand/tokens.json` (includes the WCAG contrast check)

## Process

### 1. Change
- Copy changes go in `messages/en.json` only.
- Colours, type and spacing come from tokens. Never hard-code a new colour; add a token.
- Pages are composed from `components/`. Change a pattern in the component, not per page.
- Illustration slots keep their fixed ratio and filename.

### 2. Self-review after every edit
1. `npm run typecheck && npm run lint` must be clean.
2. With `npm run dev` running:
   `MSYS_NO_PATHCONV=1 node tools/review_screenshot.js http://localhost:3000 <changed routes> 1440,390 light,dark`
   Read each image in `.tmp/review/`. Look for: contrast, spacing, clipping, overflow, awkward wrapping, placeholder leaks, dark-mode problems.
3. If anything in `lib/lab` or `components/lab` changed: `node tools/test_lab.js`.
4. Copy check: plain language, British spelling, **no em dashes**.
5. Fix what you found, then repeat from step 1. Move on only when clean.

### 3. Before shipping
- `npm run build` succeeds.
- Full review at both widths and both themes for all six routes.
- Lab test passes.

## Known edge cases
- **Full-page screenshots show the nav mid-page.** Puppeteer draws fixed and sticky elements at their scrolled position. Check the per-section images instead.
- **Headless Chrome follows the system theme.** `review_screenshot.js` sets the theme explicitly; `screenshot.js` takes `light|dark` as its fourth argument.
- **Git Bash rewrites `/` arguments** into Windows paths. Prefix the command with `MSYS_NO_PATHCONV=1`.
- **Clicking in Puppeteer can hit the fixed nav.** Use `element.evaluate(el => el.click())` in test scripts.
- **New illustrations need a rebuild in production** because pages are statically generated. In dev they show immediately.
