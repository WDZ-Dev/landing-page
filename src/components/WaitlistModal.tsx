import { useEffect, useRef, useState, type ComponentProps } from 'react'

type FormSubmitEvent = Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0]
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL as string

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const firstNameRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const timer = setTimeout(() => firstNameRef.current?.focus(), 350)
      return () => clearTimeout(timer)
    } else {
      document.body.style.overflow = ''
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  async function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()

    const form = formRef.current
    if (!form) return

    setSubmitting(true)
    setError('')

    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value
    const lastName  = (form.elements.namedItem('lastName')  as HTMLInputElement).value
    const company   = (form.elements.namedItem('company')   as HTMLInputElement).value
    const email     = (form.elements.namedItem('email')     as HTMLInputElement).value
    const needs     = (form.elements.namedItem('needs')     as HTMLTextAreaElement).value

    try {
      // Store lead record — this must succeed for the form to complete
      await addDoc(collection(db, 'waitlist'), {
        firstName,
        lastName,
        company,
        email,
        needs,
        createdAt: serverTimestamp(),
      })

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        form.reset()
      }, 4000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }

    // Fire-and-forget email notification — never blocks the form
    // Requires the Firebase "Trigger Email from Firestore" extension installed
    // and VITE_CONTACT_EMAIL set in your .env file
    if (CONTACT_EMAIL) {
      addDoc(collection(db, 'mail'), {
        to: [CONTACT_EMAIL],
        message: {
          subject: `New consultation request — ${firstName} ${lastName} (${company})`,
          html: `
            <h2 style="font-family:sans-serif;margin-bottom:24px">New Consultation Request</h2>
            <table style="font-family:sans-serif;font-size:15px;line-height:1.6;border-collapse:collapse">
              <tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap">Name</td><td><strong>${firstName} ${lastName}</strong></td></tr>
              <tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap">Company</td><td>${company}</td></tr>
              <tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap;vertical-align:top">Looking for</td><td>${needs.replace(/\n/g, '<br>')}</td></tr>
            </table>
          `,
        },
      }).catch(() => {/* email extension not yet configured — silently ignore */})
    }
  }

  return (
    <div
      className={`modal-overlay${isOpen ? ' active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {!submitted ? (
          <div className="waitlist-form">
            <div className="modal-badge">Free Consultation</div>
            <h2>Book a Free 30-Min Call</h2>
            <p className="modal-subtitle">
              Tell us about your business and what you'd like to automate.
              We'll reach out to schedule your free consultation.
            </p>

            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Jane"
                    required
                    ref={firstNameRef}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Smith"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="Acme Inc."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Work email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="jane@acme.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="needs">What are you looking to automate?</label>
                <textarea
                  id="needs"
                  name="needs"
                  placeholder="e.g. We spend hours each week on invoice processing and customer follow-ups…"
                  rows={3}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary form-submit"
                disabled={submitting}
              >
                {submitting ? 'Sending…' : <>Book Free Consultation <span className="btn-arrow">&rarr;</span></>}
              </button>
            </form>

            {error && <p className="form-note" style={{ color: '#c44' }}>{error}</p>}
            <p className="form-note">No spam, ever. We'll only reach out to schedule your call.</p>
          </div>
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
            <h3>We'll be in touch!</h3>
            <p>Thanks for reaching out. Expect a reply within one business day to schedule your free call.</p>
          </div>
        )}
      </div>
    </div>
  )
}
