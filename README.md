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

Repo: `flu-wop/fireonthebayou` → Vercel auto-deploys `main` to fireonthebayou.vercel.app.

## Launch checklist (moving fireonthebayou.com off WordPress)

1. Add the domain in Vercel and point DNS at it.
2. Set `NEXT_PUBLIC_SITE_URL=https://fireonthebayou.com` and **`SITE_INDEXABLE=true`** — until then
   every page is `noindex` and robots.txt blocks crawlers, so the preview never competes with the
   live WordPress site.
3. Redirects from all 110 old WordPress URLs are already in place (`src/lib/redirects.ts`) — they
   take effect as soon as the domain points here.
4. Set the Mailchimp env vars and send a test inquiry.

## Content

- Portfolio catalog (source of truth, 89 projects): `data/fotb-catalog.json`. Screening-room write-ups: `src/lib/projects.ts`
- Filmography (the rest of the work, plays in place): `src/lib/archive.ts`
- Clients + agency partners (Studio page): `src/lib/clients.ts`
- FAQ (Process page): `src/lib/faq.ts`
- Old WordPress URL redirects: `src/lib/redirects.ts` (already wired in `next.config.ts`)
- Brand facts, socials, studio, founder photo: `src/lib/site.ts`
- Hero reel: `HERO_REEL` in `src/components/sections/Hero.tsx` (YouTube id, or a self-hosted `mp4`)
- Jason's portrait: add `/public/images/jason-villemarette.jpg`, set `site.founder.photo`

### Contact + email

The site takes **no online payments**. `/api/contact` is rate limited (`src/lib/rate-limit.ts`) and honeypotted.
Email moves from Resend to Mailchimp in the next phase; the public address is `site.email`
(hello@fireonthebayou.com). Page views are tracked with Vercel Web Analytics (enable it in the project's Analytics tab).

### Placeholders

Every empty image or video slot renders a labeled placeholder. `/placeholders` (noindex) lists what is still empty,
with exact sizes and upload paths, from `src/lib/media-manifest.ts`.

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
