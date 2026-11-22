import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MessageCircle, Phone } from 'lucide-react'
import { site, telUrl, whatsappUrl } from '../config/site'

/**
 * Floating Call and WhatsApp buttons, bottom-right. They appear once the visitor starts scrolling.
 * Until a phone number is set in src/config/site.ts, "Call" scrolls to the contact details instead.
 */
export function QuickContact() {
  const [shown, setShown] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 160)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const actions = [
    {
      label: 'WhatsApp us',
      href: whatsappUrl(`Hello ${site.name}, I would like to ask about an appointment.`),
      external: true,
      icon: MessageCircle,
      className: 'bg-paper text-ink border border-ink/15 hover:bg-ink hover:text-paper',
    },
    {
      label: site.phone ? `Call ${site.phone}` : 'Call us',
      href: telUrl() ?? '#contact',
      external: false,
      icon: Phone,
      className: 'bg-ink text-paper ring-1 ring-ivory/25 hover:bg-gold-deep',
    },
  ]

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 md:right-6 md:bottom-6"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : 16 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {actions.map(({ label, href, external, icon: Icon, className }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`group flex h-14 items-center gap-0 overflow-hidden rounded-full shadow-[0_12px_30px_-12px_rgba(23,20,15,0.45)] transition-colors duration-500 ${className}`}
            >
              {/* Label slides out on hover (desktop) */}
              <span className="max-w-0 overflow-hidden pl-0 text-[0.875rem] whitespace-nowrap transition-[max-width,padding] duration-500 ease-lux group-hover:max-w-48 group-hover:pl-5 group-focus-visible:max-w-48 group-focus-visible:pl-5">
                {label}
              </span>
              <span className="flex size-14 shrink-0 items-center justify-center">
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
              </span>
            </a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
