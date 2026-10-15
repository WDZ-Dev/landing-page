import { useCallback, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import AgentRun from './AgentRun'
import type { AgentTask } from './agentTasks'
import { FadeUp, RevealText, spring } from './motion'

const AGENTS: { name: string; icon: string; body: string; task: AgentTask; title: string }[] = [
  {
    name: 'Document agent', icon: 'document', title: 'Contract_Q2.pdf',
    body: 'Reads contracts and invoices, pulls out the numbers that matter, files them.',
    task: { app: 'Documents', steps: ['Scanned all 47 pages', 'Extracted revenue and payment terms', 'Matched Invoice_Mar.pdf', 'Filed both and flagged the renewal'], result: 'Saved 3.2 hrs · $8,450 due, Net 30' },
  },
  {
    name: 'Communication agent', icon: 'chat', title: 'Maryam U. · refund request',
    body: 'Answers customers in seconds, handles refunds, and keeps your CRM up to date.',
    task: { app: 'Support', steps: ['Read: “I was charged twice”', 'Found the duplicate charge', 'Refunded $49.99 and replied', 'Updated the CRM record'], result: 'Replied in 3.8s · saved 45 min' },
  },
  {
    name: 'Analytics agent', icon: 'chart', title: 'Weekly report',
    body: 'Connects your tools and turns raw data into a report before Monday morning.',
    task: { app: 'Reports', steps: ['Connected Stripe, HubSpot, Sheets', 'Analyzed the week’s trends', 'Wrote the summary', 'Emailed it at 7:00 am'], result: 'Revenue up 12% · churn down 3.2%' },
  },
]

export default function Showcase() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const next = useCallback(() => setActive((a) => (a + 1) % AGENTS.length), [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  // the console tilts back on approach and settles flat, like an Apple product reveal
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 28, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.88, 1])
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 100, 0])
  const a = AGENTS[active]

  return (
    <section className="showcase" id="showcase" ref={ref}>
      <div className="wrap">
        <div className="section-head center">
          <RevealText as="h1" text="See your AI team at work." />
          <FadeUp delay={0.15}>
            <p>Each agent is built around one of your workflows and runs inside the tools you already use. Three agents running real-world jobs, with sample data. Click one to watch it.</p>
          </FadeUp>
        </div>
        <div className="device-stage">
          <motion.div className="device" style={{ rotateX, scale, y }}>
            <div className="device-bar"><span /><span /><span /><em>Sample runs</em></div>
            <div className="console">
              <div className="console-list" role="tablist" aria-label="Agents">
                {AGENTS.map((ag, i) => (
                  <button key={ag.name} role="tab" aria-selected={i === active} className="console-tab" onClick={() => setActive(i)}>
                    {i === active && <motion.span layoutId="console-pill" className="console-pill" transition={spring} />}
                    <span className="console-tab-text">
                      <strong>{ag.name}</strong>
                      <small>{ag.body}</small>
                    </span>
                  </button>
                ))}
              </div>
              <div className="console-stage" role="tabpanel">
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={spring}
                >
                  <AgentRun iconKey={a.icon} title={a.title} task={a.task} size="lg" loop={false} onDone={next} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
