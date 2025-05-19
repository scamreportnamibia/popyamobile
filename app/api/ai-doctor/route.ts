import { NextResponse } from "next/server"

// Expanded mock responses for more variety
const mockResponses = [
  "I understand how you're feeling. Would you like to talk more about what's going on?",
  "That sounds challenging. How have you been coping with these feelings?",
  "Thank you for sharing that with me. What support would be most helpful for you right now?",
  "I'm here to listen without judgment. Would you like to explore some strategies that might help?",
  "Your feelings are valid. Have you spoken to anyone else about this?",
  "It's important to remember that seeking help is a sign of strength. Would you like to discuss some resources that might be helpful?",
  "I'm hearing that this has been difficult for you. What has helped you manage similar situations in the past?",
  "Taking care of your mental health is just as important as physical health. What self-care activities do you enjoy?",
  "It sounds like you're going through a lot right now. Would it help to break down these challenges into smaller, more manageable parts?",
  "I appreciate you trusting me with your thoughts. How can I best support you today?",
  "Sometimes our thoughts can feel overwhelming. Have you tried any mindfulness techniques?",
  "Remember that progress isn't always linear. Small steps forward are still progress.",
  "It's okay to not be okay sometimes. Would you like to talk about some coping strategies?",
  "Your resilience in facing these challenges is admirable. What strengths have helped you get through difficult times before?",
  "I'm wondering if you've considered how your physical health might be affecting your mental wellbeing? Things like sleep, nutrition, and exercise can have a big impact.",
]

// More specific responses based on keywords
const keywordResponses = {
  anxiety: [
    "Anxiety can be really challenging to deal with. Have you tried any breathing exercises when you feel anxious?",
    "When anxiety hits, grounding techniques can help. Would you like me to share some with you?",
    "Many people find that naming their anxious thoughts helps reduce their power. Have you tried this approach?",
  ],
  depression: [
    "Depression can make even simple tasks feel overwhelming. What's one small thing you could do today to care for yourself?",
    "It's important to be gentle with yourself when experiencing depression. Have you been able to show yourself compassion lately?",
    "Sometimes depression can distort our thinking. Have you noticed any negative thought patterns?",
  ],
  sleep: [
    "Sleep problems can significantly impact our mental health. Have you established a regular sleep routine?",
    "Some find that limiting screen time before bed helps improve sleep quality. Is that something you've tried?",
    "Relaxation techniques before bedtime can help prepare your mind for sleep. Would you like some suggestions?",
  ],
  relationship: [
    "Relationship challenges can be very stressful. Have you been able to communicate your feelings to the other person?",
    "Setting boundaries in relationships is important for mental health. Is this something you find difficult?",
    "Sometimes writing down our thoughts before a difficult conversation can help. Have you tried this approach?",
  ],
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    // Get the last user message
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ content: mockResponses[0] })
    }

    const userContent = lastUserMessage.content.toLowerCase()

    // Check for keywords to provide more specific responses
    let responseContent = ""

    if (
      userContent.includes("anxious") ||
      userContent.includes("anxiety") ||
      userContent.includes("nervous") ||
      userContent.includes("worry")
    ) {
      const anxietyResponses = keywordResponses.anxiety
      responseContent = anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)]
    } else if (
      userContent.includes("depress") ||
      userContent.includes("sad") ||
      userContent.includes("hopeless") ||
      userContent.includes("empty")
    ) {
      const depressionResponses = keywordResponses.depression
      responseContent = depressionResponses[Math.floor(Math.random() * depressionResponses.length)]
    } else if (
      userContent.includes("sleep") ||
      userContent.includes("insomnia") ||
      userContent.includes("tired") ||
      userContent.includes("rest")
    ) {
      const sleepResponses = keywordResponses.sleep
      responseContent = sleepResponses[Math.floor(Math.random() * sleepResponses.length)]
    } else if (
      userContent.includes("relationship") ||
      userContent.includes("partner") ||
      userContent.includes("friend") ||
      userContent.includes("family")
    ) {
      const relationshipResponses = keywordResponses.relationship
      responseContent = relationshipResponses[Math.floor(Math.random() * relationshipResponses.length)]
    } else {
      // Use general responses if no keywords match
      responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    }

    return NextResponse.json({ content: responseContent })
  } catch (error) {
    console.error("Error in AI doctor route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
