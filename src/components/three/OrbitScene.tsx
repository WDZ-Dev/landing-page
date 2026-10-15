import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Html, Lightformer, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { ORBITS } from '../orbits'
import { ICONS } from '../icons'

interface SceneProps {
  /** 0..1 scroll progress through the story */
  progress: React.MutableRefObject<number>
  /** -1 = wide shot, otherwise the orbit being zoomed into */
  focus: number
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
const INTRO_SECONDS = 2.6

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

function Orbit({ index, focus, planetRefs, portal, narrow, intro }: {
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
  const planet = useRef<THREE.Group>(null)
  const tint = useMemo(() => new THREE.Color(o.color).multiplyScalar(0.55), [o.color])
  const icon = useIconTexture(o.icon, o.color)
  const focused = focus === index
  const dimmed = focus >= 0 && !focused

  useFrame(({ clock, camera }, delta) => {
    // planets drift slowly; the focused one nearly holds still so the camera can settle on it
    const speed = focused ? 0.02 : o.speed
    if (carrier.current) carrier.current.rotation.z += delta * speed
    // intro: each ring grows in after the core forms, then its badge appears
    const ringIn = easeOut(seg(intro.current, 0.32 + index * 0.1, 0.7 + index * 0.1))
    const badgeIn = easeOutBack(seg(intro.current, 0.58 + index * 0.08, 0.86 + index * 0.08))
    if (ringMesh.current) ringMesh.current.scale.setScalar(0.6 + 0.4 * ringIn)
    if (ring.current) ring.current.opacity = THREE.MathUtils.damp(ring.current.opacity, (focused ? 0.5 : dimmed ? 0.1 : 0.28) * ringIn, 4, delta)
    // gentle breathing; the focused badge grows so it reads as the subject
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
          <mesh scale={focused ? 2.6 : 1.9}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshBasicMaterial color={o.color} transparent opacity={0.07} depthWrite={false} />
          </mesh>
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

function Rig({ progress, focus, still }: SceneProps) {
  const { camera, viewport } = useThree()
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const distort = useRef<React.ComponentRef<typeof MeshDistortMaterial>>(null)
  const logo = useRef<THREE.Sprite>(null)
  const logoMat = useRef<THREE.SpriteMaterial>(null)
  const logoTex = useLogoTexture()
  const intro = useRef(still ? 1 : 0)
  const introStart = useRef<number | null>(null)
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

    // intro timeline: liquid core forms and settles, then rings, badges and the logo arrive
    if (introStart.current === null) introStart.current = state.clock.elapsedTime
    if (!still) intro.current = Math.min(1, (state.clock.elapsedTime - introStart.current) / INTRO_SECONDS)
    const wide = focus < 0
    if (core.current) core.current.scale.setScalar(0.25 + 0.75 * easeOutBack(seg(intro.current, 0, 0.42)))
    if (distort.current) {
      // churning on arrival; calmer in wide shots so the emblem reads cleanly
      const settle = easeOut(seg(intro.current, 0.05, 0.75))
      const target = THREE.MathUtils.lerp(1.1, wide ? 0.24 : 0.38, settle)
      distort.current.distort = intro.current < 1 ? target : THREE.MathUtils.damp(distort.current.distort, target, 2, delta)
    }
    if (logo.current && logoMat.current && core.current) {
      // emblem hovers just in front of the core, always facing the camera
      core.current.getWorldPosition(tmp2)
      const toCam = camera.position.clone().sub(tmp2).normalize()
      tmp2.addScaledVector(toCam, 1.45)
      logo.current.position.copy(g.worldToLocal(tmp2))
      const show = wide ? easeOut(seg(intro.current, 0.72, 1)) : 0
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
      desired.set(0, 0.2, (narrow ? 14 : 10.5) + pull)
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
        <Orbit key={i} index={i} intro={intro} focus={focus} narrow={narrow} planetRefs={planetRefs} portal={portalRef as React.MutableRefObject<HTMLElement>} />
      ))}
      {logoTex && (
        <sprite ref={logo} scale={[1.25, 1.25 * (380 / 1024), 1]} renderOrder={3}>
          <spriteMaterial ref={logoMat} map={logoTex} transparent opacity={0} depthWrite={false} toneMapped={false} />
        </sprite>
      )}
      <Sparkles count={narrow ? 35 : 80} scale={[12, 7, 6]} size={2} speed={0.3} color="#8ff0cd" opacity={0.6} />
    </group>
  )
}

export default function OrbitScene({ progress, focus, still }: SceneProps) {
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
        <Rig progress={progress} focus={focus} still={still} />
      </Canvas>
    </div>
  )
}
