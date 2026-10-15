import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Html, Lightformer, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { ORBITS } from '../orbits'
import { ICONS } from '../icons'
import { textZones } from '../textZones'

interface SceneProps {
  /** 0..1 scroll progress through the story */
  progress: React.MutableRefObject<number>
  /** 0 = scattered busywork, 1 = organized by WDZ; scrubbed by scroll */
  organize: React.MutableRefObject<number>
  /** -1 = wide shot, otherwise the orbit being zoomed into */
  focus: number
  /** show each planet's agent name (the wide shots after things are organized) */
  names: boolean
  still: boolean
}

// chip glyphs: an arrow for what arrives, a spinner-ish arc for the agent at work, a check when done
function Glyph({ kind }: { kind: 'in' | 'work' | 'done' }) {
  const d = kind === 'in' ? 'M7 2v7M3.5 6l3.5 3.5L10.5 6M2.5 12h9' : kind === 'work' ? 'M7 2a5 5 0 1 1-5 5' : 'M2.5 7.5l3 3 6-7'
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()

// intro timeline helpers: progress of a sub-range, and a soft overshoot for the core forming
const seg = (t: number, a: number, b: number) => THREE.MathUtils.clamp((t - a) / (b - a), 0, 1)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2)
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/* The real WDZ wordmark, keyed out of /logo.png (white letters on green) into a transparent texture */
function useLogoTexture() {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null)
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = 1024; c.height = 380
      const ctx = c.getContext('2d')!
      ctx.drawImage(img, 50, 270, 690, 256, 0, 0, c.width, c.height)
      const data = ctx.getImageData(0, 0, c.width, c.height)
      const px = data.data
      for (let i = 0; i < px.length; i += 4) {
        const lum = (px[i] + px[i + 1] + px[i + 2]) / 3
        px[i + 3] = THREE.MathUtils.clamp((lum - 100) / 110, 0, 1) * 255
        px[i] = 240; px[i + 1] = 252; px[i + 2] = 247
      }
      ctx.putImageData(data, 0, 0)
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
      setTex(t)
    }
    img.src = '/logo.png'
  }, [])
  return tex
}

/* Draws the orbit's symbol into a texture so it lives on the GPU, faces the camera, and is hidden behind the core like any object */
function useIconTexture(iconKey: string, color: string) {
  return useMemo(() => {
    const size = 256
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    // symbol only; the sphere underneath carries the colour
    ctx.save()
    ctx.translate(size * 0.25, size * 0.25)
    ctx.scale(size / 48, size / 48)
    ctx.strokeStyle = '#f2fff9'; ctx.lineWidth = 1.9; ctx.shadowColor = color; ctx.shadowBlur = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.stroke(new Path2D(ICONS[iconKey]))
    ctx.restore()
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  }, [iconKey, color])
}

