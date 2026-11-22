import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { collections } from '../data/content'
import { AnchorLink } from '../components/ui/AnchorLink'
import { circle } from '../components/ui/Button'
import { imageSrc, imageSrcSet } from '../components/ui/ParallaxImage'
import { Reveal } from '../components/ui/Reveal'
import { SectionBar, SectionHeading } from '../components/ui/SectionHeading'
import { cn } from '../lib/cn'

type Side = keyof typeof collections
const tabs: Array<{ id: Side; label: string }> = [
  { id: 'her', label: 'Bride' },
  { id: 'him', label: 'Groom' },
]
const ease = [0.22, 1, 0.36, 1] as const

type Props = { onExplore: (enquiry: string) => void }

export function Collections({ onExplore }: Props) {
  const [side, setSide] = useState<Side>('her')
  const reduced = useReducedMotion()

  const switcher = (
    <div role="tablist" aria-label="Collections for" className="flex gap-8">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          id={`tab-${t.id}`}
          aria-selected={side === t.id}
          aria-controls="collections-panel"
          onClick={() => setSide(t.id)}
          className={cn(
            'relative pb-2 text-[1.05rem] transition-colors duration-500',
            side === t.id ? 'text-ink' : 'text-stone hover:text-ink',
          )}
        >
          {t.label} <span className="text-[0.75rem] align-top tabular-nums">({String(collections[t.id].length).padStart(2, '0')})</span>
          {side === t.id && (
            <motion.span layoutId="collections-underline" className="absolute inset-x-0 bottom-0 h-px bg-ink" transition={{ duration: reduced ? 0 : 0.5, ease }} />
          )}
        </button>
      ))}
    </div>
  )

  return (
    <section id="collections" aria-labelledby="collections-title" className="bg-cream">
      <SectionBar index="02" label="Collections" />
      <div className="mx-auto max-w-[1600px] px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32">
        <SectionHeading
          id="collections-title"
          lines={['Collections for the', ['bride', 'and the groom']]}
          aside={switcher}
        />

        <div id="collections-panel" role="tabpanel" aria-labelledby={`tab-${side}`} className="mt-14 border-y border-ink/15 md:mt-20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={side}
              className="grid md:grid-cols-3"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{ show: { transition: { staggerChildren: reduced ? 0 : 0.09 } } }}
            >
              {collections[side].map((c, i) => (
                <motion.li
                  key={c.name}
                  className={cn('py-6 md:px-6', i > 0 && 'border-t border-ink/15 md:border-t-0 md:border-l', i === 0 && 'md:pl-0', i === 2 && 'md:pr-0')}
                  variants={{
                    hidden: { opacity: 0, y: reduced ? 0 : 36 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
                    exit: { opacity: 0, y: reduced ? 0 : -16, transition: { duration: 0.3, ease } },
                  }}
                >
                  <AnchorLink
                    to="appointment"
                    onClick={() => onExplore(c.enquiry)}
                    className="group block"
                    aria-label={`${c.name}, book a consultation`}
                    data-cursor
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-sand">
                      <img
                        src={imageSrc(c.image)}
                        srcSet={imageSrcSet(c.image)}
                        sizes="(min-width: 768px) 32vw, 92vw"
                        alt={c.alt}
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: c.position }}
                        className="tone size-full object-cover transition-transform duration-[1600ms] ease-lux group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-6">
                      <div>
                        <h3 className="text-[1.35rem] leading-tight tracking-[-0.02em]">{c.name}</h3>
                        <p className="mt-2 max-w-xs text-[0.875rem] leading-[1.55] text-stone">{c.text}</p>
                      </div>
                      <ArrowUpRight size={18} strokeWidth={1.25} aria-hidden="true" className="mt-1 shrink-0 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </AnchorLink>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        {/* For couples */}
        <Reveal className="mt-16 md:mt-24">
          <div className="relative overflow-hidden bg-ink text-ivory">
            <img
              src={imageSrc('couple-lehenga', 1600)}
              alt="A groom in a white sherwani embracing a bride in red and cream"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-[50%_28%] opacity-75 md:left-auto md:w-[58%]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-ink via-ink/85 to-ink/0 md:via-ink/60" />
            <div className="relative flex min-h-[460px] flex-col justify-between gap-12 px-6 py-10 md:min-h-[520px] md:flex-row md:items-end md:px-12 md:py-12">
              <div className="max-w-lg">
                <p className="text-[0.8125rem] text-ivory/60">For couples</p>
                <h3 className="display mt-4 text-[clamp(2.2rem,4.4vw,4rem)]">
                  Both outfits,
                  <br />
                  planned together
                </h3>
                <p className="mt-6 max-w-sm text-[0.95rem] leading-[1.6] text-ivory/70">
                  We design the bride&rsquo;s and groom&rsquo;s outfits at the same time, so the colours, fabrics and
                  details match.
                </p>
              </div>
              <AnchorLink to="appointment" onClick={() => onExplore('Bride & groom together')} className={circle(true)}>
                Book now
              </AnchorLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
