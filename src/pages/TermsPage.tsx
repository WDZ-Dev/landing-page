import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { scrollToY } from '../smooth'

export default function TermsPage() {
  useEffect(() => {
    scrollToY(0, true)
  }, [])

  const noop = () => {}

  return (
    <>
      <Navbar onOpenModal={noop} />
      <main className="legal-page">
        <div className="legal-inner">
          <div className="section-label">Terms</div>
          <h1 className="legal-heading">Terms of Service</h1>
          <p className="legal-meta">Last updated: forthcoming</p>

          <p>
            Our formal terms of service are still being drafted. Until
            they're published, every engagement we take on is governed by a
            written agreement we'll send before any work begins — covering
            scope, fees, IP, confidentiality, and termination.
          </p>

          <p>
            Want to see our standard engagement terms before booking a call?
            Email{' '}
            <a href="mailto:contact@wdzsolutions.com">contact@wdzsolutions.com</a>
            {' '}and we'll send the current draft.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
