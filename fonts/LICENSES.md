# Vendored fonts

Three families, four weights each of Spectral/Public Sans, three of IBM Plex Mono — the "Vine &
fire" identity's type stack (ADR-019). Fetched once from `fonts.gstatic.com` (Latin-subset `woff2`
only, ~92 KB total) and vendored here so the running app never depends on Google Fonts' CDN being
reachable — this is a locally-run scientific tool, not a one-shot hosted page.

All three are licensed under the **SIL Open Font License, Version 1.1** — free to embed, modify,
and redistribute, including in a built wheel. Full license text:
<https://openfontlicense.org/>

| Family | Weights vendored | Designer / foundry | Source |
|---|---|---|---|
| Spectral | 400, 500, 600, 700 | Production Type (Google Fonts) | fonts.google.com/specimen/Spectral |
| Public Sans | 400, 500, 600, 700 | USWDS / General Services Administration | fonts.google.com/specimen/Public+Sans |
| IBM Plex Mono | 400, 500, 600 | IBM / Bold Monday | fonts.google.com/specimen/IBM+Plex+Mono |

No modification was made to any font file — these are the unmodified Google Fonts `woff2` binaries.

**Packaging note** (a real, previously-hit class of bug — see `DECISIONS.md` ADR-012/ADR-018 for the
`data/*.csv` and `static/gallery/*` precedents): `pyproject.toml`'s
`[tool.setuptools.package-data]` must list `"static/fonts/*"` explicitly — a bare `"static/*"` does
not recurse into this subdirectory, so a built wheel would silently ship with broken `@font-face`
references otherwise. Verified with a real `python -m build` + `zipfile.namelist()` — see ADR-019.
