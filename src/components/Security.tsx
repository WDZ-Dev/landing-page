import { FadeUp, RevealText, TiltCard } from './motion'

const PILLARS = [
  {
    iconPath:
      'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    title: 'Your data stays yours',
    body: 'We use your data only to run your agents, and never share it without your sign-off.',
  },
  {
    iconPath:
      'M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'No model training',
    body: 'Your data is never used to train AI models, ours or anyone else’s.',
  },
  {
    iconPath:
      'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
    title: 'Minimal retention',
    body: 'We keep only what your agents need, and delete it within 30 days after we stop working together.',
  },
  {
    iconPath:
      'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z',
    title: 'Clear written terms',
    body: 'Scope, confidentiality and ownership are agreed in writing before any data changes hands.',
  },
]

export default function Security() {
  return (
    <section className="security" id="security">
      <div className="wrap">
        <div className="section-head">
          <RevealText text="Built for businesses that take data seriously." />
          <FadeUp delay={0.1}>
            <p>You're trusting us with the data that runs your company. Here's how we treat it, and what you can hold us to.</p>
          </FadeUp>
        </div>
        <div className="security-grid">
          {PILLARS.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.08}>
              <TiltCard className="glass-card" max={5}>
                <span className="glass-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={p.iconPath} />
                  </svg>
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.2}>
          <p className="security-fineprint">
            Need our full data-handling summary or a signed NDA before we talk? Email{' '}
            <a href="mailto:contact@wdzsolutions.com">contact@wdzsolutions.com</a> and we'll send it over.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
