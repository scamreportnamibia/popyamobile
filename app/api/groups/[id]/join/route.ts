import { type NextRequest, NextResponse } from "next/server"
import { joinGroup } from "@/services/group-service"
import { supabase } from "@/lib/supabase-client"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the current user from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Join group
    const success = await joinGroup(params.id, user.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to join group" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Join group API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
