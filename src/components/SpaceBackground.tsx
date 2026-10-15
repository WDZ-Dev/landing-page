import { useMemo } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

// a field of tiny stars drawn once into an SVG tile
function starTile(count: number, size: number, maxR: number, seed: number) {
  let x = seed
  const rand = () => ((x = (x * 9301 + 49297) % 233280) / 233280)
  const dots = Array.from({ length: count }, () =>
    `<circle cx="${(rand() * size).toFixed(1)}" cy="${(rand() * size).toFixed(1)}" r="${(0.4 + rand() * maxR).toFixed(2)}" fill="#cdeee3" fill-opacity="${(0.25 + rand() * 0.55).toFixed(2)}"/>`).join('')
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${dots}</svg>`)}")`
}

/* The hero's space continues behind every page: fixed stars at two depths plus soft glows.
   Moves by transform only, with a gentle parallax as you scroll. */
export default function SpaceBackground() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const far = useTransform(scrollY, (v) => (reduce ? 0 : -v * 0.03))
  const near = useTransform(scrollY, (v) => (reduce ? 0 : -v * 0.08))
  const tiles = useMemo(() => ({ far: starTile(70, 600, 0.6, 7), near: starTile(26, 700, 1.1, 42) }), [])
  return (
    <div className="space" aria-hidden="true">
      <div className="space-glow" />
      <motion.div className="space-stars" style={{ y: far, backgroundImage: tiles.far }} />
      <motion.div className="space-stars near" style={{ y: near, backgroundImage: tiles.near }} />
    </div>
  )
}
