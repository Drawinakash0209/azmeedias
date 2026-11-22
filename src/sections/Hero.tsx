import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { site } from '../config/site'
import { AnchorLink } from '../components/ui/AnchorLink'
import { button } from '../components/ui/Button'
import { cn } from '../lib/cn'

/**
 * The hero film, and how it maps onto the scroll.
 *
 * The footage is five seconds long (120 frames at 24fps) and is cut in three parts:
 *   frames   0–24   a figure emerging from darkness
 *   frames  25–77   close details: cufflink, buttoning, lapel, shoulder
 *   frames  78–119  the walk towards camera; the tagline is part of the footage from ~frame 88
 * The caption timings below are fractions of the film (0–1) chosen to sit on those cuts.
 */
const FILM = {
  /** Every frame is a keyframe, so any frame can be shown instantly. See scripts/encode-hero-scrub.sh */
  scrub: '/video/hero-scrub.mp4',
  /** Ordinary web encode, for normal playback on touch devices. */
  play: '/video/hero.mp4',
  poster: '/video/hero-poster.jpg',
  fps: 24,
  /** Touch playback stops here, just before the tagline in the footage (it would be cropped on a tall screen). */
  holdAt: 3.5,
}

/** How far the visitor scrolls while the film is pinned, in viewport heights. */
const SCROLL_LENGTH = 1.5

const captions = [
  { id: 'detail', index: '02', label: 'Detail', lines: ['Fabric, fit', 'and finish'], from: 0.215, to: 0.435 },
  { id: 'silhouette', index: '03', label: 'Fit', lines: ['Cut to your', 'measurements'], from: 0.47, to: 0.64 },
] as const

/** When the opening caption leaves, and when the final reveal arrives. */
const OPENING_OUT = 0.13
const FINAL_IN = 0.74

type Mode = 'scrub' | 'film' | 'still'

/**
 * scrub — the film is pinned and driven by the scroll (desktop pointers).
 * film  — touch devices: seeking on every scroll frame is unreliable there, so the film plays once instead.
 * still — reduced motion or data saver: the poster frame only.
 */
