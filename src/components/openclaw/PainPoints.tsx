import { useScrollReveal } from '../../hooks/useScrollReveal'

const painPoints = [
  {
    title: 'Drowning in emails and messages',
    description:
      'Your team spends hours every day sorting, reading, and responding to messages across email, WhatsApp, Slack, and more.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    delay: '',
  },
  {
    title: 'Documents pile up, decisions slow down',
    description:
      'Invoices, contracts, and reports sit in inboxes waiting for someone to read them. Information gets lost. Follow-ups get missed.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    delay: 'reveal-delay-1',
  },
  {
    title: 'Repetitive tasks eat your day',
    description:
      'Scheduling, data entry, report generation, follow-ups — the same tasks, over and over, taking time away from work that actually grows revenue.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    delay: 'reveal-delay-2',
  },
]

export default function PainPoints() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="features" ref={ref}>
      <div className="section-label reveal">The problem</div>
      <h2 className="section-heading reveal reveal-delay-1">
        Your team is buried in busywork
      </h2>
      <p className="section-subtext reveal reveal-delay-2">
        Every hour spent on repetitive tasks is an hour not spent growing your business.
      </p>

      <div className="features-grid pain-points-grid">
        {painPoints.map((p) => (
          <div key={p.title} className={`feature-card reveal ${p.delay}`}>
            <div className="feature-icon icon-warm">
              {p.icon}
            </div>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
