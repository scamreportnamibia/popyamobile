import { EventEmitter } from "events"
import webRTCCallService, { CallEvent } from "./webrtc-call-service"

// Define AI assistant events
export enum AIAssistantEvent {
  SUGGESTION = "suggestion",
  SUMMARY = "summary",
  SENTIMENT_ANALYSIS = "sentimentAnalysis",
  TRANSCRIPTION = "transcription",
  ERROR = "error",
}

// Define AI assistant options
export interface AIAssistantOptions {
  enableTranscription: boolean
  enableSentimentAnalysis: boolean
  enableSuggestions: boolean
  enableSummary: boolean
}

// Define sentiment analysis result
export interface SentimentAnalysisResult {
  score: number // -1 (negative) to 1 (positive)
  magnitude: number // 0 to infinity (intensity)
  text: string
}

// Define call summary
export interface CallSummary {
  duration: number
  topics: string[]
  keyPoints: string[]
  actionItems: string[]
  sentiment: string
}

// Define suggestion
export interface Suggestion {
  text: string
  type: "response" | "question" | "information" | "action"
  confidence: number
}

export type SentimentType = "positive" | "neutral" | "negative"

export interface AIAnalysisResult {
  sentiment: SentimentType
  suggestions: string[]
  summary?: string
  keyTopics?: string[]
  riskFactors?: string[]
}

export class AICallAssistant extends EventEmitter {
  private conversationHistory: string[] = []
  private onUpdate: (result: AIAnalysisResult) => void
  private processingInterval: NodeJS.Timeout | null = null
  private isActive = false
  private options: AIAssistantOptions
  private transcripts: { userId: string; text: string; timestamp: number }[] = []
  private callStartTime = 0
  private callEndTime = 0
  private sentimentHistory: SentimentAnalysisResult[] = []
  private suggestionInterval: NodeJS.Timeout | null = null
  private isProductionMode = false

  // Sentiment analysis dictionaries
  private positiveWords = [
    "happy",
    "good",
    "great",
    "excellent",
    "better",
    "improving",
    "hopeful",
    "grateful",
    "thankful",
    "excited",
    "joy",
    "love",
    "pleased",
    "glad",
    "wonderful",
    "fantastic",
    "delighted",
    "content",
    "satisfied",
    "positive",
    "optimistic",
    "encouraged",
    "motivated",
    "inspired",
    "relaxed",
    "calm",
  ]

  private negativeWords = [
    "sad",
    "bad",
    "terrible",
    "awful",
    "worse",
    "depressed",
    "anxious",
    "worried",
    "scared",
    "fear",
    "angry",
    "upset",
    "unhappy",
    "disappointed",
    "frustrated",
    "annoyed",
    "stressed",
    "overwhelmed",
    "exhausted",
    "tired",
    "hopeless",
    "helpless",
    "alone",
    "lonely",
    "isolated",
    "hurt",
    "pain",
    "suffering",
  ]

  // Mental health topics for detection
  private mentalHealthTopics = {
    anxiety: ["anxious", "worry", "panic", "stress", "nervous", "fear", "tension"],
    depression: ["depressed", "sad", "hopeless", "empty", "worthless", "tired", "exhausted"],
    sleep: ["insomnia", "sleep", "tired", "rest", "fatigue", "exhausted", "nightmares"],
    trauma: ["trauma", "ptsd", "flashback", "nightmare", "trigger", "abuse"],
    relationships: ["relationship", "family", "friend", "partner", "spouse", "marriage", "divorce"],
    "self-esteem": ["confidence", "self-esteem", "worth", "value", "failure", "success"],
    grief: ["grief", "loss", "death", "mourning", "missing", "gone"],
  }

  // Risk factors that need immediate attention
  private riskFactors = [
    "suicide",
    "kill myself",
    "end my life",
    "die",
    "death",
    "harm myself",
    "hurt myself",
    "self-harm",
    "cutting",
    "overdose",
    "pills",
    "no reason to live",
  ]

  constructor(options?: Partial<AIAssistantOptions>) {
    super()
    this.options = {
      enableTranscription: true,
      enableSentimentAnalysis: true,
      enableSuggestions: true,
      enableSummary: true,
      ...options,
    }

    // Set max listeners to avoid memory leak warnings
    this.setMaxListeners(20)
  }

  // Initialize the AI assistant
  public initialize(): void {
    // Subscribe to WebRTC call service events
    webRTCCallService.on(CallEvent.STATE_CHANGED, this.handleCallStateChanged.bind(this))
    webRTCCallService.on(CallEvent.TRANSCRIPTION_RESULT, this.handleTranscriptionResult.bind(this))
    webRTCCallService.on(CallEvent.SENTIMENT_RESULT, this.handleSentimentResult.bind(this))
    webRTCCallService.on(CallEvent.CALL_ENDED, this.handleCallEnded.bind(this))
  }

