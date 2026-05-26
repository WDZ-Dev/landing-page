import { useState, useEffect, useRef, useCallback } from 'react'
import './MockupAnimation.css'
import { getContent, type MailContent, type ChatContent, type DocContent, type CalContent, type ReceiptContent, type ChartContent, type ShareContent, type DollarContent, type CheckContent, type ShieldContent, type SearchContent, type PencilContent, type ClipContent, type BoxContent, type TagContent, type HomeContent, type StarContent } from './mockupContent'

type BadgePhase = { text: string; style: '' | 'working' | 'done' }

const D = [800, 1800, 1800, 2500]

const BADGE_PHASES: Record<string, { title: string; durations: number[]; phases: BadgePhase[] }> = {
  mail:      { title: 'Inbox — 3 new',       durations: D, phases: [{ text: 'Queued', style: '' }, { text: 'Reading…', style: 'working' }, { text: 'Drafting…', style: 'working' }, { text: '✓ Sent', style: 'done' }] },
  chat:      { title: 'Live Chat',            durations: D, phases: [{ text: 'New message', style: '' }, { text: 'Analyzing…', style: 'working' }, { text: 'Responding…', style: 'working' }, { text: '✓ Replied', style: 'done' }] },
  document:  { title: 'Contract_Q2.pdf',      durations: D, phases: [{ text: 'Queued', style: '' }, { text: 'Scanning…', style: 'working' }, { text: 'Extracting…', style: 'working' }, { text: '✓ Complete', style: 'done' }] },
  calendar:  { title: 'Schedule',             durations: D, phases: [{ text: 'Checking…', style: '' }, { text: 'Finding slots…', style: 'working' }, { text: 'Booking…', style: 'working' }, { text: '✓ Booked', style: 'done' }] },
  receipt:   { title: 'Invoice #1042',        durations: D, phases: [{ text: 'Queued', style: '' }, { text: 'Processing…', style: 'working' }, { text: 'Sending…', style: 'working' }, { text: '✓ Sent', style: 'done' }] },
  chart:     { title: 'Weekly Report',        durations: D, phases: [{ text: 'Queued', style: '' }, { text: 'Aggregating…', style: 'working' }, { text: 'Generating…', style: 'working' }, { text: '✓ Ready', style: 'done' }] },
  share:     { title: 'Social Scheduler',     durations: D, phases: [{ text: 'Queued', style: '' }, { text: 'Writing copy…', style: 'working' }, { text: 'Scheduling…', style: 'working' }, { text: '✓ Posted', style: 'done' }] },
  dollar:    { title: 'Finance Dashboard',    durations: D, phases: [{ text: 'Syncing…', style: '' }, { text: 'Categorizing…', style: 'working' }, { text: 'Calculating…', style: 'working' }, { text: '✓ Updated', style: 'done' }] },
  check:     { title: 'Lead Qualifier',       durations: D, phases: [{ text: 'New lead', style: '' }, { text: 'Evaluating…', style: 'working' }, { text: 'Scoring…', style: 'working' }, { text: '✓ Scored', style: 'done' }] },
  shield:    { title: 'Verification',         durations: D, phases: [{ text: 'Pending', style: '' }, { text: 'Checking…', style: 'working' }, { text: 'Validating…', style: 'working' }, { text: '✓ Verified', style: 'done' }] },
  search:    { title: 'Discovery Analysis',   durations: D, phases: [{ text: 'Queued', style: '' }, { text: 'Searching…', style: 'working' }, { text: 'Analyzing…', style: 'working' }, { text: '✓ Found 3', style: 'done' }] },
  pencil:    { title: 'Draft Editor',         durations: D, phases: [{ text: 'Queued', style: '' }, { text: 'Outlining…', style: 'working' }, { text: 'Writing…', style: 'working' }, { text: '✓ Draft ready', style: 'done' }] },
  clipboard: { title: 'Intake Form',          durations: D, phases: [{ text: 'New intake', style: '' }, { text: 'Parsing…', style: 'working' }, { text: 'Filling…', style: 'working' }, { text: '✓ Complete', style: 'done' }] },
  box:       { title: 'Inventory Tracker',    durations: D, phases: [{ text: 'Monitoring', style: '' }, { text: 'Checking…', style: 'working' }, { text: 'Alerting…', style: 'working' }, { text: '✓ Updated', style: 'done' }] },
  tag:       { title: 'Product Editor',       durations: D, phases: [{ text: 'Queued', style: '' }, { text: 'Analyzing…', style: 'working' }, { text: 'Tagging…', style: 'working' }, { text: '✓ Tagged', style: 'done' }] },
  home:      { title: 'Listing Generator',    durations: D, phases: [{ text: 'Queued', style: '' }, { text: 'Fetching MLS…', style: 'working' }, { text: 'Writing…', style: 'working' }, { text: '✓ Listed', style: 'done' }] },
  star:      { title: 'Review Summary',       durations: D, phases: [{ text: 'Queued', style: '' }, { text: 'Reading…', style: 'working' }, { text: 'Summarizing…', style: 'working' }, { text: '✓ Complete', style: 'done' }] },
}

