import { useState, useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface HeroProps {
  onOpenModal: () => void
}

const AGENT_TASKS = [
  ['Scanning Contract…', 'Extracting data…', 'Scanning Invoice…', 'Complete'],
  ['Reading email…', 'Classifying intent…', 'Drafting reply…', 'Sent'],
  ['Connecting sources…', 'Analyzing trends…', 'Generating insights…', 'Report ready'],
]

const SHUFFLE_CYCLE = 15000

function BotIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
      <rect x="3" y="7" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7.5" cy="12" r="1.2" fill="currentColor" />
      <circle cx="12.5" cy="12" r="1.2" fill="currentColor" />
      <line x1="10" y1="3" x2="10" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="2.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

function AgentBar({ name, task, phase }: { name: string; task: string[]; phase: number }) {
  return (
    <div className="hc-agent-bar">
      <div className="hc-agent-av"><BotIcon /></div>
      <div className="hc-agent-info">
        <span className="hc-agent-name">{name}</span>
        <span className="hc-agent-task">{task[phase]}</span>
      </div>
      <div className={`hc-agent-status${phase === 3 ? ' hc-agent-status-done' : ''}`}>
        <span className={`hc-agent-pulse${phase === 3 ? ' hc-agent-pulse-done' : ''}`} />
        {phase === 3 ? 'Done' : 'Working'}
      </div>
    </div>
  )
}

function AgentCursor({ phase, positions }: { phase: number; positions: { top: string; left: string }[] }) {
  const [thinking, setThinking] = useState(false)
  const lastPosRef = useRef(positions[3])
  if (phase >= 0) lastPosRef.current = positions[phase]

  useEffect(() => {
    if (phase < 0) { setThinking(false); return }
    if (phase === 3) { setThinking(true); return }

    setThinking(false)
    const show = setTimeout(() => setThinking(true), 500)
    const hide = setTimeout(() => setThinking(false), 900)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [phase])

  const pos = phase >= 0 ? positions[phase] : lastPosRef.current
  const idle = phase < 0

  return (
    <div
      className={`hc-cursor${phase === 3 ? ' hc-cursor-done' : ''}${idle ? ' hc-cursor-idle' : ''}`}
      style={{ top: pos.top, left: pos.left }}
    >
      <div className={`hc-cursor-thought${thinking ? '' : ' hc-cursor-thought-hidden'}`}>
        {phase === 3
          ? <span className="hc-cursor-check">✓</span>
          : <><span /><span /><span /></>}
      </div>
      <div className="hc-cursor-icon"><BotIcon /></div>
    </div>
  )
}

function DoneBadge() {
  return (
    <div className="hc-done-badge">
      <div className="hc-done-circle">
        <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

function DocCard({ phase }: { phase: number }) {
  const p = phase >= 0 ? `hc-p${phase}` : 'hc-idle'
  const displayPhase = phase >= 0 ? phase : 0
  return (
    <>
      <div className="hero-dash-chrome">
        <div className="hero-dash-dots"><span /><span /><span /></div>
        <span className="hero-dash-title">WDZ Agent</span>
      </div>
      <AgentBar name="Document Agent" task={AGENT_TASKS[0]} phase={displayPhase} />
      <div className={`hc-doc ${p}`}>
        <AgentCursor phase={phase} positions={[
          { top: '15%', left: '15%' },
          { top: '18%', left: '72%' },
          { top: '45%', left: '15%' },
          { top: '55%', left: '72%' },
        ]} />
        <div className="hc-doc-page">
          <div className="hc-doc-tabs">
            <span className={`hc-doc-tab${phase <= 1 ? ' hc-doc-tab-active' : ''}`}>Contract_Q2.pdf</span>
            <span className={`hc-doc-tab${phase >= 2 ? ' hc-doc-tab-active' : ''}`}>Invoice_Mar.pdf</span>
          </div>
          <div className="hc-doc-lines">
            {(phase >= 2
              ? [90, 65, 80, 50, 75, 60, 88, 70, 55, 82]
              : [85, 70, 55, 90, 60, 75, 45, 80, 65, 78, 50, 88]
            ).map((w, i) => (
              <div key={i} className="hc-doc-line" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="hc-doc-sweep" />
        </div>
        <div className="hc-doc-results">
          <div className="hc-doc-placeholder">
            <div className="hc-doc-placeholder-icon">
              <BotIcon />
            </div>
            <span>Waiting for scan…</span>
          </div>
          <span className="hc-doc-label">AI Extracted</span>
          {['Revenue: $142K', 'Terms: Net 30', 'Total due: $8,450', 'Both docs processed'].map((t, i) => (
            <div key={i} className="hc-doc-item">
              <span className="hc-doc-check">✓</span>
              <span>{t}</span>
            </div>
          ))}
          <DoneBadge />
        </div>
        <div className="hc-saved">
          Saved <strong>3.2 hrs</strong>
          <span className="hc-saved-dot" />
          Cost saved <strong>$180</strong>
        </div>
      </div>
    </>
  )
}

function CommCard({ phase }: { phase: number }) {
  const p = phase >= 0 ? `hc-p${phase}` : 'hc-idle'
  const displayPhase = phase >= 0 ? phase : 0
  return (
    <>
      <div className="hero-dash-chrome">
        <div className="hero-dash-dots"><span /><span /><span /></div>
        <span className="hero-dash-title">WDZ Agent</span>
      </div>
      <AgentBar name="Communication Agent" task={AGENT_TASKS[1]} phase={displayPhase} />
      <div className={`hc-comm ${p}`}>
        <AgentCursor phase={phase} positions={[
          { top: '6%', left: '22%' },
          { top: '38%', left: '55%' },
          { top: '56%', left: '72%' },
          { top: '82%', left: '30%' },
        ]} />
        <div className="hc-comm-msg hc-comm-customer">
          <div className="hc-comm-av hc-comm-av-cust">M</div>
          <div className="hc-comm-bubble hc-comm-bubble-cust">
            <span className="hc-comm-name">Maryam U.</span>
            I was charged twice for my last order. Can I get a refund? This is really frustrating.
          </div>
        </div>
        <div className="hc-comm-tags">
          <span className="hc-comm-tag">Refund request</span>
          <span className="hc-comm-tag hc-comm-tag-high">High priority</span>
          <span className="hc-comm-tag">Frustrated</span>
        </div>
        <div className="hc-comm-msg hc-comm-ai">
          <div className="hc-comm-bubble hc-comm-bubble-ai">
            <span className="hc-comm-name">AI Agent</span>
            <span className="hc-comm-typing"><span /><span /><span /></span>
            <span className="hc-comm-reply-text">I've found the duplicate charge and processed your refund of $49.99. You'll see it in 2–3 business days.</span>
          </div>
          <div className="hc-comm-av hc-comm-av-ai">AI</div>
        </div>
        <div className="hc-comm-actions">
          <span className="hc-comm-action-done">✓ Refund processed</span>
          <span className="hc-comm-action-done">✓ CRM updated</span>
        </div>
        <DoneBadge />
        <div className="hc-saved">
          Saved <strong>45 min</strong>
          <span className="hc-saved-dot" />
          Reply in <strong>3.8s</strong>
        </div>
      </div>
    </>
  )
}

function AnalyticsCard({ phase }: { phase: number }) {
  const p = phase >= 0 ? `hc-p${phase}` : 'hc-idle'
  const displayPhase = phase >= 0 ? phase : 0
  return (
    <>
      <div className="hero-dash-chrome">
        <div className="hero-dash-dots"><span /><span /><span /></div>
        <span className="hero-dash-title">WDZ Agent</span>
      </div>
      <AgentBar name="Analytics Agent" task={AGENT_TASKS[2]} phase={displayPhase} />
      <div className={`hc-analytics ${p}`}>
        <AgentCursor phase={phase} positions={[
          { top: '5%', left: '45%' },
          { top: '35%', left: '20%' },
          { top: '66%', left: '65%' },
          { top: '86%', left: '40%' },
        ]} />
        <div className="hc-sources">
          <div className="hc-source"><span className="hc-source-dot" />Stripe</div>
          <div className="hc-source"><span className="hc-source-dot" />HubSpot</div>
          <div className="hc-source"><span className="hc-source-dot" />Sheets</div>
        </div>
        <div className="hc-chart">
          <div className="hc-chart-bars">
            {[
              { h: 45, label: 'Mon' },
              { h: 68, label: 'Tue' },
              { h: 52, label: 'Wed' },
              { h: 85, label: 'Thu' },
              { h: 74, label: 'Fri' },
            ].map((b, i) => (
              <div key={i} className="hc-chart-col">
                <div className="hc-chart-bar" style={{ '--bar-h': `${b.h}%` } as React.CSSProperties} />
                <span className="hc-chart-label">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hc-insights">
          <span className="hc-insights-label">Insights</span>
          <div className="hc-insight-cards">
            <div className="hc-insight">
              <span className="hc-insight-up">↑ 12%</span>
              <span className="hc-insight-name">Revenue</span>
            </div>
            <div className="hc-insight">
              <span className="hc-insight-down">↓ 3.2%</span>
              <span className="hc-insight-name">Churn</span>
            </div>
            <div className="hc-insight">
              <span className="hc-insight-up">72 → 81</span>
              <span className="hc-insight-name">NPS Score</span>
            </div>
          </div>
        </div>
        <DoneBadge />
        <div className="hc-saved">
          Saved <strong>6 hrs</strong>
          <span className="hc-saved-dot" />
          Cost saved <strong>$420</strong>
        </div>
      </div>
    </>
  )
}

function getPhase(elapsed: number, frontOffset: number): number {
  const t = ((elapsed - frontOffset) % SHUFFLE_CYCLE + SHUFFLE_CYCLE) % SHUFFLE_CYCLE
  if (t < 1050) return 0
  if (t < 2100) return 1
  if (t < 3150) return 2
  if (t < 4200) return 3
  return -1
}

const HOLD_MS = 1500

function HeroDashboard() {
  const [phases, setPhases] = useState([0, -1, -1])
  const holdUntil = useRef([0, 0, 0])

  useEffect(() => {
    const start = performance.now()
    const offsets = [0, 10000, 5000]

    const id = setInterval(() => {
      const now = performance.now()
      const elapsed = now - start
      const raw = offsets.map(o => getPhase(elapsed, o))
      setPhases(prev => {
        const next = raw.map((r, i) => {
          if (r === -1 && prev[i] === 3) {
            if (holdUntil.current[i] === 0) holdUntil.current[i] = now + HOLD_MS
            if (now < holdUntil.current[i]) return 3
            holdUntil.current[i] = 0
            return -1
          }
          if (r !== -1) holdUntil.current[i] = 0
          return r
        })
        if (prev[0] !== next[0] || prev[1] !== next[1] || prev[2] !== next[2]) return next
        return prev
      })
    }, 100)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hero-dash-stack">
      <div className="hero-dash-card hero-dash-c0"><DocCard phase={phases[0]} /></div>
      <div className="hero-dash-card hero-dash-c1"><CommCard phase={phases[1]} /></div>
      <div className="hero-dash-card hero-dash-c2"><AnalyticsCard phase={phases[2]} /></div>
    </div>
  )
}

export default function Hero({ onOpenModal }: HeroProps) {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="hero" ref={ref}>
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-badge reveal">
            <span className="hero-badge-dot"></span>
            Few More Client Spots Available
          </div>
          <h1 className="reveal reveal-delay-1">
            AI that saves you <em>time</em> and <em>money</em>
          </h1>
          <p className="hero-description reveal reveal-delay-2">
            Our AI agents integrate seamlessly with your existing systems — no setup headaches, no learning curves, and <strong>no technical knowledge required.</strong> Beat the competition before your competitors do.
          </p>
          <div className="hero-actions reveal reveal-delay-3">
            <button className="btn btn-primary btn-large" onClick={onOpenModal}>
              Contact Us <span className="btn-arrow">&rarr;</span>
            </button>
            <a href="#features" className="btn btn-ghost">
              See how it works
            </a>
          </div>
        </div>
        <div className="hero-visual reveal reveal-delay-2">
          <div className="hero-graphic">
            <div className="hero-orb hero-orb-1"></div>
            <HeroDashboard />
          </div>
        </div>
      </div>
    </section>
  )
}
