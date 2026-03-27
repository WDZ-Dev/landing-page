import { useScrollReveal } from '../../hooks/useScrollReveal'

const steps = [
  {
    num: 1,
    title: 'We set up a device in your office',
    description:
      'A small, quiet computer that plugs into your network. No server room needed.',
    delay: '',
  },
  {
    num: 2,
    title: 'We connect your tools',
    description:
      'Email, WhatsApp, Slack, calendar, file storage — whatever your business runs on.',
    delay: 'reveal-delay-1',
  },
  {
    num: 3,
    title: 'We build your custom assistants',
    description:
      'Not chatbots. Custom AI workers designed around your specific processes.',
    delay: 'reveal-delay-2',
  },
]

export default function OpenClawProcess() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="process" ref={ref}>
      <div className="process-inner">
        <div className="section-label reveal">How it works</div>
        <h2 className="section-heading reveal reveal-delay-1">
          A digital team that never sleeps
        </h2>

        <div className="process-grid oc-process-grid">
          {steps.map((s) => (
            <div key={s.num} className={`process-step reveal ${s.delay}`}>
              <div className="process-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
