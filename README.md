# AZMEEDIA'S — Bespoke Tailoring

Single-page website for AZMEEDIA'S, built with React, TypeScript, Vite and Tailwind CSS.
Motion is handled by GSAP + ScrollTrigger (scroll animation), Lenis (smooth scrolling) and
Motion (menu and form transitions).

## Run

```bash
npm install
npm run dev       # local development
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
```

## Before going live

1. **Contact details** — fill in `src/config/site.ts` (phone, email, WhatsApp, Instagram).
   Anything left as `null` is shown as a visible placeholder.
2. **Appointment form** — there is no booking backend. By default the form validates the
   request and hands it to the visitor to send by WhatsApp or email. To receive requests
   directly, copy `.env.example` to `.env` and set `VITE_APPOINTMENT_ENDPOINT` to a URL that
   accepts a JSON `POST` (your own API, or a form service).
3. **Photography** — the images in `public/images` are stock placeholders from Unsplash.
   Replace them with AZMEEDIA'S own photography, keeping the same file names
   (`name-800.webp` and `name-1600.webp`).
4. **Copy** — the short descriptions for the collections and the "Why" list in
   `src/data/content.ts` are draft wording to review.

## Structure

```
public/video/        hero film: hero-scrub.mp4 (scroll-scrubbed), hero.mp4 (touch playback), poster
public/images/       photography, two widths per image
src/config/site.ts   brand and contact details, navigation
src/data/content.ts  craft stages, collections, reasons
src/components/ui/   Reveal, RevealText, ParallaxImage, AnchorLink, SectionHeading, button style
src/sections/        one component per page section
src/lib/             GSAP setup, scroll helpers, form validation
video/               original hero film (source file, not served)
scripts/             encode-hero-scrub.sh rebuilds hero-scrub.mp4 from the source film
```

## Hero film

On desktop the hero is pinned for 1.5 screen heights and the scroll drives the film frame by
frame, in both directions (`src/sections/Hero.tsx`). The footage is 5 seconds (120 frames), and
the captions are timed to its three shots: emergence, details, then the walk and final reveal.

- **`public/video/hero-scrub.mp4`** has every frame encoded as a keyframe, so any frame can be
  shown instantly. A normal web encode stutters when scrubbed backwards. If you replace the film,
  rebuild it with `scripts/encode-hero-scrub.sh path/to/film.mp4` and adjust the caption timings
  at the top of `Hero.tsx` to the new cuts.
- **Touch devices** play `hero.mp4` once and stop on the walk, without pinning. Scroll-driven
  seeking is unreliable on mobile browsers.
- **Reduced motion or data saver** shows the poster frame only.

