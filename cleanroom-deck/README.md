# Cleanroom & GMP Training — interactive presentation deck

A click-through training deck with a **main topic menu**. Pick a topic on the home
screen, click it, and you enter that topic's slides.

![topics](https://img.shields.io/badge/topics-9-blue) ![slides](https://img.shields.io/badge/slides-98-green) ![diagrams](https://img.shields.io/badge/animated%20diagrams-12-blueviolet) ![deps](https://img.shields.io/badge/dependencies-none-lightgrey)

| # | Topic | What it covers |
|---|-------|----------------|
| 1 | Cleanroom & Facility Design | grades and Annex 1 Table 1 limits, zoning, flow, surfaces, pressure cascade, RABS vs isolators |
| 2 | Qualification & Validation | V-model, DQ/IQ/OQ/PQ, cleanroom test matrix, requalification, sterilisation, APS, CSV |
| 3 | Personnel Entry & Gowning | the human source, entry sequence, garment system, aseptic behaviour, gowning qualification |
| 4 | Cross-Contamination & Contamination Control | sources and routes, the CCS, segregation, cleaning and disinfection, harbourage, excursion response |
| 5 | HVAC & Air Handling | air path, velocity and ACH, HEPA filtration and integrity, cascade/alarms, recovery, failure modes |
| 6 | Environmental Monitoring | methods, Table 2 limits, sampling design, viable + non-viable, alert vs action, trending, decisions |
| 7 | Deviations | terminology, lifecycle with timings, RCA tools, impact assessment, good vs weak reports, CAPA |
| 8 | QC & QA Responsibilities | QA vs QC, a RACI matrix, gatekeeping lists, independence and authority, findings |
| 9 | Regulatory Requirements | EU / FDA / ICH / WHO-PIC/S / ISO / USP map, key clauses, data integrity, what changed, inspection readiness |

Every topic ends with a 3-question **knowledge check** (self-marking, score kept in the
browser) and a **takeaways** slide.

## The white theme and the explanations

The deck is light-on-purpose: white cards on a pale blue-grey page, one dark ink for text, and a
per-topic accent that is *derived*, not chosen — `accentTokens()` in `assets/app.js` darkens each
topic accent until it passes 4.5:1 on white, and the whole deck paints with that derived ink.
`tools/check-styles.js` asserts the contrast of every text pair, so a recolour that becomes
unreadable fails the build instead of shipping.

Twelve slides are **animated diagrams** (`assets/anim.js`): grade scales drawn to log height, a
pressure cascade with a door that leaks, first air blocked by a hand, gowning layers containing a
shedding cloud, HEPA stages catching particles, a media-fill tray turning turbid, an EM trend
crossing an action limit, a deviation clock with the batch on hold, log-reduction bars, a QA/QC
handoff, the framework wheel and the clean-up curve. The point is not decoration — each one shows
*a mechanism* that the words on the slide only assert.

They are plain SVG + CSS, with no library and no timers:

* elements carry an index (`--i`) and the figure carries a step length (`--slot`, 1.5 s), so the
  build sequence is arithmetic in CSS rather than JavaScript;
* every loop is gated on `.slide.play`, which the renderer adds to the visible slide only — off
  screen nothing animates, so the presenter never watches a private animation;
* `R` or the ↻ control replays the current slide's build from zero (`.play` is dropped, the node
  is forced to reflow, then re-added);
* `prefers-reduced-motion` and `@media print` disable the animation and force the *finished*
  state, so a printed deck and a reduced-motion viewer get a complete, legible figure;
* headline numbers on stat slides count up on arrival (`countUp()`), landing on the exact value
  from the content, never a rounded stub.

## Run it

No build, no server, no dependencies:

```bash
open cleanroom-deck/index.html     # or double-click it — works straight from the filesystem
```

> The repository root also holds an earlier **single-file** deck (`index.html`, self-contained,
> from a previous PR). This folder is the modular version: separate content files, per-topic
> quizzes, auto-fitting slides, a content validator and a build script. Both open independently.

* **Present everything in one flow:** *Present all topics in sequence* (or `#/all/0`).
* **Shareable single file:** `node tools/build-standalone.js` → `cleanroom-gmp-deck.html`
  (CSS + JS + content + the animation library inlined, still opens from `file://`).
* **PDF:** `P` in a topic prints that topic as one slide per page; the button on the menu
  prints the whole 98-slide deck. A4 landscape.

### Keys

| Key | Action | | Key | Action |
|-----|--------|-|-----|--------|
| `→` `Space` | next slide | | `G` | slide overview / jump |
| `←` | previous slide | | `F` | fullscreen |
| `Home` `End` | first / last slide | | `P` | print or save PDF |
| `Esc` | back to the topic menu | | `A` | auto-advance 15 s / 30 s |
| `1`–`9` | jump straight into a topic | | `T` | presenter timer |
| `S` | search the menu | | `C` | force compact type |
| `R` | replay this slide's animation | | | |
| `?` | shortcuts | | | |

