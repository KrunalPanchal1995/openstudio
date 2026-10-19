# openstudio

[![Checks](https://github.com/KrunalPanchal1995/openstudio/actions/workflows/ci.yml/badge.svg)](https://github.com/KrunalPanchal1995/openstudio/actions/workflows/ci.yml) ![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square) [![Live](https://img.shields.io/badge/live-site-1f6feb?style=flat-square)](https://krunalpanchal1995.github.io/openstudio/)

**A visual studio for mathematics, science and engineering**, rebuilt from scratch. Subjects, explained figures and live instruments that run fully in the browser: no server, no build step, no tracking.

Live: <https://krunalpanchal1995.github.io/openstudio/>

## Status: early (phases 0-1 of 6)

| Phase | What | State |
|---|---|---|
| 0 | App shell: hash router, light/dark theme, host-page messaging, search, accessibility basics | done |
| 1 | Data: 13 subjects, 263 explained figures/plots/concepts rendered with KaTeX, 401 presets kept as the parity manifest | done |
| 2 | Maths instruments: Atlas (86 chapters), Transform 2D/3D, Integrals lab, Revolve, Double, Arc, Intersect | not started |
| 3 | Science and engineering instruments: Mechanisms, Molecules, Deform, Flow, Solver | not started |
| 4 | New subjects: Chemistry (periodic table), Electronics (Circuit Lab) | not started |
| 5 | Manim explainer videos (ManimGL) | not started |
| 6 | Switch the main site's /studio/ page to this app | not started |

The instrument pages already exist and list every preset with its old link (for example `#atlas?ch=S32&ex=0`), marked as being rebuilt.

## What changed from the previous Studio

- **Rebuildable.** Plain ES modules and JSON; there is no bundler. Edit a file, reload.
- **Lighter.** Project figures and videos stay on the main site and are referenced from there rather than copied (about 46 MB), so this app is about 12 MB (6 MB figure images, 4.5 MB lesson text), against 30 MB before.
- **One stylesheet and one kit** instead of three overlapping stylesheets and a fake `api/` shim.
- **Everything is meant to run in the browser.** Features that needed a desktop server (Grapher, Intersect, Solver equations/PDE) will be re-implemented client-side.
- **Accessible by default**: skip link, labelled search, keyboard focus styles, text descriptions of every figure, reduced-motion support.
- Same deep-link shape (`#view?k=v`) and the same same-origin `postMessage` protocol as before.

## Layout

```
index.html             shell
src/core/              router, theme, host messaging, KaTeX loader, DOM helper
src/ui/                subject, search, instrument and explainer views
src/workspaces/        instrument registry (one module per instrument as they are built)
data/                  subjects, 263 explainers, indexes, the 401-preset parity manifest
tools/build_data.py    regenerates data/index.json and data/presets.json
tests/                 data, parity and link checks
vendor/ fonts/         KaTeX 0.16.9 and OFL fonts, with their licences
```

## Develop

```bash
python -m http.server 8000      # then open http://localhost:8000/
python -m pip install pytest
python -m pytest tests -q
```

## Credits and checks

The explainer texts come from the previous Studio. Some are drafts and are marked "not yet reviewed by the owner" in their footer. Figures are reference renders with synthetic demonstration data unless a project is named. MIT licence.
