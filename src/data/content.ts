/**
 * Page content. Collection names, descriptions and FAQ answers are draft wording:
 * confirm them with the client before launch.
 */

export type Photo = { image: string; alt: string; position?: string }

export type Collection = Photo & {
  name: string
  text: string
  /** Pre-selects this option in the appointment form */
  enquiry: string
}

export const enquiryTypes = [
  'Bridal wear',
  'Groom wear',
  'Bride & groom together',
  'Classic tailoring',
  'Not sure yet',
] as const

export const collections: Record<'her' | 'him', Collection[]> = {
  her: [
    {
      name: 'Bridal Couture',
      text: 'White gowns, designed with you and fitted to your measurements.',
      image: 'bridal-lace-mirror',
      alt: 'A white lace wedding gown hanging in front of a gilded mirror',
      position: '50% 40%',
      enquiry: 'Bridal wear',
    },
    {
      name: 'Traditional Bridal',
      text: 'Traditional bridal wear in colour, with embroidery and detail.',
      image: 'bridal-sari',
      alt: 'A bride in a red and gold embroidered outfit with gold jewellery',
      position: '50% 25%',
      enquiry: 'Bridal wear',
    },
    {
      name: 'The Details',
      text: 'Lace, beading and finishing chosen piece by piece.',
      image: 'bridal-lace-sheer',
      alt: 'Close view of floral lace on the shoulder of a wedding gown',
      position: '50% 40%',
      enquiry: 'Bridal wear',
    },
  ],
  him: [
    {
      name: 'The Wedding Suit',
      text: 'Wedding suits cut to your measurements.',
      image: 'collection-wedding',
      alt: 'A checked dinner jacket worn with a white dress shirt and black bow tie',
      position: '50% 30%',
      enquiry: 'Groom wear',
    },
    {
      name: 'Classic Tailoring',
      text: 'Everyday suits in classic cuts and cloths.',
      image: 'collection-classic',
      alt: 'A man in a blue checked three-piece suit with a white pocket square',
      position: '50% 20%',
      enquiry: 'Classic tailoring',
    },
    {
      name: 'The Signature',
      text: 'One-off pieces designed around your style.',
      image: 'collection-signature',
      alt: 'A man in a black suit and black shirt adjusting his jacket',
      position: '50% 15%',
      enquiry: 'Groom wear',
    },
  ],
}

export const processSteps = [
  {
    number: '01',
    title: 'Consultation',
    text: 'We talk about the occasion, your style and what you have in mind.',
    image: 'craft-consultation',
    alt: 'Tailored jackets displayed on mannequins in an atelier',
  },
  {
    number: '02',
    title: 'Design & Fabric',
    text: 'We sketch the design and choose fabrics and colours with you.',
    image: 'bridal-lace-hanger',
    alt: 'A beaded lace wedding gown on a wooden hanger',
  },
  {
    number: '03',
    title: 'Fittings',
    text: 'We take your measurements and adjust the piece over several fittings.',
    image: 'bridal-window',
    alt: 'A strapless gown on a dress form beside a bright window',
  },
  {
    number: '04',
    title: 'The Final Fit',
    text: 'The finished piece, ready for the day.',
    image: 'craft-final-fit',
    alt: 'A man fastening the jacket of a dark tailored suit',
  },
] as const

