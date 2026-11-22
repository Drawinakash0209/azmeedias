import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { AnchorLink } from '../components/ui/AnchorLink'
import { circle } from '../components/ui/Button'
import { ParallaxImage } from '../components/ui/ParallaxImage'
import { Reveal } from '../components/ui/Reveal'
import { SectionBar, SectionHeading } from '../components/ui/SectionHeading'

const statement =
  "AZMEEDIA'S designs and tailors wedding clothes for brides and grooms in Sri Lanka. Every piece is made to order and fitted to you over several appointments."

/** Words darken one by one as the statement scrolls through the viewport. */
function Statement() {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: 0.6 },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <p ref={ref} className="display max-w-6xl text-[clamp(1.8rem,3.9vw,3.6rem)] leading-[1.08]">
      {statement.split(' ').map((word, i) => (
        <span key={i} data-word className="inline-block whitespace-pre">
          {word}{' '}
        </span>
      ))}
    </p>
  )
}

function TextLink({ to, children }: { to: string; children: string }) {
  return (
    <AnchorLink to={to} className="group inline-flex items-center gap-1.5 text-[0.875rem]">
      <span className="link-line">{children}</span>
      <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </AnchorLink>
  )
}

export function Intro() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-paper">
      <SectionBar index="01" label="About" />
      <div className="mx-auto max-w-[1600px] px-5 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32">
        <Statement />

        {/* Ruled three-column grid, after the reference layout */}
        <div className="mt-20 grid border-y border-ink/15 md:mt-28 md:grid-cols-12">
          <div className="flex flex-col justify-between gap-12 py-10 md:col-span-6 md:pr-10">
            <SectionHeading id="about-title" size="md" lines={[['Bridal', 'and groom'], 'wear made to measure']} />
            <Reveal>
              <AnchorLink to="process" className={circle()}>
                How it
                <br />
                works
              </AnchorLink>
            </Reveal>
          </div>
          <Reveal className="flex flex-col justify-between gap-8 border-t border-ink/15 py-10 md:col-span-3 md:border-t-0 md:border-l md:px-8">
            <p className="text-[0.95rem] leading-[1.6] text-stone">
              Gowns, traditional bridal wear and wedding suits, designed with you and made to order.
            </p>
            <TextLink to="collections">See the collections</TextLink>
          </Reveal>
          <Reveal className="flex flex-col justify-between gap-8 border-t border-ink/15 py-10 md:col-span-3 md:border-t-0 md:border-l md:pl-8">
            <p className="text-[0.95rem] leading-[1.6] text-stone">
              Getting married together? We can plan the bride&rsquo;s and groom&rsquo;s outfits at the same time so
              they work side by side.
            </p>
            <TextLink to="appointment">Book a consultation</TextLink>
          </Reveal>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:mt-8 md:grid-cols-12 md:gap-6">
          <ParallaxImage
            name="bridal-veil"
            alt="A bride lifting a sheer veil"
            sizes="(min-width: 768px) 40vw, 46vw"
            position="50% 40%"
            className="aspect-[3/4] md:col-span-5 md:aspect-[4/5]"
          />
          <ParallaxImage
            name="philosophy-portrait"
            alt="A man in a dark tailored suit with a burgundy tie, arms crossed"
            sizes="(min-width: 768px) 55vw, 46vw"
            position="50% 30%"
            className="aspect-[3/4] md:col-span-7 md:aspect-auto md:h-full"
          />
        </div>
      </div>
    </section>
  )
}
