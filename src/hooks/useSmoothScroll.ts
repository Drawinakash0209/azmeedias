import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { setLenis } from '../lib/scroll'

/** Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ duration: 1.25 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  // Web fonts change text metrics; re-measure trigger positions once they land.
  useEffect(() => {
    let alive = true
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh())
    return () => {
      alive = false
    }
  }, [])
}
