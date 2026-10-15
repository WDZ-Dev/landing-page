import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Snap from 'lenis/snap'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { textZones } from './textZones'
import { Magnetic, spring } from './motion'
import { ORBITS } from './orbits'
import { getLenis, scrollToY, setScrollGate } from '../smooth'

const OrbitScene = lazy(() => import('./three/OrbitScene'))

// scroll ranges for each beat of the story: opening, three orbits, finale
// stages: 0 the mess, 1 WDZ organizes it, 2-4 the three orbits, 5 the finale
const BEATS = [0.16, 0.36, 0.52, 0.68, 0.84]
const LAST = BEATS.length
const stageFor = (p: number) => BEATS.filter((b) => p >= b).length
// resting point for each stage, halfway between its boundaries
const stageCenter = (s: number) => (s === 0 ? 0 : (BEATS[s - 1] + (BEATS[s] ?? 1)) / 2)
const HYSTERESIS = 0.02
// the busywork-to-agents handover gets a slow glide so the caption and tick-offs can be read
const HANDOVER_SECONDS = 3.2
const STAGE_LABELS = ['The busywork', 'Meet the agents', ...ORBITS.map((o) => o.name), 'Your AI team']

/* The opening copy is scrubbed by scroll in step with the animation:
   the problem fades as tasks get ticked off, a caption carries the handover, the promise lands with the logo. */
function IntroCopy({ org, firstLoad, onOpenModal, jump }: { org: MotionValue<number>; firstLoad: boolean; onOpenModal: () => void; jump: (s: number) => void }) {
  const messOpacity = useTransform(org, [0, 0.14], [1, 0])
  const messY = useTransform(org, [0, 0.16], [0, -50])
  const messEvents = useTransform(org, (v) => (v < 0.1 ? 'auto' : 'none'))
  const capOpacity = useTransform(org, [0.1, 0.18, 0.8, 0.88], [0, 1, 1, 0])
  const capScale = useTransform(org, [0.1, 0.88], [0.96, 1.03])
  const promiseOpacity = useTransform(org, [0.86, 0.98], [0, 1])
  const promiseY = useTransform(org, [0.86, 0.99], [40, 0])
  const promiseEvents = useTransform(org, (v) => (v > 0.85 ? 'auto' : 'none'))
  const messRef = useRef<HTMLDivElement>(null)

  // publish where the headline, subtext and buttons sit so the cards can keep clear of them
  useEffect(() => {
    const el = messRef.current
    if (!el) return
    const measure = () => {
      const dots = document.querySelector('.story-dots')
      const extra = [dots, document.querySelector('.story-next')].filter((n): n is Element => !!n)
      textZones.rects = [...el.querySelectorAll('.pill, h1, .hero-sub, .hero-actions'), ...extra].map((n) => n.getBoundingClientRect())
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const t = setTimeout(measure, 1600)
    return () => { ro.disconnect(); clearTimeout(t); textZones.rects = [] }
  }, [])

  return (
    <>
      <motion.div ref={messRef} className="story-copy story-open wrap" style={{ opacity: messOpacity, y: messY, pointerEvents: messEvents }}>
        <motion.div className="intro-stack" initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ ...spring, delay: firstLoad ? 0.6 : 0 }}>
          <div className="pill"><span className="pill-dot" /> Few more client spots available</div>
          <h1>Drowning in busywork?</h1>
          <p className="hero-sub">Emails, invoices, scheduling, paperwork. The small tasks that quietly eat your week.</p>
          <div className="hero-actions">
            <Magnetic><button className="btn btn-light" onClick={onOpenModal}>Book a free call <Arrow /></button></Magnetic>
            <button className="btn btn-glass" onClick={() => jump(1)}>See WDZ sort it out</button>
          </div>
        </motion.div>
      </motion.div>
      <motion.div className="story-copy story-caption wrap" style={{ opacity: capOpacity, scale: capScale }} aria-hidden="true">
        <p>WDZ hands each task to an AI agent.</p>
      </motion.div>
      <motion.div className="story-copy story-open wrap" style={{ opacity: promiseOpacity, y: promiseY, pointerEvents: promiseEvents }}>
        <h1>AI that saves you time and money.</h1>
        <p className="hero-sub">A team of AI agents, each built for one kind of work, running inside the tools you already use. No setup headaches and no technical knowledge required.</p>
        <div className="hero-actions">
          <Magnetic><button className="btn btn-light" onClick={onOpenModal}>Book a free call <Arrow /></button></Magnetic>
          <button className="btn btn-glass" onClick={() => jump(2)}>See how it works</button>
        </div>
      </motion.div>
    </>
  )
}

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

