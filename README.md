# AZMEEDIA'S — Bespoke Tailoring

Single-page website for AZMEEDIA'S (bridal & groom designing and tailoring), built with React, TypeScript, Vite and Tailwind CSS.
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

1. **Contact details** — fill in `src/config/site.ts` (phone, WhatsApp, Instagram). Customers contact the business by call or WhatsApp only; there is deliberately no email. The floating Call button needs the phone number to dial directly.
   Anything left as `null` is shown as a visible placeholder.
2. **Appointment form** — there is no booking backend. By default the form validates the
   request and hands it to the visitor to send by WhatsApp (or to call instead). To receive requests
   directly, copy `.env.example` to `.env` and set `VITE_APPOINTMENT_ENDPOINT` to a URL that
   accepts a JSON `POST` (your own API, or a form service).
3. **Photography** — the images in `public/images` are free Unsplash stock used as placeholders
   (credits below). Replace them with AZMEEDIA'S own photography, keeping the same file names
   (`name-800.webp` and `name-1600.webp`).
4. **Reviews** — the "Kind Words" cards in `src/data/content.ts` are placeholders. Replace them
   with real client reviews (with permission); never publish invented ones.
5. **Copy** — collection names and descriptions and the FAQ answers in `src/data/content.ts`
   are draft wording to confirm with the client.

## Adding films and video reviews

Films and customer reviews live in `src/data/content.ts` (`films` and `testimonials`). Each video is
either a file or a YouTube video:

- **YouTube (recommended for anything long or numerous)** — upload as a normal or *unlisted* video,
  or as a Short for phone-shaped clips, then set `youtube` to the id from the link
  (`youtube.com/watch?v=ID` or `youtube.com/shorts/ID`). Keeps the site fast and uses no Vercel bandwidth.
- **File** — put an MP4 (H.264, ideally under ~10 MB) in `public/videos/`, set
  `src: '/videos/name.mp4'`, and add a `poster` image (a still frame, e.g. `/videos/name.jpg`).

Set `vertical: true` for phone-shaped (9:16) clips, which is how most customer reviews are filmed.
A video with neither `src` nor `youtube` shows as "Video coming soon".

Reviews can be text or video:

```ts
{ kind: 'video', name: 'Amaya & Ravi', role: 'Bride & groom', video: { title: 'Amaya & Ravi', youtube: 'ID', vertical: true } },
{ kind: 'text', quote: 'Their words here.', name: 'Amaya', role: 'Bride' },
```

## Structure

```
public/video/        hero film: hero-scrub.mp4 (scroll-scrubbed), hero.mp4 (touch playback), poster
public/images/       photography, two widths per image
src/config/site.ts   brand and contact details, navigation
src/data/content.ts  collections (for her / for him), process, lookbook, reviews, FAQ
src/components/ui/   Reveal, RevealText, ParallaxImage, AnchorLink, SectionHeading, button style
src/sections/        Hero, Intro, Collections, Process, Lookbook, Testimonials, Faq,
                     Appointment, CtaBand, Footer (contact details live in the footer)
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


## Photo credits (Unsplash, free licence)

Bridal and couple placeholders: Naeem Ad (bridal-couture), Alexander Mass (bridal-veil,
bridal-lace-hanger), Lucas T Photography (bridal-lace-mirror), Thomas AE (bridal-lace-sheer),
Jennifer Kalenberg (bridal-party), Alok Verma (bridal-redgold), Bulbul Ahmed (bridal-sari),
ola szkolda (bridal-sheer-fabric), Sou Jest (bridal-window), Nathan Dumlao (couple-bouquet),
Jeremy Wong Weddings (couple-hands), Mohit Maru (couple-lehenga), Khadija Yousaf (detail-rings).
