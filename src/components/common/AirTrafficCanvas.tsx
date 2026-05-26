'use client'

import { useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Vec3 = [number, number, number]

interface CityDef {
  lat: number
  lon: number
}

interface RouteDef {
  from: number
  to: number
  color: string
  speed: number
}

interface PlaneState {
  route: RouteDef
  t: number
  samples: Vec3[]   // great-circle sample points on unit sphere
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CITIES: CityDef[] = [
  { lat:  40.7, lon:  -74.0 }, //  0 New York
  { lat:  34.0, lon: -118.2 }, //  1 Los Angeles
  { lat:  25.8, lon:  -80.2 }, //  2 Miami
  { lat: -23.5, lon:  -46.6 }, //  3 São Paulo
  { lat:  51.5, lon:   -0.1 }, //  4 London
  { lat:  48.9, lon:    2.3 }, //  5 Paris
  { lat:  50.1, lon:    8.7 }, //  6 Frankfurt
  { lat:  40.4, lon:   -3.7 }, //  7 Madrid
  { lat:  41.9, lon:   12.5 }, //  8 Rome
  { lat:  41.0, lon:   28.9 }, //  9 Istanbul
  { lat:  25.2, lon:   55.3 }, // 10 Dubai
  { lat:  30.1, lon:   31.2 }, // 11 Cairo
  { lat:  19.1, lon:   72.9 }, // 12 Mumbai
  { lat:   1.4, lon:  103.8 }, // 13 Singapore
  { lat:  22.3, lon:  114.2 }, // 14 Hong Kong
  { lat:  35.7, lon:  139.7 }, // 15 Tokyo
  { lat: -33.9, lon:  151.2 }, // 16 Sydney
  { lat: -26.2, lon:   28.0 }, // 17 Johannesburg
  { lat:  55.8, lon:   37.6 }, // 18 Moscow
  { lat:  39.9, lon:  116.4 }, // 19 Beijing
]

const ROUTES: RouteDef[] = [
  { from:  0, to:  4, color: '#E91E8C', speed: 0.00050 },
  { from:  1, to:  4, color: '#06B6D4', speed: 0.00044 },
  { from:  2, to:  5, color: '#9333EA', speed: 0.00058 },
  { from:  3, to:  8, color: '#F472B6', speed: 0.00042 },
  { from:  0, to:  3, color: '#A78BFA', speed: 0.00048 },
  { from:  4, to: 10, color: '#06B6D4', speed: 0.00046 },
  { from:  5, to: 10, color: '#E91E8C', speed: 0.00055 },
  { from:  6, to: 12, color: '#38BDF8', speed: 0.00043 },
  { from:  9, to: 12, color: '#9333EA', speed: 0.00052 },
  { from: 10, to: 12, color: '#06B6D4', speed: 0.00049 },
  { from: 12, to: 13, color: '#F472B6', speed: 0.00060 },
  { from: 13, to: 16, color: '#A78BFA', speed: 0.00041 },
  { from: 14, to: 15, color: '#E91E8C', speed: 0.00057 },
  { from: 15, to: 16, color: '#9333EA', speed: 0.00043 },
  { from:  4, to: 13, color: '#38BDF8', speed: 0.00036 },
  { from: 17, to: 10, color: '#06B6D4', speed: 0.00050 },
  { from: 18, to:  6, color: '#A78BFA', speed: 0.00046 },
  { from: 19, to: 15, color: '#E91E8C', speed: 0.00052 },
  { from:  0, to: 18, color: '#38BDF8', speed: 0.00040 },
  { from:  3, to: 17, color: '#9333EA', speed: 0.00044 },
]

const STAGGER = [
  0.00, 0.30, 0.60, 0.15, 0.75, 0.45, 0.20, 0.65,
  0.35, 0.85, 0.50, 0.10, 0.70, 0.40, 0.25, 0.90,
  0.55, 0.05, 0.80, 0.38,
]

// ─── 3-D math ─────────────────────────────────────────────────────────────────

function latLonToVec3(lat: number, lon: number): Vec3 {
  const phi   = ((90 - lat) * Math.PI) / 180
  const theta = (lon          * Math.PI) / 180
  return [
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  ]
}

function dot3(a: Vec3, b: Vec3): number {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
}

function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const d     = Math.max(-1, Math.min(1, dot3(a, b)))
  const angle = Math.acos(d)
  if (Math.abs(angle) < 1e-6) return a
  const sinA  = Math.sin(angle)
  const f0    = Math.sin((1 - t) * angle) / sinA
  const f1    = Math.sin(t       * angle) / sinA
  return [f0*a[0]+f1*b[0], f0*a[1]+f1*b[1], f0*a[2]+f1*b[2]]
}

function greatCircleSamples(from: CityDef, to: CityDef, steps = 120): Vec3[] {
  const a = latLonToVec3(from.lat, from.lon)
  const b = latLonToVec3(to.lat,   to.lon)
  const pts: Vec3[] = []
  for (let i = 0; i <= steps; i++) pts.push(slerp(a, b, i / steps))
  return pts
}

// Apply Y-axis rotation to a unit-sphere point
function rotateY(v: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle), sin = Math.sin(angle)
  return [v[0]*cos + v[2]*sin, v[1], -v[0]*sin + v[2]*cos]
}

