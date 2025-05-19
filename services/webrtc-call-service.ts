import { EventEmitter } from "events"

// Define call events
export enum CallEvent {
  STATE_CHANGED = "stateChanged",
  REMOTE_STREAM_ADDED = "remoteStreamAdded",
  LOCAL_STREAM_ADDED = "localStreamAdded",
  CALL_ENDED = "callEnded",
  ERROR = "error",
  ICE_CANDIDATE = "iceCandidate",
  OFFER_CREATED = "offerCreated",
  ANSWER_CREATED = "answerCreated",
  TRANSCRIPTION_RESULT = "transcriptionResult",
  SENTIMENT_RESULT = "sentimentResult",
}

// Define call statistics
export interface CallStats {
  callDuration: number
  bytesTransferred: number
  packetsLost: number
  latency: number
  resolution: string
  codec: string
}

// Define call options
export interface CallOptions {
  enableVideo: boolean
  enableAudio: boolean
  enableTranscription: boolean
  enableSentimentAnalysis: boolean
  iceServers?: RTCIceServer[]
}

// Default ICE servers (STUN/TURN)
const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  // Add your TURN servers here for production
]

// Enhanced WebRTC-based call service with AI integration
// Zero-rated implementation that doesn't require paid third-party services

export type CallType = "video" | "audio"
export type CallStatus = "idle" | "connecting" | "connected" | "error" | "ended"

export interface CallParticipant {
  id: string
  name: string
  avatar?: string
  audioEnabled: boolean
  videoEnabled: boolean
}

export interface CallStateInterface {
  status: CallStatus
  callId?: string
  localParticipant?: CallParticipant
  remoteParticipants: CallParticipant[]
  error?: Error
  // AI-related state
  transcription: string
  sentiment?: "positive" | "neutral" | "negative"
  aiSuggestions: string[]
  isAIAssistantActive: boolean
}

export enum CallState {
  IDLE = "idle",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  RECONNECTING = "reconnecting",
  DISCONNECTED = "disconnected",
  ERROR = "error",
}

export class WebRTCCallService extends EventEmitter {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private callState: CallState = CallState.IDLE
  private callStartTime = 0
  private callEndTime = 0
  private signaling: any // Will be set by the signaling service
  private options: CallOptions = {
    enableVideo: true,
    enableAudio: true,
    enableTranscription: false,
    enableSentimentAnalysis: false,
    iceServers: DEFAULT_ICE_SERVERS,
  }
  private recognition: SpeechRecognition | null = null
  private callId = ""
  private userId = ""
  private remoteUserId = ""
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private reconnectInterval = 2000
  private reconnectTimeout: NodeJS.Timeout | null = null

