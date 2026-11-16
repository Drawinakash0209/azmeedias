import type Lenis from 'lenis'
import { prefersReducedMotion } from './gsap'

let lenis: Lenis | null = null

export const setLenis = (instance: Lenis | null) => {
  lenis = instance
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  // A navigation always ends any scroll lock (e.g. a link chosen inside the open mobile menu);
  // a stopped Lenis would otherwise ignore the request.
  lockScroll(false)
  if (lenis) lenis.scrollTo(id === 'home' ? 0 : el, { duration: 1.6 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  history.replaceState(null, '', id === 'home' ? location.pathname : `#${id}`)
}

/** Lock / release page scroll (used by the mobile menu). */
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}
