import { navLinks, site, whatsappUrl } from '../config/site'
import { AnchorLink } from '../components/ui/AnchorLink'

const socials = [
  { label: 'Instagram', href: site.instagram },
  { label: 'WhatsApp', href: site.whatsapp ? whatsappUrl() : null },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink">
      <div aria-hidden="true" className="h-px w-full bg-linear-to-r from-transparent via-gold/50 to-transparent" />

      <div className="mx-auto max-w-[1680px] px-6 pt-24 pb-10 md:px-12 md:pt-32">
        <div className="text-center">
          <p className="font-serif text-[clamp(2.5rem,9vw,8rem)] leading-none font-light tracking-[0.04em]">{site.name}</p>
          <p className="mt-6 font-serif text-xl text-gold italic md:text-2xl">“{site.tagline}”</p>
        </div>

        <nav aria-label="Footer" className="mt-16 md:mt-20">
          <ul className="flex flex-wrap justify-center gap-x-10 gap-y-5">
            {navLinks.map((l) => (
              <li key={l.id}>
                <AnchorLink to={l.id} className="eyebrow link-line text-ivory/60 transition-colors duration-500 hover:text-ivory">
                  {l.label}
                </AnchorLink>
              </li>
            ))}
            <li>
              <AnchorLink to="appointment" className="eyebrow link-line text-gold">
                Book an Appointment
              </AnchorLink>
            </li>
          </ul>
        </nav>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-ivory/10 pt-8 md:flex-row">
          <p className="eyebrow text-ivory/40">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex gap-8">
            {socials.map((s) => (
              <li key={s.label}>
                {/* Placeholder until a profile link is added in src/config/site.ts */}
                <a
                  href={s.href ?? '#contact'}
                  className="eyebrow link-line text-ivory/60 transition-colors duration-500 hover:text-gold"
                  {...(s.href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="eyebrow text-ivory/40">{site.location}</p>
        </div>
      </div>
    </footer>
  )
}
