'use client'

import { useEffect, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Vec2 { x: number; y: number }

interface RouteDef {
  from: number
  to: number
  color: string
  speed: number
}

interface PlaneState {
  route: RouteDef
  t: number           // 0 → 1 current progress
  samples: Vec2[]     // pre-computed bezier points (200 steps)
  cp: Vec2            // bezier control point
}

// ─── Data ────────────────────────────────────────────────────────────────────

// Normalized positions [x, y] 0→1 relative to canvas
const CITIES: Vec2[] = [
  { x: 0.20, y: 0.33 }, // 0  New York
  { x: 0.10, y: 0.37 }, // 1  Los Angeles
  { x: 0.22, y: 0.44 }, // 2  Miami
  { x: 0.28, y: 0.65 }, // 3  São Paulo
  { x: 0.46, y: 0.24 }, // 4  London
  { x: 0.48, y: 0.27 }, // 5  Paris
  { x: 0.51, y: 0.25 }, // 6  Frankfurt
  { x: 0.44, y: 0.32 }, // 7  Madrid
  { x: 0.54, y: 0.30 }, // 8  Rome
  { x: 0.58, y: 0.30 }, // 9  Istanbul
  { x: 0.62, y: 0.39 }, // 10 Dubai
  { x: 0.55, y: 0.41 }, // 11 Cairo
  { x: 0.65, y: 0.43 }, // 12 Mumbai
  { x: 0.73, y: 0.53 }, // 13 Singapore
  { x: 0.76, y: 0.38 }, // 14 Hong Kong
  { x: 0.83, y: 0.32 }, // 15 Tokyo
  { x: 0.82, y: 0.68 }, // 16 Sydney
]

// Site palette: pink, purple, cyan, white — all at reduced alpha for harmony
const ROUTES: RouteDef[] = [
  { from: 0,  to: 4,  color: '#E91E8C', speed: 0.00055 },
  { from: 1,  to: 4,  color: '#06B6D4', speed: 0.00048 },
  { from: 2,  to: 5,  color: '#9333EA', speed: 0.00062 },
  { from: 3,  to: 8,  color: '#F472B6', speed: 0.00045 },
  { from: 0,  to: 3,  color: '#A78BFA', speed: 0.00058 },
  { from: 4,  to: 10, color: '#06B6D4', speed: 0.00052 },
  { from: 5,  to: 10, color: '#E91E8C', speed: 0.00067 },
  { from: 6,  to: 12, color: '#38BDF8', speed: 0.00049 },
  { from: 9,  to: 12, color: '#9333EA', speed: 0.00060 },
  { from: 10, to: 12, color: '#06B6D4', speed: 0.00055 },
  { from: 12, to: 13, color: '#F472B6', speed: 0.00070 },
  { from: 13, to: 16, color: '#A78BFA', speed: 0.00050 },
  { from: 14, to: 15, color: '#E91E8C', speed: 0.00065 },
  { from: 15, to: 16, color: '#9333EA', speed: 0.00048 },
  { from: 4,  to: 13, color: '#38BDF8', speed: 0.00040 },
  { from: 9,  to: 15, color: '#E91E8C', speed: 0.00043 },
  { from: 11, to: 10, color: '#06B6D4', speed: 0.00072 },
  { from: 7,  to: 10, color: '#A78BFA', speed: 0.00056 },
]

const STAGGER_OFFSETS = [
  0.0, 0.35, 0.65, 0.15, 0.80, 0.50, 0.25, 0.70,
  0.40, 0.10, 0.55, 0.85, 0.30, 0.60, 0.45, 0.20, 0.75, 0.90,
]

// ─── Math helpers ─────────────────────────────────────────────────────────────

function quadBezier(p0: Vec2, p1: Vec2, p2: Vec2, t: number): Vec2 {
  const mt = 1 - t
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  }
}

function bezierAngle(p0: Vec2, p1: Vec2, p2: Vec2, t: number): number {
  const mt = 1 - t
  const dx = 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
  const dy = 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
  return Math.atan2(dy, dx)
}

function controlPoint(from: Vec2, to: Vec2): Vec2 {
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  // Arc height: 15–25% of distance, always curving "northward" (upward on screen)
  const arc = dist * 0.22
  // Perpendicular component — lean slightly left
  const px = dy / dist
  return { x: mx + px * arc * 0.3, y: my - arc }
}

function sampleBezier(p0: Vec2, cp: Vec2, p2: Vec2, steps = 200): Vec2[] {
  const pts: Vec2[] = []
  for (let i = 0; i <= steps; i++) pts.push(quadBezier(p0, cp, p2, i / steps))
  return pts
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const spacing = Math.round(w / 22)
  ctx.save()
  ctx.strokeStyle = 'rgba(147,51,234,0.07)'
  ctx.lineWidth = 0.5
  for (let x = 0; x <= w; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
  }
  for (let y = 0; y <= h; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
  }
  ctx.restore()
}

function drawGhostRoute(
  ctx: CanvasRenderingContext2D,
  samples: Vec2[],
  color: string,
  w: number,
  h: number,
) {
  ctx.save()
  ctx.beginPath()
  samples.forEach((p, i) => {
    const px = p.x * w, py = p.y * h
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
  })
  ctx.setLineDash([3, 10])
  ctx.strokeStyle = color + '28'
  ctx.lineWidth = 0.8
  ctx.stroke()
  ctx.restore()
}

