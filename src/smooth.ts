import Lenis from 'lenis'

// One shared inertial scroller; null when the visitor prefers reduced motion
let lenis: Lenis | null = null
// a section can claim wheel input (return false to swallow it); used by the story stepper
let gate: ((deltaY: number, event: WheelEvent | TouchEvent) => boolean) | null = null
export const setScrollGate = (g: typeof gate) => { gate = g }

export function initSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    anchors: { offset: -80 },
    virtualScroll: ({ deltaY, event }) => {
      if (!gate || event.type !== 'wheel') return true
      const pass = gate(deltaY, event)
      // a swallowed event must also stop the browser's own scroll
      if (!pass && event.cancelable) event.preventDefault()
      return pass
    },
  })
}

export function scrollToY(y: number, immediate = false) {
  if (lenis) lenis.scrollTo(y, { immediate, duration: 1.2 })
  else window.scrollTo({ top: y, behavior: immediate ? 'instant' : 'smooth' })
}

export function scrollToEl(el: HTMLElement | null) {
  if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 80)
}

export const getLenis = () => lenis
export const pauseScroll = () => lenis?.stop()
export const resumeScroll = () => lenis?.start()
