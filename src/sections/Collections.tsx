import { ArrowUpRight } from 'lucide-react'
import { collections } from '../data/content'
import { AnchorLink } from '../components/ui/AnchorLink'
import { ParallaxImage } from '../components/ui/ParallaxImage'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { cn } from '../lib/cn'

/** Staggered editorial layout: wide and narrow plates alternate, offset vertically. */
const layout = [
  { cell: 'lg:col-span-7', ratio: 'aspect-[4/5]', sizes: '(min-width: 1024px) 56vw, 90vw' },
  { cell: 'lg:col-span-4 lg:col-start-9 lg:mt-56', ratio: 'aspect-[3/4]', sizes: '(min-width: 1024px) 32vw, 90vw' },
  { cell: 'lg:col-span-4 lg:col-start-2 lg:-mt-24', ratio: 'aspect-[3/4]', sizes: '(min-width: 1024px) 32vw, 90vw' },
  { cell: 'lg:col-span-6 lg:col-start-7 lg:mt-40', ratio: 'aspect-[4/5]', sizes: '(min-width: 1024px) 48vw, 90vw' },
]

type Props = { onExplore: (collection: string) => void }

export function Collections({ onExplore }: Props) {
  return (
    <section id="collections" aria-labelledby="collections-title" className="bg-ink py-28 md:py-44">
      <div className="mx-auto max-w-[1680px] px-6 md:px-12">
        <SectionHeading index="03" label="Collections" id="collections-title" lines={['The Collections']} />

        <div className="mt-20 grid gap-y-24 md:mt-28 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          {collections.map((c, i) => (
            <article key={c.name} className={cn('group', layout[i].cell)}>
              <div className="relative" data-cursor>
                <ParallaxImage
                  name={c.image}
                  alt={c.alt}
                  sizes={layout[i].sizes}
                  position={c.position}
                  className={layout[i].ratio}
                  imgClassName="group-hover:scale-[1.04] group-hover:[filter:grayscale(0.2)_sepia(0.1)_contrast(1.05)_brightness(0.9)]"
                />
                <span aria-hidden="true" className="eyebrow absolute top-6 left-6 text-ivory/80">
                  N° {c.number}
                </span>
              </div>

              <Reveal className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
                <div>
                  <h3 className="font-serif text-3xl leading-tight font-light md:text-4xl">{c.name}</h3>
                  <p className="mt-3 max-w-sm leading-relaxed text-ivory/60">{c.text}</p>
                </div>
                <AnchorLink
                  to="appointment"
                  onClick={() => onExplore(c.name)}
                  aria-label={`Explore ${c.name}`}
                  className="eyebrow link-line mt-1 inline-flex shrink-0 items-center gap-2 self-start text-gold"
                >
                  Explore Collection
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="transition-transform duration-500 ease-lux group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </AnchorLink>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
