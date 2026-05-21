import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const noop = () => {}

  return (
    <>
      <Navbar onOpenModal={noop} />
      <main className="legal-page">
        <div className="legal-inner">
          <div className="section-label">Privacy</div>
          <h1 className="legal-heading">Privacy Policy</h1>
          <p className="legal-meta">Last updated: forthcoming</p>

          <p>
            We're a small team and our formal privacy policy is still being
            drafted. In short: we process the data you share with us only to
            deliver the automations you've asked for, we don't retain it
            longer than needed, and we don't use it to train AI models.
            We're based in the United States; your data is processed there.
          </p>

          <p>
            This site uses PostHog for product analytics so we can see which
            pages get traffic and where visitors drop off. It sets a cookie
            and records clicks, pageviews, and form submissions. We don't
            sell or share that data; it lives in PostHog and isn't joined
            to data from your engagements with us.
          </p>

          <p>
            If you'd like a full breakdown before we publish it — what we
            collect, how long we keep it, and how to ask us to delete it —
            email us at{' '}
            <a href="mailto:contact@wdzsolutions.com">contact@wdzsolutions.com</a>
            {' '}and we'll send our current data-handling summary.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
