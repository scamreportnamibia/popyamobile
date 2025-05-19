import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./services/auth-service"
import { corsMiddleware } from "./middleware/cors"
import { rateLimitMiddleware } from "./middleware/rate-limit"

// Paths that don't require authentication
const publicPaths = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify-otp",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
]

// Paths that require specific roles
const roleRestrictedPaths = {
  "/admin": ["super_admin"],
  "/expert-dashboard": ["expert"],
}

export async function middleware(request: NextRequest) {
  // Apply CORS middleware
  const corsResponse = corsMiddleware(request)
  if (corsResponse.status !== 200) {
    return corsResponse
  }

  // Apply rate limiting middleware
  const rateLimitResponse = rateLimitMiddleware(request)
  if (rateLimitResponse.status !== 200) {
    return rateLimitResponse
  }

  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if it's an API route
  const isApiRoute = pathname.startsWith("/api")

  // Get token from cookies or Authorization header
  const token = isApiRoute
    ? request.headers.get("Authorization")?.replace("Bearer ", "")
    : request.cookies.get("auth_token")?.value

  if (!token) {
    // Redirect to login page for non-API routes
    if (!isApiRoute) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    // Return 401 for API routes
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Verify token
    const user = await verifyToken(token)
    if (!user) {
      if (!isApiRoute) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check role restrictions
    for (const [path, roles] of Object.entries(roleRestrictedPaths)) {
      if (pathname.startsWith(path) && !roles.includes(user.role)) {
        if (!isApiRoute) {
          return NextResponse.redirect(new URL("/", request.url))
        }
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    // Continue with the request
    return NextResponse.next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    if (!isApiRoute) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|images|icons|manifest.json).*)",
  ],
}
