/**
 * Brand & contact details.
 *
 * Anything set to `null` has not been provided yet and is rendered as a
 * clearly-marked placeholder. Fill these in before going live.
 */
export const site = {
  name: "AZMEEDIA'S",
  tagline: 'Elegance, Tailored to You.',
  location: 'Sri Lanka',

  /** Display phone number, e.g. '+94 77 123 4567' */
  phone: null as string | null,
  /** e.g. 'appointments@yourdomain.com' */
  email: null as string | null,
  /** WhatsApp number in international format, e.g. '+94 77 123 4567' */
  whatsapp: null as string | null,
  /** Full profile URL, e.g. 'https://instagram.com/yourhandle' */
  instagram: null as string | null,
}

export const placeholders = {
  phone: '+94 XX XXX XXXX',
  email: 'hello@yourdomain.com',
  whatsapp: '+94 XX XXX XXXX',
  instagram: '@yourhandle',
}

export const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'Our Craft', id: 'craft' },
  { label: 'Collections', id: 'collections' },
  { label: 'About Us', id: 'about' },
  { label: 'Contact', id: 'contact' },
] as const

const digits = (v: string) => v.replace(/[^\d]/g, '')

/** wa.me link. Without a configured number WhatsApp asks the sender to pick a chat. */
export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${site.whatsapp ? digits(site.whatsapp) : ''}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export function mailtoUrl(subject?: string, body?: string) {
  const params = [
    subject && `subject=${encodeURIComponent(subject)}`,
    body && `body=${encodeURIComponent(body)}`,
  ].filter(Boolean)
  return `mailto:${site.email ?? ''}${params.length ? `?${params.join('&')}` : ''}`
}

export const telUrl = () => (site.phone ? `tel:+${digits(site.phone)}` : undefined)
