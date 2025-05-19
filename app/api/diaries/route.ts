import { type NextRequest, NextResponse } from "next/server"
import { getDiaryEntriesByUserId, createDiaryEntry } from "@/services/diary-service"
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Get diary entries
    const diaryEntries = await getDiaryEntriesByUserId(user.id, limit, offset)

    return NextResponse.json({ diaryEntries })
  } catch (error) {
    console.error("Diaries API error:", error)
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
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create diary entry
    const diaryEntry = await createDiaryEntry({
      user_id: user.id,
      title: body.title,
      content: body.content,
      mood: body.mood || null,
      tags: body.tags || null,
      ai_analysis: body.ai_analysis || null,
      images: body.images || null,
    })

    return NextResponse.json({ diaryEntry })
  } catch (error) {
    console.error("Diary creation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