  // Start the AI assistant
  public start(): void {
    if (this.isActive) return

    this.isActive = true
    this.callStartTime = Date.now()
    this.transcripts = []
    this.sentimentHistory = []

    // Start generating suggestions periodically
    if (this.options.enableSuggestions) {
      this.startSuggestionGenerator()
    }
  }

  // Stop the AI assistant
  public stop(): void {
    if (!this.isActive) return

    this.isActive = false
    this.callEndTime = Date.now()

    // Stop suggestion generator
    if (this.suggestionInterval) {
      clearInterval(this.suggestionInterval)
      this.suggestionInterval = null
    }

    // Generate final summary if enabled
    if (this.options.enableSummary) {
      this.generateCallSummary()
    }
  }

  // Get the full transcript of the call
  public getTranscript(): string {
    return this.transcripts
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((t) => `[${new Date(t.timestamp).toISOString()}] ${t.userId}: ${t.text}`)
      .join("\n")
  }

  // Get the overall sentiment of the call
  public getOverallSentiment(): SentimentAnalysisResult | null {
    if (this.sentimentHistory.length === 0) return null

    // Calculate average sentiment score and magnitude
    const totalScore = this.sentimentHistory.reduce((sum, item) => sum + item.score, 0)
    const totalMagnitude = this.sentimentHistory.reduce((sum, item) => sum + item.magnitude, 0)

    return {
      score: totalScore / this.sentimentHistory.length,
      magnitude: totalMagnitude / this.sentimentHistory.length,
      text: "Overall call sentiment",
    }
  }

  // Handle call state changes
  private handleCallStateChanged(data: { previous: string; current: string }): void {
    if (data.current === "connected" && data.previous !== "connected") {
      this.start()
    } else if (data.current !== "connected" && data.previous === "connected") {
      this.stop()
    }
  }

  // Handle transcription results
  private handleTranscriptionResult(data: { transcript: string; isFinal: boolean; userId: string }): void {
    if (!this.isActive || !data.isFinal) return

    // Add to transcript history
    this.transcripts.push({
      userId: data.userId,
      text: data.transcript,
      timestamp: Date.now(),
    })

    // Emit transcription event
    this.emit(AIAssistantEvent.TRANSCRIPTION, {
      userId: data.userId,
      text: data.transcript,
      timestamp: Date.now(),
    })

    // Analyze sentiment if enabled
    if (this.options.enableSentimentAnalysis) {
      this.analyzeSentiment(data.transcript)
    }
  }

  // Handle sentiment analysis results
  private handleSentimentResult(result: SentimentAnalysisResult): void {
    if (!this.isActive) return

    // Add to sentiment history
    this.sentimentHistory.push(result)

    // Emit sentiment analysis event
    this.emit(AIAssistantEvent.SENTIMENT_ANALYSIS, result)
  }

  // Handle call ended event
  private handleCallEnded(): void {
    this.stop()
  }

  // Analyze sentiment of text
  private async analyzeSentiment(text: string): Promise<void> {
    if (!this.isActive || !this.options.enableSentimentAnalysis) return

    try {
      let sentimentResult: SentimentAnalysisResult

      if (this.isProductionMode) {
        // Use server API route instead of direct API call
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operation: "analyze-sentiment",
            text,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        sentimentResult = await response.json()
      } else {
        // Use local sentiment analysis in development mode
        sentimentResult = this.localSentimentAnalysis(text)
      }

      // Add to sentiment history
      this.sentimentHistory.push(sentimentResult)

      // Emit sentiment analysis event
      this.emit(AIAssistantEvent.SENTIMENT_ANALYSIS, sentimentResult)
    } catch (error) {
      console.error("Failed to analyze sentiment", error)
      this.emit(AIAssistantEvent.ERROR, { message: "Failed to analyze sentiment", error })
    }
  }

  // Local sentiment analysis for development mode
  private localSentimentAnalysis(text: string): SentimentAnalysisResult {
    const lowerText = text.toLowerCase()
    let positiveScore = 0
    let negativeScore = 0

    // Count positive and negative words
    this.positiveWords.forEach((word) => {
      if (lowerText.includes(word)) positiveScore++
    })

    this.negativeWords.forEach((word) => {
      if (lowerText.includes(word)) negativeScore++
    })

    // Calculate sentiment score between -1 and 1
    let score = 0
    if (positiveScore > 0 || negativeScore > 0) {
      score = (positiveScore - negativeScore) / (positiveScore + negativeScore)
    }

    // Calculate magnitude (intensity)
    const magnitude = (positiveScore + negativeScore) / 10

    return {
      score,
      magnitude,
      text,
    }
  }

