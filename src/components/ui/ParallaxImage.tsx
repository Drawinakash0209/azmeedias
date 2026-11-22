import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'
import { cn } from '../../lib/cn'

type Props = {
  /** Base file name inside /public/images, without size suffix or extension. */
  name: string
  alt: string
  /** `sizes` attribute so the browser picks the 800w or 1600w file. */
  sizes: string
  className?: string
  imgClassName?: string
  position?: string
  /** Wipe the image into view the first time it is seen. */
  unveil?: boolean
}

export const imageSrc = (name: string, width: 800 | 1600 = 800) => `/images/${name}-${width}.webp`
export const imageSrcSet = (name: string) => `${imageSrc(name, 800)} 800w, ${imageSrc(name, 1600)} 1600w`

/** Lazy-loaded responsive photograph with a subtle scroll parallax. */
export function ParallaxImage({ name, alt, sizes, className, imgClassName, position = '50% 50%', unveil = true }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!wrap.current || !img.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      if (unveil) {
        gsap.fromTo(
          wrap.current,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.6,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: wrap.current, start: 'top 90%', once: true },
          },
        )
      }
    })
    return () => ctx.revert()
  }, [unveil])

  return (
    <div ref={wrap} className={cn('relative overflow-hidden bg-sand', className)}>
      <img
        ref={img}
        src={imageSrc(name)}
        srcSet={imageSrcSet(name)}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: position }}
        className={cn('tone absolute -top-[8%] left-0 h-[116%] w-full object-cover', imgClassName)}
      />
    </div>
  )
}
