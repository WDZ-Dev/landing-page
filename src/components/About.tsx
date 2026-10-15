import { FadeUp, RevealText, TiltCard } from './motion'

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
    bio: 'ML engineer with experience at Latham & Watkins, certified in RAG architectures and AI agent systems.',
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
    bio: 'AI researcher and PhD student at the University of Michigan AI Lab, previously an ML engineer at Scripps Research.',
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
    bio: 'Former Qualcomm developer who deployed internal AI for corporate workflows, and a VC Fellow with Sunset Ventures and Emerging LA.',
    tags: ['AI Solutions', 'Enterprise', 'VC Strategy'],
    linkedin: 'https://www.linkedin.com/in/wasayzaman/',
    website: '',
    delay: 'reveal-delay-2',
  },
]

export default function About() {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="section-head">
          <RevealText text="Meet the people who build your agents." />
          <FadeUp delay={0.1}>
            <p>WDZ Solutions was founded by three engineers with backgrounds in AI research, enterprise software, and applied machine learning.</p>
          </FadeUp>
        </div>
        <div className="founders">
          {founders.map((f, i) => (
            <FadeUp key={f.name} delay={i * 0.08}>
              <TiltCard className="founder" max={6}>
                <div className="founder-photo">
                  <img src={f.photo} alt={f.name} style={f.photoStyle} loading="lazy" />
                </div>
                <div className="founder-body">
                  <h3>{f.name}</h3>
                  <span className="founder-role">{f.title}</span>
                  <p>{f.bio}</p>
                  <div className="founder-links">
                    <a href={f.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon /> LinkedIn</a>
                    {f.website && (
                      <a href={f.website} target="_blank" rel="noopener noreferrer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