function useHoverPhase(durations: number[]) {
  const [phase, setPhase] = useState(0)
  const [hovered, setHovered] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (!hovered) {
      clearTimeout(timer.current)
      setPhase(0)
      return
    }
    let p = 0
    const go = () => {
      timer.current = setTimeout(() => {
        p = (p + 1) % durations.length
        setPhase(p)
        go()
      }, durations[p])
    }
    go()
    return () => clearTimeout(timer.current)
  }, [hovered, durations])

  const onEnter = useCallback(() => setHovered(true), [])
  const onLeave = useCallback(() => setHovered(false), [])

  return { phase, hovered, onEnter, onLeave }
}

function ChromeDots() {
  return <div className="mk-dots"><span /><span /><span /></div>
}

function AiStatus({ text }: { text: string }) {
  return (
    <div className="mk-ai-status">
      <div className="mk-ai-avatar">AI</div>
      <span>{text}</span>
    </div>
  )
}

function Chrome({ title, badge }: { title: string; badge: BadgePhase }) {
  const cls = badge.style === 'working' ? ' mk-badge-working' : badge.style === 'done' ? ' mk-badge-done' : ''
  return (
    <div className="mk-chrome">
      <ChromeDots />
      <span className="mk-title">{title}</span>
      <span className={`mk-badge${cls}`}>{badge.text}</span>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BODIES: Record<string, (phase: number, c: any) => React.JSX.Element> = {
  mail: (_p, c: MailContent) => (
    <div className="mk-body mk-mail-body">
      {c.rows.map((r, i) => (
        <div key={i} className="mk-mail-row"><div className={`mk-mail-avatar ${r.bg}`}>{r.initials}</div><div className="mk-mail-content"><div className="mk-mail-sender">{r.name}</div><div className="mk-mail-subject">{r.subject}</div></div><div className="mk-mail-time">{r.time}</div></div>
      ))}
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  chat: (_p, c: ChatContent) => (
    <div className="mk-body mk-chat-body">
      <div className="mk-chat-msg mk-chat-cust"><div className="mk-chat-av mk-warm-bg">{c.custInitial}</div><div className="mk-chat-bubble mk-cust-bubble">{c.custMsg}</div></div>
      <div className="mk-chat-msg mk-chat-agent"><div className="mk-chat-av mk-accent-bg">AI</div><div className="mk-chat-bubble mk-agent-bubble">{c.agentMsg}</div></div>
      <div className="mk-chat-typing"><div className="mk-chat-av mk-accent-bg">AI</div><div className="mk-typing-dots"><span /><span /><span /></div></div>
    </div>
  ),
  document: (phase, c: DocContent) => (
    <div className="mk-body mk-doc-body">
      <div className="mk-doc-left">
        <div className="mk-doc-file-label">{c.pages}</div>
        <div className="mk-doc-lines">
          <div className="mk-doc-line" style={{ width: '90%' }} />
          <div className="mk-doc-line" style={{ width: '75%' }} />
          <div className={`mk-doc-line${phase >= 2 ? ' mk-doc-hl' : ''}`} style={{ width: '85%' }} />
          <div className="mk-doc-line" style={{ width: '60%' }} />
          <div className={`mk-doc-line${phase >= 2 ? ' mk-doc-hl' : ''}`} style={{ width: '80%' }} />
          <div className="mk-doc-line" style={{ width: '70%' }} />
        </div>
        <div className={`mk-doc-scan${phase === 1 ? ' mk-scanning' : ''}`} />
      </div>
      <div className="mk-doc-right">
        <div className="mk-doc-extract-hdr">AI Extracted</div>
        {c.items.map((t, i) => (
          <div key={i} className={`mk-doc-extract-item${phase >= 2 ? ' mk-extract-visible' : ''}`} style={{ transitionDelay: phase >= 2 ? `${i * 0.2}s` : '0s' }}>
            <span className="mk-extract-check">✓</span> {t}
          </div>
        ))}
      </div>
    </div>
  ),
  calendar: (_p, c: CalContent) => {
    const grid = [['9:00', Array(5).fill(null)], ['11:00', Array(5).fill(null)], ['2:00', Array(5).fill(null)]] as [string, (typeof c.events[0] | null)[]][]
    for (const e of c.events) {
      const row = e.time === '9:00' ? 0 : e.time === '11:00' ? 1 : 2
      grid[row][1][e.day] = e
    }
    return (
      <div className="mk-body mk-cal-body">
        <div className="mk-cal-header"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div>
        {grid.map(([time, slots], ri) => (
          <div key={ri} className="mk-cal-slot">
            <div className="mk-cal-time">{time}</div>
            {slots.map((s, ci) => s ? (
              <div key={ci} className={`mk-cal-event ${s.isNew ? 'mk-cal-new' : 'mk-cal-booked'}`}>{s.label}</div>
            ) : (
              <div key={ci} className="mk-cal-empty" />
            ))}
          </div>
        ))}
        <AiStatus text={c.aiStatus} />
      </div>
    )
  },
  receipt: (_p, c: ReceiptContent) => (
    <div className="mk-body mk-receipt-body">
      {c.items.map((item, i) => (
        <div key={i} className="mk-receipt-row"><span className="mk-receipt-item">{item.name}</span><span className="mk-receipt-amt">{item.amount}</span></div>
      ))}
      <div className="mk-receipt-divider" />
      <div className="mk-receipt-row mk-receipt-total"><span>Total</span><span>{c.total}</span></div>
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  chart: (_p, c: ChartContent) => (
    <div className="mk-body mk-chart-body">
      {c.rows.map((r, i) => (
        <div key={i} className="mk-chart-row"><span className="mk-chart-label">{r.label}</span><div className="mk-chart-bar-wrap"><div className="mk-chart-bar" style={{ '--target-w': r.pct } as React.CSSProperties} /></div><span className="mk-chart-val">{r.value}</span></div>
      ))}
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  share: (_p, c: ShareContent) => (
    <div className="mk-body mk-share-body">
      {c.posts.map((p, i) => (
        <div key={i} className="mk-share-post"><div className="mk-share-platform">{p.platform}</div><div className="mk-share-text">{p.text}</div><div className={`mk-share-status ${p.statusClass}`}>{p.status}</div></div>
      ))}
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  dollar: (_p, c: DollarContent) => (
    <div className="mk-body mk-dollar-body">
      <div className="mk-dollar-big"><span className="mk-dollar-sign">$</span><span className="mk-dollar-num">{c.amount}</span></div>
      <div className="mk-dollar-change">{c.change}</div>
      <div className="mk-dollar-bars">
        {[35, 50, 42, 68, 58, 75, 85].map((h, i) => (
          <div key={i} className={`mk-dollar-bar${i === 6 ? ' mk-bar-current' : ''}`} style={{ '--bar-h': `${h}%` } as React.CSSProperties} />
        ))}
      </div>
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  check: (_p, c: CheckContent) => (
    <div className="mk-body mk-check-body">
      {c.rows.map((r, i) => (
        <div key={i} className="mk-check-row"><div className="mk-checkbox" /><span className="mk-check-text">{r.text}</span><span className="mk-check-score">{r.score}</span></div>
      ))}
      <div className="mk-check-total" dangerouslySetInnerHTML={{ __html: c.total }} />
    </div>
  ),
  shield: (_p, c: ShieldContent) => (
    <div className="mk-body mk-shield-body">
      <div className="mk-shield-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
        <div className="mk-shield-pulse" />
      </div>
      <div className="mk-shield-status">{c.status}</div>
      <div className="mk-shield-details">{c.details}</div>
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  search: (_p, c: SearchContent) => (
    <div className="mk-body mk-search-body">
      <div className="mk-search-bar"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-5.2-5.2m0 0A7.5 7.5 0 105.2 5.2a7.5 7.5 0 0010.6 10.6z" /></svg><span>{c.query}</span></div>
      {c.results.map((r, i) => (
        <div key={i} className="mk-search-result"><span className="mk-search-doc">{r.doc}</span><span className="mk-search-match">{r.match}</span></div>
      ))}
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  pencil: (_p, c: PencilContent) => (
    <div className="mk-body mk-pencil-body">
      {c.lines.map((l, i) => <div key={i} className="mk-pencil-line">{l}</div>)}
      <div className="mk-pencil-line mk-pencil-typing">{c.typingLine}</div>
      <div className="mk-pencil-cursor" />
      {c.ghostLines.map((l, i) => <div key={i} className="mk-pencil-line mk-pencil-ghost">{l}</div>)}
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  clipboard: (_p, c: ClipContent) => (
    <div className="mk-body mk-clip-body">
      {c.fields.map((f, i) => (
        <div key={i} className="mk-clip-field"><label>{f.label}</label><div className="mk-clip-input"><span>{f.value}</span></div></div>
      ))}
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  box: (_p, c: BoxContent) => (
    <div className="mk-body mk-box-body">
      {c.items.map((item, i) => (
        <div key={i} className="mk-box-item"><div className="mk-box-thumb" /><div className="mk-box-info"><div className="mk-box-name">{item.name}</div><div className={`mk-box-stock ${item.stockClass}`}>{item.stock}</div></div></div>
      ))}
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  tag: (_p, c: TagContent) => (
    <div className="mk-body mk-tag-body">
      <div className="mk-tag-preview">
        <div className="mk-tag-img" />
        <div className="mk-tag-desc-lines"><div /><div /><div /></div>
      </div>
      <div className="mk-tag-pills">{c.tags.map((t, i) => <span key={i}>{t}</span>)}</div>
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  home: (_p, c: HomeContent) => (
    <div className="mk-body mk-home-body">
      <div className="mk-home-img" />
      <div className="mk-home-details">
        <div className="mk-home-price">{c.price}</div>
        <div className="mk-home-addr">{c.address}</div>
        <div className="mk-home-tags">{c.tags.map((t, i) => <span key={i}>{t}</span>)}</div>
      </div>
      <AiStatus text={c.aiStatus} />
    </div>
  ),
  star: (_p, c: StarContent) => (
    <div className="mk-body mk-star-body">
      <div className="mk-star-avg"><div className="mk-star-num">{c.rating}</div><div className="mk-star-icons">{Array.from({ length: 5 }).map((_, i) => <svg key={i} className={`mk-star-icon${i < 4 ? ' filled' : ' half'}`} viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>)}</div><div className="mk-star-count">{c.count}</div></div>
      <div className="mk-star-bars">
        {c.bars.map((b, i) => (
          <div key={i} className="mk-star-bar-row"><span>{b.label}</span><div className="mk-star-bar-wrap"><div className="mk-star-bar" style={{ '--target-w': b.pct } as React.CSSProperties} /></div></div>
        ))}
      </div>
      <AiStatus text={c.aiStatus} />
    </div>
  ),
}

export default function MockupAnimation({ iconKey, industry }: { iconKey: string; industry: string }) {
  const config = BADGE_PHASES[iconKey] || BADGE_PHASES.check
  const { phase, hovered, onEnter, onLeave } = useHoverPhase(config.durations)
  const badge = config.phases[phase]
  const Body = BODIES[iconKey] || BODIES.check
  const content = getContent(industry, iconKey)

  return (
    <div className={`mk-container${hovered ? ' mk-hovered' : ''}${phase >= 1 ? ' mk-p1' : ''}${phase >= 2 ? ' mk-p2' : ''}${phase >= 3 ? ' mk-p3' : ''}`} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="mk-window">
        <Chrome title={config.title} badge={badge} />
        {Body(phase, content)}
      </div>
    </div>
  )
}
