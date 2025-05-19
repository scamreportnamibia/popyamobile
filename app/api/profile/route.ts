import { type NextRequest, NextResponse } from "next/server"
import { getUserById, getUserProfile } from "@/services/user-service"
import { getMoodEntriesByUserId } from "@/services/mood-service"

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would get the user ID from the session
    // For now, we'll use a hardcoded ID (3 is the regular user we seeded)
    const userId = 3

    // Get user data
    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user profile
    const profile = await getUserProfile(userId)

    // Get mood entries
    const moodEntries = await getMoodEntriesByUserId(userId)

    // Return combined data
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        user_code: user.user_code,
      },
      profile,
      moodEntries,
    })
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // In a real app, you would get the user ID from the session
    const userId = 3

    // Get request body
    const body = await request.json()

    // Update user profile
    const updatedProfile = await updateUserProfile(userId, body)
    if (!updatedProfile) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 400 })
    }

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error("Profile update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function updateUserProfile(userId: number, data: any) {
  // This is a placeholder - in a real app, you would validate the data
  // and update the user profile in the database
  return { userId, ...data }
}
