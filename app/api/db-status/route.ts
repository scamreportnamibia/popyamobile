import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/neon-client"

export async function GET() {
  try {
    const connected = await checkDatabaseConnection()

    if (connected) {
      return NextResponse.json({
        connected: true,
        message: "Successfully connected to Neon PostgreSQL database.",
      })
    } else {
      return NextResponse.json({
        connected: false,
        message: "Failed to connect to database. Check your connection string.",
      })
    }
  } catch (error) {
    console.error("Database status check error:", error)
    return NextResponse.json(
      {
        connected: false,
        message: "Error checking database connection.",
      },
      { status: 500 },
    )
  }
}
