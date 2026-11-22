import { useState } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { Cursor } from './components/Cursor'
import { QuickContact } from './components/QuickContact'
import { Navigation } from './sections/Navigation'
import { Hero } from './sections/Hero'
import { Intro } from './sections/Intro'
import { Collections } from './sections/Collections'
import { Process } from './sections/Process'
import { Lookbook } from './sections/Lookbook'
import { Films } from './sections/Films'
import { Testimonials } from './sections/Testimonials'
import { Faq } from './sections/Faq'
import { Appointment } from './sections/Appointment'
import { CtaBand } from './sections/CtaBand'
import { Footer } from './sections/Footer'

export default function App() {
  useSmoothScroll()
  // A collection card carries its enquiry type into the appointment form.
  const [enquiry, setEnquiry] = useState('')

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[80] rounded-full bg-ink px-5 py-3 text-sm text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Cursor />
      <Navigation />
      <main id="main">
        <Hero />
        <Intro />
        <Collections onExplore={setEnquiry} />
        <Process />
        <Lookbook />
        <Films />
        <Testimonials />
        <Faq />
        <Appointment preselectedType={enquiry} />
        <CtaBand />
      </main>
      <Footer />
      <QuickContact />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
