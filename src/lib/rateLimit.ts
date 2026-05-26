/**
 * In-memory rate limiter for API routes.
 * For production with multiple instances, replace the Map with Redis (e.g. Upstash).
 *
 * Usage in an API route:
 *   const result = rateLimit(request, { limit: 5, windowMs: 60_000 })
 *   if (!result.ok) return Response.json({ error: 'Too many requests' }, { status: 429 })
 */

interface RateLimitOptions {
  limit: number
  windowMs: number
}

interface RateLimitResult {
  ok: boolean
  remaining: number
  resetAt: number
}

const store = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(request: Request, options: RateLimitOptions): RateLimitResult {
  const { limit, windowMs } = options
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'anonymous'

  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs
    store.set(ip, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, resetAt }
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}
