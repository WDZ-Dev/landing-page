import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Showcase from '../components/Showcase'
import Features from '../components/Features'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import WaitlistModal from '../components/WaitlistModal'
import { scrollToY } from '../smooth'

export default function DemosPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const open = () => setModalOpen(true)

  useEffect(() => {
    scrollToY(0, true)
  }, [])

  return (
    <>
      <Navbar onOpenModal={open} />
      <main className="demos">
        <Showcase />
        <Features />
        <section className="demos-more">
          <div className="wrap">
            <p>Want your AI team running on hardware in your own office? <Link to="/openclaw">See OpenClaw</Link>.</p>
          </div>
        </section>
        <CTA onOpenModal={open} />
      </main>
      <Footer />
      <WaitlistModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
