import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"
import { executeQuery } from "@/services/database-service"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Generate unique filename
    const filename = `${uuidv4()}-${file.name.replace(/\s/g, "_")}`
    const filePath = `profile-pictures/${filename}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("user-uploads").upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Supabase storage error:", error)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("user-uploads").getPublicUrl(filePath)

    // Update user record in database
    await executeQuery("UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2", [publicUrl, userId])

    // Return success response with image URL
    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
    })
  } catch (error) {
    console.error("Profile picture upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
