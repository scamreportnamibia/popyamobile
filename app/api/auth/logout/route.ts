import { type NextRequest, NextResponse } from "next/server"
import { logoutUser } from "@/services/auth-service"

export async function POST(request: NextRequest) {
  try {
    const result = await logoutUser()

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
