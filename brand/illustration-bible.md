# GRTA Illustration Bible: "Stop-motion Clay"

Use this file to generate every illustration on grta.ai, so they all look like they come from the same world. Paste the **master prompt** first, then the **scene prompt**, then the **locks**.

**Style reference:** the original inspiration image (the claymation team around a table). In Gemini, upload it with your prompt and say *"Match the illustration style of this image exactly. Ignore the website, text and buttons; use only the artwork style."*

---

## 1. The idea in one line

Warm, charming handmade clay people working together in cozy, sunlit Scandinavian rooms, like a still from a stop-motion film. The people are the story; very faint threads of light are the quiet hint of what GRTA does.

## 2. Style rules

| Do | Don't |
|---|---|
| Real stop-motion claymation: plasticine figures with visible fingerprint and tool marks, matte surfaces | Smooth realistic 3D, glossy plastic, photographic skin |
| Charming proportions: slightly oversized heads, big round expressive eyes with highlights, round noses, rosy cheeks | Realistic adult faces, tiny eyes, uncanny realism |
| Warm, open expressions: engaged, smiling, laughing together | Blank, stiff or bored faces |
| Hair sculpted as clay coils, curls and buns; clothes as real miniature fabric: chunky hand-knitted sweaters, denim, linen | Flat painted hair, plain untextured clothing |
| Cozy Scandinavian studio: birch and oak, a whiteboard with sticky notes, ceramic mugs, a pencil pot, notebooks, laptops, lots of green plants, a green enamel pendant lamp | Neon, chrome, dark sci-fi labs, holograms that dominate |
| Golden afternoon sunlight through large windows, soft shadows, shallow depth of field like a miniature set | Flat lighting, night scenes, harsh spotlights |
| **Futurist layer, optional and very faint:** thin threads of pale-blue light between people | Glowing robots, circuit boards, brains, floating UI |

**Palette (approximate):** warm cream and paper-white, forest green, moss green, mustard, rust and terracotta, navy knit, warm wood and clay tones, golden sunlight. Orange tones are welcome in clothing and props; keep bright saturated orange to small accents such as a sticky note.

## 3. The cast

Six people recur across the site. Keep them consistent: same face, hair, clothing colours.

| Name | Role | Look | Where they appear |
|---|---|---|---|
| **Ingrid** | HR lead, 50s | Silver bob, round glasses, forest-green cardigan | Home (HR door), About |
| **Kofi** | Project lead, 40s | Short black hair, trimmed beard, oatmeal knit sweater | Home (Project door), How it works |
| **Mei** | Data scientist, 30s | Black hair in a low bun, moss-green shirt, laptop | How it works, Lab |
| **Lars** | Operations analyst, "the wildcard," 30s | Ginger curls, freckles, denim overshirt | Lab (wildcard), How it works |
| **Amara** | Student / researcher, 20s | Natural curls, gold hoop earrings, rust sweater | Partners |
| **Sofia** | 7×7 guide, 40s | Long dark-blonde braid, linen shirt, warm smile | How it works (7×7), About |

## 4. Master prompt

> A charming stop-motion claymation scene, like a still from a handmade animated film. Plasticine characters with visible fingerprint texture, slightly oversized heads, big round expressive eyes with highlights, round noses and rosy cheeks, warm open smiles. Hair sculpted from clay coils, clothes made of real miniature fabric: chunky hand-knitted sweaters, denim, linen. A cozy, sunlit Scandinavian studio with birch wood, ceramic mugs, notebooks, a pencil pot, lots of green plants and a green enamel pendant lamp. Golden afternoon sunlight through large windows, soft shadows, shallow depth of field like a miniature set. Warm palette of cream, forest green, moss, mustard, rust and wood tones. Optional: very faint thin threads of pale-blue light between the people. No text, no logos, no readable writing.

## 5. Scene list (mapped to the sitemap)

Every slot has a **fixed ratio and filename**. Export at 2× the listed width as WebP (and AVIF if the tool supports it), then drop the file into `public/illustrations/` with the exact name. The layout doesn't change.

| # | File | Ratio · width | Page / section | Scene prompt |
|---|---|---|---|---|
| 01 | `home-hero.webp` | 16:9 · 1920 · full-bleed | Home · Hero | All six cast members around the right end of a long birch table, mid-conversation, leaning in. They fill the RIGHT 60% of the frame; the LEFT 40% is calm, softly lit wall, window light and blurred plants, because the headline sits there on a white fade. |
| 02 | `home-door-hr.webp` | 4:5 · 800 | Home · Pick your door (HR) | Ingrid at a window desk, looking at a soft floating map of small glowing dots (people) gently connected; some dots she has not noticed light up. |
| 03 | `home-door-project.webp` | 4:5 · 800 | Home · Pick your door (Project) | Kofi at a whiteboard with a few sticky notes, one ember orange; three threads of light reach toward him from out of frame. |
| 04 | `home-flywheel.webp` | 1:1 · 1000 | Home · How it learns | A small team closing laptops at the end of a project, one person tapping a short rating on a phone; a soft loop of light circles the table. |
| 05 | `how-brief.webp` | 16:10 · 1600 | How it works · Journey (brief + gap) | Kofi writing a messy paragraph in a notebook; above it the words become neat blocks of light. A gentle orange spark marks one missing block. |
| 06 | `how-translate.webp` | 16:10 · 1600 | How it works · Journey (translate) | Mei looking at a speech bubble of vague words that turn into three crisp tags of light. |
| 07 | `how-variants.webp` | 16:10 · 1600 | How it works · Journey (variants) | Three small groups on one table, each with its own colour of thread (forest, moss, fjord); Kofi considers them. |
| 08 | `how-hiit.webp` | 3:1 · 1800 | How it works · HIIT 9→3→1 | Nine people in three small circles of three, threads converging into one plan document at the centre. |
| 09 | `how-7x7.webp` | 1:1 · 1000 | How it works · Rolling it out | Sofia sitting with six colleagues in a circle; a thread links her to a second circle in the background. |
| 10 | `lab-wildcard.webp` | 4:5 · 800 | Lab · Team variants | Lars standing slightly apart, holding a single ember-orange card; a thread reaches toward him from the team. |
| 11 | `partners-hero.webp` | 16:10 · 1600 | Partners · Hero | Amara and a researcher in a bright university lab-library; a long thread of light runs out of the window toward a distant horizon (Denmark to Uganda, implied, no maps or flags). |
| 12 | `about-together.webp` | 3:1 · 1800 | About · Be GRTA Together | The cast walking side by side outdoors on a calm Nordic waterfront, threads loosely connecting them. |
| 13 | `empty-state.webp` | 1:1 · 600 | Lab · empty and error states | A single chair at an empty table, a cup of coffee, one small thread waiting. |
| 14 | `og-scene.webp` | 1.91:1 · 1200 | Social share images | Close crop of two hands passing a sticky note, a thread of light between them. |

## 6. Checks before a file goes on the site

- [ ] Same cast faces and clothing as the table above
- [ ] Real claymation look: fingerprint texture, sculpted hair, knitted fabric, warm sunlight
- [ ] Bright orange limited to small accents
- [ ] Threads are thin and subtle; people still dominate the image
- [ ] Clear empty space where the layout puts text
- [ ] No text, logos, flags or brand names in the image
- [ ] Exported at the exact ratio, at 2× width, as WebP, named exactly as listed
- [ ] Alt text written in `messages/en.json` (describe the people and what they are doing)

Until final art exists, the site uses the placeholders in `brand/illustrations/` at the same ratios.
