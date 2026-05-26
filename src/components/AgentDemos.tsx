import { useState, useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

function usePhase(durations: number[], enabled = true) {
  const [phase, setPhase] = useState(0)
  const phaseRef = useRef(0)
  const durRef = useRef(durations)

  useEffect(() => {
    if (!enabled) return
    let t: ReturnType<typeof setTimeout>
    const go = () => {
      t = setTimeout(() => {
        phaseRef.current = (phaseRef.current + 1) % durRef.current.length
        setPhase(phaseRef.current)
        go()
      }, durRef.current[phaseRef.current])
    }
    go()
    return () => clearTimeout(t)
  }, [enabled])

  return phase
}

function ChromeDots() {
  return (
    <div className="chrome-dots">
      <span /><span /><span />
    </div>
  )
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="demo-step-dots">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`demo-dot${i === current ? ' demo-dot-active' : i < current ? ' demo-dot-past' : ''}`} />
      ))}
    </div>
  )
}

function sc(current: number, index: number) {
  if (current === index) return 'demo-screen demo-screen-active'
  if (current > index) return 'demo-screen demo-screen-past'
  return 'demo-screen'
}

// ── Document Processing ──────────────────────────────────────────
function DocDemo({ playing }: { playing: boolean }) {
  const screen = usePhase([2500, 3000, 3200, 3500], playing)

  const badges = ['Uploading…', 'Scanning…', 'Extracting…', '✓ Complete']
  const badgeCls = screen < 3 ? (screen > 0 ? ' badge-working' : '') : ' badge-done'

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
          <span className={`chrome-badge${badgeCls}`}>{badges[screen]}</span>
        </div>
        <div className="demo-body-screens">
          {/* Upload */}
          <div className={sc(screen, 0)}>
            <div className="ds-doc-upload">
              <div className="ds-upload-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m0 0l2.25-2.25M9.75 15l2.25 2.25M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="ds-upload-name">Contract_Q2.pdf</div>
              <div className="ds-upload-meta">2.4 MB · 47 pages</div>
              <div className="ds-upload-bar-wrap">
                <div className="ds-upload-bar" />
              </div>
            </div>
          </div>

          {/* Scanning */}
          <div className={sc(screen, 1)}>
            <div className="ds-doc-scan">
              <div className="ds-scan-page">
                {[90, 68, 83, 52, 78, 60, 72, 42].map((w, i) => (
                  <div key={i} className="ds-scan-line" style={{ width: `${w}%` }} />
                ))}
                <div className="ds-scan-sweep" />
              </div>
              <div className="ds-scan-info">
                <div className="ds-scan-label">Analyzing pages…</div>
                <div className="ds-scan-count">47 / 47</div>
                <div className="ds-scan-progress-wrap">
                  <div className="ds-scan-progress" />
                </div>
              </div>
            </div>
          </div>

          {/* Extracting */}
          <div className={sc(screen, 2)}>
            <div className="ds-doc-extract">
              <div className="ds-extract-left">
                <div className="ds-extract-file-label">47 pages</div>
                {[90, 68, 83, 52, 78, 60].map((w, i) => (
                  <div key={i} className={`ds-extract-line${i === 2 || i === 4 ? ' ds-hl' : ''}`} style={{ width: `${w}%` }} />
                ))}
              </div>
              <div className="ds-extract-right">
                <div className="ds-extract-hdr">AI Extracted</div>
                {['2 parties identified', '3 risk clauses flagged', 'Payment terms: net-30', 'Summary generated'].map((t, i) => (
                  <div key={i} className="ds-extract-item" style={{ animationDelay: `${i * 0.25}s` }}>
                    <span className="ds-extract-check">✓</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Complete */}
          <div className={sc(screen, 3)}>
            <div className="ds-doc-done">
              {[
                { label: 'Parties', value: 'Acme Corp ↔ ClientCo' },
                { label: 'Risk Clauses', value: '3 flagged' },
                { label: 'Payment', value: 'Net-30' },
                { label: 'Confidence', value: '97%' },
              ].map((r, i) => (
                <div key={i} className="ds-done-row" style={{ animationDelay: `${i * 0.12}s` }}>
                  <span className="ds-done-label">{r.label}</span>
                  <span className="ds-done-value">{r.value}</span>
                </div>
              ))}
              <div className="ds-done-footer">
                <span>Processed in 4.2s</span>
                <span className="ds-done-export">Export PDF →</span>
              </div>
            </div>
          </div>
        </div>
        <StepDots current={screen} total={4} />
      </div>
      <p className="agent-demo-desc">
        Contracts, invoices, clinical notes, and claims — processed in seconds, not hours.
      </p>
    </div>
  )
}

// ── Client Communication ─────────────────────────────────────────
function CommDemo({ playing }: { playing: boolean }) {
  const screen = usePhase([2500, 3000, 3200, 3500], playing)

  const badges = ['3 unread', 'Classifying…', 'Drafting…', '✓ Sent']
  const badgeCls = screen === 0 ? '' : screen < 3 ? ' badge-working' : ' badge-done'

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
          <span className={`chrome-badge${badgeCls}`}>{badges[screen]}</span>
        </div>
        <div className="demo-body-screens">
          {/* Inbox */}
          <div className={sc(screen, 0)}>
            <div className="ds-comm-inbox">
              {[
                { initials: 'MU', name: 'Maryam U.', subj: 'Help with order #4821 — wrong item', time: '9:41 AM', active: true },
                { initials: 'TR', name: 'Tom R.', subj: 'Quick question about pricing plans', time: '9:38 AM', active: false },
                { initials: 'AL', name: 'Amy L.', subj: 'Following up on our meeting last week', time: '9:12 AM', active: false },
              ].map((m, i) => (
                <div key={i} className={`ds-inbox-row${m.active ? ' ds-inbox-active' : ''}`} style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className={`ds-inbox-av${m.active ? ' ds-inbox-av-hl' : ''}`}>{m.initials}</div>
                  <div className="ds-inbox-body">
                    <div className="ds-inbox-name">{m.name}<span className="ds-inbox-time">{m.time}</span></div>
                    <div className="ds-inbox-subj">{m.subj}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classifying */}
          <div className={sc(screen, 1)}>
            <div className="ds-comm-classify">
              <div className="ds-classify-msg">
                <div className="ds-classify-from">From: Maryam U. · 9:41 AM</div>
                <div className="ds-classify-text">Hi, I need help with order #4821 — the wrong item arrived and I need a replacement ASAP.</div>
              </div>
              <div className="ds-classify-tags">
                {[
                  { label: 'Intent', value: 'Order Issue', cls: 'ds-tag-red' },
                  { label: 'Sentiment', value: 'Frustrated', cls: 'ds-tag-amber' },
                  { label: 'Priority', value: 'High', cls: 'ds-tag-red' },
                ].map((t, i) => (
                  <div key={i} className={`ds-classify-tag ${t.cls}`} style={{ animationDelay: `${0.3 + i * 0.25}s` }}>
                    <span className="ds-ctag-label">{t.label}</span>
                    <span className="ds-ctag-value">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drafting */}
          <div className={sc(screen, 2)}>
            <div className="ds-comm-draft">
              <div className="ds-draft-header">
                <span className="ds-draft-re">Re: Order #4821</span>
                <span className="ds-draft-to">To: Maryam U.</span>
              </div>
              <div className="ds-draft-compose">
                <div className="ds-draft-av">AI</div>
                <div className="ds-draft-text">
                  Hi Maryam! So sorry about that. I've already processed a full refund and shipped the correct item — you'll receive it in 2–3 business days. A tracking link is on its way to your email.
                  <span className="ds-draft-cursor" />
                </div>
              </div>
            </div>
          </div>

          {/* Sent */}
          <div className={sc(screen, 3)}>
            <div className="ds-comm-sent">
              <div className="ds-sent-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div className="ds-sent-title">Reply sent to Maryam U.</div>
              <div className="ds-sent-details">
                {[
                  { label: 'Response time', value: '4 seconds' },
                  { label: 'CRM updated', value: 'Case #4821' },
                  { label: 'Refund initiated', value: '$49.99' },
                ].map((r, i) => (
                  <div key={i} className="ds-sent-row" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                    <span>{r.label}</span>
                    <span className="ds-sent-val">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <StepDots current={screen} total={4} />
      </div>
      <p className="agent-demo-desc">
        Follow-ups, support replies, and reminders — sent instantly, at any scale, 24/7.
      </p>
    </div>
  )
}

// ── Reporting & Analytics ────────────────────────────────────────
function ReportDemo({ playing }: { playing: boolean }) {
  const screen = usePhase([2500, 3000, 3200, 3500], playing)

  const badges = ['Connecting…', 'Processing…', 'Analyzing…', '✓ Ready']
  const badgeCls = screen < 3 ? ' badge-working' : ' badge-done'

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
          <span className={`chrome-badge${badgeCls}`}>{badges[screen]}</span>
        </div>
        <div className="demo-body-screens">
          {/* Connecting */}
          <div className={sc(screen, 0)}>
            <div className="ds-report-connect">
              {[
                { abbr: 'CRM', label: 'Sales CRM' },
                { abbr: 'QB', label: 'Accounting' },
                { abbr: 'GA', label: 'Analytics' },
              ].map((s, i) => (
                <div key={i} className="ds-source-card" style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="ds-source-icon">{s.abbr}</div>
                  <div className="ds-source-label">{s.label}</div>
                  <div className="ds-source-status">Connected</div>
                </div>
              ))}
              <div className="ds-connect-pulse" />
            </div>
          </div>

          {/* Building */}
          <div className={sc(screen, 1)}>
            <div className="ds-report-build">
              {[
                { label: 'Revenue', value: '$124K', pct: 78 },
                { label: 'New Leads', value: '847', pct: 62 },
                { label: 'Deals Won', value: '43', pct: 45 },
                { label: 'Retention', value: '94%', pct: 88 },
              ].map((m, i) => (
                <div key={i} className="ds-build-row">
                  <span className="ds-build-label">{m.label}</span>
                  <div className="ds-build-bar-wrap">
                    <div className="ds-build-bar" style={{ '--bar-target': `${m.pct}%`, animationDelay: `${i * 0.15}s` } as React.CSSProperties} />
                  </div>
                  <span className="ds-build-value" style={{ animationDelay: `${0.4 + i * 0.12}s` }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className={sc(screen, 2)}>
            <div className="ds-report-insights">
              {[
                { text: 'Revenue up 12% vs last week', tag: 'Growth' },
                { text: '3 deals at risk of churn', tag: 'Alert' },
                { text: 'Top channel: Email campaigns', tag: 'Insight' },
              ].map((ins, i) => (
                <div key={i} className="ds-insight-card" style={{ animationDelay: `${i * 0.25}s` }}>
                  <div className="ds-insight-text">{ins.text}</div>
                  <div className="ds-insight-tag">{ins.tag}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ready */}
          <div className={sc(screen, 3)}>
            <div className="ds-report-ready">
              {[
                { label: 'Revenue', value: '$124K', trend: '+12%' },
                { label: 'New Leads', value: '847', trend: '+8%' },
                { label: 'Deals Won', value: '43', trend: '+23%' },
                { label: 'Retention', value: '94%', trend: '+2%' },
              ].map((m, i) => (
                <div key={i} className="ds-ready-row" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="ds-ready-label">{m.label}</span>
                  <span className="ds-ready-value">{m.value}</span>
                  <span className="ds-ready-trend">{m.trend}</span>
                </div>
              ))}
              <div className="ds-ready-footer">
                <span>Auto-generated · Mon 9:00 AM</span>
                <span className="ds-ready-export">Export PDF →</span>
              </div>
            </div>
          </div>
        </div>
        <StepDots current={screen} total={4} />
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
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(
    typeof document === 'undefined' ? true : document.visibilityState === 'visible',
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0, rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const playing = inView && pageVisible

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
        <DocDemo playing={playing} />
        <CommDemo playing={playing} />
        <ReportDemo playing={playing} />
      </div>
    </section>
  )
}
