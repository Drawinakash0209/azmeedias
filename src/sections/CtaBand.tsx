import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { AnchorLink } from '../components/ui/AnchorLink'
import { circle } from '../components/ui/Button'
import { imageSrc } from '../components/ui/ParallaxImage'
import { RevealText } from '../components/ui/RevealText'

/** Full-bleed photograph band; the image opens out from an inset frame as it scrolls in. */
export function CtaBand() {
  const frame = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!frame.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame.current,
        { clipPath: 'inset(7% 6% 7% 6%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: frame.current, start: 'top 85%', end: 'top 20%', scrub: 0.6 },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section aria-labelledby="cta-title" className="bg-paper">
      <div ref={frame} className="relative isolate overflow-hidden bg-night text-ivory">
        <img
          src={imageSrc('couple-bouquet', 1600)}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover object-[50%_40%] opacity-85"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-night/85 via-night/45 to-transparent" />
        <div className="mx-auto flex min-h-[80svh] max-w-[1600px] flex-col justify-end gap-12 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-10 md:py-16">
          <div>
            <p className="text-[0.8125rem] text-ivory/60">Planning a wedding?</p>
            <RevealText
              as="h2"
              id="cta-title"
              className="display mt-5 text-[clamp(2.6rem,7vw,6.5rem)]"
              lines={['Start with a', 'consultation']}
            />
          </div>
          <AnchorLink to="appointment" className={circle(true)}>
            Book now
          </AnchorLink>
        </div>
      </div>
    </section>
  )
}
