import { useCallback, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { testimonials, type Video } from '../data/content'
import { VideoCard } from '../components/VideoCard'
import { VideoLightbox } from '../components/VideoLightbox'
import { Reveal } from '../components/ui/Reveal'
import { SectionBar, SectionHeading } from '../components/ui/SectionHeading'
import { cn } from '../lib/cn'

/** Customer reviews: phone-shaped video cards and text cards in one swipeable row. */
export function Testimonials() {
  const track = useRef<HTMLUListElement>(null)
  const [playing, setPlaying] = useState<Video | null>(null)
  const close = useCallback(() => setPlaying(null), [])

  const go = (dir: 1 | -1) => {
    const el = track.current
    const card = el?.querySelector('li')
    if (!el || !card) return
    el.scrollBy({ left: dir * card.getBoundingClientRect().width, behavior: 'smooth' })
  }

  const arrows = (
    <div className="flex gap-2">
      {([-1, 1] as const).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => go(d)}
          aria-label={d < 0 ? 'Previous reviews' : 'Next reviews'}
          className="flex size-12 items-center justify-center rounded-full border border-ink/30 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-paper"
        >
          {d < 0 ? <ArrowLeft size={17} strokeWidth={1.25} /> : <ArrowRight size={17} strokeWidth={1.25} />}
        </button>
      ))}
    </div>
  )

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-cream">
      <SectionBar index="06" label="Reviews" />
      <div className="mx-auto max-w-[1600px] px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32">
        <SectionHeading id="reviews-title" lines={['What our clients say']} aside={<div className="hidden sm:block">{arrows}</div>} />

        <Reveal>
          <ul ref={track} className="no-scrollbar mt-14 flex snap-x snap-mandatory overflow-x-auto border-y border-ink/15 md:mt-20" aria-label="Client reviews">
            {testimonials.map((t, i) => (
              <li
                key={i}
                className={cn(
                  'flex w-[78%] shrink-0 snap-start flex-col justify-between gap-10 py-8 pr-6 sm:w-[45%] md:px-6 md:py-10 lg:w-1/4',
                  i > 0 && 'border-l border-ink/15 pl-6',
                  i === 0 && 'md:pl-0',
                )}
              >
                {t.kind === 'video' ? (
                  <VideoCard video={t.video} onPlay={setPlaying} className="aspect-[9/16]" />
                ) : (
                  <blockquote className="text-[1.3rem] leading-[1.4] tracking-[-0.02em] md:text-[1.45rem]">“{t.quote}”</blockquote>
                )}
                <p className="flex items-baseline justify-between gap-4 text-[0.875rem]">
                  <span>{t.name}</span>
                  <span className="text-stone">{t.kind === 'video' ? `${t.role} · Video` : t.role}</span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <VideoLightbox video={playing} onClose={close} />
    </section>
  )
}
