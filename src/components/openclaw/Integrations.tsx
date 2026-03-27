import { useScrollReveal } from '../../hooks/useScrollReveal'

const tools = [
  'WhatsApp', 'Slack', 'Gmail', 'Outlook', 'Telegram', 'Discord',
  'Microsoft Teams', 'Google Calendar', 'Google Drive', 'Notion',
  'Trello', 'Shopify', 'Stripe', 'QuickBooks', 'Salesforce',
]

export default function Integrations() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="integrations-section" ref={ref}>
      <div className="integrations-inner">
        <div className="section-label reveal" style={{ textAlign: 'center' }}>Integrations</div>
        <h2
          className="section-heading reveal reveal-delay-1"
          style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}
        >
          Works with your existing tools
        </h2>

        <div className="integrations-pills-flat reveal reveal-delay-2">
          {tools.map((t) => (
            <span key={t} className="integration-pill">{t}</span>
          ))}
        </div>

        <p className="integrations-note reveal reveal-delay-3">
          Don't see yours? We can likely connect it. <a href="#quote">Ask us</a>.
        </p>
      </div>
    </section>
  )
}
