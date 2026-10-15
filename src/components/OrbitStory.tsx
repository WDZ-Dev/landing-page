import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Snap from 'lenis/snap'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { Magnetic, spring } from './motion'
import { ORBITS } from './orbits'
import { getLenis, scrollToY, setScrollGate } from '../smooth'

const OrbitScene = lazy(() => import('./three/OrbitScene'))

// scroll ranges for each beat of the story: opening, three orbits, finale
const BEATS = [0.14, 0.36, 0.58, 0.8]
const stageFor = (p: number) => BEATS.filter((b) => p >= b).length // 0..4
// resting point for each stage, halfway between its boundaries
const stageCenter = (s: number) => (s === 0 ? 0 : (BEATS[s - 1] + (BEATS[s] ?? 1)) / 2)
const HYSTERESIS = 0.02

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

const enter = { initial: { opacity: 0, y: 24, filter: 'blur(8px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: -16, filter: 'blur(8px)', transition: { duration: 0.25 } } }

export default function OrbitStory({ onOpenModal }: { onOpenModal: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [stage, setStage] = useState(0)
  const reduce = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const stageRef = useRef(0)
  // the headline waits for the core to form on first load only
  const firstLoad = useRef(true)
  useEffect(() => { const t = setTimeout(() => { firstLoad.current = false }, 2000); return () => clearTimeout(t) }, [])
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    progress.current = p
    const cur = stageRef.current
    const s = stageFor(p)
    // require a small margin past a boundary so the story never flickers between stages
    if (s > cur && p < BEATS[s - 1] + HYSTERESIS) return
    if (s < cur && p > BEATS[cur - 1] - HYSTERESIS) return
    if (s !== cur) { stageRef.current = s; setStage(s) }
  })

  // desktop: one wheel/trackpad gesture moves exactly one stage, so fast flicks can't skip an orbit.
  // trailing momentum events from the same gesture are swallowed until the wheel goes quiet.
  useEffect(() => {
    let lockedAt = 0
    let lastEvent = 0
    let lastMag = 0
    setScrollGate((deltaY) => {
      const el = ref.current
      if (!el || Math.abs(deltaY) < 1) return true
      const travel = el.offsetHeight - window.innerHeight
      const stageY = (s: number) => el.offsetTop + stageCenter(s) * travel
      const y = window.scrollY
      if (y < el.offsetTop - 4 || y > stageY(4) + 4) return true
      const dir = deltaY > 0 ? 1 : -1
      let nearest = 0
      for (let s = 1; s <= 4; s++) if (Math.abs(stageY(s) - y) < Math.abs(stageY(nearest) - y)) nearest = s
      if (dir > 0 && nearest === 4 && y >= stageY(4) - 4) return true // past the finale: scroll on normally
      if (dir < 0 && nearest === 0 && y <= el.offsetTop + 4) return true // above the story: scroll on normally
      const now = performance.now()
      const mag = Math.abs(deltaY)
      // a new gesture = wheel was quiet for a moment, or the deltas grow again (not a decaying momentum tail)
      const fresh = now - lastEvent > 400 || (now - lastEvent > 150 && mag > lastMag * 1.6)
      lastEvent = now
      lastMag = mag
      if (lockedAt && (now - lockedAt < 1000 || !fresh)) return false
      lockedAt = now
      scrollToY(stageY(Math.max(0, Math.min(4, nearest + dir))))
      return false
    })
    return () => setScrollGate(null)
  }, [])

  // when scrolling stops inside the story, settle on the nearest stage (one flick, one stage)
  useEffect(() => {
    const lenis = getLenis()
    const el = ref.current
    if (!lenis || !el) return
    let snap: Snap | null = null
    const build = () => {
      snap?.destroy()
      snap = new Snap(lenis, { type: 'proximity', distanceThreshold: '35%', duration: 0.9, debounce: 140 })
      const travel = el.offsetHeight - window.innerHeight
      for (let s = 0; s <= 4; s++) snap.add(el.offsetTop + stageCenter(s) * travel)
    }
    build()
    window.addEventListener('resize', build)
    return () => { window.removeEventListener('resize', build); snap?.destroy() }
  }, [])

  const focus = stage >= 1 && stage <= 3 ? stage - 1 : -1
  const jump = (s: number) => {
    const el = ref.current
    if (!el) return
    const p = stageCenter(s)
    scrollToY(el.offsetTop + p * (el.offsetHeight - window.innerHeight))
  }

  return (
    <section className="story" ref={ref} id="top">
      <div className="story-sticky">
        <div className="hero-glow" aria-hidden="true" />
        {/* soft pulse where the core will form, while the 3D code loads */}
        <Suspense fallback={<div className="scene-loader" aria-hidden="true"><span /></div>}>
          <OrbitScene progress={progress} focus={focus} still={reduce} />
        </Suspense>

        <AnimatePresence>
          {stage === 0 && (
            <motion.div key="open" className="story-copy story-open wrap" {...enter} transition={{ ...spring, delay: firstLoad.current ? 0.9 : 0 }}>
              <div className="pill"><span className="pill-dot" /> Few more client spots available</div>
              <h1>AI that saves you time and money.</h1>
              <p className="hero-sub">Our AI agents plug into the systems you already use. No setup headaches, no learning curve, and no technical knowledge required.</p>
              <div className="hero-actions">
                <Magnetic><button className="btn btn-light" onClick={onOpenModal}>Book a free call <Arrow /></button></Magnetic>
                <button className="btn btn-glass" onClick={() => jump(1)}>See how it works</button>
              </div>
            </motion.div>
          )}
          {focus >= 0 && (
            <motion.div key={ORBITS[focus].key} className="story-copy story-orbit wrap" {...enter} transition={spring}>
              <div className="story-panel">
                <span className="story-kicker" style={{ color: ORBITS[focus].color }}>
                  <span className="story-kicker-dot" style={{ background: ORBITS[focus].color }} />
                  {ORBITS[focus].name}
                </span>
                <h2>{ORBITS[focus].headline}</h2>
                <p>{ORBITS[focus].body}</p>
                <p className="story-tools"><span>Works with tools like</span> {ORBITS[focus].tools.join(' · ')}</p>
              </div>
            </motion.div>
          )}
          {stage === 4 && (
            <motion.div key="finale" className="story-copy story-finale wrap" {...enter} transition={spring}>
              <h2>One AI team, built around your business.</h2>
              <ul className="story-promises">
                <li>Done for you, start to finish</li>
                <li>No technical knowledge needed</li>
                <li>You approve anything important</li>
              </ul>
              <div className="hero-actions">
                <Link to="/demos" className="btn btn-light">See demos by industry <Arrow /></Link>
                <button className="btn btn-glass" onClick={onOpenModal}>Book a free call</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === 0 && (
            <motion.div className="story-hint" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.2 } }} exit={{ opacity: 0 }}>
              Scroll to explore<span />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="story-dots" role="group" aria-label="Story sections">
          {['Overview', ...ORBITS.map((o) => o.name), 'Your AI team'].map((label, i) => (
            <button key={label} className="story-dot" aria-current={stage === i} onClick={() => jump(i)}>
              <span className="story-dot-label">{label}</span>
              <span className="story-dot-mark" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