  // Using multiple STUN servers for better connectivity
  private iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    // Free TURN servers - in production you would use your own TURN server
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ]

  // For speech recognition
  private speechRecognition: SpeechRecognition | null = null
  private isTranscribing = false

  // For AI processing
  private aiProcessor: AIProcessor | null = null

  constructor() {
    super()
    // Set max listeners to avoid memory leak warnings
    this.setMaxListeners(20)
    // Initialize signaling service
    //this.signaling = new SignalingService()
    //this.setupSignalingListeners()

    // Initialize AI processor
    //this.aiProcessor = new AIProcessor((suggestions, sentiment) => {
    //  this.state.aiSuggestions = suggestions;
    //  this.state.sentiment = sentiment;
    //  this.notifyStateChange();
    //});
  }

  // Initialize the call service with signaling and options
  public initialize(signaling: any, userId: string, options?: Partial<CallOptions>): void {
    this.signaling = signaling
    this.userId = userId
    this.options = { ...this.options, ...options }

    // Set up signaling event listeners
    this.signaling.on("offer", this.handleOffer.bind(this))
    this.signaling.on("answer", this.handleAnswer.bind(this))
    this.signaling.on("iceCandidate", this.handleRemoteIceCandidate.bind(this))
    this.signaling.on("hangup", this.handleRemoteHangup.bind(this))
    this.signaling.on("reconnect", this.handleReconnectRequest.bind(this))
    this.signaling.on("error", this.handleSignalingError.bind(this))
  }

  // Start a call to a remote user
  public async startCall(remoteUserId: string, options?: Partial<CallOptions>): Promise<void> {
    try {
      this.remoteUserId = remoteUserId
      this.callId = `${this.userId}_${remoteUserId}_${Date.now()}`
      this.options = { ...this.options, ...options }
      this.setCallState(CallState.CONNECTING)

      // Get local media stream
      await this.getLocalStream()

      // Create peer connection
      await this.createPeerConnection()

      // Create and send offer
      const offer = await this.peerConnection!.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: this.options.enableVideo,
      })

      await this.peerConnection!.setLocalDescription(offer)

      // Send offer through signaling
      this.signaling.sendOffer(this.remoteUserId, {
        callId: this.callId,
        offer: offer,
        userId: this.userId,
      })

      // Start call timer
      this.callStartTime = Date.now()

      // Start speech recognition if enabled
      if (this.options.enableTranscription) {
        this.startSpeechRecognition()
      }

      this.emit(CallEvent.OFFER_CREATED, offer)
    } catch (error) {
      this.handleError("Failed to start call", error)
    }
  }

  // Answer an incoming call
  public async answerCall(
    callId: string,
    remoteUserId: string,
    remoteOffer: RTCSessionDescriptionInit,
    options?: Partial<CallOptions>,
  ): Promise<void> {
    try {
      this.callId = callId
      this.remoteUserId = remoteUserId
      this.options = { ...this.options, ...options }
      this.setCallState(CallState.CONNECTING)

      // Get local media stream
      await this.getLocalStream()

      // Create peer connection
      await this.createPeerConnection()

      // Set remote description (offer)
      await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(remoteOffer))

      // Create and send answer
      const answer = await this.peerConnection!.createAnswer()
      await this.peerConnection!.setLocalDescription(answer)

      // Send answer through signaling
      this.signaling.sendAnswer(this.remoteUserId, {
        callId: this.callId,
        answer: answer,
        userId: this.userId,
      })

      // Start call timer
      this.callStartTime = Date.now()

      // Start speech recognition if enabled
      if (this.options.enableTranscription) {
        this.startSpeechRecognition()
      }

      this.emit(CallEvent.ANSWER_CREATED, answer)
    } catch (error) {
      this.handleError("Failed to answer call", error)
    }
  }

  // End the current call
  public async endCall(): Promise<void> {
    try {
      // Send hangup signal to remote peer
      if (this.remoteUserId) {
        this.signaling.sendHangup(this.remoteUserId, {
          callId: this.callId,
          userId: this.userId,
        })
      }

      // Stop call timer
      this.callEndTime = Date.now()

      // Stop speech recognition if active
      this.stopSpeechRecognition()

      // Clean up resources
      await this.cleanup()

      // Calculate and emit call statistics
      const callStats = this.generateCallStats()
      this.emit(CallEvent.CALL_ENDED, callStats)

      this.setCallState(CallState.IDLE)
    } catch (error) {
      this.handleError("Failed to end call properly", error)
      // Force cleanup even if there was an error
      this.cleanup()
    }
  }

  // Toggle video during a call
  public async toggleVideo(enable: boolean): Promise<void> {
    if (!this.localStream) return

    try {
      const videoTracks = this.localStream.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = enable
      })

      this.options.enableVideo = enable
    } catch (error) {
      this.handleError("Failed to toggle video", error)
    }
  }

  // Toggle audio during a call
  public async toggleAudio(enable: boolean): Promise<void> {
    if (!this.localStream) return

    try {
      const audioTracks = this.localStream.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = enable
      })

      this.options.enableAudio = enable
    } catch (error) {
      this.handleError("Failed to toggle audio", error)
    }
  }

  // Toggle transcription during a call
  public toggleTranscription(enable: boolean): void {
    this.options.enableTranscription = enable

    if (enable) {
      this.startSpeechRecognition()
    } else {
      this.stopSpeechRecognition()
    }
  }

  // Get the current call state
  public getCallState(): CallState {
    return this.callState
  }

  // Get the local media stream
  public getLocalStream(): Promise<MediaStream> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.localStream) {
          resolve(this.localStream)
          return
        }

        const constraints: MediaStreamConstraints = {
          audio: this.options.enableAudio,
          video: this.options.enableVideo
            ? {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user",
              }
            : false,
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        this.localStream = stream
        this.emit(CallEvent.LOCAL_STREAM_ADDED, stream)
        resolve(stream)
      } catch (error) {
        this.handleError("Failed to get local media stream", error)
        reject(error)
      }
    })
  }

  // Get the remote media stream
  public getRemoteStream(): MediaStream | null {
    return this.remoteStream
  }

  // Generate call statistics
  private generateCallStats(): CallStats {
    const duration = this.callEndTime - this.callStartTime
    const bytesTransferred = 0
    const packetsLost = 0
    const latency = 0
    const resolution = "unknown"
    const codec = "unknown"

    // Get stats from RTCPeerConnection if available
    if (this.peerConnection) {
      // In a real implementation, you would use getStats() to get detailed statistics
      // This is a simplified version
    }

    return {
      callDuration: Math.floor(duration / 1000), // in seconds
      bytesTransferred,
      packetsLost,
      latency,
      resolution,
      codec,
    }
  }

  // Create and set up the RTCPeerConnection
  private async createPeerConnection(): Promise<void> {
    try {
      // Close existing connection if any
      if (this.peerConnection) {
        this.peerConnection.close()
      }

      // Create new peer connection with ICE servers
      this.peerConnection = new RTCPeerConnection({
        iceServers: this.options.iceServers || DEFAULT_ICE_SERVERS,
      })

      // Add local tracks to the connection
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection!.addTrack(track, this.localStream!)
        })
      }

      // Set up event handlers
      this.peerConnection.onicecandidate = this.handleIceCandidate.bind(this)
      this.peerConnection.ontrack = this.handleTrack.bind(this)
      this.peerConnection.oniceconnectionstatechange = this.handleIceConnectionStateChange.bind(this)
      this.peerConnection.onsignalingstatechange = this.handleSignalingStateChange.bind(this)
      this.peerConnection.onconnectionstatechange = this.handleConnectionStateChange.bind(this)
    } catch (error) {
      this.handleError("Failed to create peer connection", error)
      throw error
    }
  }

  // Handle ICE candidate events
  private handleIceCandidate(event: RTCPeerConnectionIceEvent): void {
    if (event.candidate) {
      // Send ICE candidate to remote peer through signaling
      this.signaling.sendIceCandidate(this.remoteUserId, {
        callId: this.callId,
        candidate: event.candidate,
        userId: this.userId,
      })

      this.emit(CallEvent.ICE_CANDIDATE, event.candidate)
    }
  }

  // Handle incoming tracks from remote peer
  private handleTrack(event: RTCTrackEvent): void {
    if (event.streams && event.streams[0]) {
      this.remoteStream = event.streams[0]
      this.emit(CallEvent.REMOTE_STREAM_ADDED, this.remoteStream)

      if (this.callState === CallState.CONNECTING) {
        this.setCallState(CallState.CONNECTED)
      }
    }
  }

  // Handle ICE connection state changes
  private handleIceConnectionStateChange(): void {
    if (!this.peerConnection) return

    const state = this.peerConnection.iceConnectionState
    console.log("ICE connection state changed:", state)

    switch (state) {
      case "connected":
      case "completed":
        if (this.callState === CallState.CONNECTING || this.callState === CallState.RECONNECTING) {
          this.setCallState(CallState.CONNECTED)
          this.reconnectAttempts = 0
        }
        break
      case "failed":
      case "disconnected":
        if (this.callState === CallState.CONNECTED) {
          this.attemptReconnection()
        }
        break
      case "closed":
        this.setCallState(CallState.DISCONNECTED)
        break
    }
  }

  // Handle signaling state changes
  private handleSignalingStateChange(): void {
    if (!this.peerConnection) return

    console.log("Signaling state changed:", this.peerConnection.signalingState)

    if (this.peerConnection.signalingState === "closed") {
      this.setCallState(CallState.DISCONNECTED)
    }
  }

  // Handle connection state changes
  private handleConnectionStateChange(): void {
    if (!this.peerConnection) return

    console.log("Connection state changed:", this.peerConnection.connectionState)

    switch (this.peerConnection.connectionState) {
      case "connected":
        if (this.callState === CallState.CONNECTING || this.callState === CallState.RECONNECTING) {
          this.setCallState(CallState.CONNECTED)
          this.reconnectAttempts = 0
        }
        break
      case "disconnected":
      case "failed":
        if (this.callState === CallState.CONNECTED) {
          this.attemptReconnection()
        }
        break
      case "closed":
        this.setCallState(CallState.DISCONNECTED)
        break
    }
  }

  // Handle incoming offers from remote peers
  private async handleOffer(data: any): Promise<void> {
    if (data.callId && data.userId && data.offer) {
      // If we're already in a call, reject the new offer
      if (this.callState !== CallState.IDLE) {
        this.signaling.sendReject(data.userId, {
          callId: data.callId,
          reason: "User is busy in another call",
          userId: this.userId,
        })
        return
      }

      // Emit event for UI to show incoming call
      this.emit("incomingCall", {
        callId: data.callId,
        userId: data.userId,
        offer: data.offer,
      })
    }
  }

  // Handle incoming answers from remote peers
  private async handleAnswer(data: any): Promise<void> {
    if (data.callId === this.callId && data.userId === this.remoteUserId && data.answer) {
      try {
        await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(data.answer))
      } catch (error) {
        this.handleError("Failed to set remote description (answer)", error)
      }
    }
  }

  // Handle incoming ICE candidates from remote peers
  private async handleRemoteIceCandidate(data: any): Promise<void> {
    if (data.callId === this.callId && data.userId === this.remoteUserId && data.candidate) {
      try {
        await this.peerConnection!.addIceCandidate(new RTCIceCandidate(data.candidate))
      } catch (error) {
        this.handleError("Failed to add ICE candidate", error)
      }
    }
  }

  // Handle remote hangup
  private handleRemoteHangup(data: any): void {
    if (data.callId === this.callId && data.userId === this.remoteUserId) {
      this.callEndTime = Date.now()
      this.stopSpeechRecognition()
      this.cleanup()

      const callStats = this.generateCallStats()
      this.emit(CallEvent.CALL_ENDED, callStats)

      this.setCallState(CallState.IDLE)
    }
  }

  // Handle reconnection requests
  private handleReconnectRequest(data: any): void {
    if (data.callId === this.callId && data.userId === this.remoteUserId) {
      // Attempt to reconnect from our side as well
      this.attemptReconnection()
    }
  }

  // Handle signaling errors
  private handleSignalingError(error: any): void {
    this.handleError("Signaling error", error)
  }

  // Handle errors
  private handleError(message: string, error: any): void {
    console.error(message, error)
    this.emit(CallEvent.ERROR, { message, error })

    if (this.callState === CallState.CONNECTING) {
      this.setCallState(CallState.ERROR)
      this.cleanup()
    }
  }

  // Set the call state and emit state change event
  private setCallState(state: CallState): void {
    const previousState = this.callState
    this.callState = state
    this.emit(CallEvent.STATE_CHANGED, { previous: previousState, current: state })
  }

  // Attempt to reconnect after connection failure
  private attemptReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.handleError("Max reconnection attempts reached", null)
      this.endCall()
      return
    }

    this.setCallState(CallState.RECONNECTING)
    this.reconnectAttempts++

    // Clear any existing timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    // Send reconnect signal to remote peer
    this.signaling.sendReconnect(this.remoteUserId, {
      callId: this.callId,
      userId: this.userId,
    })

    // Set timeout for reconnection
    this.reconnectTimeout = setTimeout(async () => {
      try {
        // Create new peer connection
        await this.createPeerConnection()

        // Create and send offer
        const offer = await this.peerConnection!.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: this.options.enableVideo,
        })

        await this.peerConnection!.setLocalDescription(offer)

        // Send offer through signaling
        this.signaling.sendOffer(this.remoteUserId, {
          callId: this.callId,
          offer: offer,
          userId: this.userId,
          isReconnect: true,
        })
      } catch (error) {
        this.handleError("Failed to reconnect", error)
        this.attemptReconnection() // Try again
      }
    }, this.reconnectInterval)
  }

  // Start speech recognition for transcription
  private startSpeechRecognition(): void {
    if (!this.options.enableTranscription || !window.SpeechRecognition) return

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = true

      this.recognition.onresult = (event) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        if (finalTranscript) {
          this.emit(CallEvent.TRANSCRIPTION_RESULT, {
            transcript: finalTranscript,
            isFinal: true,
            userId: this.userId,
          })

          // If sentiment analysis is enabled, analyze the transcript
          if (this.options.enableSentimentAnalysis) {
            this.analyzeSentiment(finalTranscript)
          }
        } else if (interimTranscript) {
          this.emit(CallEvent.TRANSCRIPTION_RESULT, {
            transcript: interimTranscript,
            isFinal: false,
            userId: this.userId,
          })
        }
      }

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        // Restart recognition if it errors out
        this.stopSpeechRecognition()
        this.startSpeechRecognition()
      }

      this.recognition.start()
    } catch (error) {
      console.error("Failed to start speech recognition", error)
    }
  }

  // Stop speech recognition
  private stopSpeechRecognition(): void {
    if (this.recognition) {
      try {
        this.recognition.stop()
      } catch (error) {
        console.error("Error stopping speech recognition", error)
      }
      this.recognition = null
    }
  }

  // Analyze sentiment of transcribed text
  private analyzeSentiment(text: string): void {
    // In a real implementation, you would call an AI service here
    // This is a placeholder for demonstration
    const mockSentiment = {
      score: Math.random() * 2 - 1, // Random score between -1 and 1
      magnitude: Math.random(),
      text,
    }

    this.emit(CallEvent.SENTIMENT_RESULT, mockSentiment)
  }

  // Clean up resources
  private async cleanup(): Promise<void> {
    // Stop speech recognition
    this.stopSpeechRecognition()

    // Clear reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    // Stop local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }

    // Reset remote stream
    this.remoteStream = null
  }

  private setupSignalingListeners() {
    if (!this.signaling) return

    // Listen for offer from remote peer
    this.signaling.onOffer = async (offer, remoteParticipantId, remoteParticipantName) => {
      if (this.state.status !== "idle") return

      await this.initializePeerConnection()

      try {
        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await this.peerConnection?.createAnswer()
        await this.peerConnection?.setLocalDescription(answer)

        this.signaling?.sendAnswer(answer, remoteParticipantId)

        // Update state with remote participant
        this.updateRemoteParticipant(remoteParticipantId, {
          id: remoteParticipantId,
          name: remoteParticipantName,
          audioEnabled: true,
          videoEnabled: true,
        })

        this.state.status = "connected"
        this.notifyStateChange()
      } catch (error) {
        console.error("Error handling offer:", error)
        this.handleCallError(error as Error)
      }
    }

    // Listen for answer to our offer
    this.signaling.onAnswer = async (answer, remoteParticipantId) => {
      try {
        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(answer))

        this.state.status = "connected"
        this.notifyStateChange()
      } catch (error) {
        console.error("Error handling answer:", error)
        this.handleCallError(error as Error)
      }
    }

    // Listen for ICE candidates
    this.signaling.onIceCandidate = (candidate, remoteParticipantId) => {
      try {
        this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate))
      } catch (error) {
        console.error("Error adding ICE candidate:", error)
      }
    }

    // Listen for call end
    this.signaling.onCallEnded = (remoteParticipantId) => {
      this.removeParticipant(remoteParticipantId)
      if (this.state.remoteParticipants.length === 0) {
        this.endCall()
      }
    }
  }

  private async initializePeerConnection() {
    // Create RTCPeerConnection with ICE servers for NAT traversal
    this.peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers,
    })

    // Set up event handlers
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.state.remoteParticipants[0]) {
        this.signaling?.sendIceCandidate(event.candidate, this.state.remoteParticipants[0].id)
      }
    }

    this.peerConnection.ontrack = (event) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream()
      }
      this.remoteStream.addTrack(event.track)

      // Update remote participant's media state
      if (this.state.remoteParticipants[0]) {
        const trackKind = event.track.kind
        if (trackKind === "audio") {
          this.updateRemoteParticipant(this.state.remoteParticipants[0].id, { audioEnabled: true })

          // Start transcription when we receive audio
          this.startTranscription(this.remoteStream)
        } else if (trackKind === "video") {
          this.updateRemoteParticipant(this.state.remoteParticipants[0].id, { videoEnabled: true })
        }
        this.notifyStateChange()
      }
    }

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log("Connection state:", this.peerConnection?.connectionState)

      if (this.peerConnection?.connectionState === "connected") {
        console.log("WebRTC connection established successfully")
      } else if (
        this.peerConnection?.connectionState === "disconnected" ||
        this.peerConnection?.connectionState === "failed" ||
        this.peerConnection?.connectionState === "closed"
      ) {
        this.handleCallError(new Error(`Connection lost: ${this.peerConnection?.connectionState}`))
      }
    }

    // Handle ICE connection state changes
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", this.peerConnection?.iceConnectionState)

      if (this.peerConnection?.iceConnectionState === "failed") {
        console.log("Attempting ICE restart...")
        this.peerConnection.restartIce()
      }
    }
  }

  private updateRemoteParticipant(participantId: string, updates: Partial<CallParticipant>) {
    const participant = this.state.remoteParticipants.find((p) => p.id === participantId)

    if (participant) {
      const index = this.state.remoteParticipants.indexOf(participant)
      this.state.remoteParticipants[index] = { ...participant, ...updates }
    } else {
      this.state.remoteParticipants.push({
        id: participantId,
        name: updates.name || `User ${participantId}`,
        audioEnabled: updates.audioEnabled || false,
        videoEnabled: updates.videoEnabled || false,
        avatar: updates.avatar,
      })
    }
  }

  private removeParticipant(participantId: string) {
    this.state.remoteParticipants = this.state.remoteParticipants.filter((p) => p.id !== participantId)
    this.notifyStateChange()
  }

  private notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state })
    }
  }

  private handleCallError(error: Error) {
    this.state.status = "error"
    this.state.error = error
    this.notifyStateChange()
    console.error("Call error:", error)
  }

  // Start a call to another user
  public async startCallOld(
    callId: string,
    localParticipantId: string,
    localParticipantName: string,
    remoteParticipantId: string,
    callType: CallType,
    onStateChange: (state: CallStateInterface) => void,
  ): Promise<void> {
    try {
      this.onStateChange = onStateChange
      this.state = {
        status: "connecting",
        callId,
        localParticipant: {
          id: localParticipantId,
          name: localParticipantName,
          audioEnabled: true,
          videoEnabled: callType === "video",
        },
        remoteParticipants: [],
        transcription: "",
        aiSuggestions: [],
        isAIAssistantActive: false,
      }
      this.notifyStateChange()

      // Connect to signaling server
      await this.signaling?.connect(localParticipantId)

      // Initialize WebRTC peer connection
      await this.initializePeerConnection()

      // Get local media stream with appropriate constraints
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video:
          callType === "video"
            ? {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user",
              }
            : false,
      }

      try {
        this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch (err) {
        console.error("Error getting user media:", err)
        // Fallback to audio only if video fails
        if (callType === "video") {
          console.log("Falling back to audio only")
          this.localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          })
          if (this.state.localParticipant) {
            this.state.localParticipant.videoEnabled = false
          }
        } else {
          throw err
        }
      }

      // Add tracks to peer connection
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!)
      })

      // Start transcribing local audio for AI processing
      this.startTranscription(this.localStream)

      // Create and send offer
      const offer = await this.peerConnection?.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: callType === "video",
      })
      await this.peerConnection?.setLocalDescription(offer)

      // Send offer to remote participant
      this.signaling?.sendOffer(offer!, remoteParticipantId, localParticipantName)

      // Add remote participant to state
      this.updateRemoteParticipant(remoteParticipantId, {
        id: remoteParticipantId,
        name: "Connecting...",
        audioEnabled: false,
        videoEnabled: false,
      })

      this.notifyStateChange()
    } catch (error) {
      this.handleCallError(error as Error)
    }
  }

  // Toggle mute/unmute audio
  public async toggleAudioOld(): Promise<void> {
    if (!this.localStream) return

    const audioTrack = this.localStream.getAudioTracks()[0]
    if (!audioTrack) return

    const enabled = !audioTrack.enabled
    audioTrack.enabled = enabled

    if (this.state.localParticipant) {
      this.state.localParticipant.audioEnabled = enabled
    }

    this.notifyStateChange()
  }

  // Toggle video on/off
  public async toggleVideoOld(): Promise<void> {
    if (!this.localStream) return

    const videoTrack = this.localStream.getVideoTracks()[0]
    if (!videoTrack) return

    const enabled = !videoTrack.enabled
    videoTrack.enabled = enabled

    if (this.state.localParticipant) {
      this.state.localParticipant.videoEnabled = enabled
    }

    this.notifyStateChange()
  }

  // Toggle AI assistant
  public toggleAIAssistantOld(): void {
    this.state.isAIAssistantActive = !this.state.isAIAssistantActive

    if (this.state.isAIAssistantActive) {
      // Generate initial suggestions when activated
      this.aiProcessor?.generateSuggestions(this.state.transcription)
    } else {
      // Clear suggestions when deactivated
      this.state.aiSuggestions = []
    }

    this.notifyStateChange()
  }

  // End the call and clean up resources
  public async endCallOld(): Promise<void> {
    // Stop transcription
    this.stopTranscription()

    // Stop all local tracks
    this.localStream?.getTracks().forEach((track) => track.stop())

    // Close peer connection
    this.peerConnection?.close()

    // Notify remote participants
    if (this.state.remoteParticipants.length > 0) {
      this.signaling?.sendCallEnded(this.state.remoteParticipants[0].id)
    }

    // Reset state
    this.state = {
      status: "ended",
      remoteParticipants: [],
      transcription: "",
      aiSuggestions: [],
      isAIAssistantActive: false,
    }

    this.localStream = null
    this.remoteStream = null
    this.peerConnection = null

    this.notifyStateChange()
  }

  // Play local video on element
  public playLocalVideo(element: string | HTMLElement): void {
    if (!this.localStream) return

    const videoElement =
      typeof element === "string"
        ? (document.getElementById(element) as HTMLVideoElement)
        : (element as HTMLVideoElement)

    if (videoElement && videoElement instanceof HTMLVideoElement) {
      videoElement.srcObject = this.localStream
      videoElement.play().catch((error) => console.error("Error playing local video:", error))
    }
  }

  // Play remote video on element
  public playRemoteVideo(element: string | HTMLElement): void {
    if (!this.remoteStream) return

    const videoElement =
      typeof element === "string"
        ? (document.getElementById(element) as HTMLVideoElement)
        : (element as HTMLVideoElement)

    if (videoElement && videoElement instanceof HTMLVideoElement) {
      videoElement.srcObject = this.remoteStream
      videoElement.play().catch((error) => console.error("Error playing remote video:", error))
    }
  }

  // Start speech recognition and transcription
  private startTranscription(stream: MediaStream | null): void {
    if (!stream || this.isTranscribing || !("webkitSpeechRecognition" in window)) return

    try {
      // @ts-ignore - Using the webkit prefix for broader compatibility
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.speechRecognition = new SpeechRecognition()

      this.speechRecognition.continuous = true
      this.speechRecognition.interimResults = true
      this.speechRecognition.lang = "en-US" // Default to English

      this.speechRecognition.onresult = (event) => {
        let transcript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + " "

            // Process with AI if assistant is active
            if (this.state.isAIAssistantActive) {
              this.aiProcessor?.processText(event.results[i][0].transcript)
            }
          }
        }

        if (transcript) {
          this.state.transcription += transcript
          this.notifyStateChange()
        }
      }

      this.speechRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
      }

      this.speechRecognition.start()
      this.isTranscribing = true
    } catch (error) {
      console.error("Failed to start transcription:", error)
    }
  }

  // Stop speech recognition
  private stopTranscription(): void {
    if (this.speechRecognition && this.isTranscribing) {
      this.speechRecognition.stop()
      this.isTranscribing = false
    }
  }
}