function Orbit({ index, focus, planetRefs, portal, narrow, intro, names }: {
  names: boolean
  intro: React.MutableRefObject<number>
  narrow: boolean
  index: number
  focus: number
  planetRefs: React.MutableRefObject<(THREE.Object3D | null)[]>
  portal: React.MutableRefObject<HTMLElement>
}) {
  const o = ORBITS[index]
  const carrier = useRef<THREE.Group>(null)
  const ring = useRef<THREE.MeshBasicMaterial>(null)
  const ringMesh = useRef<THREE.Mesh>(null)
  const badge = useRef<THREE.Mesh>(null)
  const symbol = useRef<THREE.Sprite>(null)
  const halo = useRef<THREE.Mesh>(null)
  const planet = useRef<THREE.Group>(null)
  const tint = useMemo(() => new THREE.Color(o.color).multiplyScalar(0.55), [o.color])
  const icon = useIconTexture(o.icon, o.color)
  const focused = focus === index
  const dimmed = focus >= 0 && !focused

  useFrame(({ clock, camera }, delta) => {
    // planets drift slowly; the focused one nearly holds still so the camera can settle on it
    const speed = focused ? 0.02 : o.speed
    if (carrier.current) carrier.current.rotation.z += delta * speed
    // as WDZ organizes things, each ring draws in, then its planet appears
    const org = intro.current
    const ringIn = easeOut(seg(org, 0.5 + index * 0.08, 0.82 + index * 0.06))
    const badgeIn = easeOutBack(seg(org, 0.68 + index * 0.07, 0.9 + index * 0.05))
    if (ringMesh.current) ringMesh.current.scale.setScalar(0.6 + 0.4 * ringIn)
    if (ring.current) ring.current.opacity = THREE.MathUtils.damp(ring.current.opacity, (focused ? 0.5 : dimmed ? 0.1 : 0.28) * ringIn, 4, delta)
    // gentle breathing; the focused badge grows so it reads as the subject
    if (halo.current) halo.current.scale.setScalar(THREE.MathUtils.damp(halo.current.scale.x, (focused ? 2.6 : 1.9) * badgeIn, 6, delta))
    if (badge.current) {
      const sc = THREE.MathUtils.damp(badge.current.scale.x, ((focused ? 1.25 : 1) + Math.sin(clock.elapsedTime * 2 + index) * 0.03) * badgeIn, 8, delta)
      badge.current.scale.setScalar(sc)
      // the symbol sits on the sphere's camera-facing side so it is never swallowed by the ball
      if (symbol.current && planet.current) {
        planet.current.getWorldPosition(tmp2)
        tmp2.addScaledVector(camera.position.clone().sub(tmp2).normalize(), 0.21 * sc)
        symbol.current.position.copy(planet.current.worldToLocal(tmp2))
        symbol.current.scale.setScalar(0.2 * sc)
      }
    }
  })

  return (
    <group rotation={o.tilt}>
      <mesh ref={ringMesh}>
        <torusGeometry args={[o.radius, focused ? 0.012 : 0.007, 8, 200]} />
        <meshBasicMaterial ref={ring} color={o.color} transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <group ref={carrier} rotation={[0, 0, o.angle]}>
        <group position={[o.radius, 0, 0]} ref={(el) => { planetRefs.current[index] = el; planet.current = el }}>
          {/* a glossy little planet in its orbit's colour, with its symbol on the front */}
          {/* drawn after the emblem (which writes no depth) so planets always sit on top of the logo */}
          <mesh ref={badge} scale={0} renderOrder={4}>
            <sphereGeometry args={[0.2, 48, 48]} />
            <meshPhysicalMaterial transparent opacity={1} color={tint} emissive={o.color} emissiveIntensity={0.28} roughness={0.22} metalness={0.25} clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={1.3} />
          </mesh>
          <sprite ref={symbol} scale={0.2} renderOrder={5}>
            <spriteMaterial map={icon} transparent depthWrite={false} toneMapped={false} />
          </sprite>
          <mesh ref={halo} scale={0}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshBasicMaterial color={o.color} transparent opacity={0.07} depthWrite={false} />
          </mesh>
          {names && (
            <Html portal={portal} zIndexRange={[8, 0]} pointerEvents="none">
              <div className="planet-name"><i style={{ background: o.color }} />{o.name}</div>
            </Html>
          )}
          {/* task chips: one screen-space stack beside the planet, surfacing only when zoomed in */}
          {focused && <Html portal={portal} zIndexRange={[10, 0]} pointerEvents="none" wrapperClass="chip-anchor">
            <div className={`chip-stack${narrow ? ' below' : ''}`}>
              {o.tasks.map((task, i) => (
                <div key={task.label} className={`scene-chip chip-${task.kind}`} style={{ animationDelay: `${300 + i * 380}ms` }}>
                  <span className="scene-chip-check" style={{ color: o.color }}><Glyph kind={task.kind} /></span>
                  <span><strong>{task.label}</strong><small>{task.detail}</small></span>
                </div>
              ))}
            </div>
          </Html>}
        </group>
      </group>
    </group>
  )
}

