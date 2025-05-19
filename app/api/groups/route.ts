import { type NextRequest, NextResponse } from "next/server"
import { getAllGroups, createGroup } from "@/services/group-service"
import { supabase } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Get groups
    const groups = await getAllGroups(limit, offset)

    return NextResponse.json({ groups })
  } catch (error) {
    console.error("Groups API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    if (!body.name || !body.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create group
    const group = await createGroup({
      name: body.name,
      description: body.description,
      is_ai_enabled: body.is_ai_enabled || false,
      tags: body.tags || null,
      created_by: user.id,
    })

    return NextResponse.json({ group })
  } catch (error) {
    console.error("Group creation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
