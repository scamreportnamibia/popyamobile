// This service provides mock data for the app when running in offline mode
// or when API keys are not available

export interface MockResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Generic mock API call function
export async function mockApiCall<T>(mockData: T, delay = 800, shouldSucceed = true): Promise<MockResponse<T>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve({
          data: mockData,
          success: true,
        })
      } else {
        reject({
          data: null,
          success: false,
          message: "Mock API call failed",
        })
      }
    }, delay)
  })
}

// Mental health analysis mock data
export const mockMentalHealthAnalysis = {
  sentiment: {
    score: 0.65,
    label: "positive",
  },
  emotions: {
    joy: 0.45,
    sadness: 0.15,
    anger: 0.05,
    fear: 0.1,
    surprise: 0.25,
  },
  riskFactors: {
    depression: {
      score: 0.25,
      level: "low",
      recommendation: "Continue monitoring your mood and practice self-care.",
    },
    anxiety: {
      score: 0.3,
      level: "low",
      recommendation: "Try mindfulness exercises to manage stress.",
    },
    suicidal: {
      score: 0.05,
      level: "minimal",
      recommendation: "No immediate concern detected.",
    },
  },
  recommendations: [
    "Continue practicing mindfulness and relaxation techniques",
    "Maintain your social connections",
    "Ensure you're getting adequate sleep and exercise",
    "Consider journaling to track your mood patterns",
  ],
}

// Expert recommendations mock data
export const mockExpertRecommendations = [
  {
    id: "exp1",
    name: "Dr. Maria Ndapewa",
    title: "Clinical Psychologist",
    specialization: "Anxiety & Depression",
    matchScore: 92,
    availability: "Available today",
  },
  {
    id: "exp2",
    name: "Thomas Shilongo",
    title: "Counselor",
    specialization: "Trauma Recovery",
    matchScore: 85,
    availability: "Available tomorrow",
  },
  {
    id: "exp3",
    name: "Dr. James Hamukwaya",
    title: "Psychiatrist",
    specialization: "Mood Disorders",
    matchScore: 78,
    availability: "Available in 2 days",
  },
]

// Resource recommendations mock data
export const mockResourceRecommendations = [
  {
    id: "res1",
    title: "Understanding Anxiety",
    type: "article",
    readTime: "5 min read",
    relevanceScore: 95,
  },
  {
    id: "res2",
    title: "Mindfulness Meditation",
    type: "audio",
    duration: "10 min",
    relevanceScore: 88,
  },
  {
    id: "res3",
    title: "Stress Management Techniques",
    type: "video",
    duration: "15 min",
    relevanceScore: 82,
  },
]

// AI chat response mock data
export const getMockAiResponse = (message: string): string => {
  const responses = [
    "I understand how you're feeling. It's completely normal to experience these emotions.",
    "Thank you for sharing that with me. Would you like to talk more about what's causing these feelings?",
    "I hear you. Have you tried any relaxation techniques that have helped you in the past?",
    "That sounds challenging. Remember that it's okay to ask for help when you need it.",
    "I appreciate you opening up. What small step could you take today to help yourself feel better?",
    "Your feelings are valid. Would it help to connect with a professional who specializes in this area?",
    "I'm here to support you. Have you considered joining one of our support groups to connect with others?",
    "That's a common experience. Many people find that regular exercise helps manage these feelings.",
    "I'm listening. Sometimes writing down your thoughts in a journal can help process these emotions.",
    "You're not alone in feeling this way. Would you like me to suggest some resources that might help?",
  ]

  // Simple keyword matching for slightly more relevant responses
  if (message.toLowerCase().includes("sad") || message.toLowerCase().includes("depress")) {
    return "I'm sorry to hear you're feeling down. Depression and sadness are common experiences, but that doesn't make them any easier to deal with. Would you like to explore some coping strategies together?"
  }

  if (
    message.toLowerCase().includes("anxious") ||
    message.toLowerCase().includes("worry") ||
    message.toLowerCase().includes("stress")
  ) {
    return "Anxiety can be really challenging to manage. Deep breathing exercises and grounding techniques might help in the moment. Would you like to learn about some techniques you can try?"
  }

  if (message.toLowerCase().includes("sleep") || message.toLowerCase().includes("tired")) {
    return "Sleep difficulties can have a big impact on our mental wellbeing. Establishing a consistent sleep routine and creating a relaxing bedtime environment might help. Would you like some more specific suggestions?"
  }

  // Default to random response if no keywords match
  return responses[Math.floor(Math.random() * responses.length)]
}

// Export all mock data functions
export const MockDataService = {
  getMentalHealthAnalysis: () => mockApiCall(mockMentalHealthAnalysis),
  getExpertRecommendations: () => mockApiCall(mockExpertRecommendations),
  getResourceRecommendations: () => mockApiCall(mockResourceRecommendations),
  getAiResponse: (message: string) => mockApiCall(getMockAiResponse(message)),
}
