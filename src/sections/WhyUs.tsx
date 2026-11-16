import { reasons } from '../data/content'
import { site } from '../config/site'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'

const numerals = ['I', 'II', 'III', 'IV', 'V']

export function WhyUs() {
  return (
    <section id="why" aria-labelledby="why-title" className="bg-coal py-28 md:py-44">
      <div className="mx-auto grid max-w-[1680px] gap-y-16 px-6 md:px-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <SectionHeading index="04" label="The Difference" id="why-title" lines={['Why', site.name]} />
          </div>
        </div>

        <ol className="border-b border-ivory/10 lg:col-span-7 lg:col-start-6">
          {reasons.map((r, i) => (
            <Reveal
              as="li"
              key={r.title}
              className="group relative grid gap-x-8 gap-y-3 border-t border-ivory/10 py-9 md:grid-cols-[3.5rem_1fr_15rem] md:items-baseline md:py-11"
            >
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-gold/70 transition-transform duration-1000 ease-lux group-hover:scale-x-100"
              />
              <span aria-hidden="true" className="font-serif text-lg text-gold italic">
                {numerals[i]}
              </span>
              <h3 className="font-serif text-3xl leading-tight font-light transition-transform duration-700 ease-lux md:text-4xl md:group-hover:translate-x-3">
                {r.title}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-ivory/55">{r.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
