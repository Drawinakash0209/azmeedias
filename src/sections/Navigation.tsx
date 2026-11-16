import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { navLinks, site } from '../config/site'
import { AnchorLink } from '../components/ui/AnchorLink'
import { goldButton } from '../components/ui/Button'
import { lockScroll } from '../lib/scroll'
import { cn } from '../lib/cn'

const ease = [0.22, 1, 0.36, 1] as const

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,padding] duration-700 ease-lux motion-safe:animate-nav-in',
        scrolled && !open ? 'border-ivory/10 bg-ink/90 py-4 backdrop-blur-md' : 'border-transparent py-6',
      )}
    >
      <div className="mx-auto flex max-w-[1680px] items-center justify-between px-6 md:px-12">
        <AnchorLink
          to="home"
          onClick={() => setOpen(false)}
          className="relative z-50 font-serif text-xl tracking-[0.22em] md:text-2xl"
          aria-label={`${site.name} — home`}
        >
          {site.name}
        </AnchorLink>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {navLinks.map((l) => (
              <li key={l.id}>
                <AnchorLink
                  to={l.id}
                  className="eyebrow link-line text-ivory/75 transition-colors duration-500 hover:text-ivory"
                >
                  {l.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          {/* Display is set on a wrapper: goldButton's own inline-flex would override `hidden`. */}
          <div className="hidden sm:block">
            <AnchorLink to="appointment" className={goldButton('sm')}>
              <span className="relative">Book an Appointment</span>
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
            <span className="relative block h-3 w-7" aria-hidden="true">
              <span
                className={cn(
                  'absolute left-0 h-px w-full bg-ivory transition-transform duration-500 ease-lux',
                  open ? 'top-1/2 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 h-px w-full bg-ivory transition-transform duration-500 ease-lux',
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
            className="fixed inset-0 z-40 flex h-dvh flex-col bg-ink px-6 pt-28 pb-10 lg:hidden"
            initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: reduced ? 0.2 : 0.9, ease }}
          >
            <nav aria-label="Mobile" className="flex-1">
              <ul className="flex flex-col">
                {navLinks.map((l, i) => (
                  <li key={l.id} className="overflow-hidden border-b border-ivory/10">
                    <motion.div
                      initial={reduced ? false : { y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease }}
                    >
                      <AnchorLink
                        to={l.id}
                        onClick={() => setOpen(false)}
                        className="flex items-baseline gap-5 py-5 font-serif text-4xl font-light"
                      >
                        <span className="eyebrow text-gold" aria-hidden="true">
                          0{i + 1}
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
              <AnchorLink to="appointment" onClick={() => setOpen(false)} className={goldButton('md', 'w-full')}>
                <span className="relative">Book an Appointment</span>
              </AnchorLink>
              <p className="text-center font-serif text-lg text-ivory/60 italic">“{site.tagline}”</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
