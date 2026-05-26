import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rateLimit'
import { sanitizePayload, sanitizeEmail } from '@/lib/sanitize'

// Allows static export (GitHub Pages). The route won't execute on static hosts —
// server-side features (rate limiting, email) only run on Vercel/Node.js.
export const dynamic = 'force-static'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  agencyName: z.string().min(2).max(100),
  agentCount: z.number().int().min(1).max(10_000),
  message: z.string().max(1000).optional(),
})

export async function POST(request: NextRequest) {
  // Rate limit: 5 submissions per IP per minute
  const limit = rateLimit(request, { limit: 5, windowMs: 60_000 })
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde um minuto.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
      },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  // Validate schema
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  // Sanitize all string fields
  const safe = sanitizePayload(parsed.data)

  // Double-check email after sanitization
  const email = sanitizeEmail(safe.email)
  if (!email) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 422 })
  }

  // TODO: send to Resend / CRM — use process.env.RESEND_API_KEY (server-side only, never exposed)
  // await sendEmail({ to: 'vendas@sakurapass.com.br', data: { ...safe, email } })

  return NextResponse.json({ ok: true }, { status: 200 })
}

// Explicitly reject other methods
export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