Progress, completion ticks and quiz scores are stored in `localStorage`, and every slide is
linkable: `#/gowning/3` opens Personnel Entry & Gowning at its fourth slide.

## Edit the content

Slides are data, not markup. All wording lives in `assets/data.js` (topics 1–5) and
`assets/data2.js` (topics 6–9):

```js
{
  id: "em", n: 6, title: "Environmental Monitoring", icon: "🔬",
  accent: "#2dd4bf", tagline: "one-line description shown on the menu card",
  refs: ["EU GMP Annex 1 §9"],
  slides: [
    { k: "intro",  t, lead, objectives: [] },
    { k: "points", t, sub, items: [["Heading", "Explanation"]], ref, note },
    { k: "cards",  t, items: [["💧", "Heading", "Explanation"]] },
    { k: "table",  t, cols: [], rows: [[…]], note },
    { k: "flow",   t, steps: [["Step", "Detail"]] },
    { k: "split",  t, left: { h, tone: "good", items: [] }, right: { h, tone: "bad", items: [] } },
    { k: "stats",  t, items: [["0.36–0.54 m/s", "Label", "small print"]] },
    { k: "callout", t, quote, points: [] },
    { k: "diagram", t, sub, anim: "udaf", items: [["Legend heading", "Why it matters"]], note },
    { k: "quiz",   t, questions: [{ q, opts: [], a: 0, why }] },
    { k: "end",    t, items: [] }
  ]
}
```

`k: "diagram"` pulls its drawing from `window.DECK_ANIM` (`assets/anim.js`): `anim` names the
builder, `items` become the legend under the figure, and the builder's own caption explains the
mechanism. The `timeline` builder also reads a `track: [["label", "detail"]]` array. Adding a
diagram means writing one builder and pointing a slide at it — `validate-content.js` fails if a
slide names a builder that does not exist, and also fails if a builder is never used, so the two
lists cannot drift.

`assets/app.js` renders whatever it finds — add a slide object and it appears in the deck,
the progress dots, the overview and the print output automatically. Slides auto-shrink when
they would not fit the screen.

### Check your edits

```bash
node tools/validate-content.js   # schema, table column counts, quiz answer indexes, dupes
node tools/check-styles.js       # keyframes, CSS variables, contrast, diagram geometry
```

Both exit non-zero on anything that would render a broken or unreadable slide. `check-styles.js`
is the stricter of the two: it re-reads the palette out of `styles.css`, runs every diagram
builder with the *real* words from the content, and measures each text run against the box it is
drawn on — so an animation that spills off its canvas, a label wider than its own card, an accent
too pale for white, or an `animation:` name with no `@keyframes` block all fail the check. The
builder helpers (`clip()`, `lines()`) use the same width estimate as the checker on purpose: what
is measured to fit here cannot be measured to overflow there.

## Sources behind the content

EU GMP Annex 1 (2022 revision, in operation 25 Aug 2023) §2–§10 including Table 1 and Table 2,
Annex 11, Annex 15, Annex 16, Annex 19 and Chapters 1, 3, 4, 5, 6; 21 CFR 210/211 and Part 11;
FDA process-validation guidance (2011) and aseptic-processing guidance; ICH Q7, Q8, Q9(R1), Q10;
ISO 14644-1/-2/-3, ISO 14698, ISO 11133, ISO 21501-4, EN 1822; WHO TRS and PIC/S PI 007 / PI 020 /
PI 041. Grade limits, velocity guidance, requalification intervals and disinfection rules were taken
from the official Annex 1 text rather than from the pre-2022 numbers.

> Training material, not a compliance opinion. Confirm anything you plan to rely on against the
> current official text and your site's SOPs.

## Files

```
cleanroom-deck/
  index.html                  the deck (topic menu + slides)
  assets/styles.css           theme, slide layouts, print and compact styles
  assets/data.js  data2.js     all slide content (edit here)
  assets/app.js               renderer, navigation, quiz, progress, routing
  assets/anim.js              the 12 explanatory diagrams (SVG + CSS, no dependencies)
  tools/validate-content.js   content schema + consistency checks
  tools/check-styles.js       contrast, keyframes and diagram geometry checks
  tools/build-standalone.js   one-file export for sharing

../index.html                 earlier single-file deck on main (untouched by this folder)
../New Text Document (7).html original scroll version (kept as-is; its Grade A figure of
                              3 520 000 /m³ is the pre-2022 Annex 1 value)
```

Commands above are relative to this folder — from the repo root prefix them with `cleanroom-deck/`.
