import { useScrollReveal } from '../hooks/useScrollReveal'

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const founders = [
  {
    initials: 'DB',
    photo: '/headshots/danial.JPG',
    photoStyle: { objectPosition: 'center 25%', transform: 'scale(1.3)' } as React.CSSProperties,
    name: 'Danial Beg',
    title: 'Co-Founder',
    bio: 'ML engineer with experience at Latham & Watkins and a background in machine learning from UC Irvine. Certified in RAG architectures and AI agent systems, he brings hands-on expertise in building production-grade intelligent systems.',
    tags: ['ML Engineering', 'RAG Systems', 'AI Agents'],
    linkedin: 'https://www.linkedin.com/in/danialbeg/',
    website: 'https://danialbeg.com/',
    delay: '',
  },
  {
    initials: 'ZQ',
    photo: '/headshots/zubair.png',
    photoStyle: { objectPosition: 'center 0%' } as React.CSSProperties,
    name: 'Zubair Qazi',
    title: 'Co-Founder',
    bio: 'AI researcher and PhD student at the University of Michigan AI Lab, focused on graph-based machine learning, large language models, and AI agents. Previously an ML engineer at Scripps Research, he brings deep research expertise to production AI systems.',
    tags: ['PhD — AI Research', 'LLMs', 'AI Agents'],
    linkedin: 'https://www.linkedin.com/in/zubair-qazi/',
    website: 'https://zubairqazi.com/',
    delay: 'reveal-delay-1',
  },
  {
    initials: 'WZ',
    photo: '/headshots/wasay.jpg',
    photoStyle: {} as React.CSSProperties,
    name: 'Wasay Zaman',
    title: 'Co-Founder',
    bio: 'Former IT software developer at Qualcomm, where he architected and deployed internal AI solutions for complex corporate workflows. Also a VC Fellow with Sunset Ventures and Emerging LA, he combines technical execution with venture-scale strategy.',
    tags: ['AI Solutions', 'Enterprise', 'VC Strategy'],
    linkedin: 'https://www.linkedin.com/in/wasayzaman/',
    website: '',
    delay: 'reveal-delay-2',
  },
]

export default function About() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about-inner">
        <div className="about-header">
          <div className="section-label reveal">Who we are</div>
          <h2
            className="section-heading reveal reveal-delay-1"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            Built by engineers who ship AI in production
          </h2>
          <p className="section-subtext reveal reveal-delay-2">
            WDZ Solutions was founded by three engineers with deep roots in
            machine learning research, enterprise software, and applied AI — the
            people behind the agents know what it takes to make them work at
            scale.
          </p>
        </div>

        <div className="founders-grid">
          {founders.map((f) => (
            <div key={f.name} className={`founder-card reveal ${f.delay}`}>
              <div className="founder-photo">
                {f.photo ? (
                  <img src={f.photo} alt={f.name} style={f.photoStyle} />
                ) : (
                  <span className="initials">{f.initials}</span>
                )}
              </div>
              <div className="founder-name">{f.name}</div>
              <div className="founder-title">{f.title}</div>
              <p className="founder-bio">{f.bio}</p>
              <div className="founder-tags">
                {f.tags.map((tag) => (
                  <span key={tag} className="founder-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="founder-links">
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-linkedin"
                >
                  <LinkedInIcon />
                  LinkedIn
                </a>
                {f.website && (
                  <a
                    href={f.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="founder-linkedin"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                    </svg>
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
