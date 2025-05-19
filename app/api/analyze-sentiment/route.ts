import { NextResponse } from "next/server"

// Mock sentiment analysis function
function analyzeSentiment(text: string) {
  // Simple keyword-based sentiment analysis
  const positiveWords = ["happy", "good", "great", "excellent", "joy", "love", "hope", "positive", "better", "improve"]
  const negativeWords = ["sad", "bad", "terrible", "awful", "depressed", "anxious", "worried", "fear", "stress", "pain"]
  const riskWords = ["suicide", "kill", "die", "death", "end my life", "hurt myself", "self-harm", "no reason to live"]

  const lowerText = text.toLowerCase()

  // Count occurrences of positive and negative words
  let positiveCount = 0
  let negativeCount = 0
  let riskCount = 0

  positiveWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lowerText.match(regex)
    if (matches) positiveCount += matches.length
  })

  negativeWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lowerText.match(regex)
    if (matches) negativeCount += matches.length
  })

  riskWords.forEach((word) => {
    if (lowerText.includes(word)) riskCount++
  })

  // Calculate sentiment score (-1 to 1)
  const totalWords = text.split(/\s+/).length
  const sentimentScore =
    totalWords > 0
      ? (positiveCount - negativeCount) / Math.min(totalWords, positiveWords.length + negativeWords.length)
      : 0

  // Determine sentiment label
  let sentiment
  if (sentimentScore > 0.3) sentiment = "positive"
  else if (sentimentScore < -0.3) sentiment = "negative"
  else sentiment = "neutral"

  // Determine risk level
  let riskLevel = "low"
  if (riskCount > 0) riskLevel = "high"
  else if (negativeCount > positiveCount * 2) riskLevel = "medium"

  // Generate recommendations based on sentiment and risk
  let recommendations = []

  if (riskLevel === "high") {
    recommendations = [
      "Please consider reaching out to a mental health professional immediately.",
      "Contact a crisis helpline: Lifeline/Childline Namibia at 116 (toll-free).",
      "You're not alone, and help is available.",
    ]
  } else if (riskLevel === "medium" || sentiment === "negative") {
    recommendations = [
      "Consider speaking with a mental health professional.",
      "Practice self-care activities like deep breathing or gentle exercise.",
      "Connect with supportive friends or family members.",
    ]
  } else {
    recommendations = [
      "Continue practicing positive mental health habits.",
      "Regular exercise and good sleep can help maintain your wellbeing.",
      "Journaling can help track your emotional patterns.",
    ]
  }

  return {
    sentiment,
    score: sentimentScore,
    riskLevel,
    recommendations,
    analysis: {
      positiveWordCount: positiveCount,
      negativeWordCount: negativeCount,
      riskWordCount: riskCount,
      totalWords: totalWords,
    },
  }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid request. Please provide text to analyze." }, { status: 400 })
    }

    // Use the mock sentiment analysis function
    const result = analyzeSentiment(text)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error analyzing sentiment:", error)
    return NextResponse.json({ error: "Failed to analyze sentiment." }, { status: 500 })
  }
}
