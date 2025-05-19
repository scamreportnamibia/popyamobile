import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory store for rate limiting
// In production, use Redis or another distributed store
const rateLimitStore = new Map<string, { count: number; timestamp: number }>()

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100 // 100 requests per minute

export function rateLimitMiddleware(request: NextRequest) {
  // Skip rate limiting in development
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next()
  }

  // Get client IP
  const ip = request.ip || "unknown"

  // Get current timestamp
  const now = Date.now()

  // Get or create rate limit entry
  const rateLimit = rateLimitStore.get(ip) || { count: 0, timestamp: now }

  // Reset count if window has passed
  if (now - rateLimit.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.count = 0
    rateLimit.timestamp = now
  }

  // Increment count
  rateLimit.count++

  // Update store
  rateLimitStore.set(ip, rateLimit)

  // Check if rate limit exceeded
  if (rateLimit.count > MAX_REQUESTS) {
    return NextResponse.json({ error: "Too many requests, please try again later." }, { status: 429 })
  }

  // Add rate limit headers
  const response = NextResponse.next()
  response.headers.set("X-RateLimit-Limit", MAX_REQUESTS.toString())
  response.headers.set("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - rateLimit.count).toString())
  response.headers.set("X-RateLimit-Reset", (rateLimit.timestamp + RATE_LIMIT_WINDOW).toString())

  return response
}
