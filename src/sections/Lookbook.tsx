import { useEffect, useRef } from 'react'
import { lookbook } from '../data/content'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { imageSrc, imageSrcSet } from '../components/ui/ParallaxImage'
import { SectionBar, SectionHeading } from '../components/ui/SectionHeading'

/** Strength of the curve. ANGLE is the tilt of a card at the screen edge; DEPTH pulls the centre back. */
const ANGLE = 34
const DEPTH = 0.22
const LIFT = 0.05

/**
 * Lookbook on a curved strip: cards near the screen edges are larger and angled in,
 * cards in the middle sit back, as if lining the inside of a cylinder.
 * Desktop: the section pins and scrolling slides the strip sideways.
 * Touch and small screens: a swipeable row with the same curve.
 */
export function Lookbook() {
  const section = useRef<HTMLElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  // Curve: every frame, shape each card from where it sits on screen.
  useEffect(() => {
    if (!track.current || prefersReducedMotion()) return
    const cards = Array.from(track.current.querySelectorAll<HTMLElement>('[data-plate]'))

    const shape = () => {
      const half = window.innerWidth / 2
      for (const card of cards) {
        const r = card.getBoundingClientRect()
        if (r.right < -200 || r.left > window.innerWidth + 200) continue
        // -1 at the left edge of the screen, 0 in the centre, 1 at the right edge
        const d = gsap.utils.clamp(-1.4, 1.4, (r.left + r.width / 2 - half) / half)
        const scale = 1 - DEPTH + DEPTH * d * d
        card.style.transform = `perspective(1100px) rotateY(${-d * ANGLE}deg) scale(${scale}) translateY(${-LIFT * 100 * d * d}%)`
      }
    }

    shape()
    gsap.ticker.add(shape)
    return () => {
      gsap.ticker.remove(shape)
      cards.forEach((c) => (c.style.transform = ''))
    }
  }, [])

  // Desktop: pin and drive the strip sideways with the scroll; start with it centred on the first cards.
  useEffect(() => {
    if (!section.current || !track.current || prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (hover: hover) and (pointer: fine)', () => {
      const el = track.current!
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth)
      gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <>
      <SectionBar index="04" label="Lookbook" />
      <section
        ref={section}
        id="lookbook"
        aria-labelledby="lookbook-title"
        className="overflow-hidden bg-cream pb-20 md:pb-28 lg:flex lg:h-svh lg:flex-col lg:pb-0"
      >
        <div className="mx-auto w-full max-w-[1600px] px-5 pt-16 md:px-10 md:pt-20 lg:pt-24">
          <SectionHeading
            id="lookbook-title"
            lines={['Lookbook']}
            text={
              <>
                <span className="lg:hidden">Swipe to see more</span>
                <span className="hidden lg:inline">Keep scrolling to see more</span>
              </>
            }
          />
        </div>

        <div
          ref={scroller}
          className="no-scrollbar mt-12 snap-x snap-mandatory scroll-px-[19vw] overflow-x-auto overscroll-x-contain py-10 lg:my-auto lg:snap-none lg:overflow-visible lg:py-0"
          tabIndex={0}
          aria-label="Lookbook images"
        >
          <div ref={track} className="flex w-max items-center gap-3 px-[19vw] md:gap-5 lg:px-[6vw] lg:will-change-transform">
            {lookbook.map((p) => (
              <figure
                key={p.image}
                data-plate
                className="w-[62vw] shrink-0 snap-center will-change-transform sm:w-[36vw] lg:w-[19.5vw]"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-sand lg:max-h-[62svh]">
                  <img
                    src={imageSrc(p.image)}
                    srcSet={imageSrcSet(p.image)}
                    sizes="(min-width: 1024px) 20vw, 62vw"
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: p.position }}
                    className="tone size-full object-cover"
                  />
                </div>
                <figcaption className="sr-only">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
