// Mock responses for the AI mental health service
export const MOCK_RESPONSES = [
  "Thank you for sharing that with me. How long have you been feeling this way?",
  "I understand this must be difficult. Would you like to tell me more about what's been happening?",
  "I appreciate your openness. Many people experience similar feelings. What helps you cope when you feel this way?",
  "That's really insightful. Have you noticed any patterns or triggers related to these feelings?",
  "I'm here to listen without judgment. How can I best support you right now?",
]

export interface Resource {
  title: string
  description: string
  url?: string
  type: "contact" | "article" | "video" | "exercise"
}

export const isDevelopmentMode = true

class AIMentalHealthService {
  private static instance: AIMentalHealthService

  private constructor() {
    console.log("AI Mental Health Service initialized in development mode")
  }

  public static getInstance(): AIMentalHealthService {
    if (!AIMentalHealthService.instance) {
      AIMentalHealthService.instance = new AIMentalHealthService()
    }
    return AIMentalHealthService.instance
  }

  // Analyze text for potential risk factors
  public analyzeText(text: string): { riskFactors: string[]; riskLevel: "low" | "medium" | "high" } {
    const lowerText = text.toLowerCase()
    const highRiskWords = ["suicide", "kill myself", "end my life", "don't want to live", "better off dead"]
    const mediumRiskWords = ["hopeless", "worthless", "can't go on", "giving up", "no point", "hurt myself"]

    const riskFactors: string[] = []

    // Check for high risk words
    for (const word of highRiskWords) {
      if (lowerText.includes(word)) {
        riskFactors.push(word)
      }
    }

    // Check for medium risk words
    for (const word of mediumRiskWords) {
      if (lowerText.includes(word)) {
        riskFactors.push(word)
      }
    }

    // Determine risk level
    let riskLevel: "low" | "medium" | "high" = "low"
    if (riskFactors.some((factor) => highRiskWords.includes(factor))) {
      riskLevel = "high"
    } else if (riskFactors.length > 0) {
      riskLevel = "medium"
    }

    return { riskFactors, riskLevel }
  }

  // Get a chat response
  public async getChatResponse(messages: { role: string; content: string }[]): Promise<{ content: string }> {
    try {
      // In development mode, return a mock response
      if (isDevelopmentMode) {
        return { content: MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)] }
      }

      // In production, call the API
      const response = await fetch("/api/mental-health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error getting chat response:", error)
      return { content: "I'm having trouble connecting. Please try again later." }
    }
  }

  // Analyze text sentiment
  public async analyzeTextSentiment(text: string): Promise<{
    sentiment: "positive" | "neutral" | "negative"
    riskLevel: "low" | "medium" | "high"
    recommendedResources?: string[]
  }> {
    try {
      // In development mode, return a mock response
      if (isDevelopmentMode) {
        const { riskLevel } = this.analyzeText(text)
        const sentiment = this.getRandomSentiment()
        const recommendedResources = this.getRandomResources()

        return { sentiment, riskLevel, recommendedResources }
      }

      // In production, call the API
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, operation: "analyze-sentiment" }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      const { riskLevel } = this.analyzeText(text)

      return {
        sentiment: data.sentiment,
        riskLevel,
        recommendedResources: this.getRecommendedResources(data.sentiment, riskLevel),
      }
    } catch (error) {
      console.error("Error analyzing text sentiment:", error)
      return { sentiment: "neutral", riskLevel: "low" }
    }
  }

  // Get random sentiment for development mode
  private getRandomSentiment(): "positive" | "neutral" | "negative" {
    const sentiments: ("positive" | "neutral" | "negative")[] = ["positive", "neutral", "negative"]
    return sentiments[Math.floor(Math.random() * sentiments.length)]
  }

  // Get random resources for development mode
  private getRandomResources(): string[] {
    const resources = ["meditation", "breathing_exercise", "therapy_resources", "support_groups", "self_care"]
    const count = Math.floor(Math.random() * 3) + 1 // 1-3 resources
    const selectedResources: string[] = []

    for (let i = 0; i < count; i++) {
      const resource = resources[Math.floor(Math.random() * resources.length)]
      if (!selectedResources.includes(resource)) {
        selectedResources.push(resource)
      }
    }

    return selectedResources
  }

  // Get recommended resources based on sentiment and risk level
  private getRecommendedResources(sentiment: string, riskLevel: string): string[] {
    if (riskLevel === "high") {
      return ["crisis_resources", "therapy_resources", "support_groups"]
    }

    if (sentiment === "negative") {
      return ["meditation", "breathing_exercise", "self_care"]
    }

    if (sentiment === "neutral") {
      return ["meditation", "journaling", "physical_activity"]
    }

    return ["gratitude_practice", "positive_affirmations", "social_connection"]
  }
}

export const aiMentalHealthService = AIMentalHealthService.getInstance()
export default aiMentalHealthService
