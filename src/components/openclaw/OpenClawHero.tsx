import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function OpenClawHero() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="hero" ref={ref}>
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-badge oc-badge reveal">
            <span className="hero-badge-dot oc-dot"></span>
            OpenClaw Services
          </div>
          <h1 className="reveal reveal-delay-1">
            Your own AI team — running on <em>hardware you control</em>
          </h1>
          <p className="hero-description reveal reveal-delay-2">
            We set up AI assistants that handle your busywork — emails,
            documents, scheduling, and more — running privately on hardware
            in your office. Your data never leaves your building.
          </p>
          <div className="hero-actions reveal reveal-delay-3">
            <a href="#quote" className="btn btn-primary btn-large oc-btn-primary">
              Get a Free Quote <span className="btn-arrow">&rarr;</span>
            </a>
            <a href="#capabilities" className="btn btn-ghost">
              See what it can do
            </a>
          </div>
        </div>
        <div className="hero-visual reveal reveal-delay-2">
          <div className="hero-graphic">
            {/* OpenClaw-branded orbs */}
            <div className="hero-orb oc-orb-1"></div>
            <div className="hero-orb oc-orb-2"></div>
            <div className="hero-orb oc-orb-3"></div>

            {/* Molty the lobster — matching OpenClaw mascot style */}
            <div className="oc-molty">
              <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="moltyGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF5A2D" stopOpacity="0.35"/>
                    <stop offset="100%" stopColor="#FF5A2D" stopOpacity="0"/>
                  </radialGradient>
                  <radialGradient id="bodyGrad" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#F06850"/>
                    <stop offset="60%" stopColor="#E5442E"/>
                    <stop offset="100%" stopColor="#C4331E"/>
                  </radialGradient>
                  <radialGradient id="clawGrad" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#E5503A"/>
                    <stop offset="100%" stopColor="#C43420"/>
                  </radialGradient>
                </defs>

                {/* Glow behind Molty */}
                <ellipse cx="110" cy="148" rx="100" ry="100" fill="url(#moltyGlow)"/>

                {/* Left antenna */}
                <path d="M88 72C82 52 68 38 62 34" stroke="#C43420" strokeWidth="5" strokeLinecap="round"/>
                <circle cx="60" cy="32" r="7" fill="url(#clawGrad)"/>

                {/* Right antenna */}
                <path d="M132 72C138 52 152 38 158 34" stroke="#C43420" strokeWidth="5" strokeLinecap="round"/>
                <circle cx="160" cy="32" r="7" fill="url(#clawGrad)"/>

                {/* Left claw arm */}
                <ellipse cx="38" cy="148" rx="22" ry="20" fill="url(#clawGrad)"/>
                <ellipse cx="38" cy="148" rx="22" ry="20" fill="#E5442E" fillOpacity="0.3"/>

                {/* Right claw arm */}
                <ellipse cx="182" cy="148" rx="22" ry="20" fill="url(#clawGrad)"/>
                <ellipse cx="182" cy="148" rx="22" ry="20" fill="#E5442E" fillOpacity="0.3"/>

                {/* Main body — round blob shape */}
                <ellipse cx="110" cy="152" rx="66" ry="72" fill="url(#bodyGrad)"/>

                {/* Body highlight/sheen */}
                <ellipse cx="96" cy="126" rx="32" ry="28" fill="white" fillOpacity="0.07"/>

                {/* Left foot */}
                <ellipse cx="82" cy="222" rx="14" ry="8" fill="#C43420"/>
                {/* Right foot */}
                <ellipse cx="138" cy="222" rx="14" ry="8" fill="#C43420"/>

                {/* Left leg */}
                <rect x="76" y="210" width="12" height="16" rx="6" fill="#D13D28"/>
                {/* Right leg */}
                <rect x="132" y="210" width="12" height="16" rx="6" fill="#D13D28"/>

                {/* Eyes — large teal/cyan */}
                <ellipse cx="90" cy="136" rx="14" ry="15" fill="#1A2A2A"/>
                <ellipse cx="130" cy="136" rx="14" ry="15" fill="#1A2A2A"/>

                {/* Eye iris — teal */}
                <ellipse cx="92" cy="138" rx="9" ry="10" fill="#2DD4BF"/>
                <ellipse cx="132" cy="138" rx="9" ry="10" fill="#2DD4BF"/>

                {/* Eye inner glow */}
                <ellipse cx="92" cy="138" rx="6" ry="7" fill="#5EEAD4" fillOpacity="0.4"/>
                <ellipse cx="132" cy="138" rx="6" ry="7" fill="#5EEAD4" fillOpacity="0.4"/>

                {/* Pupils */}
                <circle cx="94" cy="138" r="4.5" fill="#0F1A1A"/>
                <circle cx="134" cy="138" r="4.5" fill="#0F1A1A"/>

                {/* Eye highlights */}
                <circle cx="88" cy="133" r="3" fill="white" fillOpacity="0.8"/>
                <circle cx="128" cy="133" r="3" fill="white" fillOpacity="0.8"/>
                <circle cx="96" cy="142" r="1.5" fill="white" fillOpacity="0.4"/>
                <circle cx="136" cy="142" r="1.5" fill="white" fillOpacity="0.4"/>
              </svg>
            </div>

            {/* Info cards orbit around Molty */}
            <div className="hero-card oc-card oc-card-tl">
              <div className="hero-card-icon oc-icon-orange">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 2L2 6l7 4 7-4-7-4z" />
                  <path d="M2 14l7 4 7-4" />
                  <path d="M2 10l7 4 7-4" />
                </svg>
              </div>
              <div className="hero-card-label">Your Data</div>
              <div className="hero-card-value" style={{ color: '#FF5A2D' }}>Stays on your hardware</div>
            </div>

            <div className="hero-card oc-card oc-card-bl">
              <div className="hero-card-icon oc-icon-warm">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div className="hero-card-label">15+ Channels</div>
              <div className="hero-card-value">WhatsApp, Slack, Email...</div>
            </div>

            <div className="hero-card oc-card oc-card-r">
              <div className="hero-card-icon oc-icon-deep">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="9" r="7" />
                  <path d="M9 6v3l2 2" />
                </svg>
              </div>
              <div className="hero-card-label">100+ Skills</div>
              <div className="hero-card-value">Ready to configure</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
