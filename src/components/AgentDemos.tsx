import { useState, useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

function usePhase(durations: number[]) {
  const [phase, setPhase] = useState(0)
  const durRef = useRef(durations)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const go = (p: number) => {
      t = setTimeout(() => {
        const next = (p + 1) % durRef.current.length
        setPhase(next)
        go(next)
      }, durRef.current[p])
    }
    go(0)
    return () => clearTimeout(t)
  }, [])

  return phase
}

function ChromeDots() {
  return (
    <div className="chrome-dots">
      <span /><span /><span />
    </div>
  )
}

// ── Document Processing ──────────────────────────────────────────
function DocDemo() {
  // phases: 0=idle  1=scanning  2=extracting  3=done
  const phase = usePhase([1600, 2400, 2800, 1800])

  const items = [
    '2 parties identified',
    '3 risk clauses flagged',
    'Payment terms: net-30',
    'Summary generated',
  ]

  return (
    <div className="agent-demo-card reveal">
      <div className="agent-demo-label">
        <span className="demo-num">01</span>
        Document Processing
      </div>
      <div className="demo-window">
        <div className="demo-chrome">
          <ChromeDots />
          <span className="chrome-title">Contract_Q2.pdf</span>
          <span className={`chrome-badge${phase === 1 ? ' badge-working' : phase >= 2 ? ' badge-done' : ''}`}>
            {phase === 0 && 'Queued'}
            {phase === 1 && 'Analyzing…'}
            {phase === 2 && 'Extracting…'}
            {phase === 3 && '✓ Complete'}
          </span>
        </div>
        <div className="doc-demo-body">
          <div className="doc-panel">
            <div className="doc-panel-hdr">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>Contract_Q2.pdf</span>
              <span className="doc-pages">47 pages</span>
            </div>
            <div className="doc-lines-wrap">
              {[90, 68, 83, 52, 78, 60, 72, 42].map((w, i) => (
                <div
                  key={i}
                  className={`doc-line${phase >= 1 && i < 5 ? ' doc-line-hl' : ''}`}
                  style={{ width: `${w}%`, transitionDelay: `${i * 0.07}s` }}
                />
              ))}
              <div className={`doc-scan${phase === 1 ? ' scanning' : ''}`} />
            </div>
          </div>
          <div className="doc-extract">
            <div className="extract-hdr">AI Extracted</div>
            {items.map((text, i) => (
              <div
                key={i}
                className={`extract-item${phase >= 2 ? ' extract-visible' : ''}`}
                style={{ transitionDelay: phase >= 2 ? `${i * 0.2}s` : '0s' }}
              >
                <span className="extract-check">✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="agent-demo-desc">
        Contracts, invoices, clinical notes, and claims — processed in seconds, not hours.
      </p>
    </div>
  )
}

// ── Client Communication ─────────────────────────────────────────
function CommDemo() {
  // phases: 0=empty  1=customer msg  2=typing  3=agent reply
  const phase = usePhase([1400, 2000, 1800, 3200])

  return (
    <div className="agent-demo-card reveal reveal-delay-1">
      <div className="agent-demo-label">
        <span className="demo-num">02</span>
        Client Communication
      </div>
      <div className="demo-window">
        <div className="demo-chrome">
          <ChromeDots />
          <span className="chrome-title">Customer Inbox</span>
          <span className={`chrome-badge${phase >= 1 && phase < 3 ? ' badge-working' : phase === 3 ? ' badge-done' : ''}`}>
            {phase === 0 && '3 unread'}
            {(phase === 1 || phase === 2) && 'Responding…'}
            {phase === 3 && '✓ Sent'}
          </span>
        </div>
        <div className="comm-demo-body">
          <div className={`comm-msg${phase >= 1 ? ' msg-visible' : ''}`}>
            <div className="msg-avatar cust-avatar">S</div>
            <div className="msg-body">
              <div className="msg-name">
                Sarah M. <span className="msg-time">9:41 AM</span>
              </div>
              <div className="msg-bubble cust-bubble">
                Hi, I need help with order #4821 — the wrong item arrived.
              </div>
            </div>
          </div>

          <div className={`comm-typing${phase === 2 ? ' typing-visible' : ''}`}>
            <div className="msg-avatar agent-avatar">AI</div>
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>

          <div className={`comm-msg comm-msg-agent${phase === 3 ? ' msg-visible' : ''}`}>
            <div className="msg-avatar agent-avatar">AI</div>
            <div className="msg-body">
              <div className="msg-name">
                AI Agent <span className="msg-time">9:41 AM ✓✓</span>
              </div>
              <div className="msg-bubble agent-bubble">
                Hi Sarah! So sorry about that. I've processed a full refund + replacement — you'll see it in 2–3 days.
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="agent-demo-desc">
        Follow-ups, support replies, and reminders — sent instantly, at any scale, 24/7.
      </p>
    </div>
  )
}

// ── Reporting & Analytics ────────────────────────────────────────
function ReportDemo() {
  // phases: 0=empty  1=bars fill  2=values appear  3=footer
  const phase = usePhase([1400, 2600, 1800, 2400])

  const metrics = [
    { label: 'Revenue',   value: '$124K', pct: 78, trend: '+12%' },
    { label: 'New Leads', value: '847',   pct: 62, trend: '+8%'  },
    { label: 'Deals Won', value: '43',    pct: 45, trend: '+23%' },
    { label: 'Retention', value: '94%',   pct: 88, trend: '+2%'  },
  ]

  return (
    <div className="agent-demo-card reveal reveal-delay-2">
      <div className="agent-demo-label">
        <span className="demo-num">03</span>
        Reporting &amp; Analytics
      </div>
      <div className="demo-window">
        <div className="demo-chrome">
          <ChromeDots />
          <span className="chrome-title">Weekly Report</span>
          <span className={`chrome-badge${phase === 1 ? ' badge-working' : phase >= 2 ? ' badge-done' : ''}`}>
            {phase === 0 && 'Generating…'}
            {phase === 1 && 'Processing…'}
            {phase >= 2 && '✓ Ready'}
          </span>
        </div>
        <div className="report-demo-body">
          {metrics.map((m, i) => (
            <div key={i} className="metric-row">
              <span className="metric-label">{m.label}</span>
              <div className="metric-bar-wrap">
                <div
                  className="metric-bar"
                  style={{
                    width: phase >= 1 ? `${m.pct}%` : '0%',
                    transitionDelay: `${i * 0.14}s`,
                  }}
                />
              </div>
              <span
                className={`metric-value${phase >= 2 ? ' val-visible' : ''}`}
                style={{ transitionDelay: phase >= 2 ? `${i * 0.1}s` : '0s' }}
              >
                {m.value}
              </span>
              <span
                className={`metric-trend${phase >= 2 ? ' val-visible' : ''}`}
                style={{ transitionDelay: phase >= 2 ? `${0.3 + i * 0.1}s` : '0s' }}
              >
                ↑ {m.trend}
              </span>
            </div>
          ))}
          <div className={`report-footer${phase >= 3 ? ' footer-visible' : ''}`}>
            <span>Auto-generated · Mon 9:00 AM</span>
            <span className="report-export-btn">Export PDF →</span>
          </div>
        </div>
      </div>
      <p className="agent-demo-desc">
        Raw data turned into clean reports and dashboards — delivered on your schedule.
      </p>
    </div>
  )
}

// ── Section ──────────────────────────────────────────────────────
export default function AgentDemos() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="agent-demos" id="demos" ref={ref}>
      <div className="section-label reveal">AI in Action</div>
      <h2 className="section-heading reveal reveal-delay-1">
        See what your agents actually do
      </h2>
      <p className="section-subtext reveal reveal-delay-2">
        The three most impactful automations — visualised live across every industry we serve.
      </p>
      <div className="agent-demos-grid">
        <DocDemo />
        <CommDemo />
        <ReportDemo />
      </div>
    </section>
  )
}
