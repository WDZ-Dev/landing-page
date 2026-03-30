import { useScrollReveal } from '../hooks/useScrollReveal'

interface HeroProps {
  onOpenModal: () => void
}

export default function Hero({ onOpenModal }: HeroProps) {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="hero" ref={ref}>
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-badge reveal">
            <span className="hero-badge-dot"></span>
            Now accepting early clients
          </div>
          <h1 className="reveal reveal-delay-1">
            AI agents that <em>actually</em> run your operations
          </h1>
          <p className="hero-description reveal reveal-delay-2">
            WDZ Solutions builds autonomous AI agents tailored to your business
            — handling workflows, decisions, and processes so your team can focus
            on what matters.
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
            <div className="hero-orb hero-orb-2"></div>
            <div className="hero-orb hero-orb-3"></div>

            <div className="hero-card hero-card-1">
              <div className="hero-card-icon teal">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="hero-card-label">Data Pipeline</div>
              <div className="hero-card-value">Processing 2.4k records</div>
              <div className="hero-card-bar">
                <div className="hero-card-bar-fill"></div>
              </div>
            </div>

            <div className="hero-card hero-card-2">
              <div className="hero-card-icon gold">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="9" r="8" />
                  <path d="M9 5v4l3 3" />
                </svg>
              </div>
              <div className="hero-card-label">Task Automation</div>
              <div className="hero-card-value">14 workflows active</div>
            </div>

            <div className="hero-card hero-card-3">
              <div className="hero-card-icon warm">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className="hero-card-label">Agent Status</div>
              <div className="hero-card-value" style={{ color: 'var(--accent)' }}>
                All systems online
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