// Add type definition for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

// Simple AI processor for call assistance
class AIProcessor {
  private onUpdate: (suggestions: string[], sentiment?: "positive" | "neutral" | "negative") => void
  private conversationHistory: string[] = []

  constructor(onUpdate: (suggestions: string[], sentiment?: "positive" | "neutral" | "negative") => void) {
    this.onUpdate = onUpdate
  }

  // Process new text from the conversation
  public processText(text: string): void {
    this.conversationHistory.push(text)

    // Analyze sentiment
    const sentiment = this.analyzeSentiment(text)

    // Generate suggestions based on the conversation
    const suggestions = this.generateSuggestions(text)

    // Update the caller
    this.onUpdate(suggestions, sentiment)
  }

  // Generate suggestions based on the conversation context
  public generateSuggestions(text: string): string[] {
    const lowerText = text.toLowerCase()
    const suggestions: string[] = []

    // Simple rule-based suggestion generation
    if (lowerText.includes("anxious") || lowerText.includes("anxiety") || lowerText.includes("worried")) {
      suggestions.push("I understand you're feeling anxious. Would deep breathing help?")
      suggestions.push("Would you like to try a quick grounding exercise?")
    }

    if (lowerText.includes("sad") || lowerText.includes("depressed") || lowerText.includes("unhappy")) {
      suggestions.push("I hear that you're feeling down. Would you like to talk about it more?")
      suggestions.push("Sometimes sharing what's making you sad can help lighten the burden.")
    }

    if (lowerText.includes("help") || lowerText.includes("support") || lowerText.includes("advice")) {
      suggestions.push("What specific kind of support would be most helpful right now?")
      suggestions.push("I'm here to listen and help however I can.")
    }

    if (lowerText.includes("sleep") || lowerText.includes("tired") || lowerText.includes("insomnia")) {
      suggestions.push("Sleep difficulties can affect mental health. Have you established a bedtime routine?")
      suggestions.push("Would you like some tips for better sleep hygiene?")
    }

    // Default suggestions if none match
    if (suggestions.length === 0) {
      suggestions.push("How are you feeling about what we've discussed so far?")
      suggestions.push("Is there anything specific you'd like to focus on today?")
      suggestions.push("Would it help to talk about coping strategies for this situation?")
    }

    return suggestions
  }

