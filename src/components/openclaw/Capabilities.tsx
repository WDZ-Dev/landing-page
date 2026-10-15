import { Link } from 'react-router-dom'
import AgentRun from '../AgentRun'
import type { AgentTask } from '../agentTasks'
import { FadeUp, RevealText, TiltCard } from '../motion'

const t = (app: string, steps: string[], result: string): AgentTask => ({ app, steps, result })

// OpenClaw-specific runs across the channels it connects to; sample data
const capabilities = [
  { key: 'mail', title: 'Manage your inbox', task: t('Inbox', ['Sorted 52 emails overnight', 'Drafted 6 replies', 'Left them for your review'], '6 drafts ready') },
  { key: 'chat', title: 'Answer customer messages', task: t('WhatsApp', ['“Are you open Sunday?”', 'Checked your business hours', 'Replied in your voice'], 'Answered in 3 seconds') },
  { key: 'document', title: 'Process documents', task: t('Documents', ['Invoice arrived by email', 'Extracted vendor and amount', 'Filed it to your drive'], '$1,240 logged') },
  { key: 'calendar', title: 'Automate your calendar', task: t('Slack', ['“Can we meet Thursday?”', 'Found a time for 4 people', 'Sent the invite'], 'Thu 11:00 am booked') },
  { key: 'chart', title: 'Generate reports', task: t('Reports', ['Pulled sales from Shopify', 'Built the weekly summary', 'Posted it to Slack'], 'Report in #team at 7 am') },
  { key: 'clipboard', title: 'Run your workflows', task: t('Onboarding', ['New client signed', 'Created accounts and folders', 'Sent the welcome pack'], 'Onboarding done in 2 min') },
]

export default function Capabilities() {
  return (
    <section className="industries oc-capabilities" id="capabilities">
      <div className="wrap">
        <div className="section-head">
          <RevealText text="How AI transforms your daily operations." />
          <FadeUp delay={0.1}>
            <p>Six jobs your private AI team handles out of the box, shown here with sample data.</p>
          </FadeUp>
        </div>
        <div className="bento">
          {capabilities.map((c, i) => (
            <FadeUp key={c.title} delay={(i % 3) * 0.08}>
              <TiltCard className="feature-card run-card" max={5}>
                <div className="run-stage"><AgentRun iconKey={c.key} title={c.title} task={c.task} offset={i * 450} /></div>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.1}>
          <p className="more-link">Want to see agents built for your industry? <Link to="/demos">Browse the demos</Link>.</p>
        </FadeUp>
      </div>
    </section>
  )
}
