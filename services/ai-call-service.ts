export interface CallTranscript {
  id: string
  callId: string
  transcript: TranscriptSegment[]
  summary?: string
  sentiment?: "positive" | "neutral" | "negative"
  keywords?: string[]
  suggestedActions?: string[]
  userDemographics?: UserDemographics
  locationData?: LocationData
  reportTimestamp: number
}

export interface UserDemographics {
  age?: number
  gender?: string
  region?: string
  town?: string
  problemCategory?: string
}

export interface LocationData {
  latitude?: number
  longitude?: number
  accuracy?: number
  timestamp?: number
  address?: string
}

export interface TranscriptSegment {
  speaker: string
  text: string
  timestamp: number
  sentiment?: "positive" | "neutral" | "negative"
  emotionalState?: string[]
  riskLevel?: "low" | "medium" | "high"
}

export class AICallService {
  private static instance: AICallService
  private activeTranscripts: Map<string, CallTranscript> = new Map()
  private speechRecognition: Map<string, any> = new Map() // Using 'any' to avoid type issues
  private demographicsData: Map<string, UserDemographics> = new Map()
  private locationData: Map<string, LocationData> = new Map()

  private constructor() {
    console.log(`AI Call Service initialized (Production Mode)`)
  }

  public static getInstance(): AICallService {
    if (!AICallService.instance) {
      AICallService.instance = new AICallService()
    }
    return AICallService.instance
  }

  /**
   * Set user demographics data
   */
  public setUserDemographics(callId: string, demographics: UserDemographics): void {
    this.demographicsData.set(callId, demographics)

    // Update the transcript with demographics data
    const transcript = this.activeTranscripts.get(callId)
    if (transcript) {
      transcript.userDemographics = demographics
    }
  }

  /**
   * Set location data
   */
  public setLocationData(callId: string, location: LocationData): void {
    this.locationData.set(callId, location)

    // Update the transcript with location data
    const transcript = this.activeTranscripts.get(callId)
    if (transcript) {
      transcript.locationData = location
    }
  }

  /**
   * Start transcribing a call
   */
  public startTranscribing(
    callId: string,
    localStream: MediaStream,
    localSpeakerName = "You",
    userData?: UserDemographics,
  ): void {
    if (!callId) return

    // Check browser support
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.error("Speech recognition not supported in this browser")
      return
    }

    const transcript: CallTranscript = {
      id: `transcript-${Date.now()}`,
      callId,
      transcript: [],
      reportTimestamp: Date.now(),
      userDemographics: userData || this.demographicsData.get(callId),
      locationData: this.locationData.get(callId),
    }

    this.activeTranscripts.set(callId, transcript)

