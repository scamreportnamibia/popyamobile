import { type NextRequest, NextResponse } from "next/server"
import { getJoinedGroups } from "@/services/group-service"
import { supabase } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  try {
    // Get the current user from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get joined groups
    const groups = await getJoinedGroups(user.id)

    return NextResponse.json({ groups })
  } catch (error) {
    console.error("Joined groups API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
