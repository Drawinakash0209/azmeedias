import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

type Props = {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  y?: number
}

/** Fades content up once, as it enters the viewport. */
export function Reveal({ children, as: Tag = 'div', className, delay = 0, y = 28 }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(el, {
        autoAlpha: 0,
        y,
        delay,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })
    return () => ctx.revert()
  }, [delay, y])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