// a few of the scattered dots are labelled, so it is obvious they are your tasks
const MESS = [
  { text: '41 unread emails', sub: 'Oldest from Tuesday', icon: 'mail', orbit: 0, at: [-4.6, 1.75, 0.3] },
  { text: 'Invoice #1042', sub: 'Overdue 6 days', icon: 'receipt', orbit: 1, at: [3.3, 2.9, 0.4] },
  { text: 'Missed call', sub: 'New customer, no voicemail', icon: 'phone', orbit: 0, at: [-3.4, 0.9, 1.0] },
  { text: 'Contract to review', sub: '32 pages, due Friday', icon: 'document', orbit: 1, at: [3.9, 1.1, 0.6] },
  { text: '“Can we reschedule?”', sub: 'Reply needed', icon: 'calendar', orbit: 2, at: [-1.9, -0.2, 1.4] },
  { text: '18 receipts to file', sub: 'From this month', icon: 'clipboard', orbit: 1, at: [4.3, -0.1, 0.2] },
  { text: 'Customer question', sub: 'Waiting 3 hours', icon: 'chat', orbit: 0, at: [-1.3, 1.4, 1.2] },
  { text: 'Weekly report', sub: 'Due Monday, not started', icon: 'chart', orbit: 2, at: [1.5, 0.5, 1.4] },
] as const
// phones: a staggered column of four cards below the buttons, so nothing overlaps
const MESS_PHONE: [number, number, number][] = [[-0.75, 2.0, 1], [0.05, 1.25, 1], [-0.75, 0.5, 1], [0.05, -0.25, 1]]

/* The mess: scattered tasks drift in disarray. Scrolling lets WDZ pull each one onto its orbit,
   where it stays as a small bead riding the ring, so the opening flows straight into the scene. */
