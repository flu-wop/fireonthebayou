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

## Content and admin

All site content lives in the database and is edited at **/admin** (no code). Pages read from Turso and fall back to the
seed files when the database is unset, unseeded or unreachable, so previews and builds always work.

| What | Where it is edited | Seed source (fallback) |
|---|---|---|
| Projects (89), formats and industries on each | Admin > Projects | `data/fotb-catalog.json` + write-ups in `src/lib/projects.ts` |
| Testimonials (9 slots) | Admin > Testimonials | `src/lib/testimonials.ts` |
| Clients and logos (banner, Studio wall) | Admin > Clients and logos | distinct clients in the catalog |
| Crew | Admin > Crew | `src/lib/crew.ts` |
| Services, Process, Post-Production tab, FAQ | Admin > those lists | `src/lib/services.ts`, `process.ts`, `faq.ts` |
| Tagline, hero reel, contact details, socials | Admin > Settings (Owner) | `src/lib/site.ts` |
| Filter chips (formats, industries) | Admin > Formats & industries (Owner) | defaults in `src/lib/content/seed-data.ts` |
| Title, description, link preview per page | Admin > SEO | code defaults |
| Images, SVG logos, hero MP4 | Admin > Placeholders / Media library (Vercel Blob) | files in `/public` |

**Setup (once):** set `TURSO_URL`, `TURSO_TOKEN`, `ADMIN_PASSWORD`, `BLOB_READ_WRITE_TOKEN` (add a Blob store in Vercel).
Open `/admin`, sign in with your email and `ADMIN_PASSWORD` (first sign-in creates the Owner account), then press
**Seed from files** on the Overview page (or run `npm run seed`). Add Editors under Users; each person has their own
login. After the first sign-in, change the Owner password and stop sharing `ADMIN_PASSWORD`.

**Workflow:** edits save as drafts. Preview links (Overview, or any editor) show the real site with the drafts, work for
7 days and are never indexed. **Publish** applies a record; **Publish all** applies everything and refreshes the site.
History lists every change with who and when; **Revert to before** restores the earlier version as a draft.
Admin covers content only: layout changes, new page types and new features still need a developer.

Roles: **Owner** does everything (settings, formats and industries, users, system health); **Editor** manages content,
media, SEO and the inbox. Old WordPress redirects (`src/lib/redirects.ts`) are shown read-only under SEO.

Scripts: `npm run seed [-- --overwrite]`, `npm run check:catalog` (verifies the 89-project counts in the catalog file).

### Contact + email

The site takes **no online payments**. `/api/contact` is rate limited (`src/lib/rate-limit.ts`) and honeypotted.
Each inquiry is saved to Turso (`fotb_inquiries`); if the visitor ticked the opt-in box the contact is also added to a
Mailchimp audience with a tag. Env vars: `TURSO_URL`, `TURSO_TOKEN`, `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`
(e.g. `us21`), `MAILCHIMP_AUDIENCE_ID` (optional `MAILCHIMP_TAG`, default "Website inquiry"). The internal new-inquiry
alert is undecided: implement it in `notifyNewInquiry()` in `src/lib/notify.ts`. The public address is `site.email`
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
