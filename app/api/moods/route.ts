import { type NextRequest, NextResponse } from "next/server"
import { getMoodEntriesByUserId, createMoodEntry } from "@/services/mood-service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get mood entries
    const moodEntries = await getMoodEntriesByUserId(session.user.id)

    return NextResponse.json({ moodEntries })
  } catch (error) {
    console.error("Moods API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()

    // Validate request
    if (!body.mood_value || !body.mood_emoji) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create mood entry
    const moodEntry = await createMoodEntry({
      user_id: session.user.id,
      mood_value: body.mood_value,
      mood_emoji: body.mood_emoji,
      notes: body.notes || null,
    })

    return NextResponse.json({ moodEntry })
  } catch (error) {
    console.error("Mood creation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
