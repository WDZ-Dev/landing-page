import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import OpenClawHero from '../components/openclaw/OpenClawHero'
import OpenClawProcess from '../components/openclaw/OpenClawProcess'
import Capabilities from '../components/openclaw/Capabilities'
import Integrations from '../components/openclaw/Integrations'
import WhyWDZ from '../components/openclaw/WhyWDZ'
import FAQ from '../components/openclaw/FAQ'
import QuoteForm from '../components/openclaw/QuoteForm'
import Footer from '../components/Footer'

export default function OpenClawPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const noop = () => {}

  return (
    <>
      <Navbar onOpenModal={noop} variant="openclaw" />
      <OpenClawHero />
      <OpenClawProcess />
      <Capabilities />
      <Integrations />
      <WhyWDZ />
      <FAQ />
      <QuoteForm />
      <Footer />
    </>
  )
}