const enter = { initial: { opacity: 0, y: 24, filter: 'blur(8px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: -16, filter: 'blur(8px)', transition: { duration: 0.25 } } }

export default function OrbitStory({ onOpenModal }: { onOpenModal: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const progress = useRef(0)
  // 0 = chaos, 1 = organized; scrubbed by the first scroll
  const organize = useRef(0)
  const [stage, setStage] = useState(0)
  const reduce = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // the same 0 to 1 organize value the 3D scene uses, so the copy moves in lockstep with it
  const orgMV = useTransform(scrollYProgress, [0, stageCenter(1)], [0, 1], { clamp: true })

  const stageRef = useRef(0)
  // the headline waits for the core to form on first load only
  const firstLoad = useRef(true)
  useEffect(() => { const t = setTimeout(() => { firstLoad.current = false }, 2600); return () => clearTimeout(t) }, [])
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    progress.current = p
    organize.current = Math.min(1, p / stageCenter(1))
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
    let lockedUntil = 0
    let lastEvent = 0
    let lastMag = 0
    setScrollGate((deltaY) => {
      const el = ref.current
      if (!el || Math.abs(deltaY) < 1) return true
      // ignore tiny accidental trackpad nudges inside the story
      if (Math.abs(deltaY) < 4) return false
      const travel = el.offsetHeight - window.innerHeight
      const stageY = (s: number) => el.offsetTop + stageCenter(s) * travel
      const y = window.scrollY
      if (y < el.offsetTop - 4 || y > stageY(LAST) + 4) return true
      const dir = deltaY > 0 ? 1 : -1
      let nearest = 0
      for (let s = 1; s <= LAST; s++) if (Math.abs(stageY(s) - y) < Math.abs(stageY(nearest) - y)) nearest = s
      if (dir > 0 && nearest === LAST && y >= stageY(LAST) - 4) return true // past the finale: scroll on normally
      if (dir < 0 && nearest === 0 && y <= el.offsetTop + 4) return true // above the story: scroll on normally
      const now = performance.now()
      const mag = Math.abs(deltaY)
      // a new gesture = wheel was quiet for a moment, or the deltas grow again (not a decaying momentum tail)
      const fresh = now - lastEvent > 400 || (now - lastEvent > 150 && mag > lastMag * 1.6)
      lastEvent = now
      lastMag = mag
      if (lockedAt && (now < lockedUntil || !fresh)) return false
      lockedAt = now
      const next = Math.max(0, Math.min(LAST, nearest + dir))
      const seconds = Math.min(nearest, next) === 0 ? HANDOVER_SECONDS : 0.9
      // stay locked for most of the glide, so the next flick can't cut the handover short
      lockedUntil = now + Math.max(750, seconds * 850)
      scrollToY(stageY(next), false, seconds)
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
      for (let s = 0; s <= LAST; s++) snap.add(el.offsetTop + stageCenter(s) * travel)
    }
    build()
    window.addEventListener('resize', build)
    return () => { window.removeEventListener('resize', build); snap?.destroy() }
  }, [])

  const focus = stage >= 2 && stage <= 4 ? stage - 2 : -1
  const leave = () => {
    const el = ref.current
    if (el) scrollToY(el.offsetTop + el.offsetHeight)
  }

  // keyboard: arrows, Page keys and Space step through the stages while the story is on screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = ref.current
      if (!el || (e.target as HTMLElement)?.closest('input, textarea, select, [contenteditable]')) return
      const y = window.scrollY
      const travel = el.offsetHeight - window.innerHeight
      if (y < el.offsetTop - 4 || y > el.offsetTop + stageCenter(LAST) * travel + 4) return
      const down = ['ArrowDown', 'PageDown', ' '].includes(e.key) && !e.shiftKey
      const up = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)
      const cur = stageRef.current
      if (down && cur < LAST) { e.preventDefault(); jump(cur + 1) }
      else if (up && cur > 0) { e.preventDefault(); jump(cur - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const jump = (s: number) => {
    const el = ref.current
    if (!el) return
    const p = stageCenter(s)
    const slow = Math.min(stageRef.current, s) === 0 && Math.max(stageRef.current, s) >= 1
    scrollToY(el.offsetTop + p * (el.offsetHeight - window.innerHeight), false, slow ? HANDOVER_SECONDS : 0.9)
  }

  return (
    <section className="story" ref={ref} id="top">
      <div className="story-sticky">
        <div className="hero-glow" aria-hidden="true" />
        {/* soft pulse where the core will form, while the 3D code loads */}
        <Suspense fallback={<div className="scene-loader" aria-hidden="true"><span /></div>}>
          <OrbitScene progress={progress} organize={organize} focus={focus} names={stage === 1 || stage === LAST} still={reduce} />
        </Suspense>

        <AnimatePresence>
          {stage <= 1 && (
            <motion.div key="intro" className="story-copy" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
              <IntroCopy org={orgMV} firstLoad={firstLoad.current} onOpenModal={onOpenModal} jump={jump} />
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
          {stage === LAST && (
            <motion.div key="finale" className="story-copy story-finale wrap" {...enter} transition={spring}>
              <h2>Your AI agents, built around your business.</h2>
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

        {/* an explicit way through the story for anyone who'd rather click than scroll */}
        <motion.button
          className="story-next"
          onClick={() => (stage < LAST ? jump(stage + 1) : leave())}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { ...spring, delay: firstLoad.current ? 1.4 : 0 } }}
        >
          <span>{stage < LAST ? `Next: ${STAGE_LABELS[stage + 1]}` : 'Continue'}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.button>
        <div className="story-dots" role="group" aria-label="Story sections">
          {STAGE_LABELS.map((label, i) => (
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
