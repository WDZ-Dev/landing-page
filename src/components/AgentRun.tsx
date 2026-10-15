import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { AGENT_TASKS, type AgentTask } from './agentTasks'
import { ICONS } from './icons'
import { spring } from './motion'

const STEP_MS = 1100
const HOLD_MS = 2600

interface AgentRunProps {
  iconKey: string
  title?: string
  task?: AgentTask
  size?: 'sm' | 'lg'
  /** stagger so a grid of cards doesn't run in lockstep */
  offset?: number
  /** fires each time a run completes (used by the console to advance) */
  onDone?: () => void
  loop?: boolean
}

function StepMark({ state }: { state: 'todo' | 'active' | 'done' }) {
  return (
    <span className={`run-mark run-mark-${state}`} aria-hidden="true">
      {state === 'done' && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <motion.path d="M2.5 6.5l2.2 2.2 4.8-5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }} />
        </svg>
      )}
    </span>
  )
}

/* One generic agent window: steps stream in, a status pill morphs, the result lands. */
export default function AgentRun({ iconKey, title, task, size = 'sm', offset = 0, onDone, loop = true }: AgentRunProps) {
  const t = task ?? AGENT_TASKS[iconKey] ?? AGENT_TASKS.document
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.45 })
  const reduce = useReducedMotion()
  const [done, setDone] = useState(reduce ? t.steps.length : -1)
  const total = t.steps.length

  useEffect(() => { setDone(reduce ? total : -1) }, [iconKey, task, reduce, total])

  useEffect(() => {
    if (reduce || !inView) return
    const delay = done === -1 ? 500 + offset : done < total ? STEP_MS : HOLD_MS
    const id = setTimeout(() => {
      if (done < total) setDone(done + 1)
      else { onDone?.(); if (loop) setDone(-1) }
    }, delay)
    return () => clearTimeout(id)
  }, [done, inView, reduce, total, offset, loop, onDone])

  const status = done < 0 ? 'Waiting' : done < total ? 'Working' : 'Done'

  return (
    <div ref={ref} className={`run run-${size}`} data-status={status.toLowerCase()}>
      <div className="run-head">
        <span className="run-app">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={ICONS[iconKey] || ICONS.check} />
          </svg>
        </span>
        <span className="run-title">
          <strong>{title ?? t.app}</strong>
          <small>Sample run</small>
        </span>
        <motion.span layout className="run-status" transition={spring}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.25 }}
              className="run-status-inner"
            >
              <span className="run-status-dot" />{status}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </div>
      <ol className="run-steps">
        {t.steps.map((step, i) => {
          const state = i < done ? 'done' : i === done && done < total ? 'active' : 'todo'
          return (
            <li key={step} className={`run-step run-step-${state}`}>
              <StepMark state={state} />
              <span className="run-step-text">{step}</span>
            </li>
          )
        })}
      </ol>
      <AnimatePresence>
        {done >= total && (
          <motion.div
            className="run-result"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          >
            <span>Result</span>
            <strong>{t.result}</strong>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
