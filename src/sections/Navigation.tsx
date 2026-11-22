import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { navLinks, site } from '../config/site'
import { AnchorLink } from '../components/ui/AnchorLink'
import { button } from '../components/ui/Button'
import { lockScroll } from '../lib/scroll'
import { cn } from '../lib/cn'

const ease = [0.22, 1, 0.36, 1] as const

/** True once the visitor has scrolled past the dark hero film. */
function usePastHero() {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('home')
      const limit = hero ? hero.offsetTop + hero.offsetHeight - 80 : 40
      setPast(window.scrollY > limit)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return past
}

export function Navigation() {
  const past = usePastHero()
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const light = past && !open // ivory bar with dark text

  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth >= 1024 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      lockScroll(false)
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color,padding] duration-700 ease-lux motion-safe:animate-nav-in',
        light ? 'border-ink/10 bg-paper/90 py-3 text-ink backdrop-blur-xl' : 'border-transparent py-5 text-ivory',
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10">
        <AnchorLink
          to="home"
          onClick={() => setOpen(false)}
          className="relative z-50 flex flex-col leading-none"
          aria-label={`${site.name}, home`}
        >
          <span className="font-serif text-[1.2rem] tracking-[0.18em] md:text-[1.35rem]">{site.name}</span>
          <span className={cn('mt-1.5 text-[0.7rem] tracking-[0.02em]', light ? 'text-stone' : 'text-ivory/60')}>
            {site.descriptor}
          </span>
        </AnchorLink>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navLinks.map((l) => (
              <li key={l.id}>
                <AnchorLink to={l.id} className="link-line text-[0.875rem] opacity-80 transition-opacity hover:opacity-100">
                  {l.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/* Display is set on a wrapper: the button style's own inline-flex would override `hidden`. */}
          <div className="hidden sm:block">
            <AnchorLink to="appointment" className={button(light ? 'dark' : 'light', 'sm')}>
              Book a Consultation
            </AnchorLink>
          </div>

          <button
            type="button"
            className="relative z-50 -mr-2 flex size-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className={cn(
                  'absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-lux',
                  open ? 'top-1/2 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-lux',
                  open ? 'top-1/2 -rotate-45' : 'top-full',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex h-dvh flex-col bg-night px-5 pt-28 pb-10 text-ivory lg:hidden"
            initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: reduced ? 0.2 : 0.9, ease }}
          >
            <nav aria-label="Mobile" className="flex-1">
              <ul className="flex flex-col">
                {[{ label: 'Home', id: 'home' }, ...navLinks].map((l, i) => (
                  <li key={l.id} className="overflow-hidden border-b border-ivory/10">
                    <motion.div
                      initial={reduced ? false : { y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.9, delay: 0.25 + i * 0.06, ease }}
                    >
                      <AnchorLink
                        to={l.id}
                        onClick={() => setOpen(false)}
                        className="display flex items-baseline gap-5 py-4 text-[2.2rem]"
                      >
                        <span className="text-[0.8125rem] tracking-normal text-ivory/50 tabular-nums" aria-hidden="true">
                          (0{i + 1})
                        </span>
                        {l.label}
                      </AnchorLink>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: reduced ? 0 : 0.7 }}
              className="space-y-6"
            >
              <AnchorLink to="appointment" onClick={() => setOpen(false)} className={button('light', 'md', 'w-full')}>
                Book a Consultation
              </AnchorLink>
              <p className="text-center text-[0.95rem] text-ivory/60">{site.tagline}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
