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
            <div className="hero-orb hero-orb-2"></div>
            <div className="hero-orb hero-orb-3"></div>

            <div className="hero-card hero-card-1">
              <div className="hero-card-icon teal">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="9" r="8" />
                  <path d="M9 5v4l3 3" />
                </svg>
              </div>
              <div className="hero-card-label">Time Saved</div>
              <div className="hero-card-value">120 hrs / month</div>
              <div className="hero-card-bar">
                <div className="hero-card-bar-fill"></div>
              </div>
            </div>

            <div className="hero-card hero-card-2">
              <div className="hero-card-icon gold">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="9" r="8" />
                  <path d="M9 5v8" />
                  <path d="M11.5 7H7.5a1 1 0 000 2h3a1 1 0 010 2H6.5" />
                </svg>
              </div>
              <div className="hero-card-label">Operational costs</div>
              <div className="hero-card-value">$14,000 saved</div>
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
