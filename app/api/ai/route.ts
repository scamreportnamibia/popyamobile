import { NextResponse } from "next/server"

// Mock AI responses
const mockResponses = [
  "I understand how you're feeling. Would you like to talk more about what's going on?",
  "That sounds challenging. How have you been coping with these feelings?",
  "Thank you for sharing that with me. What support would be most helpful for you right now?",
  "I'm here to listen without judgment. Would you like to explore some strategies that might help?",
  "Your feelings are valid. Have you spoken to anyone else about this?",
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 })
    }

    // Return a random mock response
    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)]

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in AI route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
