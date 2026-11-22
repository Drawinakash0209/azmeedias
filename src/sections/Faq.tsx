import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import { faqs } from '../data/content'
import { whatsappUrl } from '../config/site'
import { circle } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { SectionBar, SectionHeading } from '../components/ui/SectionHeading'
import { cn } from '../lib/cn'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const reduced = useReducedMotion()
  const base = useId()

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-paper">
      <SectionBar index="07" label="Questions" />
      <div className="mx-auto max-w-[1600px] px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32">
        <SectionHeading id="faq-title" lines={['Questions before', 'your first visit']} />

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="flex flex-col justify-between gap-10 lg:col-span-4">
            <p className="max-w-xs text-[0.95rem] leading-[1.6] text-stone">
              If your question isn&rsquo;t here, message us and we&rsquo;ll get back to you.
            </p>
            <a
              href={whatsappUrl('Hello, I have a question about bridal / groom wear.')}
              target="_blank"
              rel="noopener noreferrer"
              className={circle()}
            >
              Ask us
            </a>
          </Reveal>

          <Reveal as="ul" className="border-t border-ink/15 lg:col-span-8">
            {faqs.map((f, i) => {
              const isOpen = open === i
              const id = `${base}-${i}`
              return (
                <li key={f.q} className="border-b border-ink/15">
                  <h3>
                    <button
                      type="button"
                      id={`${id}-q`}
                      aria-expanded={isOpen}
                      aria-controls={`${id}-a`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[4rem_1fr_auto] md:py-7"
                    >
                      <span className="text-[0.8125rem] text-stone tabular-nums">({String(i + 1).padStart(2, '0')})</span>
                      <span className="text-[1.15rem] leading-snug tracking-[-0.02em] md:text-[1.35rem]">{f.q}</span>
                      <Plus
                        size={20}
                        strokeWidth={1.25}
                        aria-hidden="true"
                        className={cn('transition-transform duration-500 ease-lux', isOpen && 'rotate-45')}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`${id}-a`}
                        role="region"
                        aria-labelledby={`${id}-q`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-8 pl-[4rem] text-[0.95rem] leading-[1.7] text-stone md:pl-[5rem]">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
