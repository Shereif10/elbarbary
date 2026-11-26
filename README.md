# ELBARBARY Group Website

Official website of **ELBARBARY Multi-Investment Group** — general contracting and prefabricated buildings (precast, foam concrete, steel structure) across the UAE, Oman and Saudi Arabia.

## Stack

Static site, no build step: HTML + CSS + vanilla JS. Bilingual Arabic (RTL, default) / English with a language toggle.

## Structure

- `index.html` — single-page site: hero, stats, about, group companies, services, why prefab, projects (dual marquee), home models, contact
- `css/style.css` — styles, animations, responsive rules
- `js/app.js` — language toggle, preloader, scroll reveals, count-up stats, marquees, scrollspy, parallax
- `images/` — brand and project images

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Deployment

Published via GitHub Pages from the `main` branch (root).
