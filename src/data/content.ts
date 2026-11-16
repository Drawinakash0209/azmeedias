export const craftStages = [
  {
    number: '01',
    title: 'Consultation',
    text: 'Understanding your style, preferences and vision.',
    image: 'craft-consultation',
    alt: 'Tailored jackets displayed on mannequins in an atelier',
    position: '50% 40%',
  },
  {
    number: '02',
    title: 'Measurements',
    text: 'Precise measurements to achieve your perfect fit.',
    image: 'craft-measurements',
    alt: 'Close view of a fitted checked jacket across the shoulders and chest',
    position: '50% 30%',
  },
  {
    number: '03',
    title: 'Craftsmanship',
    text: 'Careful selection of fabrics, construction and finishing.',
    image: 'craft-craftsmanship',
    alt: 'A tailor cutting suiting cloth by hand at a wooden workbench',
    position: '50% 50%',
  },
  {
    number: '04',
    title: 'The Final Fit',
    text: 'A personalised suit designed around you.',
    image: 'craft-final-fit',
    alt: 'A man fastening the jacket of a dark tailored suit',
    position: '50% 25%',
  },
] as const

export const collections = [
  {
    number: '01',
    name: 'The Classic Collection',
    text: 'Timeless tailoring in enduring cuts and cloths, made to be worn for years.',
    image: 'collection-classic',
    alt: 'A man in a blue checked three-piece suit with a white pocket square',
    position: '50% 20%',
  },
  {
    number: '02',
    name: 'The Wedding Collection',
    text: 'Tailoring for the day that matters most, made around you.',
    image: 'collection-wedding',
    alt: 'A checked dinner jacket worn with a white dress shirt and black bow tie',
    position: '50% 30%',
  },
  {
    number: '03',
    name: 'The Executive Collection',
    text: 'Refined, composed suits for the boardroom and beyond.',
    image: 'collection-executive',
    alt: 'A man in a navy suit and open white shirt walking past a glass building',
    position: '50% 20%',
  },
  {
    number: '04',
    name: 'The Signature Collection',
    text: 'Distinctive pieces shaped entirely by your individual style.',
    image: 'collection-signature',
    alt: 'A man in a black suit and black shirt adjusting his jacket',
    position: '50% 15%',
  },
] as const

export const suitTypes = [...collections.map((c) => c.name), 'Not sure yet — please advise'] as const

export const reasons = [
  {
    title: 'Personalised Bespoke Tailoring',
    text: 'Each suit begins with you, and is made for no one else.',
  },
  {
    title: 'Precision Measurements',
    text: 'Every measurement is taken with purpose, for a fit that is yours alone.',
  },
  {
    title: 'Premium Fabric Selection',
    text: 'Cloth chosen with care for its character, drape and feel.',
  },
  {
    title: 'Exceptional Attention to Detail',
    text: 'From the first stitch to the final press, nothing is overlooked.',
  },
  {
    title: 'Individual Styling',
    text: 'Guidance on cut, colour and finish, to reflect who you are.',
  },
] as const
