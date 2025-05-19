import { NextResponse } from "next/server"

export async function GET() {
  // Always return false since we're not using OpenAI API
  return NextResponse.json({ available: false })
}
