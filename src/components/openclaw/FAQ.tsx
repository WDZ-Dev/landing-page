import { useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const faqs = [
  {
    question: 'Do I need any technical knowledge?',
    answer:
      'Not at all. We handle the setup and configuration. You interact with your AI assistants through tools you already use — email, WhatsApp, Slack. If you can send a text, you can use this.',
  },
  {
    question: 'What hardware do I need?',
    answer:
      'A small mini-computer about the size of a paperback book. We help you get one. It sits quietly in your office — no server room or IT department required.',
  },
  {
    question: 'How is this different from ChatGPT?',
    answer:
      'ChatGPT runs in the cloud and gives generic answers. What we build runs in your office, is customized to your business, and can take real actions — not just answer questions.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Every business is different, so we provide custom quotes. Reach out below and we\'ll put together a no-obligation proposal.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq-item${open ? ' faq-open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <span className="faq-toggle">{open ? '−' : '+'}</span>
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="faq-section" ref={ref}>
      <div className="faq-inner">
        <div className="section-label reveal" style={{ textAlign: 'center' }}>FAQ</div>
        <h2 className="section-heading reveal reveal-delay-1" style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
          Common questions
        </h2>

        <div className="faq-list reveal reveal-delay-2">
          {faqs.map((f) => (
            <FAQItem key={f.question} {...f} />
          ))}
        </div>
      </div>
    </section>
  )
}
