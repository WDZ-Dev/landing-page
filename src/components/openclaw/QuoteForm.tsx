import { useRef, useState, type FormEvent } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const sectionRef = useScrollReveal<HTMLElement>()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const form = formRef.current
    if (!form) return

    setSubmitting(true)
    setError('')

    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement).value

    const data = {
      firstName: getValue('firstName'),
      lastName: getValue('lastName'),
      business: getValue('business'),
      email: getValue('email'),
      phone: getValue('phone'),
      businessDescription: getValue('businessDescription'),
      automationNeeds: getValue('automationNeeds'),
      createdAt: serverTimestamp(),
    }

    try {
      await addDoc(collection(db, 'openclaw-quotes'), data)
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="quote-section" id="quote" ref={sectionRef}>
      <div className="quote-inner">
        {!submitted ? (
          <>
            <div className="section-label reveal" style={{ textAlign: 'center' }}>Get started</div>
            <h2
              className="section-heading reveal reveal-delay-1"
              style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}
            >
              Get a free quote
            </h2>
            <p className="section-subtext reveal reveal-delay-2" style={{ margin: '0 auto 3rem', textAlign: 'center' }}>
              Tell us about your business. We'll respond within one business day
              with a no-obligation proposal.
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="quote-form reveal reveal-delay-3">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="q-firstName">First name</label>
                  <input type="text" id="q-firstName" name="firstName" placeholder="Jane" required />
                </div>
                <div className="form-group">
                  <label htmlFor="q-lastName">Last name</label>
                  <input type="text" id="q-lastName" name="lastName" placeholder="Smith" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="q-business">Business name</label>
                  <input type="text" id="q-business" name="business" placeholder="Acme Inc." required />
                </div>
                <div className="form-group">
                  <label htmlFor="q-email">Email</label>
                  <input type="email" id="q-email" name="email" placeholder="jane@acme.com" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="q-phone">Phone <span style={{ fontWeight: 300, color: 'var(--text-secondary)' }}>(optional)</span></label>
                <input type="tel" id="q-phone" name="phone" placeholder="(555) 123-4567" />
              </div>

              <div className="form-group">
                <label htmlFor="q-businessDesc">What does your business do?</label>
                <textarea
                  id="q-businessDesc"
                  name="businessDescription"
                  rows={3}
                  placeholder="We run a property management company with 200 units..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="q-automation">
                  What tasks would you like to automate?{' '}
                  <span style={{ fontWeight: 300, color: 'var(--text-secondary)' }}>(optional)</span>
                </label>
                <textarea
                  id="q-automation"
                  name="automationNeeds"
                  rows={3}
                  placeholder="Email sorting, tenant communication, lease document processing..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-large quote-submit" disabled={submitting}>
                {submitting ? 'Submitting...' : <>Request a Free Quote <span className="btn-arrow">&rarr;</span></>}
              </button>

              {error && <p className="form-note" style={{ color: '#c44' }}>{error}</p>}
              <p className="form-note">
                No commitment. No spam. We'll respond within one business day.
              </p>
            </form>
          </>
        ) : (
          <div className="form-success show">
            <div className="form-success-icon">
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l6 6L23 7" />
              </svg>
            </div>
            <h3>We've received your request</h3>
            <p>One of our team will be in touch within one business day to discuss your needs.</p>
          </div>
        )}
      </div>
    </section>
  )
}