  // Generate call summary
  private async generateCallSummary(): Promise<void> {
    if (!this.options.enableSummary || this.transcripts.length === 0) return

    try {
      const duration = this.callEndTime - this.callStartTime
      let summary: CallSummary

      if (this.isProductionMode) {
        // Use server API route instead of direct API call
        const fullTranscript = this.getTranscript()
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operation: "summarize",
            text: fullTranscript,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const result = await response.json()
        summary = {
          duration: Math.floor(duration / 1000),
          topics: result.topics || [],
          keyPoints: result.keyPoints || [],
          actionItems: result.actionItems || [],
          sentiment: this.getOverallSentimentDescription(),
        }
      } else {
        // Use mock summary in development mode
        summary = {
          duration: Math.floor(duration / 1000), // in seconds
          topics: ["Mental health", "Anxiety management", "Support resources"],
          keyPoints: [
            "User expressed feelings of anxiety",
            "Discussed coping strategies",
            "Recommended professional support",
          ],
          actionItems: ["Follow up with therapist", "Try breathing exercises"],
          sentiment: this.getOverallSentimentDescription(),
        }
      }

      // Emit summary event
      this.emit(AIAssistantEvent.SUMMARY, summary)
    } catch (error) {
      console.error("Failed to generate call summary", error)
      this.emit(AIAssistantEvent.ERROR, { message: "Failed to generate call summary", error })
    }
  }

  // Start generating suggestions periodically
  private startSuggestionGenerator(): void {
    if (this.suggestionInterval) {
      clearInterval(this.suggestionInterval)
    }

    // Generate suggestions every 10 seconds
    this.suggestionInterval = setInterval(() => {
      if (!this.isActive || this.transcripts.length === 0) return

      this.generateSuggestion()
    }, 10000)
  }

  // Generate a suggestion based on the conversation
  private async generateSuggestion(): Promise<void> {
    if (!this.isActive || !this.options.enableSuggestions || this.transcripts.length === 0) return

    try {
      // Get the last few transcripts
      const recentTranscripts = this.transcripts
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5)
        .map((t) => t.text)
        .join(" ")

      let suggestion: Suggestion

      if (this.isProductionMode) {
        // Use server API route instead of direct API call
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operation: "chat-completion",
            messages: [
              {
                role: "system",
                content:
                  "You are an AI assistant helping with a mental health conversation. Generate a helpful suggestion based on the recent transcript.",
              },
              { role: "user", content: recentTranscripts },
            ],
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const result = await response.json()
        suggestion = {
          text: result.content || "Would you like to talk more about that?",
          type: "response",
          confidence: 0.8,
        }
      } else {
        // Use mock suggestion in development mode
        const suggestionTypes: ("response" | "question" | "information" | "action")[] = [
          "response",
          "question",
          "information",
          "action",
        ]

        const mockSuggestions = [
          "It sounds like you're going through a difficult time. Would you like to talk more about that?",
          "Have you tried any relaxation techniques that have worked for you in the past?",
          "It might be helpful to speak with a mental health professional about these feelings.",
          "Would it help to break down this problem into smaller, more manageable parts?",
        ]

        suggestion = {
          text: mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)],
          type: suggestionTypes[Math.floor(Math.random() * suggestionTypes.length)],
          confidence: 0.7 + Math.random() * 0.3, // Random between 0.7 and 1.0
        }
      }

      // Only emit suggestions with high confidence
      if (suggestion.confidence > 0.7) {
        this.emit(AIAssistantEvent.SUGGESTION, suggestion)
      }
    } catch (error) {
      console.error("Failed to generate suggestion", error)
      this.emit(AIAssistantEvent.ERROR, { message: "Failed to generate suggestion", error })
    }
  }

  // Get a description of the overall sentiment
  private getOverallSentimentDescription(): string {
    const sentiment = this.getOverallSentiment()

    if (!sentiment) return "Neutral"

    if (sentiment.score > 0.5) return "Very Positive"
    if (sentiment.score > 0.1) return "Positive"
    if (sentiment.score > -0.1) return "Neutral"
    if (sentiment.score > -0.5) return "Negative"
    return "Very Negative"
  }
}

// Create and export a singleton instance
const aiCallAssistant = new AICallAssistant()
export default aiCallAssistant
