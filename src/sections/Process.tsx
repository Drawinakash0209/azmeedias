import { useEffect, useRef } from 'react'
import { processSteps } from '../data/content'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { ParallaxImage } from '../components/ui/ParallaxImage'
import { Reveal } from '../components/ui/Reveal'
import { SectionBar, SectionHeading } from '../components/ui/SectionHeading'
import { cn } from '../lib/cn'

/** Four ruled columns. A line draws across the top as the section scrolls into view. */
export function Process() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-progress]',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-steps]', start: 'top 80%', end: 'bottom 70%', scrub: 0.6 },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="process" aria-labelledby="process-title" className="bg-paper">
      <SectionBar index="03" label="How it works" />
      <div className="mx-auto max-w-[1600px] px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32">
        <SectionHeading
          id="process-title"
          lines={[['From the first', 'meeting'], 'to the final fitting']}
          text="Gown or suit, every piece goes through the same four steps."
        />

        <div data-steps className="relative mt-16 md:mt-24">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-ink/15">
            <div data-progress className="h-full origin-left bg-ink" />
          </div>

          <ol className="grid md:grid-cols-4">
            {processSteps.map((s, i) => (
              <li key={s.number} className={cn('flex flex-col pt-8 pb-10 md:px-6 md:pb-0', i > 0 && 'border-t border-ink/15 md:border-t-0 md:border-l', i === 0 && 'md:pl-0', i === 3 && 'md:pr-0')}>
                <Reveal>
                  <p className="text-[0.8125rem] text-stone tabular-nums">({s.number})</p>
                  <h3 className="mt-6 text-[1.6rem] leading-tight tracking-[-0.03em] md:text-[1.75rem]">{s.title}</h3>
                  <p className="mt-3 max-w-xs text-[0.9rem] leading-[1.6] text-stone">{s.text}</p>
                </Reveal>
                <ParallaxImage name={s.image} alt={s.alt} sizes="(min-width: 768px) 24vw, 92vw" className="mt-8 aspect-[4/5]" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
