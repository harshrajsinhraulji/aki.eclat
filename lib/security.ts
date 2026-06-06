/**
 * lib/security.ts
 * Input sanitisation and rate-limiting helpers for API routes.
 * All confession/reaction/reply inputs pass through here first.
 */

/* ─────────────────────────────────────────────
   INPUT SANITISATION
───────────────────────────────────────────── */

/**
 * Strip HTML tags and dangerous characters.
 * Confessions are plain text only.
 */
export function sanitiseText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')          // strip HTML
    .replace(/javascript:/gi, '')      // strip JS protocol
    .replace(/on\w+\s*=/gi, '')        // strip event handlers
    .trim()
    .slice(0, 1000)                    // hard cap
}

/**
 * Validate that a string is non-empty and within bounds.
 */
export function validateText(
  input: unknown,
  min = 1,
  max = 1000
): { valid: boolean; reason?: string } {
  if (typeof input !== 'string') {
    return { valid: false, reason: 'Must be a string' }
  }
  const trimmed = input.trim()
  if (trimmed.length < min) {
    return { valid: false, reason: `Too short (min ${min} characters)` }
  }
  if (trimmed.length > max) {
    return { valid: false, reason: `Too long (max ${max} characters)` }
  }
  return { valid: true }
}

/* ─────────────────────────────────────────────
   IN-MEMORY RATE LIMITER
   Simple per-IP rate limiting for API routes.
   Resets on cold start (Vercel function lifecycle).
───────────────────────────────────────────── */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

/**
 * Returns true if the request is allowed.
 * Returns false (rate limited) if too many requests in the window.
 *
 * @param key — typically the client IP
 * @param limit — max requests per window
 * @param windowMs — time window in milliseconds
 */
export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count += 1
  return true
}

/**
 * Extract IP from Next.js request headers.
 * Falls back to a generic key for local dev.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local'
  )
}

/* ─────────────────────────────────────────────
   ADMIN AUTH VALIDATION
───────────────────────────────────────────── */

/**
 * Validate admin session token.
 * Called by all admin API routes.
 */
export function validateAdminToken(authHeader: string | null): boolean {
  if (!authHeader?.startsWith('Bearer ')) return false
  // In Phase 2: verify token with Firebase Auth admin SDK
  // For now: presence check (actual validation via Konami/Env variable)
  const token = authHeader.slice(7)
  return token.length > 0
}