function drawTrail(
  ctx: CanvasRenderingContext2D,
  samples: Vec2[],
  t: number,
  color: string,
  w: number,
  h: number,
) {
  const end = Math.floor(t * (samples.length - 1))
  if (end < 2) return
  const trailLen = Math.min(end, 50) // last 50 samples = trail length
  const start = Math.max(0, end - trailLen)
  ctx.save()
  for (let i = start; i < end; i++) {
    const alpha = ((i - start) / trailLen) * 0.7
    const p0 = samples[i], p1 = samples[i + 1]
    ctx.beginPath()
    ctx.moveTo(p0.x * w, p0.y * h)
    ctx.lineTo(p1.x * w, p1.y * h)
    ctx.strokeStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0')
    ctx.lineWidth = 1.5
    ctx.setLineDash([])
    ctx.stroke()
  }
  ctx.restore()
}

function drawPlane(
  ctx: CanvasRenderingContext2D,
  pos: Vec2,
  angle: number,
  color: string,
  w: number,
  h: number,
) {
  const scale = Math.min(w, h) * 0.009
  const px = pos.x * w, py = pos.y * h
  ctx.save()
  ctx.translate(px, py)
  ctx.rotate(angle)

  // Glow
  ctx.shadowColor = color
  ctx.shadowBlur = 14

  // Body
  ctx.beginPath()
  ctx.moveTo(scale, 0)
  ctx.lineTo(-scale * 0.5, -scale * 0.45)
  ctx.lineTo(-scale * 0.2, 0)
  ctx.lineTo(-scale * 0.5, scale * 0.45)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()

  // Wing highlight
  ctx.shadowBlur = 6
  ctx.beginPath()
  ctx.moveTo(scale * 0.1, 0)
  ctx.lineTo(-scale * 0.1, -scale * 0.8)
  ctx.lineTo(-scale * 0.3, 0)
  ctx.lineTo(-scale * 0.1, scale * 0.8)
  ctx.closePath()
  ctx.fillStyle = color + 'CC'
  ctx.fill()

  ctx.restore()
}

function drawCity(
  ctx: CanvasRenderingContext2D,
  city: Vec2,
  time: number,
  idx: number,
  w: number,
  h: number,
) {
  const px = city.x * w, py = city.y * h
  const pulse = Math.sin(time * 0.0012 + idx * 0.9) * 0.5 + 0.5
  const scale = Math.min(w, h) * 0.001

  ctx.save()

  // Outer pulse ring
  ctx.beginPath()
  ctx.arc(px, py, (3 + pulse * 6) * scale, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(6,182,212,${0.15 + pulse * 0.25})`
  ctx.lineWidth = 0.8
  ctx.stroke()

  // Mid ring
  ctx.beginPath()
  ctx.arc(px, py, 2.5 * scale, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(6,182,212,0.5)'
  ctx.lineWidth = 0.8
  ctx.stroke()

  // Core dot
  ctx.beginPath()
  ctx.arc(px, py, 1.8 * scale, 0, Math.PI * 2)
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = '#06B6D4'
  ctx.shadowBlur = 8
  ctx.fill()

  ctx.restore()
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AirTrafficCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Build plane states
    const planes: PlaneState[] = ROUTES.map((route, i) => {
      const from = CITIES[route.from]
      const to = CITIES[route.to]
      const cp = controlPoint(from, to)
      return {
        route,
        t: STAGGER_OFFSETS[i % STAGGER_OFFSETS.length],
        samples: sampleBezier(from, cp, to),
        cp,
      }
    })

    let raf = 0
    let lastTime = 0

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas!.getBoundingClientRect()
      canvas!.width = rect.width * dpr
      canvas!.height = rect.height * dpr
      ctx!.scale(dpr, dpr)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    function draw(time: number) {
      const dt = time - lastTime
      lastTime = time
      const w = canvas!.getBoundingClientRect().width
      const h = canvas!.getBoundingClientRect().height

      // Clear
      ctx!.clearRect(0, 0, w, h)

      // Grid
      drawGrid(ctx!, w, h)

      // Ghost routes
      planes.forEach(plane => drawGhostRoute(ctx!, plane.samples, plane.route.color, w, h))

      // Trails + planes
      planes.forEach(plane => {
        drawTrail(ctx!, plane.samples, plane.t, plane.route.color, w, h)

        const sIdx = Math.floor(plane.t * (plane.samples.length - 1))
        const pos = plane.samples[Math.min(sIdx, plane.samples.length - 1)]
        const from = CITIES[plane.route.from]
        const to = CITIES[plane.route.to]
        const angle = bezierAngle(from, plane.cp, to, plane.t)
        drawPlane(ctx!, pos, angle, plane.route.color, w, h)
      })

      // City dots
      CITIES.forEach((city, i) => drawCity(ctx!, city, time, i, w, h))

      // Advance planes
      if (!prefersReduced) {
        planes.forEach(plane => {
          plane.t += plane.route.speed * (dt || 16)
          if (plane.t > 1) plane.t = 0
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
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    />
  )
}
