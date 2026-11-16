import { useEffect, useRef, useState } from 'react'
import { craftStages } from '../data/content'
import { ScrollTrigger, gsap } from '../lib/gsap'
import { imageSrc, imageSrcSet, ParallaxImage } from '../components/ui/ParallaxImage'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { cn } from '../lib/cn'

/**
 * The bespoke process. On desktop a pinned photograph cross-fades as each
 * stage scrolls past; on smaller screens every stage carries its own image.
 */
export function Craft() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-stage]').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="craft" aria-labelledby="craft-title" className="relative bg-coal">
      <div className="mx-auto max-w-[1680px] px-6 pt-28 md:px-12 md:pt-44">
        <SectionHeading index="02" label="The Process" id="craft-title" lines={['The Art of', 'Craftsmanship']} />
      </div>

      <div className="mx-auto grid max-w-[1680px] px-6 pb-28 md:px-12 md:pb-32 lg:grid-cols-12 lg:gap-x-10">
        {/* Pinned photograph (desktop) */}
        <div className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-0 flex h-screen items-center">
            <div className="relative aspect-[4/5] max-h-[78vh] w-full overflow-hidden bg-ink">
              {craftStages.map((s, i) => (
                <img
                  key={s.image}
                  src={imageSrc(s.image)}
                  srcSet={imageSrcSet(s.image)}
                  sizes="45vw"
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: s.position }}
                  className={cn(
                    'tone absolute inset-0 size-full object-cover transition-[opacity,transform,filter] duration-[1400ms] ease-lux',
                    i === active ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0',
                  )}
                />
              ))}
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
              <div aria-hidden="true" className="absolute bottom-8 left-8 flex items-end gap-4">
                <span className="font-serif text-7xl leading-none font-light text-ivory">{craftStages[active].number}</span>
                <span className="eyebrow pb-2 text-ivory/60">/ 04</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stages */}
        <ol className="lg:col-span-5 lg:col-start-8">
          {craftStages.map((s, i) => (
            <li
              key={s.number}
              data-stage
              className={cn(
                'flex flex-col justify-center border-t border-ivory/10 py-16 transition-opacity duration-700 ease-lux first:border-t-0 lg:min-h-[78vh] lg:border-t-0 lg:py-0',
                i === active ? 'lg:opacity-100' : 'lg:opacity-30',
              )}
            >
              <ParallaxImage
                name={s.image}
                alt={s.alt}
                sizes="90vw"
                position={s.position}
                className="mb-10 aspect-[4/5] sm:aspect-[3/2] lg:hidden"
              />
              <Reveal>
                <p className="eyebrow flex items-center gap-4 text-gold">
                  <span>{s.number}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-px bg-gold/60 transition-[width] duration-1000 ease-lux',
                      i === active ? 'w-16' : 'w-6',
                    )}
                  />
                </p>
                <h3 className="mt-6 font-serif text-5xl leading-none font-light md:text-6xl xl:text-7xl">{s.title}</h3>
                <p className="mt-6 max-w-sm text-lg leading-relaxed text-ivory/65">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
