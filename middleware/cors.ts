import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Configure CORS
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://your-production-domain.com", "https://www.your-production-domain.com"]
    : ["http://localhost:3000"]

export function corsMiddleware(request: NextRequest) {
  // Check if the origin is allowed
  const origin = request.headers.get("origin") || ""
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // Get the response
  const response = NextResponse.next()

  // Set CORS headers
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin)
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Max-Age", "86400") // 24 hours

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    })
  }

  return response
}
