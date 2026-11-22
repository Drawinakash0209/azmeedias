import { Play } from 'lucide-react'
import type { Video } from '../data/content'
import { isPlayable, posterOf } from './VideoLightbox'
import { cn } from '../lib/cn'

type Props = { video: Video; onPlay: (v: Video) => void; className?: string; sizes?: string }

/** Poster with a round play button. Without a video yet, shows a quiet "coming soon" state. */
export function VideoCard({ video, onPlay, className }: Props) {
  const playable = isPlayable(video)
  const poster = posterOf(video)

  const inner = (
    <>
      {poster ? (
        <img
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn('tone absolute inset-0 size-full object-cover transition-transform duration-[1600ms] ease-lux', playable && 'group-hover:scale-[1.04]', !playable && 'opacity-60')}
        />
      ) : null}
      <div aria-hidden="true" className={cn('absolute inset-0', playable ? 'bg-ink/25 transition-colors duration-700 group-hover:bg-ink/10' : 'bg-sand/40')} />
      {playable ? (
        <span className="absolute top-1/2 left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/70 text-ivory backdrop-blur-[2px] transition-[transform,background-color,color] duration-700 ease-lux group-hover:scale-110 group-hover:bg-ivory group-hover:text-ink md:size-24">
          <Play size={22} strokeWidth={1.25} className="ml-1" aria-hidden="true" />
        </span>
      ) : (
        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[0.875rem] text-ink/70">Video coming soon</span>
      )}
    </>
  )

  return playable ? (
    <button type="button" onClick={() => onPlay(video)} aria-label={`Play ${video.title}`} className={cn('group relative block w-full overflow-hidden bg-ink', className)} data-cursor>
      {inner}
    </button>
  ) : (
    <div className={cn('relative overflow-hidden bg-sand', className)}>{inner}</div>
  )
}