  // Simple sentiment analysis
  private analyzeSentiment(text: string): "positive" | "neutral" | "negative" {
    const lowerText = text.toLowerCase()

    const positiveWords = [
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
    ]
    const negativeWords = [
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
    ]

    let positiveScore = 0
    let negativeScore = 0

    positiveWords.forEach((word) => {
      if (lowerText.includes(word)) positiveScore++
    })

    negativeWords.forEach((word) => {
      if (lowerText.includes(word)) negativeScore++
    })

    if (positiveScore > negativeScore) return "positive"
    if (negativeScore > positiveScore) return "negative"
    return "neutral"
  }
}

// Enhanced signaling service implementation
// In a real app, this would use WebSockets or another real-time communication method
class SignalingService {
  private userId: string | null = null
  private socket: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000 // Start with 1 second

  // Event handlers
  public onOffer: ((offer: RTCSessionDescriptionInit, from: string, name: string) => void) | null = null
  public onAnswer: ((answer: RTCSessionDescriptionInit, from: string) => void) | null = null
  public onIceCandidate: ((candidate: RTCIceCandidateInit, from: string) => void) | null = null
  public onCallEnded: ((from: string) => void) | null = null

  // Connect to signaling server
  public async connect(userId: string): Promise<void> {
    this.userId = userId

    return new Promise((resolve, reject) => {
      try {
        // In a real implementation, connect to your WebSocket server
        // For this demo, we'll simulate the connection
        console.log(`Signaling: Connected with user ID ${userId}`)

        // Simulate successful connection
        setTimeout(resolve, 100)
      } catch (error) {
        reject(error)
      }
    })
  }

