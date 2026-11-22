import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import type { Video } from '../data/content'
import { lockScroll } from '../lib/scroll'

/** True when a video has something to play (a file or a YouTube id). */
export const isPlayable = (v?: Video | null) => !!(v && (v.src || v.youtube))

/** Poster image: the one given, else YouTube's own thumbnail. */
export const posterOf = (v: Video) => v.poster ?? (v.youtube ? `https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg` : undefined)

type Props = { video: Video | null; onClose: () => void }

/** Full-screen player for a self-hosted MP4 or a YouTube video. */
export function VideoLightbox({ video, onClose }: Props) {
  const closeBtn = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!video) return
    const previous = document.activeElement as HTMLElement | null
    lockScroll(true)
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      previous?.focus()
    }
  }, [video, onClose])

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-night/95 p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.4 }}
          onClick={onClose}
        >
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="absolute top-4 right-4 flex size-12 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors hover:bg-ivory hover:text-ink md:top-6 md:right-6"
          >
            <X size={20} strokeWidth={1.25} />
          </button>

          <motion.div
            className={video.vertical ? 'aspect-[9/16] h-[min(85svh,900px)] max-w-full' : 'aspect-video w-full max-w-6xl'}
            initial={{ scale: reduced ? 1 : 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: reduced ? 1 : 0.96, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {video.youtube ? (
              <iframe
                className="size-full bg-black"
                src={`https://www.youtube-nocookie.com/embed/${video.youtube}?autoplay=1&rel=0&playsinline=1`}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <video className="size-full bg-black object-contain" src={video.src} poster={posterOf(video)} controls autoPlay playsInline />
            )}
          </motion.div>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.875rem] text-ivory/60">{video.title}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
