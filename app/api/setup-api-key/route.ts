import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey || typeof apiKey !== "string" || !apiKey.startsWith("sk-")) {
      return NextResponse.json({ error: "Invalid API key format" }, { status: 400 })
    }

    // In a production environment, you would use a secure way to store this
    // such as environment variables in your hosting platform (Vercel, etc.)
    // This is a simplified example for demonstration purposes

    // For security reasons, we'll just return success without actually storing the key
    // In a real implementation, you would set this in your hosting platform

    return NextResponse.json({
      success: true,
      message: "API key received. Please set this in your environment variables.",
    })
  } catch (error) {
    console.error("Error setting up API key:", error)
    return NextResponse.json({ error: "Failed to set up API key" }, { status: 500 })
  }
}
