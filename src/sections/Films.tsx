import { useState } from 'react'
import { films, type Video } from '../data/content'
import { VideoCard } from '../components/VideoCard'
import { VideoLightbox } from '../components/VideoLightbox'
import { Reveal } from '../components/ui/Reveal'
import { SectionBar, SectionHeading } from '../components/ui/SectionHeading'

/** Marketing films: one large, the rest beside it. */
export function Films() {
  const [playing, setPlaying] = useState<Video | null>(null)
  const [featured, ...rest] = films
  if (!featured) return null

  return (
    <section id="films" aria-labelledby="films-title" className="bg-paper">
      <SectionBar index="05" label="Films" />
      <div className="mx-auto max-w-[1600px] px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32">
        <SectionHeading id="films-title" lines={['Films']} text="Short films from our studio and our weddings." />

        <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-12">
          <Reveal className="md:col-span-8">
            <VideoCard video={featured} onPlay={setPlaying} className="aspect-video" />
            <p className="mt-3 flex justify-between text-[0.8125rem]">
              <span>{featured.title}</span>
              <span className="text-stone tabular-nums">(01)</span>
            </p>
          </Reveal>
          <div className="grid gap-6 md:col-span-4">
            {rest.map((v, i) => (
              <Reveal key={v.title + i}>
                <VideoCard video={v} onPlay={setPlaying} className="aspect-video" />
                <p className="mt-3 flex justify-between text-[0.8125rem]">
                  <span>{v.title}</span>
                  <span className="text-stone tabular-nums">({String(i + 2).padStart(2, '0')})</span>
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <VideoLightbox video={playing} onClose={() => setPlaying(null)} />
    </section>
  )
}
