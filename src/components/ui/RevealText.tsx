import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'
import { cn } from '../../lib/cn'

type Props = {
  /** Each entry is revealed as its own masked line. */
  lines: ReactNode[]
  as?: ElementType
  className?: string
  delay?: number
  id?: string
}

/** Editorial headline reveal: each line rises from behind a mask. */
export function RevealText({ lines, as: Tag = 'h2', className, delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-line]', {
        yPercent: 110,
        delay,
        duration: 1.5,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [delay])

  return (
    <Tag ref={ref} id={id} className={cn(className)}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.12em] block overflow-y-clip pb-[0.12em]">
          <span data-line className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
