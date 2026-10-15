import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import OrbitStory from '../components/OrbitStory'
import Process from '../components/Process'
import About from '../components/About'
import Security from '../components/Security'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import WaitlistModal from '../components/WaitlistModal'
import { scrollToY } from '../smooth'

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const open = () => setModalOpen(true)

  useEffect(() => {
    scrollToY(0, true)
  }, [])

  return (
    <>
      <Navbar onOpenModal={open} />
      <main>
        <OrbitStory onOpenModal={open} />
        <Process />
        <About />
        <Security />
        <CTA onOpenModal={open} />
      </main>
      <Footer />
      <WaitlistModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