    // Create speech recognition for the local user
    try {
      // @ts-ignore - TypeScript doesn't know about the browser's SpeechRecognition API
      const SpeechRecognition: any = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            const text = result[0].transcript.trim()
            if (text) {
              const segment: TranscriptSegment = {
                speaker: localSpeakerName,
                text,
                timestamp: Date.now(),
              }
              transcript.transcript.push(segment)
              this.analyzeSegmentSentiment(callId, segment)
              this.analyzeRiskLevel(callId, segment)

              // Check for high-risk speech and alert if necessary
              if (segment.riskLevel === "high") {
                this.sendRealTimeAlert(callId, segment)
              }
            }
          }
        }
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error)
      }

      recognition.onend = () => {
        // Restart if transcription ends unexpectedly
        if (this.speechRecognition.has(callId)) {
          recognition.start()
        }
      }

      this.speechRecognition.set(callId, recognition)
      recognition.start()
    } catch (error) {
      console.error("Error starting speech recognition:", error)
    }
  }

  /**
   * Stop transcribing a call
   */
  public async stopTranscribing(callId: string): Promise<CallTranscript | null> {
    if (!callId || !this.activeTranscripts.has(callId)) return null

    const recognition = this.speechRecognition.get(callId)
    if (recognition) {
      recognition.stop()
      this.speechRecognition.delete(callId)
    }

    const transcript = this.activeTranscripts.get(callId)!

    // Generate summary and analyze sentiment
    await this.generateCallSummary(callId)

    return transcript
  }

  /**
   * Add a transcript segment from a remote participant
   */
  public addRemoteTranscriptSegment(callId: string, speaker: string, text: string): void {
    if (!callId || !this.activeTranscripts.has(callId)) return

    const transcript = this.activeTranscripts.get(callId)!
    const segment: TranscriptSegment = {
      speaker,
      text,
      timestamp: Date.now(),
    }

    transcript.transcript.push(segment)
    this.analyzeSegmentSentiment(callId, segment)
    this.analyzeRiskLevel(callId, segment)

    // Check for high-risk speech and alert if necessary
    if (segment.riskLevel === "high") {
      this.sendRealTimeAlert(callId, segment)
    }
  }

  /**
   * Get the current transcript for a call
   */
  public getTranscript(callId: string): CallTranscript | null {
    return this.activeTranscripts.get(callId) || null
  }

  /**
   * Export the transcript as a PDF
   */
  public async exportTranscriptPDF(callId: string): Promise<Blob | null> {
    const transcript = this.getTranscript(callId)
    if (!transcript) return null

    // This is a placeholder - in a real implementation you would use a library like jsPDF
    // to generate a PDF with the transcript data

    // For now, let's just create a JSON blob
    const transcriptData = JSON.stringify(transcript, null, 2)
    return new Blob([transcriptData], { type: "application/json" })
  }

  /**
   * Analyze sentiment of a transcript segment
   */
  private async analyzeSegmentSentiment(callId: string, segment: TranscriptSegment): Promise<void> {
    try {
      segment.sentiment = this.analyzeSentimentLocally(segment.text)
      segment.emotionalState = this.detectEmotionalStatesLocally(segment.text)
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
      segment.sentiment = "neutral"
    }
  }

  /**
   * Analyze risk level of a transcript segment
   */
  private async analyzeRiskLevel(callId: string, segment: TranscriptSegment): Promise<void> {
    try {
      segment.riskLevel = this.analyzeRiskLevelLocally(segment.text)
    } catch (error) {
      console.error("Error analyzing risk level:", error)
      segment.riskLevel = "low"
    }
  }

  /**
   * Send a real-time alert to experts about high-risk speech
   */
  private async sendRealTimeAlert(callId: string, segment: TranscriptSegment): Promise<void> {
    const transcript = this.activeTranscripts.get(callId)
    if (!transcript) return

    // In a real implementation, this would send a notification to the admin panel
    // and/or notify experts via a messaging system, email, SMS, etc.
    console.log(`🚨 HIGH RISK ALERT: ${segment.speaker} said "${segment.text}" during call ${callId}`)

    // You would typically integrate with your notification system here
    // For example:
    // notificationService.sendHighRiskAlert({
    //   callId,
    //   transcriptId: transcript.id,
    //   segment,
    //   userDemographics: transcript.userDemographics,
    //   locationData: transcript.locationData,
    //   timestamp: Date.now()
    // })
  }

  /**
   * Generate a summary of the call
   */
  private async generateCallSummary(callId: string): Promise<void> {
    if (!callId || !this.activeTranscripts.has(callId)) return

    const transcript = this.activeTranscripts.get(callId)!

    if (transcript.transcript.length === 0) return

    try {
      transcript.summary = "This is a summary of the conversation."
      transcript.keywords = ["mental health", "support", "resources"]
      transcript.suggestedActions = ["Follow up with user", "Schedule a check-in", "Provide resources"]
    } catch (error) {
      console.error("Error generating call summary:", error)
    }
  }

  /**
   * Local fallback methods for sentiment analysis
   */
  private analyzeSentimentLocally(text: string): "positive" | "neutral" | "negative" {
    const text_lower = text.toLowerCase()

    const positiveWords = ["happy", "good", "great", "excellent", "better", "improving", "hopeful", "glad", "enjoy"]
    const negativeWords = ["sad", "bad", "upset", "terrible", "worse", "anxious", "worried", "depressed", "struggle"]

    let positiveScore = 0
    let negativeScore = 0

    positiveWords.forEach((word) => {
      if (text_lower.includes(word)) positiveScore++
    })

    negativeWords.forEach((word) => {
      if (text_lower.includes(word)) negativeScore++
    })

    if (positiveScore > negativeScore) return "positive"
    if (negativeScore > positiveScore) return "negative"
    return "neutral"
  }

  private detectEmotionalStatesLocally(text: string): string[] {
    const text_lower = text.toLowerCase()

    const emotionKeywords = {
      anxiety: ["anxious", "worry", "nervous", "stress", "panic"],
      sadness: ["sad", "down", "unhappy", "depressed", "miserable"],
      anger: ["angry", "mad", "frustrated", "annoyed", "irritated"],
      fear: ["afraid", "scared", "terrified", "frightened", "fearful"],
      joy: ["happy", "excited", "pleased", "glad", "delighted"],
    }

    const detectedEmotions: string[] = []

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      for (const keyword of keywords) {
        if (text_lower.includes(keyword)) {
          detectedEmotions.push(emotion)
          break
        }
      }
    })

    return detectedEmotions.length > 0 ? detectedEmotions : ["neutral"]
  }

  private analyzeRiskLevelLocally(text: string): "low" | "medium" | "high" {
    const text_lower = text.toLowerCase()

    const highRiskWords = ["suicide", "kill myself", "end my life", "don't want to live", "better off dead"]
    const mediumRiskWords = ["hopeless", "worthless", "can't go on", "giving up", "no point", "hurt myself"]

    for (const word of highRiskWords) {
      if (text_lower.includes(word)) return "high"
    }

    for (const word of mediumRiskWords) {
      if (text_lower.includes(word)) return "medium"
    }

    return "low"
  }
}

export const aiCallService = AICallService.getInstance()
