import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FadeUp, RevealText, TiltCard, spring } from './motion'
import AgentRun from './AgentRun'
import type { AgentTask } from './agentTasks'

type Card = { title: string; iconKey: string; task: AgentTask }

const t = (app: string, steps: string[], result: string): AgentTask => ({ app, steps, result })

// Every run is illustrative sample data
const industries: { title: string; cards: Card[] }[] = [
  {
    title: 'Small businesses',
    cards: [
      { title: 'Invoice tracking', iconKey: 'receipt', task: t('Invoices', ['Checked 23 open invoices', 'Found 4 past due', 'Sent polite reminders'], '$6,120 back in motion') },
      { title: 'Customer follow-up', iconKey: 'mail', task: t('Inbox', ['Found quotes with no reply', 'Wrote personal follow-ups', 'Sent and logged them in your CRM'], '5 follow-ups sent') },
      { title: 'Lead qualification', iconKey: 'check', task: t('Leads', ['9 new leads from your site', 'Scored each on budget and fit', 'Booked calls with the top 2'], '2 calls on your calendar') },
      { title: 'Expense categorization', iconKey: 'dollar', task: t('Expenses', ['Read 31 receipts', 'Categorized every expense', 'Synced them to QuickBooks'], 'Ready for your accountant') },
    ],
  },
  {
    title: 'Law firms',
    cards: [
      { title: 'Contract review', iconKey: 'document', task: t('Documents', ['Read the 32-page MSA', 'Flagged 3 risky clauses', 'Compared against your playbook'], '3 clauses need attention') },
      { title: 'Discovery analysis', iconKey: 'search', task: t('Discovery', ['Scanned 1,240 documents', 'Tagged them by issue and date', 'Summarized the key exhibits'], '18 documents flagged as relevant') },
      { title: 'Standard agreements', iconKey: 'pencil', task: t('Drafts', ['Loaded your NDA template', 'Filled in parties and terms', 'Marked items for review'], 'Draft ready for attorney review') },
      { title: 'Client intake', iconKey: 'clipboard', task: t('Intake', ['New inquiry from your website', 'Ran a conflict check', 'Opened the matter record'], 'Matter #2041 created') },
    ],
  },
  {
    title: 'Healthcare',
    cards: [
      { title: 'Appointment scheduling', iconKey: 'calendar', task: t('Calendar', ['Patient asked to reschedule', 'Found the next open slot', 'Sent a confirmation text'], 'Moved to Tue 9:15 am') },
      { title: 'Insurance verification', iconKey: 'shield', task: t('Verification', ['Pulled tomorrow’s 22 visits', 'Checked each patient’s coverage', 'Flagged 1 lapsed policy'], '21 of 22 verified') },
      { title: 'Clinical note summaries', iconKey: 'document', task: t('Charts', ['Read the visit notes', 'Structured them into a summary', 'Filed it to the patient chart'], 'Summary filed in 8 seconds') },
      { title: 'Patient follow-ups', iconKey: 'chat', task: t('Messages', ['Visit completed yesterday', 'Sent care instructions', 'Scheduled a check-in reminder'], 'Follow-up set for day 7') },
    ],
  },
  {
    title: 'E-commerce',
    cards: [
      { title: 'Product descriptions', iconKey: 'tag', task: t('Products', ['Read specs for 12 new SKUs', 'Wrote search-ready copy', 'Published to your store'], '12 listings live') },
      { title: 'Customer service', iconKey: 'chat', task: t('Support', ['“Where is my order?”', 'Looked up the tracking', 'Replied with the delivery date'], 'Resolved in 6 seconds') },
      { title: 'Inventory forecasting', iconKey: 'box', task: t('Inventory', ['Analyzed 90 days of sales', 'Forecast next month’s demand', 'Drafted purchase orders'], '4 SKUs to reorder now') },
      { title: 'Review summaries', iconKey: 'star', task: t('Reviews', ['Read 214 new reviews', 'Grouped them by theme', 'Summarized for your team'], 'Top ask: faster shipping') },
    ],
  },
  {
    title: 'Construction',
    cards: [
      { title: 'Bid management', iconKey: 'clipboard', task: t('Bids', ['3 subcontractor bids received', 'Compared scope and price', 'Flagged a missing line item'], 'Best bid: $184K, 6 weeks') },
      { title: 'Compliance documentation', iconKey: 'document', task: t('Site docs', ['Pulled today’s site log', 'Filled in the safety report', 'Filed it for inspection'], 'Daily report submitted') },
      { title: 'Subcontractor scheduling', iconKey: 'calendar', task: t('Schedule', ['Concrete pour moved to Friday', 'Rescheduled 3 crews', 'Texted everyone the update'], 'All crews confirmed') },
      { title: 'Budget tracking', iconKey: 'chart', task: t('Budget', ['Synced this week’s costs', 'Compared them to budget', 'Flagged the framing overrun'], 'Framing 8% over budget') },
    ],
  },
]

export default function Features() {
  const [selected, setSelected] = useState(0)
  const current = industries[selected]

  return (
    <section className="industries" id="industries">
      <div className="wrap">
        <div className="section-head">
          <RevealText text="Agents by industry." />
          <FadeUp delay={0.1}>
            <p>Pick your line of work and watch four agents run a typical day, with sample data. Most of what we build is custom to your business.</p>
          </FadeUp>
        </div>

        <FadeUp delay={0.15}>
          <div className="segmented" role="tablist" aria-label="Industries">
            {industries.map((industry, index) => (
              <button
                key={industry.title}
                role="tab"
                aria-selected={selected === index}
                className="segment"
                onClick={() => setSelected(index)}
              >
                {selected === index && (
                  <motion.span layoutId="segment-pill" className="segment-pill" transition={spring} />
                )}
                <span className="segment-label">{industry.title}</span>
              </button>
            ))}
          </div>
        </FadeUp>

        <div className="bento bento-2" role="tabpanel" aria-label={current.title}>
          <AnimatePresence mode="popLayout">
            {current.cards.map((card, i) => (
              <motion.div
                key={current.title + card.title}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)', transition: { duration: 0.18 } }}
                transition={{ ...spring, delay: i * 0.05 }}
              >
                <TiltCard className="feature-card run-card" max={5}>
                  <div className="run-stage">
                    <AgentRun iconKey={card.iconKey} title={card.title} task={card.task} offset={i * 450} />
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
