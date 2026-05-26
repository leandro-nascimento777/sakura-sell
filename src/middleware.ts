import { type NextRequest, NextResponse } from 'next/server'

/**
 * Edge middleware — runs before every request hits a route.
 *
 * Responsibilities:
 * 1. Block requests with suspicious User-Agents (basic bot/scanner protection)
 * 2. Reject oversized payloads on POST routes (prevents memory exhaustion)
 * 3. Add security headers as a second layer (complementary to next.config.ts)
 */

const BLOCKED_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /nuclei/i,
  /dirbuster/i,
  /gobuster/i,
  /wfuzz/i,
  /burpsuite/i,
]

const MAX_BODY_SIZE_BYTES = 10_240 // 10 KB

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? ''

  // 1. Block known vulnerability scanners
  if (BLOCKED_USER_AGENTS.some((pattern) => pattern.test(ua))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // 2. Reject oversized POST bodies (applies to /api/* routes)
  if (request.method === 'POST') {
    const contentLength = Number(request.headers.get('content-length') ?? 0)
    if (contentLength > MAX_BODY_SIZE_BYTES) {
      return new NextResponse('Payload Too Large', { status: 413 })
    }
  }

  // 3. Pass through with additional security headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  // Run on all routes except static assets and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
