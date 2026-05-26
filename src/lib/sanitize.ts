/**
 * Strips HTML tags and trims whitespace from user input.
 * Prevents stored XSS if the value ever gets rendered as HTML.
 */
export function sanitizeText(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim()
}

/**
 * Normalizes and validates an email address.
 * Returns null if the format is invalid.
 */
export function sanitizeEmail(value: string): string | null {
  const email = value.toLowerCase().trim()
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  return valid ? email : null
}

/**
 * Strips non-numeric characters from a phone number input.
 */
export function sanitizePhone(value: string): string {
  return value.replace(/[^\d+\s\-()]/g, '').trim()
}

/**
 * Sanitizes all string fields in an object recursively.
 * Safe to call on form payloads before persisting or sending.
 */
export function sanitizePayload<T extends Record<string, unknown>>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).map(([k, v]) => [
      k,
      typeof v === 'string' ? sanitizeText(v) : v,
    ]),
  ) as T
}