function Swarm({ intro, count, portal, labels, narrow, focused }: { intro: React.MutableRefObject<number>; count: number; portal: React.MutableRefObject<HTMLElement>; labels: boolean; narrow: boolean; focused: boolean }) {
  const shown = narrow ? MESS.slice(0, 4) : MESS
  const beadScale = useRef(1)
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const ringMats = useMemo(() => ORBITS.map((o) => new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...o.tilt))), [])
  const labelGroups = useRef<(THREE.Group | null)[]>([])
  const labelEls = useRef<(HTMLDivElement | null)[]>([])
  const loadStart = useRef<number | null>(null)
  // per-card screen-space nudge that keeps it clear of the headline and buttons
  const nudges = useRef(MESS.map(() => ({ x: 0, y: 0 })))
  const world = useMemo(() => new THREE.Vector3(), [])
  const parts = useMemo(() => {
    let x = 11
    const rand = () => ((x = (x * 16807) % 2147483647) / 2147483647)
    return Array.from({ length: count }, (_, j) => {
      const m = MESS[j]
      return {
        orbit: m ? m.orbit : j % 3,
        angle: rand() * Math.PI * 2,
        jitter: (rand() - 0.5) * 0.12,
        // phones are narrow, so labelled tasks pull in toward the centre
        start: m ? (narrow && j < MESS_PHONE.length ? new THREE.Vector3(...MESS_PHONE[j]) : new THREE.Vector3(m.at[0] * 0.82, m.at[1], m.at[2])) : new THREE.Vector3((rand() - 0.5) * 14, (rand() - 0.5) * 7 + 1.6, (rand() - 0.5) * 6),
        phase: rand() * 10,
        delay: m ? 0.15 + j * 0.06 : rand() * 0.7,
        size: m ? 1.2 : 0.5 + rand() * 0.5,
        labelled: !!m,
      }
    })
  }, [count, narrow])

  useEffect(() => {
    const m = mesh.current
    if (!m) return
    const c = new THREE.Color()
    parts.forEach((p, j) => m.setColorAt(j, c.set(ORBITS[p.orbit].color)))
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [parts])

  const chaos = new THREE.Vector3()
  const target = new THREE.Vector3()
  useFrame(({ clock, camera, size }, delta) => {
    const m = mesh.current
    if (!m) return
    // beads shrink right down when the camera is close, so they never blow up into blobs
    beadScale.current = THREE.MathUtils.damp(beadScale.current, focused ? 0.35 : 1, 4, delta)
    const t = clock.elapsedTime
    if (loadStart.current === null) loadStart.current = t
    const since = t - loadStart.current
    const org = intro.current
    parts.forEach((p, j) => {
      const o = ORBITS[p.orbit]
      // restless, slightly frantic drift while nothing is organized
      chaos.set(
        p.start.x + Math.sin(t * 0.7 + p.phase) * 0.3,
        p.start.y + Math.cos(t * 0.9 + p.phase * 1.3) * 0.22,
        p.start.z + Math.sin(t * 0.6 + p.phase * 0.7) * 0.22,
      )
      // on load the tasks pour in from the edges of the screen
      const fly = easeOut(seg(since, p.delay * 0.6, 1.1 + p.delay * 0.6))
      chaos.multiplyScalar(1 + (1 - fly) * 1.4)
      // home: a point on its orbit ring that travels with the ring
      const a = p.angle + t * o.speed * 0.6
      const r = o.radius + p.jitter
      target.set(Math.cos(a) * r, Math.sin(a) * r, 0).applyMatrix4(ringMats[p.orbit])
      const b = easeInOut(seg(org, 0.12 + p.delay * 0.45, 0.6 + p.delay * 0.45))
      dummy.position.lerpVectors(chaos, target, b)
      dummy.position.y += Math.sin(b * Math.PI) * 0.8 // swept in on an arc
      // a card is the task itself; its dot only appears once it is ticked off and flies to its orbit
      const reveal = p.labelled && labels ? seg(b, 0.2, 0.45) : 1
      dummy.scale.setScalar(0.05 * p.size * (1 - 0.6 * b) * fly * reveal * (b > 0.99 ? beadScale.current : 1))
      dummy.updateMatrix()
      m.setMatrixAt(j, dummy.matrix)
      const g = labelGroups.current[j]
      if (g) {
        g.position.copy(dummy.position)
        const el = labelEls.current[j]
        if (el) {
          // ticked off first, then it fades as it flies into its orbit
          el.classList.toggle('done', b > 0.08)
          el.style.opacity = String(fly * (1 - seg(b, 0.25, 0.6)))
          // keep the card clear of the copy: project it to the screen and push it out of any text box it touches
          g.getWorldPosition(world).project(camera)
          const n = nudges.current[j]
          const cw = el.offsetWidth, ch = el.offsetHeight
          const hx = (world.x + 1) / 2 * size.width
          const hy = (1 - world.y) / 2 * size.height
          // how far a card centred at (x, y) must move to clear every text box
          const push = (x: number, y: number) => {
            let tx = 0, ty = 0
            for (const r of textZones.rects) {
              const pad = 18
              const L = r.left - pad, Rr = r.right + pad, T = r.top - pad, B = r.bottom + pad
              if (x + cw / 2 < L || x - cw / 2 > Rr || y + ch / 2 < T || y - ch / 2 > B) continue
              const pushL = L - (x + cw / 2), pushR = Rr - (x - cw / 2), pushD = B - (y - ch / 2)
              const h = Math.abs(pushL) < Math.abs(pushR) ? pushL : pushR
              if (Math.abs(h) <= Math.abs(pushD)) tx += h; else ty += pushD
            }
            // and never past the screen edges or under the nav bar
            const edge = 16
            if (x + tx - cw / 2 < edge) tx += edge - (x + tx - cw / 2)
            if (x + tx + cw / 2 > size.width - edge) tx -= x + tx + cw / 2 - (size.width - edge)
            if (y + ty - ch / 2 < 84) ty += 84 - (y + ty - ch / 2)
            if (y + ty + ch / 2 > size.height - edge) ty -= y + ty + ch / 2 - (size.height - edge)
            return [tx, ty]
          }
          // two passes, so a card pushed out of one box doesn't land in the next
          const [ax, ay] = push(hx, hy)
          const [bx, by] = push(hx + ax, hy + ay)
          // glide to the nearest clear spot from home; no oscillation
          n.x = THREE.MathUtils.damp(n.x, ax + bx, 5, delta)
          n.y = THREE.MathUtils.damp(n.y, ay + by, 5, delta)
          el.style.translate = `${n.x.toFixed(1)}px ${n.y.toFixed(1)}px`
        }
      }
    })
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial transparent opacity={0.6} toneMapped={false} />
      </instancedMesh>
      {labels && shown.map((m, j) => (
        <group key={m.text} ref={(el) => { labelGroups.current[j] = el }}>
          <Html portal={portal} center pointerEvents="none" zIndexRange={[9, 0]}>
            <div className="mess-card" ref={(el) => { labelEls.current[j] = el }} style={{ '--c': ORBITS[m.orbit].color, '--tilt': `${((j * 37) % 7) - 3}deg` } as React.CSSProperties}>
              <span className="mess-icon">
                <svg className="mess-glyph" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[m.icon]} /></svg>
                <svg className="mess-check" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.5l3 3 6-7" /></svg>
              </span>
              <span className="mess-text"><strong>{m.text}</strong><small>{m.sub}</small><span className="mess-handled">Handled by {ORBITS[m.orbit].name}</span></span>
              <span className="mess-alert" />
            </div>
          </Html>
        </group>
      ))}
    </>
  )
}

