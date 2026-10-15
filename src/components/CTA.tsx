import { FadeUp, Magnetic, RevealText } from './motion'

interface CTAProps {
  onOpenModal: () => void
}

export default function CTA({ onOpenModal }: CTAProps) {
  return (
    <section className="cta">
      <div className="wrap cta-inner">
        <RevealText text="Ready to hand off the busywork?" />
        <FadeUp delay={0.15}>
          <p>We take on a limited number of businesses at a time. On a free 30-minute call, we’ll show you what we could take off your plate first.</p>
        </FadeUp>
        <FadeUp delay={0.25}>
          <Magnetic>
            <button className="btn btn-light btn-large" onClick={onOpenModal}>
              Book a free call
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </Magnetic>
        </FadeUp>
      </div>
    </section>
  )
}
