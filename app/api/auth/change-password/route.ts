import { type NextRequest, NextResponse } from "next/server"
import { changePassword, verifyToken } from "@/services/auth-service"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const success = await changePassword(user.id, currentPassword, newPassword)
    if (!success) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Change password API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
