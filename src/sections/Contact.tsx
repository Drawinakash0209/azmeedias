import type { ReactNode } from 'react'
import { AtSign, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from 'lucide-react'
import { mailtoUrl, placeholders, site, telUrl, whatsappUrl } from '../config/site'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'

type Item = { icon: LucideIcon; label: string; value: ReactNode; href?: string; external?: boolean; pending?: boolean }

const instagramHandle = (url: string) => `@${url.replace(/\/+$/, '').split('/').pop()}`

const items: Item[] = [
  { icon: MapPin, label: 'Location', value: site.location },
  { icon: Phone, label: 'Telephone', value: site.phone ?? placeholders.phone, href: telUrl(), pending: !site.phone },
  {
    icon: Mail,
    label: 'Email',
    value: site.email ?? placeholders.email,
    href: site.email ? mailtoUrl() : undefined,
    pending: !site.email,
  },
  {
    icon: AtSign,
    label: 'Instagram',
    value: site.instagram ? instagramHandle(site.instagram) : placeholders.instagram,
    href: site.instagram ?? undefined,
    external: true,
    pending: !site.instagram,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: site.whatsapp ?? placeholders.whatsapp,
    href: site.whatsapp ? whatsappUrl() : undefined,
    external: true,
    pending: !site.whatsapp,
  },
]

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-coal py-28 md:py-40">
      <div className="mx-auto max-w-[1680px] px-6 md:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index="06" label="Contact" id="contact-title" lines={[site.name]} />
          <Reveal as="p" className="max-w-sm font-serif text-2xl text-ivory/70 italic lg:text-right">
            “{site.tagline}”
          </Reveal>
        </div>

        <ul className="mt-20 grid border-t border-ivory/10 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(({ icon: Icon, label, value, href, external, pending }, i) => (
            <Reveal
              as="li"
              key={label}
              delay={i * 0.06}
              className="border-b border-ivory/10 py-10 sm:px-8 sm:first:pl-0 lg:border-r lg:border-b-0 lg:last:border-r-0"
            >
              <Icon size={18} strokeWidth={1.25} className="text-gold" aria-hidden="true" />
              <p className="eyebrow mt-6 text-ivory/50">{label}</p>
              {href ? (
                <a
                  href={href}
                  className="link-line mt-3 inline-block font-serif text-2xl font-light [overflow-wrap:anywhere] lg:text-xl 2xl:text-2xl"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {value}
                </a>
              ) : (
                <p className={`mt-3 font-serif text-2xl font-light [overflow-wrap:anywhere] lg:text-xl 2xl:text-2xl ${pending ? 'text-ivory/45' : ''}`}>{value}</p>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