function pickMode(): Mode {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  if (prefersReducedMotion() || saveData) return 'still'
  const desktop = window.matchMedia(
    '(min-width: 900px) and (orientation: landscape) and (hover: hover) and (pointer: fine)',
  ).matches
  return desktop ? 'scrub' : 'film'
}

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [mode] = useState(pickMode)
  const scrub = mode === 'scrub'

  // Scroll-driven film: ScrollTrigger sets the wanted frame, a ticker loop seeks to it.
  useEffect(() => {
    const v = video.current
    if (!scrub || !v) return

    let lastFrame = 0 // index of the last usable frame, known once metadata arrives
    let progress = 0
    let wanted = -1 // time we want on screen; -1 until the film can be seeked
    let objectUrl = ''
    const abort = new AbortController()

    const aim = () => {
      if (!lastFrame) return
      // Aim at the middle of a frame so rounding never lands on its neighbour.
      wanted = (Math.round(progress * lastFrame) + 0.5) / FILM.fps
    }
    const onMeta = () => {
      // Stop one frame short of the end: seeking to the exact duration can blank the picture.
      lastFrame = Math.max(1, Math.floor(v.duration * FILM.fps) - 1)
      aim()
    }
    // A browser decodes one seek at a time. Asking again before it finishes makes the
    // picture stall, so each tick only seeks if the previous seek has landed.
    const seek = () => {
      if (wanted < 0 || v.seeking || v.readyState < 1) return
      if (Math.abs(v.currentTime - wanted) > 0.001) v.currentTime = wanted
    }
    // A background tab can drop its decoded frame; show it again on return.
    const onVisible = () => {
      if (!document.hidden && wanted >= 0 && v.readyState >= 1) v.currentTime = wanted
    }

    v.muted = true
    v.addEventListener('loadedmetadata', onMeta)
    document.addEventListener('visibilitychange', onVisible)
    gsap.ticker.add(seek)

    // Hold the whole film in memory so no seek ever waits on the network.
    fetch(FILM.scrub, { signal: abort.signal })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob)
        v.src = objectUrl
      })
      .catch(() => {
        if (!abort.signal.aborted) v.src = FILM.scrub // let the browser stream it instead
      })

    const ctx = gsap.context(() => {
      // One-off entrance, on inner elements so it never fights the scroll timeline.
      gsap.from(media.current, { autoAlpha: 0, duration: 2.4, ease: 'power2.out' })
      gsap.from('[data-intro-line]', { yPercent: 110, duration: 1.6, stagger: 0.14, ease: 'power4.out', delay: 0.7 })
      gsap.from('[data-intro-fade]', { autoAlpha: 0, duration: 1.4, ease: 'power3.out', delay: 1.5 })

      // The timeline is exactly 1 long, so positions below read as fractions of the film.
      const playhead = { p: 0 }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
      })
      tl.to(
        playhead,
        {
          p: 1,
          duration: 1,
          onUpdate: () => {
            progress = playhead.p
            aim()
          },
        },
        0,
      )
      tl.to('[data-rail]', { scaleY: 1, duration: 1 }, 0)
      tl.to('[data-hint]', { opacity: 0, duration: 0.05 }, 0.03)
      tl.to('[data-caption="opening"]', { opacity: 0, y: -24, duration: 0.05, ease: 'power2.in' }, OPENING_OUT)

      for (const c of captions) {
        const el = `[data-caption="${c.id}"]`
        tl.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.045, ease: 'power2.out' }, c.from)
        tl.to(el, { opacity: 0, y: -24, duration: 0.04, ease: 'power2.in' }, c.to - 0.04)
      }

      tl.fromTo('[data-final-line]', { yPercent: 110 }, { yPercent: 0, duration: 0.1, ease: 'power3.out' }, FINAL_IN)
      tl.fromTo(
        '[data-final-fade]',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.07, stagger: 0.03, ease: 'power2.out' },
        FINAL_IN + 0.08,
      )
    }, section)

    return () => {
      abort.abort()
      ctx.revert()
      gsap.ticker.remove(seek)
      v.removeEventListener('loadedmetadata', onMeta)
      document.removeEventListener('visibilitychange', onVisible)
      v.removeAttribute('src')
      v.load()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [scrub])

  // Touch devices: play the film once, then rest on the walk. No pinning, no scroll-jacking.
  useEffect(() => {
    const v = video.current
    if (mode !== 'film') return

    const hold = () => {
      if (v && !v.paused && v.currentTime >= FILM.holdAt) v.pause()
    }
    if (v) {
      v.muted = true
      // Autoplay can be refused (low-power mode, browser policy). The poster simply stays.
      v.play().catch(() => {})
      gsap.ticker.add(hold)
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from(media.current, { autoAlpha: 0, duration: 2.4, ease: 'power2.out' })
        .from('[data-final-line]', { yPercent: 110, duration: 1.6, stagger: 0.14 }, 0.7)
        .from('[data-final-fade]', { autoAlpha: 0, y: 18, duration: 1.4, stagger: 0.14, ease: 'power3.out' }, 1.3)

      const away = { trigger: section.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to(media.current, { yPercent: 14, ease: 'none', scrollTrigger: away })
      gsap.to('[data-final]', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: away })
    }, section)

    return () => {
      gsap.ticker.remove(hold)
      ctx.revert()
    }
  }, [mode])

  return (
    <section
      ref={section}
      id="home"
      aria-label="Introduction"
      className={cn('relative bg-ink text-ivory', !scrub && 'h-svh min-h-[620px]')}
      // Pinned for SCROLL_LENGTH viewports: the stage below sticks while this taller section scrolls past.
      style={scrub ? { height: `${(1 + SCROLL_LENGTH) * 100}svh` } : undefined}
    >
      <div className={cn('overflow-hidden', scrub ? 'sticky top-0 h-svh' : 'relative size-full')}>
        <div ref={media} className="absolute inset-0">
          {mode === 'still' ? (
            <img src={FILM.poster} alt="" className="size-full object-cover" fetchPriority="high" />
          ) : (
            <video
              ref={video}
              className="size-full object-cover"
              poster={FILM.poster}
              src={scrub ? undefined : FILM.play}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden="true"
              tabIndex={-1}
            />
          )}
        </div>

        {/* Readability: weight at the top for the navigation and at the bottom for the captions. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-ink/75 to-transparent" />
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent',
            scrub ? 'h-[55%] from-ink/90 via-ink/35' : 'h-[70%] from-ink via-ink/55',
          )}
        />

        <div className="absolute inset-x-0 bottom-0">
          <div className="relative mx-auto max-w-[1680px] px-6 pb-12 md:px-12 md:pb-16">
            {scrub && (
              <>
                <div data-caption="opening" className="absolute inset-x-6 bottom-12 md:inset-x-12 md:bottom-16">
                  <CaptionLabel index="01" label="Bridal & groom" intro />
                  <p className="display mt-5 text-[clamp(2.4rem,5.6vw,5.4rem)]">
                    {['Wedding clothes,', 'made to measure'].map((line) => (
                      <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                        <span data-intro-line className="block">
                          {line}
                        </span>
                      </span>
                    ))}
                  </p>
                </div>

                {captions.map((c) => (
                  <div
                    key={c.id}
                    data-caption={c.id}
                    className="absolute inset-x-6 bottom-12 opacity-0 md:inset-x-12 md:bottom-16"
                  >
                    <CaptionLabel index={c.index} label={c.label} />
                    <p className="display mt-5 text-[clamp(2.4rem,5.6vw,5.4rem)]">
                      {c.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </>
            )}

            {/* Final reveal. In scrub mode it arrives with the last shot; otherwise it is the whole hero. */}
            <div data-final className="max-w-full">
              <p className="overflow-hidden">
                <span data-final-line className="block text-[0.875rem] text-ivory/70">
                  {`${site.descriptor} · ${site.location}`}
                </span>
              </p>

              <h1
                className={cn(
                  'mt-6 overflow-hidden pb-[0.08em] font-serif leading-[0.88] font-light tracking-[0.02em]',
                  scrub ? 'text-[clamp(2.4rem,8.4vw,8rem)]' : 'text-[clamp(2.4rem,10vw,9.5rem)]',
                )}
              >
                <span data-final-line className="block">
                  {site.name}
                </span>
              </h1>

              <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
                {/* The scrubbed footage carries the tagline itself, so it is not set a second time on top of it. */}
                <p
                  data-final-fade
                  className={cn('text-[1.05rem] text-ivory/80', scrub && 'sr-only')}
                >
                  “{site.tagline}”
                </p>
                <div data-final-fade>
                  <AnchorLink to="collections" className={button('light')}>
                    Explore the Collections
                  </AnchorLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue, and in scrub mode a hairline that fills as the film advances. */}
        <div
          aria-hidden="true"
          data-intro-fade
          className="absolute right-6 bottom-12 hidden flex-col items-center gap-6 md:right-12 md:bottom-16 md:flex"
        >
          <span data-hint className="eyebrow text-ivory/60 [writing-mode:vertical-rl]">
            Scroll
          </span>
          <span className="block h-20 w-px overflow-hidden bg-ivory/15">
            {scrub ? (
              <span data-rail className="block size-full origin-top scale-y-0 bg-gold" />
            ) : (
              <span className="block size-full bg-gold motion-safe:animate-scroll-line" />
            )}
          </span>
        </div>
      </div>
    </section>
  )
}

function CaptionLabel({ index, label, intro = false }: { index: string; label: string; intro?: boolean }) {
  return (
    <p className="overflow-hidden">
      <span {...(intro ? { 'data-intro-line': '' } : {})} className="flex gap-3 text-[0.875rem] text-ivory/70">
        <span aria-hidden="true" className="tabular-nums">({index})</span>
        {label}
      </span>
    </p>
  )
}
