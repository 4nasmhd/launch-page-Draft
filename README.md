# ProLedge — Launching Soon

A standalone "coming soon" landing page for **ProLedge**.

> **Beyond Average. Built Better.** — world-class finance & accounting education, launching soon.

## Features

- Cinematic cross-fading hero slideshow (real corporate-finance photography, with a slow Ken-Burns zoom)
- Mouse-driven 3D parallax on the hero
- Animated **"Learn What …"** word rotator
- Email waitlist capture (stored in `localStorage`)
- Fully responsive + reduced-motion friendly
- Text wordmark in the nav, official logo in the footer (colors matched to brand: white `#fbfcfc`, blue `#4baafb`)

## Folder structure

```
launching-soon/
├── index.html            # the landing page (entry point)
├── 404.html              # branded not-found page
├── site.webmanifest      # PWA manifest
├── robots.txt            # crawler directives
├── sitemap.xml           # sitemap
├── serve.ps1             # local static dev server (port 5501)
├── google-apps-script.gs # Apps Script for the waitlist → Google Sheet (reference; not served)
├── README.md
└── assets/
    ├── favicon.svg        # brand favicon (chart mark)
    └── images/
        ├── walk.png       # poster figure — the walking gentleman (REQUIRED)
        ├── proledge_converted.svg   # footer logo (REQUIRED)
        ├── hero-1.jpg     # legacy / unused (old slideshow)
        ├── hero-2.jpg     # legacy / unused
        ├── hero-3.jpg     # legacy / unused
        └── hero-4.jpg     # legacy / unused
```

## Run locally

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open <http://localhost:5501/>.

Any static host works too — just upload the contents of this folder.

## Customizing

- **Hero images:** replace `assets/images/hero-1.jpg … hero-4.jpg` (keep the same names — no code change needed).
- **Headline / copy:** edit the `<h1>` and `.hero-sub` in `index.html`.
- **Brand colors:** defined as CSS variables in the `:root` block of `index.html`.
- **Canonical URL / social meta:** update the `https://proledge.io/launching-soon/` references in the `<head>` to your real domain.

## License

© ProLedge. All rights reserved.
