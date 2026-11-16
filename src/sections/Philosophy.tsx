import { ParallaxImage } from '../components/ui/ParallaxImage'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'

export function Philosophy() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-ink py-28 md:py-44">
      <div className="mx-auto grid max-w-[1680px] gap-y-20 px-6 md:px-12 lg:grid-cols-12 lg:gap-x-10">
        {/* Photography: one tall portrait with a smaller detail overlapping it */}
        <div className="relative lg:col-span-6 xl:col-span-5">
          <ParallaxImage
            name="philosophy-portrait"
            alt="A man in a dark tailored suit with a burgundy tie, standing with arms crossed in low light"
            sizes="(min-width: 1024px) 42vw, 85vw"
            position="50% 30%"
            className="aspect-[4/5] w-[85%] lg:w-full"
          />
          <div className="absolute -bottom-12 right-0 w-[42%] border-[10px] border-ink lg:-right-[22%] lg:-bottom-20 lg:w-[46%]">
            <ParallaxImage
              name="philosophy-detail"
              alt="Detail of a shirt cuff and wristwatch beneath a navy suit sleeve"
              sizes="(min-width: 1024px) 20vw, 36vw"
              position="50% 35%"
              className="aspect-[3/4]"
            />
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-24">
          <SectionHeading index="01" label="Our Philosophy" id="about-title" lines={['Beyond the', 'Ordinary.']} />

          <div className="mt-12 max-w-xl space-y-7">
            <Reveal as="p" className="font-serif text-2xl leading-snug text-ivory/90 italic md:text-[1.75rem]">
              True elegance is never accidental. It is crafted through precision, attention to detail and an
              understanding of individuality.
            </Reveal>
            <Reveal as="p" className="text-base leading-loose text-ivory/65 md:text-lg">
              At AZMEEDIA&rsquo;S, we believe a suit should be more than something you wear. It should be an
              expression of who you are.
            </Reveal>
            <Reveal as="p" className="text-base leading-loose text-ivory/65 md:text-lg">
              Every detail matters. Every measurement has a purpose. Every creation is tailored to you.
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
