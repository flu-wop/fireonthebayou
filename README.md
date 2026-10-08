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
3. Add 301 redirects from the old WordPress URLs (e.g. `/meet-the-crew/`, `/capabilities/...`,
   `/client/...`) to the new pages in `next.config.ts` so search rankings carry over.
4. Wire Stripe + Resend (below) and run a 4242 test purchase.

## Content

- Projects, films, credits: `src/lib/projects.ts` (`homeReel` sets the home page order)
- Brand facts, socials, studio, founder photo, consult offer: `src/lib/site.ts`
- Hero reel: `HERO_REEL` in `src/components/sections/Hero.tsx` (YouTube id, or a self-hosted `mp4`)
- Jason's portrait: add `/public/images/jason-villemarette.jpg`, set `site.founder.photo`

### Paid Creative Consult (Stripe)

Price, length, and what's included live in `consult` in `src/lib/site.ts` (enforced server-side).
Vercel → Settings → Environment Variables:

| Var | What |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…` to test, `sk_live_…` to go live) |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → add `https://<domain>/api/stripe/webhook`, event `checkout.session.completed` |
| `NEXT_PUBLIC_SITE_URL` | `https://fireonthebayou.com` (success/cancel redirects) |
| `STRIPE_CONSULT_PRICE_ID` | optional — use a Stripe Price instead of the amount in `site.ts` |
| `RESEND_API_KEY` | optional — emails each paid booking to the studio |
| `RESEND_FROM_EMAIL` / `RESEND_TO_EMAIL` | sender (verified domain) / recipient (defaults to `site.email`) |

Flow: `/consult` form → `/api/consult/checkout` → Stripe Checkout → `/consult/success`;
the webhook verifies the signature and emails the booking. Test with card `4242 4242 4242 4242`.

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
