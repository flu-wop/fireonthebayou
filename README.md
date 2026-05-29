# Fire on the Bayou

Flagship cinematic site for a New Orleans video production house — home of **Mid City Sound**.
Built to feel noticeably more elevated than midcitysound.com / streetbeat.video.

**Stack:** Next.js 16.2.6 (App Router, Turbopack) · TypeScript · Tailwind v3 · Framer Motion · Lenis smooth-scroll.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (what Vercel runs)
```

## Deploy (your usual flow)

```bash
git init
git add .
git commit -m "Fire on the Bayou — initial build"
git branch -M main
git remote add origin https://github.com/flu-wop/fire-on-the-bayou.git
git push -u origin main
```

Then import the repo in Vercel — it auto-deploys on every push. No env vars needed yet
(the contact form uses a `mailto:` fallback; wire `/api/contact` later if you want server email).

---

## The "antigravity" feel — where it comes from

| Mechanic | File | What it does |
|---|---|---|
| Inertial smooth-scroll | `effects/SmoothScroll.tsx` | Lenis — the weighted glide |
| Scroll-LINKED parallax | `effects/Parallax.tsx`, `sections/Hero.tsx`, `ProjectCard.tsx` | media drifts at a different rate than scroll = depth |
| Scroll-TRIGGERED reveals | `effects/Reveal.tsx` | staggered fade/rise on enter |
| Word-by-word illumination | `sections/Statement.tsx` | text lights up as it scrolls through |
| Magnetic CTAs | `effects/Magnetic.tsx` | buttons lean toward the cursor |
| Film grain + vignette | `effects/GrainOverlay.tsx`, `.grain`/`.vignette` in globals | shot-on-film texture |

To dial parallax up/down, change the `speed` prop on `<Parallax>` or the `lerp` in `SmoothScroll`.

---

## Drop in your real media

Placeholders are in `/public/images` so nothing looks broken. Replace these filenames:

**Hero reel** (the big one):
- `/public/video/hero-reel.mp4`  (and optionally `.webm`) — muted, ~10–20s loop
- `/public/images/hero-poster.jpg` — still frame fallback

**Project tiles** — each plays its `.mp4` on hover, falls back to the `.jpg`:
- `work-bayou-after-dark`, `work-second-line`, `work-below-sea-level`,
  `work-ember-room`, `work-high-water`, `work-the-makers`
  → drop matching `.jpg` in `/public/images` and `.mp4` in `/public/video`

**Other:** `studio-mid-city-sound.jpg`, `about-crew.jpg`, `og-image.jpg`

Edit project list, services, and process copy in `src/lib/*.ts` — no component edits needed.
Brand-level facts (email, phone, socials, studio blurb) live in `src/lib/site.ts`.

---

## Structure

```
src/
  app/            route per page (home, work, services, process, about, contact)
  components/
    effects/      SmoothScroll, Parallax, Reveal, Magnetic, GrainOverlay
    layout/       Navbar, Footer
    sections/     Hero, ProjectCard, WorkTeaser, Statement, ProcessSteps, etc.
    ui/           Button, SectionHeading
  lib/            site config + content data (projects/services/process)
```

Every page in `app/` is a thin composition of `sections/` — keep them readable.
