import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Process from '../components/Process'
import Stats from '../components/Stats'
import About from '../components/About'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import WaitlistModal from '../components/WaitlistModal'

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Navbar onOpenModal={() => setModalOpen(true)} />
      <Hero onOpenModal={() => setModalOpen(true)} />
      <Features />
      <Process />
      <Stats />
      <About />
      <CTA onOpenModal={() => setModalOpen(true)} />
      <Footer />
      <WaitlistModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