  // Reconnect to signaling server with exponential backoff
  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Maximum reconnection attempts reached")
      return
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
    console.log(`Attempting to reconnect in ${delay}ms...`)

    setTimeout(() => {
      this.reconnectAttempts++
      this.connect(this.userId || "unknown")
    }, delay)
  }

  // Send offer to remote peer
  public sendOffer(offer: RTCSessionDescriptionInit, to: string, name: string): void {
    console.log(`Signaling: Sending offer to ${to}`)

    // In a real app, this would send the offer through your signaling server
    // For this demo, we'll simulate the offer being sent

    // Simulate receiving the offer on the other end (for demo purposes)
    setTimeout(() => {
      if (this.onOffer) {
        this.onOffer(offer, to, name)
      }
    }, 500)
  }

  // Send answer to remote peer
  public sendAnswer(answer: RTCSessionDescriptionInit, to: string): void {
    console.log(`Signaling: Sending answer to ${to}`)

    // In a real app, this would send the answer through your signaling server
    // For this demo, we'll simulate the answer being sent

    // Simulate receiving the answer on the other end (for demo purposes)
    setTimeout(() => {
      if (this.onAnswer) {
        this.onAnswer(answer, to)
      }
    }, 500)
  }

  // Send ICE candidate to remote peer
  public sendIceCandidate(candidate: RTCIceCandidateInit, to: string): void {
    console.log(`Signaling: Sending ICE candidate to ${to}`)

    // In a real app, this would send the ICE candidate through your signaling server
    // For this demo, we'll simulate the ICE candidate being sent

    // Simulate receiving the ICE candidate on the other end (for demo purposes)
    setTimeout(() => {
      if (this.onIceCandidate) {
        this.onIceCandidate(candidate, to)
      }
    }, 200)
  }

  // Send call ended signal
  public sendCallEnded(to: string): void {
    console.log(`Signaling: Sending call ended to ${to}`)

    // In a real app, this would send the call ended signal through your signaling server
    // For this demo, we'll simulate the signal being sent

    // Simulate receiving the call ended signal on the other end (for demo purposes)
    setTimeout(() => {
      if (this.onCallEnded) {
        this.onCallEnded(to)
      }
    }, 200)
  }
}

// Create and export a singleton instance
const webRTCCallService = new WebRTCCallService()
export default webRTCCallService
