import { NextResponse } from "next/server"
import { verifyToken } from "@/services/auth-service"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    // Get token from cookies or Authorization header
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "") || cookies().get("auth_token")?.value

    // Check if user is authenticated and is an admin
    if (token) {
      const user = await verifyToken(token)
      if (user && user.role === "super_admin") {
        // Only show environment variables to admins
        return NextResponse.json({
          environment: process.env.NODE_ENV,
          variables: {
            CLIENT_URL: process.env.CLIENT_URL,
            PORT: process.env.PORT,
            DATABASE_URL: "********", // Masked for security
            JWT_SECRET: "********", // Masked for security
          },
        })
      }
    }

    // For non-admins, just return the environment
    return NextResponse.json({
      environment: process.env.NODE_ENV,
      message: "Authentication required to view environment variables",
    })
  } catch (error) {
    console.error("Environment check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
