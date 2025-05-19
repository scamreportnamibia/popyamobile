import { type NextRequest, NextResponse } from "next/server"
import { getDiaryEntryById, updateDiaryEntry, deleteDiaryEntry } from "@/services/diary-service"
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

    // Get diary entry
    const diaryEntry = await getDiaryEntryById(params.id)

    if (!diaryEntry) {
      return NextResponse.json({ error: "Diary entry not found" }, { status: 404 })
    }

    // Check if the diary entry belongs to the user
    if (diaryEntry.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ diaryEntry })
  } catch (error) {
    console.error("Diary entry API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the current user from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get diary entry
    const diaryEntry = await getDiaryEntryById(params.id)

    if (!diaryEntry) {
      return NextResponse.json({ error: "Diary entry not found" }, { status: 404 })
    }

    // Check if the diary entry belongs to the user
    if (diaryEntry.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get request body
    const body = await request.json()

    // Update diary entry
    const updatedEntry = await updateDiaryEntry(params.id, {
      title: body.title,
      content: body.content,
      mood: body.mood,
      tags: body.tags,
      ai_analysis: body.ai_analysis,
      images: body.images,
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({ diaryEntry: updatedEntry })
  } catch (error) {
    console.error("Diary update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the current user from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get diary entry
    const diaryEntry = await getDiaryEntryById(params.id)

    if (!diaryEntry) {
      return NextResponse.json({ error: "Diary entry not found" }, { status: 404 })
    }

    // Check if the diary entry belongs to the user
    if (diaryEntry.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete diary entry
    const success = await deleteDiaryEntry(params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete diary entry" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Diary deletion API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
