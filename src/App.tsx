import { useState } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { Cursor } from './components/Cursor'
import { Navigation } from './sections/Navigation'
import { Hero } from './sections/Hero'
import { Philosophy } from './sections/Philosophy'
import { Craft } from './sections/Craft'
import { Collections } from './sections/Collections'
import { WhyUs } from './sections/WhyUs'
import { Appointment } from './sections/Appointment'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

export default function App() {
  useSmoothScroll()
  // "Explore Collection" carries the chosen collection into the appointment form.
  const [suitType, setSuitType] = useState('')

  return (
    <>
      <a
        href="#main"
        className="eyebrow sr-only z-[80] bg-gold px-5 py-3 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Cursor />
      <Navigation />
      <main id="main">
        <Hero />
        <Philosophy />
        <Craft />
        <Collections onExplore={setSuitType} />
        <WhyUs />
        <Appointment preselectedType={suitType} />
        <Contact />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
