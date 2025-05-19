import { NextResponse } from "next/server"

export async function GET() {
  // Return a mock public key
  const mockPublicKey = "BPxwEX_zCxzQB8XTU-QkqkGm9kYvSN3qBVNDxf8ZiHJZvFT9TDQnPXxfFTzEFIDJ9Lf9_Q2zU6Vf1yVl4YU7xQA"

  return NextResponse.json({ success: true, publicKey: mockPublicKey })
}
