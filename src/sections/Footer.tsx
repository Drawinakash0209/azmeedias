import type { ReactNode } from 'react'
import { AtSign, MapPin, MessageCircle, Phone, type LucideIcon } from 'lucide-react'
import { navLinks, placeholders, site, telUrl, whatsappUrl } from '../config/site'
import { AnchorLink } from '../components/ui/AnchorLink'

type Item = { icon: LucideIcon; label: string; value: ReactNode; href?: string; external?: boolean; pending?: boolean }

const instagramHandle = (url: string) => `@${url.replace(/\/+$/, '').split('/').pop()}`

const contacts: Item[] = [
  { icon: MapPin, label: 'Location', value: site.location },
  { icon: Phone, label: 'Telephone', value: site.phone ?? placeholders.phone, href: telUrl(), pending: !site.phone },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: site.whatsapp ?? placeholders.whatsapp,
    href: site.whatsapp ? whatsappUrl() : undefined,
    external: true,
    pending: !site.whatsapp,
  },
  {
    icon: AtSign,
    label: 'Instagram',
    value: site.instagram ? instagramHandle(site.instagram) : placeholders.instagram,
    href: site.instagram ?? undefined,
    external: true,
    pending: !site.instagram,
  },
]

export function Footer() {
  return (
    <footer id="contact" aria-labelledby="contact-title" className="bg-night text-ivory">
      <div className="mx-auto max-w-[1600px] px-5 pt-24 pb-10 md:px-10 md:pt-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p id="contact-title" className="display text-[clamp(2.2rem,4vw,3.6rem)]">
              Visit the
              <br />
              atelier
            </p>
            <p className="mt-6 max-w-xs text-[0.95rem] leading-[1.6] text-ivory/60">
              {site.descriptor}, {site.location}. {site.tagline}
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <p className="text-[0.8125rem] text-ivory/45">Explore</p>
            <ul className="mt-6 space-y-3">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <AnchorLink to={l.id} className="link-line text-ivory/80 transition-colors hover:text-ivory">
                    {l.label}
                  </AnchorLink>
                </li>
              ))}
              <li>
                <AnchorLink to="appointment" className="link-line text-gold">
                  Book a Consultation
                </AnchorLink>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-5">
            <p className="text-[0.8125rem] text-ivory/45">Contact</p>
            <ul className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {contacts.map(({ icon: Icon, label, value, href, external, pending }) => (
                <li key={label} className="flex gap-4">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-ivory/20 text-ivory/80">
                    <Icon size={15} strokeWidth={1.4} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.8125rem] text-ivory/45">{label}</span>
                    {href ? (
                      <a
                        href={href}
                        className="link-line mt-1 inline-block [overflow-wrap:anywhere]"
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {value}
                      </a>
                    ) : (
                      <span className={`mt-1 block [overflow-wrap:anywhere] ${pending ? 'text-ivory/40' : ''}`}>{value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-ivory/15 pt-6 text-[0.8125rem] text-ivory/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Bridal &amp; Groom Designing &amp; Tailoring · {site.location}</p>
        </div>
      </div>

      {/* Oversized wordmark, cut off by the bottom edge */}
      <div aria-hidden="true" className="overflow-hidden">
        <p className="-mb-[0.22em] text-center font-serif text-[15.2vw] leading-[0.9] tracking-[-0.02em] whitespace-nowrap text-ivory/90">
          {site.name}
        </p>
      </div>
    </footer>
  )
}
