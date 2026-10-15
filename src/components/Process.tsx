import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { FadeUp, RevealText, spring } from './motion'

const steps = [
  {
    num: 1,
    title: 'Discovery',
    description: 'We learn how your business runs and find the tasks worth handing to AI.',
  },
  {
    num: 2,
    title: 'Design',
    description: 'We build agents around your exact process and the tools you already use.',
  },
  {
    num: 3,
    title: 'Deploy',
    description: 'Your agents go live, with a person approving anything important.',
  },
  {
    num: 4,
    title: 'Optimize',
    description: 'We track how they perform and keep improving them over time.',
  },
]

export default function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section className="process" id="process">
      <div className="wrap">
        <div className="section-head">
          <RevealText text="Up and running in weeks, not months." />
          <FadeUp delay={0.1}>
            <p>Four steps, and you stay in control the whole way.</p>
          </FadeUp>
        </div>
        <div className="timeline" ref={ref}>
          <div className="timeline-track" aria-hidden="true">
            <motion.div className="timeline-fill" style={{ scaleX: fill }} />
          </div>
          <ol className="timeline-steps">
            {steps.map((s, i) => (
              <motion.li
                key={s.num}
                className="timeline-step"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ ...spring, duration: 0.8, delay: i * 0.12 }}
              >
                <span className="timeline-dot" aria-hidden="true" />
                <span className="timeline-num">0{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
