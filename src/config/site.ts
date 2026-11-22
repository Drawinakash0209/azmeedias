/**
 * Brand & contact details.
 *
 * Customers contact the business by phone call or WhatsApp only (no email, by the client's choice).
 * Anything set to `null` has not been provided yet and is rendered as a
 * clearly-marked placeholder. Fill these in before going live.
 */
export const site = {
  name: "AZMEEDIA'S",
  /** Short line under the wordmark */
  descriptor: 'Bridal & Groom Couture',
  tagline: 'Elegance, Tailored to You.',
  location: 'Sri Lanka',

  /** Display phone number, e.g. '+94 77 123 4567' */
  phone: null as string | null,
  /** WhatsApp number in international format, e.g. '+94 77 123 4567' */
  whatsapp: null as string | null,
  /** Full profile URL, e.g. 'https://instagram.com/yourhandle' */
  instagram: null as string | null,
}

export const placeholders = {
  phone: '+94 XX XXX XXXX',
  whatsapp: '+94 XX XXX XXXX',
  instagram: '@yourhandle',
}

export const navLinks = [
  { label: 'Collections', id: 'collections' },
  { label: 'The Process', id: 'process' },
  { label: 'Lookbook', id: 'lookbook' },
  { label: 'Films', id: 'films' },
  { label: 'Reviews', id: 'reviews' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Contact', id: 'contact' },
] as const

const digits = (v: string) => v.replace(/[^\d]/g, '')

/** wa.me link. Without a configured number WhatsApp asks the sender to pick a chat. */
export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${site.whatsapp ? digits(site.whatsapp) : ''}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export const telUrl = () => (site.phone ? `tel:+${digits(site.phone)}` : undefined)