/* The moment WDZ forms: a ring of light ripples outward from the core */
function Shockwave({ intro, core }: { intro: React.MutableRefObject<number>; core: React.RefObject<THREE.Mesh | null> }) {
  const ring = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(({ camera }) => {
    if (!ring.current || !mat.current) return
    const w = seg(intro.current, 0.26, 0.72)
    ring.current.visible = w > 0 && w < 1
    if (core.current) ring.current.position.copy(core.current.position)
    ring.current.quaternion.copy(camera.quaternion)
    ring.current.scale.setScalar(1 + easeOut(w) * 8)
    mat.current.opacity = (1 - w) * 0.55
  })
  return (
    <mesh ref={ring} visible={false}>
      <ringGeometry args={[0.96, 1, 128]} />
      <meshBasicMaterial ref={mat} color="#86d6b9" transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function Rig({ progress, organize, focus, names, still }: SceneProps) {
  const { camera, viewport } = useThree()
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const distort = useRef<React.ComponentRef<typeof MeshDistortMaterial>>(null)
  const logo = useRef<THREE.Sprite>(null)
  const logoMat = useRef<THREE.SpriteMaterial>(null)
  const logoTex = useLogoTexture()
  // smoothed organize value shared with the orbits and swarm
  const intro = useRef(still ? 1 : 0)
  const planetRefs = useRef<(THREE.Object3D | null)[]>([])
  const look = useRef(new THREE.Vector3(0, -0.6, 0))
  const portal = useThree((s) => s.gl.domElement.parentElement?.parentElement) as HTMLElement
  const portalRef = useMemo(() => ({ current: portal }), [portal])
  const narrow = viewport.aspect < 0.9

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    // pointer parallax on the whole system, critically damped
    // pointer parallax in wide shots only; zoomed in, a tiny tilt swings the planet across the screen
    const sway = focus < 0 ? 1 : 0
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.25 * sway, 3, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.12 * sway, 3, delta)
    if (core.current) core.current.rotation.y += delta * 0.15

    // scroll scrubs the organizing: the core forms, the shockwave rolls out, tasks find their orbits
    if (!still) intro.current = THREE.MathUtils.damp(intro.current, organize.current, 6, delta)
    const org = intro.current
    const wide = focus < 0
    if (core.current) core.current.scale.setScalar(0.001 + easeOutBack(seg(org, 0.06, 0.4)))
    if (distort.current) {
      // churning as it forms; calmer in wide shots so the emblem reads cleanly
      const settle = easeOut(seg(org, 0.1, 0.85))
      const target = THREE.MathUtils.lerp(1.1, wide ? 0.24 : 0.38, settle)
      distort.current.distort = THREE.MathUtils.damp(distort.current.distort, target, 4, delta)
    }
    if (logo.current && logoMat.current && core.current) {
      // emblem hovers just in front of the core, always facing the camera
      core.current.getWorldPosition(tmp2)
      const toCam = camera.position.clone().sub(tmp2).normalize()
      tmp2.addScaledVector(toCam, 1.45)
      logo.current.position.copy(g.worldToLocal(tmp2))
      const show = wide ? easeOut(seg(org, 0.85, 1)) : 0
      logoMat.current.opacity = THREE.MathUtils.damp(logoMat.current.opacity, show * 0.92, 4, delta)
    }

    const desired = new THREE.Vector3()
    const target = new THREE.Vector3()
    const planet = focus >= 0 && !still ? planetRefs.current[focus] : null
    if (planet) {
      planet.getWorldPosition(tmp)
      // sit just outside the planet, looking back past it toward the core
      const out = tmp.clone().setZ(0).normalize()
      desired.copy(tmp).addScaledVector(out, narrow ? 0.5 : 0.9).add(new THREE.Vector3(0, 0.15, narrow ? 3.6 : 2.5))
      // frame the planet right of centre on desktop (panel sits left), high on phones (panel sits low)
      target.copy(tmp).add(new THREE.Vector3(narrow ? 0 : -0.4, narrow ? -0.85 : 0.1, 0))
    } else {
      // wide shot; the finale pulls back a little further than the opening
      const p = progress.current
      const pull = p > 0.8 ? 1.5 : 0
      // a touch closer while things are still a mess, pulling back as order arrives
      desired.set(0, 0.2, (narrow ? 14 : 10.5) + pull - (1 - intro.current) * 1.2)
      // look above the core so the system sits under the headline
      target.set(0, narrow ? 2.1 : 0.75, 0)
    }
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desired.x, 2.8, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desired.y, 2.8, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desired.z, 2.8, delta)
    look.current.x = THREE.MathUtils.damp(look.current.x, target.x, 2.6, delta)
    look.current.y = THREE.MathUtils.damp(look.current.y, target.y, 2.6, delta)
    look.current.z = THREE.MathUtils.damp(look.current.z, target.z, 2.6, delta)
    camera.lookAt(look.current)
  })

  return (
    <group ref={group} position={[0, -1.4, 0]}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1, narrow ? 24 : 64]} />
          <MeshDistortMaterial ref={distort} color="#1b7d6d" roughness={0.12} metalness={0.35} distort={1.1} speed={1.6} envMapIntensity={1.4} />
        </mesh>
      </Float>
      {ORBITS.map((_, i) => (
        <Orbit key={i} index={i} intro={intro} names={names} focus={focus} narrow={narrow} planetRefs={planetRefs} portal={portalRef as React.MutableRefObject<HTMLElement>} />
      ))}
      <Shockwave intro={intro} core={core} />
      <Swarm intro={intro} count={narrow ? 14 : 28} portal={portalRef as React.MutableRefObject<HTMLElement>} labels={!still && focus < 0} narrow={narrow} focused={focus >= 0} />
      {logoTex && (
        <sprite ref={logo} scale={[1.25, 1.25 * (380 / 1024), 1]} renderOrder={3}>
          <spriteMaterial ref={logoMat} map={logoTex} transparent opacity={0} depthWrite={false} toneMapped={false} />
        </sprite>
      )}
    </group>
  )
}

export default function OrbitScene({ progress, organize, focus, names, still }: SceneProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="orbit-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.2, 10.5], fov: 38 }}
        // measure layout size, not the transformed box, so entrance effects can't skew the canvas
        resize={{ offsetSize: true }}
        dpr={[1, 1.5]}
        frameloop={visible ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 5, 3]} intensity={1.6} />
        <pointLight position={[-4, -2, 2]} intensity={18} color="#5fe3b5" />
        <pointLight position={[3, -3, -2]} intensity={10} color="#7cc8ff" />
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 4, -6]} scale={[10, 2, 1]} color="#ffffff" />
          <Lightformer intensity={1.4} position={[-6, 0, -2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} color="#5fe3b5" />
          <Lightformer intensity={1.2} position={[6, -1, 0]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} color="#9be7ff" />
        </Environment>
        <Rig progress={progress} organize={organize} focus={focus} names={names} still={still} />
      </Canvas>
    </div>
  )
}
