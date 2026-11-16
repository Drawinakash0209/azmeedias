import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/**
 * A quiet ring that trails the pointer and opens up over interactive elements.
 * Desktop pointers only; the native cursor stays visible so nothing is lost.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const [enabled] = useState(
    () => window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion(),
  )

  useEffect(() => {
    const el = ring.current
    if (!enabled || !el) return

    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    const x = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' })

    const move = (e: PointerEvent) => {
      x(e.clientX)
      y(e.clientY)
      gsap.to(el, { autoAlpha: 1, duration: 0.4, overwrite: 'auto' })
    }
    const over = (e: PointerEvent) => {
      const active = !!(e.target as Element).closest?.('a, button, select, [data-cursor]')
      gsap.to(el, {
        scale: active ? 2.1 : 1,
        backgroundColor: active ? 'rgba(198,165,107,0.12)' : 'rgba(198,165,107,0)',
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
    const leave = () => gsap.to(el, { autoAlpha: 0, duration: 0.3, overwrite: 'auto' })

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-[70] size-7 rounded-full border border-gold/70"
    />
  )
}
