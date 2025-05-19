import { type NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/services/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const result = await loginUser({ email, password })

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 401 })
    }

    return NextResponse.json({
      user: result.user,
      session: result.session,
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
