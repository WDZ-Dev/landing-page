import { useRef, type ReactNode, type CSSProperties, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'

// Apple-style springs: critically damped by default, a touch of bounce only after momentum
export const spring = { type: 'spring', bounce: 0, duration: 0.6 } as const
export const springSoft = { type: 'spring', bounce: 0.15, duration: 0.8 } as const

/* Words rise out of a blur, staggered (in the spirit of reactbits BlurText) */
export function RevealText({ text, as = 'h2', className, delay = 0 }: { text: string; as?: 'h1' | 'h2' | 'p'; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  const words = text.split(' ')
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ staggerChildren: reduce ? 0 : 0.06, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="word"
          variants={{
            hidden: reduce ? { opacity: 0 } : { opacity: 0, y: '0.35em', filter: 'blur(10px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { ...spring, duration: 0.9 } },
          }}
        >
          {w}{i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}

export function FadeUp({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ ...spring, duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  )
}

/* Pulls gently toward the pointer, springs home on leave */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useSpring(0, { stiffness: 200, damping: 24 })
  const y = useSpring(0, { stiffness: 200, damping: 24 })
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  return (
    <motion.span ref={ref} className="magnetic" style={{ x, y }} onPointerMove={onMove} onPointerLeave={() => { x.set(0); y.set(0) }}>
      {children}
    </motion.span>
  )
}

/* 3D tilt toward the pointer plus a spotlight that follows it.
   Springs are critically damped (Apple default) so the card settles without wobble;
   the spotlight moves by transform so no styles recalculate inside the card. */
const tiltSpring = { stiffness: 170, damping: 26, mass: 1 }

export function TiltCard({ children, className = '', max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const gx = useMotionValue(0)
  const gy = useMotionValue(0)
  const rect = useRef<DOMRect | null>(null)
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), tiltSpring)
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), tiltSpring)
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    // measure once per hover, not on every move
    const r = rect.current ?? (rect.current = e.currentTarget.getBoundingClientRect())
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
    gx.set(e.clientX - r.left)
    gy.set(e.clientY - r.top)
  }
  return (
    <motion.div
      className={`tilt ${className}`}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
      onPointerMove={onMove}
      onPointerEnter={() => { rect.current = null }}
      onPointerLeave={() => { px.set(0.5); py.set(0.5); rect.current = null }}
    >
      {children}
      {!reduce && <span className="tilt-glow-clip" aria-hidden="true"><motion.span className="tilt-glow" style={{ x: gx, y: gy }} /></span>}
    </motion.div>
  )
}
