import { useScrollReveal } from '../../hooks/useScrollReveal'

const capabilities = [
  {
    icon: 'teal',
    title: 'Manage your inbox',
    description: 'Sorts, prioritizes, and drafts replies. You just review and send.',
    svgPath: (
      <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    ),
    delay: '',
  },
  {
    icon: 'gold',
    title: 'Answer customer messages',
    description: 'Responds on WhatsApp, Slack, or email using your business info — not generic templates.',
    svgPath: (
      <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    ),
    delay: 'reveal-delay-1',
  },
  {
    icon: 'warm',
    title: 'Process documents',
    description: 'Reads invoices, contracts, and reports. Extracts key details and files them.',
    svgPath: (
      <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    ),
    delay: 'reveal-delay-2',
  },
  {
    icon: 'teal',
    title: 'Automate your calendar',
    description: 'Schedules meetings, sends reminders, handles rescheduling across your team.',
    svgPath: (
      <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    ),
    delay: '',
  },
  {
    icon: 'gold',
    title: 'Generate reports',
    description: 'Pulls data from your systems and creates summaries on the schedule you set.',
    svgPath: (
      <path d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    ),
    delay: 'reveal-delay-1',
  },
  {
    icon: 'warm',
    title: 'Run your workflows',
    description: 'Client onboarding, order processing, support routing — handled end to end.',
    svgPath: (
      <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    ),
    delay: 'reveal-delay-2',
  },
]

export default function Capabilities() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="features" id="capabilities" ref={ref}>
      <div className="section-label reveal">Capabilities</div>
      <h2 className="section-heading reveal reveal-delay-1">
        What your AI assistants can do
      </h2>

      <div className="features-grid">
        {capabilities.map((c) => (
          <div key={c.title} className={`feature-card reveal ${c.delay}`}>
            <div className={`feature-icon icon-${c.icon}`}>
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {c.svgPath}
              </svg>
            </div>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
