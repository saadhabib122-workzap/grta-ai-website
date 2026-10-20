# GRTA brand assets

Everything here is generated from `tokens.json` and the scripts in `src/`. Change the source, then rebuild:

```
npm run brand:build
```

That runs, in order: tokens + contrast check → logo → icons → motifs → PNG/favicon/OG exports → guidelines HTML + PDF.

| Path | What it is |
|---|---|
| `tokens.json` | Colours, themes, type, spacing, motion. Single source of truth. |
| `tokens.css` | Generated CSS variables (light + "Nordic night" dark). The website imports this. |
| `logo/` | GR/TA mark (primary, forest, ink, white, living) and `grta.ai` lockups, all font-independent SVG. |
| `icons/` | 35 line icons, `sprite.svg`, and `index.json` (name → group). |
| `motifs/` | Thread pattern, coverage map, 20×20 slide stack. |
| `illustrations/` | Placeholders at the fixed slot ratios (16:10, 1:1, 4:5, 3:1). |
| `export/` | PNG sizes, `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `og-default.png`. |
| `illustration-bible.md` | Style rules, cast, master prompt, 14 scene prompts mapped to the sitemap. |
| `voice-and-tone.md` | How GRTA writes. |
| `guidelines.html` / `GRTA_Brand_Guidelines.pdf` | The brand guidelines document. |
| `_archive/` | The retired navy/orange brand, for reference only. |