/** Horizontal lookbook. `size` sets each plate's width. */
export const lookbook: Array<Photo & { caption: string; size: 'tall' | 'wide' | 'square' }> = [
  { image: 'bridal-couture', caption: 'Heritage bridal', size: 'tall', alt: 'A bride in an ornate blue and gold outfit with jewellery', position: '50% 25%' },
  { image: 'couple-lehenga', caption: 'Bride & groom', size: 'tall', alt: 'A groom in a white sherwani embracing a bride in red and cream', position: '50% 30%' },
  { image: 'detail-rings', caption: 'The details', size: 'wide', alt: 'Hands with henna and rings resting on an embroidered outfit' },
  { image: 'bridal-sheer-fabric', caption: 'Soft tulle', size: 'tall', alt: 'A woman framed by soft white tulle', position: '50% 50%' },
  { image: 'collection-executive', caption: 'Modern tailoring', size: 'tall', alt: 'A man in a navy suit and open white shirt walking past a glass building', position: '50% 20%' },
  { image: 'couple-hands', caption: 'Together', size: 'wide', alt: 'A bride and groom holding hands' },
  { image: 'bridal-redgold', caption: 'Traditional bride', size: 'tall', alt: 'A bride in pink and red with gold jewellery and a veil', position: '50% 30%' },
  { image: 'philosophy-portrait', caption: 'The groom', size: 'tall', alt: 'A man in a dark tailored suit with a burgundy tie', position: '50% 30%' },
  { image: 'bridal-party', caption: 'The wedding party', size: 'square', alt: 'A bride with her bridesmaids holding bouquets in a garden', position: '50% 40%' },
]

/**
 * A video: either a file in public/videos (`src`) or a YouTube video (`youtube`, the id from the
 * link, e.g. "dQw4w9WgXcQ" from youtube.com/watch?v=dQw4w9WgXcQ or youtube.com/shorts/dQw4w9WgXcQ).
 * Leave both out to show a "coming soon" placeholder.
 */
export type Video = {
  title: string
  /** Still image shown before playing. YouTube videos fall back to their own thumbnail. */
  poster?: string
  src?: string
  youtube?: string
  /** Phone-shaped (9:16) video, e.g. a customer review or a YouTube Short */
  vertical?: boolean
}

/** Marketing films. The first one is shown large. */
export const films: Video[] = [
  { title: 'Brand film', poster: '/video/hero-poster.jpg', src: '/video/hero.mp4' },
  { title: 'Bridal film', poster: '/images/bridal-sheer-fabric-800.webp' },
  { title: 'In the atelier', poster: '/images/bridal-window-800.webp' },
]

/**
 * Customer reviews: video or text. The entries below are placeholders. Replace them with real
 * reviews (with the customer's permission); never publish invented ones.
 */
export type Review =
  | { kind: 'text'; quote: string; name: string; role: string }
  | { kind: 'video'; name: string; role: string; video: Video }

export const testimonials: Review[] = [
  { kind: 'video', name: 'Client name', role: 'Bride', video: { title: 'Customer review', vertical: true } },
  { kind: 'text', quote: 'Placeholder. Add a real client review here.', name: 'Client name', role: 'Bride' },
  { kind: 'video', name: 'Client name', role: 'Groom', video: { title: 'Customer review', vertical: true } },
  { kind: 'text', quote: 'Placeholder. Add a real client review here.', name: 'Client name', role: 'Groom' },
  { kind: 'text', quote: 'Placeholder. Add a real client review here.', name: 'Client names', role: 'Bride & groom' },
]

export const faqs = [
  {
    q: 'When should we book our first consultation?',
    a: 'As early as you can. Bespoke bridal and groom wear is made over several fittings, so we recommend getting in touch well ahead of your wedding date. We will confirm a timeline with you at your consultation.',
  },
  {
    q: 'What happens at the consultation?',
    a: 'We talk through your vision, the occasion and your personal style, look at silhouettes and fabrics together, and take your measurements.',
  },
  {
    q: 'Do you design for both the bride and the groom?',
    a: 'Yes. We design and tailor both bridal wear and groom wear, and can plan the two together so you look right side by side.',
  },
  {
    q: 'How many fittings will I need?',
    a: 'Most pieces need a few fittings as they take shape. Once your design is agreed, we will tell you how many to plan for.',
  },
  {
    q: 'Can I bring inspiration images?',
    a: 'Please do. Photos, sketches or anything that captures what you have in mind help us understand your vision from the start.',
  },
  {
    q: 'Where are you located?',
    a: 'We are based in Sri Lanka. When you book an appointment, we will share everything you need for your visit.',
  },
]
