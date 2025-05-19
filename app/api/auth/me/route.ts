import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/services/auth-service"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies or Authorization header
    const token = request.headers.get("Authorization")?.replace("Bearer ", "") || cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Auth me API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
