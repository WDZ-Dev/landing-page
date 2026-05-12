import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const ICONS: Record<string, string> = {
  mail: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  chat: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
  document: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5',
  receipt: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z',
  chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  share: 'M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z',
  dollar: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 3.07-.879 4.242 0l.879.659M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  check: 'M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  shield: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  search: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
  pencil: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
  clipboard: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z',
  truck: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
  wrench: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m5.108-.233l3.276-3.276',
  box: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m16.5 0h.375c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125H3.75m16.5 0H3.75m6 0v9.75',
  tag: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z',
  home: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  star: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
}

const industries = [
  {
    title: 'Your Company',
    cards: [
      { icon: 'teal', iconKey: 'mail', title: 'Email automation', description: 'Send follow-ups, confirmations, and newsletters without lifting a finger.', delay: '' },
      { icon: 'gold', iconKey: 'chat', title: 'Customer support', description: 'Handle common questions and route complex issues to the right team instantly.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'document', title: 'Data entry & processing', description: 'Extract and organize information from documents and emails automatically.', delay: 'reveal-delay-2' },
      { icon: 'teal', iconKey: 'calendar', title: 'Appointment scheduling', description: 'Let customers book meetings without back-and-forth emails.', delay: '' },
      { icon: 'gold', iconKey: 'receipt', title: 'Invoice & payment reminders', description: 'Send payment reminders and track overdue invoices automatically.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'chart', title: 'Report generation', description: 'Turn raw data into polished reports and dashboards.', delay: 'reveal-delay-2' },
    ],
  },
  {
    title: 'Small Businesses',
    cards: [
      { icon: 'teal', iconKey: 'receipt', title: 'Invoice tracking', description: 'Monitor sent invoices and remind customers about overdue payments automatically.', delay: '' },
      { icon: 'gold', iconKey: 'mail', title: 'Customer follow-up', description: 'Stay in touch with customers and leads without manual email chains.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'share', title: 'Social media posting', description: 'Schedule and publish social media content automatically across platforms.', delay: 'reveal-delay-2' },
      { icon: 'teal', iconKey: 'dollar', title: 'Expense categorization', description: 'Automatically organize receipts and expenses for cleaner bookkeeping.', delay: '' },
      { icon: 'gold', iconKey: 'check', title: 'Lead qualification', description: 'Filter and prioritize new leads so you focus on the best prospects.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'chart', title: 'Basic analytics & insights', description: 'Get weekly summaries of key metrics without spending hours on analysis.', delay: 'reveal-delay-2' },
    ],
  },
  {
    title: 'Law Firms',
    cards: [
      { icon: 'teal', iconKey: 'document', title: 'Contract review', description: 'Review contracts quickly, flag risks, and surface critical clauses without manual reading.', delay: '' },
      { icon: 'gold', iconKey: 'search', title: 'Discovery document analysis', description: 'Sort and summarize discovery documents so attorneys spend time on strategy, not paperwork.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'pencil', title: 'Drafting standard agreements', description: 'Generate first drafts of standard agreements and speed up review cycles.', delay: 'reveal-delay-2' },
      { icon: 'teal', iconKey: 'clipboard', title: 'Intake automation', description: 'Capture new client details, route cases, and populate matter records automatically.', delay: '' },
    ],
  },
  {
    title: 'Healthcare',
    cards: [
      { icon: 'teal', iconKey: 'calendar', title: 'Appointment scheduling', description: 'Automate scheduling, reminders, and cancellations to reduce no-shows.', delay: '' },
      { icon: 'gold', iconKey: 'shield', title: 'Insurance verification', description: 'Check patient coverage automatically before appointments.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'document', title: 'Clinical note summarization', description: 'Turn visit notes into structured summaries for faster record keeping.', delay: 'reveal-delay-2' },
      { icon: 'teal', iconKey: 'chat', title: 'Patient follow-ups', description: 'Send follow-up messages, reminders, and care instructions without manual effort.', delay: '' },
    ],
  },
  {
    title: 'Real Estate',
    cards: [
      { icon: 'teal', iconKey: 'home', title: 'Listing generation', description: 'Create attractive property listings automatically from your data.', delay: '' },
      { icon: 'gold', iconKey: 'check', title: 'Lead qualification', description: 'Score and route leads so agents spend time only on qualified prospects.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'document', title: 'Document processing', description: 'Process contracts, disclosures, and closing paperwork faster.', delay: 'reveal-delay-2' },
      { icon: 'teal', iconKey: 'chart', title: 'Comp analysis', description: 'Generate comparable market reports automatically from property data.', delay: '' },
    ],
  },
  {
    title: 'E-Commerce',
    cards: [
      { icon: 'teal', iconKey: 'tag', title: 'Product description generation', description: 'Create SEO-ready product copy automatically from product specs.', delay: '' },
      { icon: 'gold', iconKey: 'chat', title: 'Customer service', description: 'Handle common customer questions and returns with AI-powered automation.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'box', title: 'Inventory forecasting', description: 'Predict stock needs to avoid overstock and out-of-stock situations.', delay: 'reveal-delay-2' },
      { icon: 'teal', iconKey: 'star', title: 'Review summarization', description: 'Summarize customer feedback and highlight trends automatically.', delay: '' },
    ],
  },
  {
    title: 'Agencies',
    cards: [
      { icon: 'teal', iconKey: 'chart', title: 'Client reporting', description: 'Auto-generate campaign reports and analytics summaries for clients.', delay: '' },
      { icon: 'gold', iconKey: 'pencil', title: 'Content production', description: 'Help create copy, briefs, and content drafts quickly.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'clipboard', title: 'Project status updates', description: 'Generate progress updates automatically so teams stay aligned.', delay: 'reveal-delay-2' },
      { icon: 'teal', iconKey: 'document', title: 'Meeting summaries', description: 'Turn meetings into concise notes with action items.', delay: '' },
    ],
  },
  {
    title: 'Manufacturing and Logistics',
    cards: [
      { icon: 'teal', iconKey: 'chart', title: 'Demand forecasting', description: 'Predict demand trends so you can plan production and inventory.', delay: '' },
      { icon: 'gold', iconKey: 'search', title: 'Quality inspection', description: 'Detect defects and quality issues automatically with AI.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'wrench', title: 'Predictive maintenance', description: 'Identify equipment issues before they cause downtime.', delay: 'reveal-delay-2' },
      { icon: 'teal', iconKey: 'truck', title: 'Supply chain monitoring', description: 'Track shipments and flag delays so operations stay on schedule.', delay: '' },
    ],
  },
  {
    title: 'Accounting Firms',
    cards: [
      { icon: 'teal', iconKey: 'receipt', title: 'Receipt / invoice processing', description: 'Capture receipts and invoices automatically into your accounting workflow.', delay: '' },
      { icon: 'gold', iconKey: 'mail', title: 'Client communication', description: 'Automate client updates and document requests without manual outreach.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'document', title: 'Tax prep automation', description: 'Speed up tax prep with automated categorization and document assembly.', delay: 'reveal-delay-2' },
      { icon: 'teal', iconKey: 'dollar', title: 'Bookkeeping', description: 'Reconcile accounts and categorize transactions automatically.', delay: '' },
    ],
  },
  {
    title: 'Insurance',
    cards: [
      { icon: 'teal', iconKey: 'document', title: 'Claims processing', description: 'Automate intake, routing, and initial assessment of claims.', delay: '' },
      { icon: 'gold', iconKey: 'shield', title: 'Underwriting support', description: 'Provide underwriters with fast risk insights and recommendations.', delay: 'reveal-delay-1' },
      { icon: 'warm', iconKey: 'clipboard', title: 'Policy summarization', description: 'Summarize policies for agents and customers in plain language.', delay: 'reveal-delay-2' },
      { icon: 'teal', iconKey: 'share', title: 'Customer triage', description: 'Route inquiries to the right team or response path instantly.', delay: '' },
    ],
  },
]

export default function Features() {
  const ref = useScrollReveal<HTMLElement>()
  const [selectedIndustry, setSelectedIndustry] = useState(0)
  const currentIndustry = industries[selectedIndustry]

  useEffect(() => {
    if (ref.current) {
      const cards = ref.current.querySelectorAll('.feature-card')
      cards.forEach(card => {
        card.classList.remove('visible')
        setTimeout(() => {
          card.classList.add('visible')
        }, 0)
      })
    }
  }, [selectedIndustry])

  return (
    <section className="features" id="features" ref={ref}>
      <div className="section-label reveal">Your Custom AI Employees</div>
      <h2 className="section-heading reveal reveal-delay-1">
        What we can do for <em>{selectedIndustry === 0 ? 'your company' : currentIndustry.title}</em>
      </h2>

      <div className="industry-tabs reveal reveal-delay-2">
        {industries.slice(1).map((industry, index) => (
          <button
            key={industry.title}
            className={`industry-tab ${selectedIndustry === index + 1 ? 'active' : ''}`}
            onClick={() => setSelectedIndustry(index + 1)}
          >
            {industry.title}
          </button>
        ))}
      </div>

      <div className="industry-display reveal reveal-delay-2">
        {currentIndustry.cards.map((card) => (
          <div key={card.title} className={`feature-card reveal ${card.delay}`}>
            <div className={`feature-icon icon-${card.icon}`}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={ICONS[card.iconKey] || ICONS.check} />
              </svg>
            </div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