// Orthographic projection → screen coords; returns null if on back hemisphere
function project(
  v: Vec3,
  cx: number, cy: number,
  radius: number,
): [number, number] | null {
  if (v[2] < 0) return null          // back hemisphere — hidden
  return [cx + v[0] * radius, cy - v[1] * radius]
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function drawGlobe(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, R: number,
) {
  // Atmosphere outer glow
  const atm = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.18)
  atm.addColorStop(0,   'rgba(147,51,234,0.18)')
  atm.addColorStop(0.5, 'rgba(233,30,140,0.07)')
  atm.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.beginPath()
  ctx.arc(cx, cy, R * 1.18, 0, Math.PI * 2)
  ctx.fillStyle = atm
  ctx.fill()

  // Sphere base
  const base = ctx.createRadialGradient(cx - R*0.25, cy - R*0.25, R*0.05, cx, cy, R)
  base.addColorStop(0,   '#1E1040')
  base.addColorStop(0.4, '#0F0A24')
  base.addColorStop(1,   '#060412')
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.fillStyle = base
  ctx.fill()

  // Clip all future drawing to the sphere
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.clip()
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, R: number,
  rotation: number,
) {
  ctx.save()
  ctx.lineWidth = 0.4

  // Parallels (lat lines)
  for (let lat = -75; lat <= 75; lat += 30) {
    const phi = ((90 - lat) * Math.PI) / 180
    const r2d = Math.sin(phi) * R
    const y2d = cy - Math.cos(phi) * R
    if (r2d < 0) continue
    ctx.beginPath()
    ctx.arc(cx, y2d, r2d, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(147,51,234,0.12)'
    ctx.stroke()
  }

  // Meridians (lon lines) — only front-facing segments
  for (let lon = 0; lon < 360; lon += 30) {
    ctx.beginPath()
    let started = false
    for (let lat = -90; lat <= 90; lat += 3) {
      const v   = latLonToVec3(lat, lon)
      const rv  = rotateY(v, rotation)
      const pt  = project(rv, cx, cy, R)
      if (!pt) { started = false; continue }
      if (!started) { ctx.moveTo(pt[0], pt[1]); started = true }
      else ctx.lineTo(pt[0], pt[1])
    }
    ctx.strokeStyle = 'rgba(147,51,234,0.10)'
    ctx.stroke()
  }

  ctx.restore()
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  cx: number, cy: number, R: number,
  stars: Array<[number, number, number]>,
) {
  ctx.save()
  // Clip OUTSIDE globe — inverse clip trick
  ctx.beginPath()
  ctx.rect(0, 0, w, h)
  ctx.arc(cx, cy, R + 2, 0, Math.PI * 2, true) // true = CCW = hole
  ctx.fillStyle = 'transparent'
  ctx.fill()

  stars.forEach(([sx, sy, sa]) => {
    ctx.beginPath()
    ctx.arc(sx, sy, 0.6, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${sa})`
    ctx.fill()
  })
  ctx.restore()
}

function drawCity(
  ctx: CanvasRenderingContext2D,
  pos: [number, number],
  time: number,
  idx: number,
  R: number,
) {
  const [px, py] = pos
  const pulse = (Math.sin(time * 0.0014 + idx * 1.1) + 1) / 2
  const scale = R * 0.012

  ctx.save()

  // Outer ring
  ctx.beginPath()
  ctx.arc(px, py, scale * (1.8 + pulse * 2.2), 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(6,182,212,${0.12 + pulse * 0.28})`
  ctx.lineWidth = 0.7
  ctx.stroke()

  // Inner ring
  ctx.beginPath()
  ctx.arc(px, py, scale * 1.4, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(6,182,212,0.55)'
  ctx.lineWidth = 0.8
  ctx.stroke()

  // Core
  ctx.beginPath()
  ctx.arc(px, py, scale * 0.9, 0, Math.PI * 2)
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = '#06B6D4'
  ctx.shadowBlur = 10
  ctx.fill()

  ctx.restore()
}

function drawArc(
  ctx: CanvasRenderingContext2D,
  samples: Vec3[],
  t: number,
  color: string,
  cx: number, cy: number, R: number,
  rotation: number,
) {
  const { r, g, b } = hexToRgb(color)
  const endIdx = Math.floor(t * (samples.length - 1))
  const trailLen = 40

  // Ghost (full path, dashed, very faint)
  ctx.save()
  ctx.setLineDash([2, 8])
  ctx.lineWidth = 0.7
  ctx.beginPath()
  let ghostStarted = false
  samples.forEach((v) => {
    const rv = rotateY(v, rotation)
    const pt = project(rv, cx, cy, R)
    if (!pt) { ghostStarted = false; return }
    if (!ghostStarted) { ctx.moveTo(pt[0], pt[1]); ghostStarted = true }
    else ctx.lineTo(pt[0], pt[1])
  })
  ctx.strokeStyle = `rgba(${r},${g},${b},0.14)`
  ctx.stroke()
  ctx.restore()

  // Active trail (from t-trailLen to t, with alpha gradient)
  ctx.save()
  ctx.setLineDash([])
  for (let i = Math.max(0, endIdx - trailLen); i < endIdx; i++) {
    const alpha = ((i - (endIdx - trailLen)) / trailLen) * 0.75
    const rv0 = rotateY(samples[i],     rotation)
    const rv1 = rotateY(samples[i + 1], rotation)
    const p0  = project(rv0, cx, cy, R)
    const p1  = project(rv1, cx, cy, R)
    if (!p0 || !p1) continue
    ctx.beginPath()
    ctx.moveTo(p0[0], p0[1])
    ctx.lineTo(p1[0], p1[1])
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
    ctx.lineWidth = 1.4
    ctx.stroke()
  }
  ctx.restore()
}

function drawPlane(
  ctx: CanvasRenderingContext2D,
  samples: Vec3[],
  t: number,
  color: string,
  cx: number, cy: number, R: number,
  rotation: number,
) {
  const idx = Math.floor(t * (samples.length - 1))
  const v   = rotateY(samples[idx], rotation)
  const pt  = project(v, cx, cy, R)
  if (!pt) return

  // Direction: tangent from idx to idx+1
  const nextV = rotateY(samples[Math.min(idx + 1, samples.length - 1)], rotation)
  const npt   = project(nextV, cx, cy, R)
  if (!npt) return
  const angle = Math.atan2(npt[1] - pt[1], npt[0] - pt[0])

  const s = R * 0.028
  ctx.save()
  ctx.translate(pt[0], pt[1])
  ctx.rotate(angle)
  ctx.shadowColor = color
  ctx.shadowBlur  = 14

  // Body
  ctx.beginPath()
  ctx.moveTo(s, 0)
  ctx.lineTo(-s * 0.5, -s * 0.45)
  ctx.lineTo(-s * 0.2, 0)
  ctx.lineTo(-s * 0.5,  s * 0.45)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()

  // Wings
  ctx.beginPath()
  ctx.moveTo(s * 0.1,  0)
  ctx.lineTo(-s * 0.1, -s * 0.85)
  ctx.lineTo(-s * 0.3,  0)
  ctx.lineTo(-s * 0.1,  s * 0.85)
  ctx.closePath()
  ctx.fillStyle = color + 'CC'
  ctx.fill()

  ctx.restore()
}

function drawSpecular(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, R: number,
) {
  const hx = cx - R * 0.30
  const hy = cy - R * 0.32
  const sg = ctx.createRadialGradient(hx, hy, 0, hx, hy, R * 0.70)
  sg.addColorStop(0,   'rgba(255,255,255,0.06)')
  sg.addColorStop(0.4, 'rgba(255,255,255,0.02)')
  sg.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.fillStyle = sg
  ctx.fill()
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AirTrafficCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Pre-compute great-circle samples for each route
    const planes: PlaneState[] = ROUTES.map((route, i) => ({
      route,
      t: STAGGER[i % STAGGER.length],
      samples: greatCircleSamples(CITIES[route.from], CITIES[route.to]),
    }))

    // Star field (generated once, outside the globe clip)
    let stars: Array<[number, number, number]> = []

    let rotation = 0.38   // initial rotation (radians) — starts showing Americas + Europe
    let raf = 0
    let lastTime = 0

    function resize() {
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas!.getBoundingClientRect()
      canvas!.width  = rect.width  * dpr
      canvas!.height = rect.height * dpr
      ctx!.scale(dpr, dpr)

      // Regenerate stars
      const w = rect.width, h = rect.height
      stars = Array.from({ length: 160 }, () => [
        Math.random() * w,
        Math.random() * h,
        Math.random() * 0.55 + 0.1,
      ] as [number, number, number])
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    function draw(now: number) {
      const dt   = Math.min(now - lastTime, 32)  // cap dt to avoid jumps
      lastTime   = now
      const rect = canvas!.getBoundingClientRect()
      const w = rect.width, h = rect.height

      // Globe geometry
      const R  = Math.min(w, h) * 0.42
      const cx = w * 0.5
      const cy = h * 0.5

      ctx!.clearRect(0, 0, w, h)

      // Stars (outside globe)
      drawStars(ctx!, w, h, cx, cy, R, stars)

      // Save before clipping
      ctx!.save()

      // Draw globe base + atmosphere (sets clip)
      drawGlobe(ctx!, cx, cy, R)

      // Grid
      drawGrid(ctx!, cx, cy, R, rotation)

      // Ghost arcs
      planes.forEach(p => drawArc(ctx!, p.samples, p.t, p.route.color, cx, cy, R, rotation))

      // City dots
      CITIES.forEach((city, i) => {
        const v  = latLonToVec3(city.lat, city.lon)
        const rv = rotateY(v, rotation)
        const pt = project(rv, cx, cy, R)
        if (pt) drawCity(ctx!, pt, now, i, R)
      })

      // Planes
      planes.forEach(p => drawPlane(ctx!, p.samples, p.t, p.route.color, cx, cy, R, rotation))

      // Specular highlight
      drawSpecular(ctx!, cx, cy, R)

      ctx!.restore()   // remove clip

      // Smooth rotation & plane advance
      if (!prefersReduced) {
        rotation += 0.00012 * dt   // ~0.7°/s — slow, elegant
        planes.forEach(p => {
          p.t += p.route.speed * dt
          if (p.t > 1) p.t = 0
        })
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.75 }}
      aria-hidden="true"
    />
  )
}
