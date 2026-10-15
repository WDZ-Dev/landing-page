import { useScrollReveal } from '../../hooks/useScrollReveal'

const reasons = [
  {
    icon: 'teal',
    title: 'Your data stays yours',
    description:
      'Everything runs on hardware in your office. No cloud. No third parties. No data leaving your building.',
    svgPath: (
      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    ),
    delay: '',
  },
  {
    icon: 'gold',
    title: 'No vendor lock-in',
    description:
      'Built on open-source software, so you keep everything, always.',
    svgPath: (
      <path d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    ),
    delay: 'reveal-delay-1',
  },
  {
    icon: 'warm',
    title: 'Up and running in weeks',
    description:
      'From first conversation to AI assistants handling real work — typically 2 to 4 weeks.',
    svgPath: (
      <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    ),
    delay: 'reveal-delay-2',
  },
  {
    icon: 'teal',
    title: 'Ongoing support after go-live',
    description:
      'We stay involved — monitoring, model updates, and a direct line to our engineering team.',
    svgPath: (
      <path d="M11.42 15.17l-5.384 3.065A1.5 1.5 0 014.5 16.93V7.07a1.5 1.5 0 011.536-1.305l5.384 3.065a1.5 1.5 0 010 2.61zM13.5 4.06l5.384 3.065A1.5 1.5 0 0120.42 8.43v8.14a1.5 1.5 0 01-1.536 1.305L13.5 14.81a1.5 1.5 0 010-2.61z" />
    ),
    delay: 'reveal-delay-3',
  },
]

export default function WhyWDZ() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="features" ref={ref}>
      <h2 className="section-heading reveal reveal-delay-1">
        Built by AI engineers. Backed by real expertise.
      </h2>

      <div className="features-grid why-wdz-grid">
        {reasons.map((r) => (
          <div key={r.title} className={`feature-card reveal ${r.delay}`}>
            <div className={`feature-icon icon-${r.icon}`}>
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {r.svgPath}
              </svg>
            </div>
            <h3>{r.title}</h3>
            <p>{r.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
