import { type NextRequest, NextResponse } from "next/server"
import { getGroupMessages, sendGroupMessage } from "@/services/group-service"
import { supabase } from "@/lib/supabase-client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the current user from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // Get group messages
    const messages = await getGroupMessages(params.id, limit)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Group messages API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the current user from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()

    // Validate request
    if (!body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send message
    const message = await sendGroupMessage(params.id, user.id, body.content, body.mentions || [])

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Send message API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
