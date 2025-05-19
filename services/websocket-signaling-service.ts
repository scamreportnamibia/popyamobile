import { EventEmitter } from "events"

// Define signaling events
export enum SignalingEvent {
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  RECONNECTING = "reconnecting",
  OFFER = "offer",
  ANSWER = "answer",
  ICE_CANDIDATE = "iceCandidate",
  HANGUP = "hangup",
  REJECT = "reject",
  RECONNECT = "reconnect",
  ERROR = "error",
}

// Define signaling message types
export enum SignalingMessageType {
  REGISTER = "register",
  OFFER = "offer",
  ANSWER = "answer",
  ICE_CANDIDATE = "ice_candidate",
  HANGUP = "hangup",
  REJECT = "reject",
  RECONNECT = "reconnect",
}

// Define signaling options
export interface SignalingOptions {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
}

export class WebSocketSignalingService extends EventEmitter {
  private socket: WebSocket | null = null
  private userId = ""
  private options: SignalingOptions
  private reconnectAttempts = 0
  private reconnectTimeout: NodeJS.Timeout | null = null
  private heartbeatInterval: NodeJS.Timeout | null = null
  private isConnected = false
  private messageQueue: any[] = []
  private isDevelopmentMode: boolean

  constructor(options: SignalingOptions) {
    super()
    this.options = {
      reconnectInterval: 2000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      ...options,
    }

    // Check if we're in development mode
    this.isDevelopmentMode =
      !process.env.NEXT_PUBLIC_PRODUCTION_MODE || process.env.NEXT_PUBLIC_PRODUCTION_MODE === "false"

    // Set max listeners to avoid memory leak warnings
    this.setMaxListeners(20)
  }

  // Connect to the signaling server
  public connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userId = userId

      try {
        // Use the free WebSocket service for development
        const wsUrl = this.isDevelopmentMode ? "wss://socketsbay.com/wss/v2/1/demo/" : this.options.url

        console.log(`Connecting to WebSocket server: ${wsUrl} (Development Mode: ${this.isDevelopmentMode})`)
        this.socket = new WebSocket(wsUrl)

        this.socket.onopen = () => {
          console.log("WebSocket connection established")
          this.isConnected = true
          this.reconnectAttempts = 0

          // Register user ID with the signaling server
          this.sendMessage({
            type: SignalingMessageType.REGISTER,
            userId: this.userId,
          })

          // Start heartbeat
          this.startHeartbeat()

          // Process any queued messages
          this.processMessageQueue()

          this.emit(SignalingEvent.CONNECTED)
          resolve()
        }

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error("Failed to parse signaling message", error)
          }
        }

        this.socket.onclose = (event) => {
          console.log("WebSocket connection closed", event.code, event.reason)
          this.isConnected = false
          this.stopHeartbeat()

          this.emit(SignalingEvent.DISCONNECTED, {
            code: event.code,
            reason: event.reason,
          })

          // Attempt to reconnect if not closed cleanly
          if (event.code !== 1000) {
            this.attemptReconnect()
          }
        }

        this.socket.onerror = (error) => {
          console.error("WebSocket error", error)
          this.emit(SignalingEvent.ERROR, error)
          reject(error)
        }
      } catch (error) {
        console.error("Failed to create WebSocket connection", error)
        this.emit(SignalingEvent.ERROR, error)
        reject(error)
      }
    })
  }

  // Disconnect from the signaling server
  public disconnect(): void {
    this.stopHeartbeat()

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      this.socket.close(1000, "Normal closure")
    }

    this.isConnected = false
    this.socket = null
  }

  // Send an offer to a remote peer
  public sendOffer(remoteUserId: string, data: any): void {
    this.sendMessage({
      type: SignalingMessageType.OFFER,
      to: remoteUserId,
      from: this.userId,
      data,
    })
  }

  // Send an answer to a remote peer
  public sendAnswer(remoteUserId: string, data: any): void {
    this.sendMessage({
      type: SignalingMessageType.ANSWER,
      to: remoteUserId,
      from: this.userId,
      data,
    })
  }

  // Send an ICE candidate to a remote peer
  public sendIceCandidate(remoteUserId: string, data: any): void {
    this.sendMessage({
      type: SignalingMessageType.ICE_CANDIDATE,
      to: remoteUserId,
      from: this.userId,
      data,
    })
  }

  // Send a hangup signal to a remote peer
  public sendHangup(remoteUserId: string, data: any): void {
    this.sendMessage({
      type: SignalingMessageType.HANGUP,
      to: remoteUserId,
      from: this.userId,
      data,
    })
  }

  // Send a reject signal to a remote peer
  public sendReject(remoteUserId: string, data: any): void {
    this.sendMessage({
      type: SignalingMessageType.REJECT,
      to: remoteUserId,
      from: this.userId,
      data,
    })
  }

  // Send a reconnect signal to a remote peer
  public sendReconnect(remoteUserId: string, data: any): void {
    this.sendMessage({
      type: SignalingMessageType.RECONNECT,
      to: remoteUserId,
      from: this.userId,
      data,
    })
  }

  // Send a message to the signaling server
  private sendMessage(message: any): void {
    if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      // Queue message if not connected
      this.messageQueue.push(message)

      // Attempt to reconnect if not already reconnecting
      if (!this.reconnectTimeout && !this.isConnected) {
        this.attemptReconnect()
      }

      return
    }

    try {
      this.socket.send(JSON.stringify(message))
    } catch (error) {
      console.error("Failed to send message", error)
      this.emit(SignalingEvent.ERROR, error)

      // Queue message for retry
      this.messageQueue.push(message)
    }
  }

  // Handle incoming messages from the signaling server
  private handleMessage(message: any): void {
    if (!message || !message.type) return

    switch (message.type) {
      case SignalingMessageType.OFFER:
        if (message.from && message.data) {
          this.emit(SignalingEvent.OFFER, {
            userId: message.from,
            ...message.data,
          })
        }
        break
      case SignalingMessageType.ANSWER:
        if (message.from && message.data) {
          this.emit(SignalingEvent.ANSWER, {
            userId: message.from,
            ...message.data,
          })
        }
        break
      case SignalingMessageType.ICE_CANDIDATE:
        if (message.from && message.data) {
          this.emit(SignalingEvent.ICE_CANDIDATE, {
            userId: message.from,
            ...message.data,
          })
        }
        break
      case SignalingMessageType.HANGUP:
        if (message.from && message.data) {
          this.emit(SignalingEvent.HANGUP, {
            userId: message.from,
            ...message.data,
          })
        }
        break
      case SignalingMessageType.REJECT:
        if (message.from && message.data) {
          this.emit(SignalingEvent.REJECT, {
            userId: message.from,
            ...message.data,
          })
        }
        break
      case SignalingMessageType.RECONNECT:
        if (message.from && message.data) {
          this.emit(SignalingEvent.RECONNECT, {
            userId: message.from,
            ...message.data,
          })
        }
        break
      default:
        console.log("Unhandled message type", message.type)
    }
  }

  // Attempt to reconnect to the signaling server
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= (this.options.maxReconnectAttempts || 5)) {
      console.error("Max reconnect attempts reached")
      this.emit(SignalingEvent.ERROR, { message: "Max reconnect attempts reached" })
      return
    }

    this.emit(SignalingEvent.RECONNECTING, { attempt: this.reconnectAttempts + 1 })

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++

      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`)

      this.connect(this.userId).catch(() => {
        // If reconnection fails, try again
        this.attemptReconnect()
      })
    }, this.options.reconnectInterval)
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        // Send a ping message
        this.socket.send(JSON.stringify({ type: "ping" }))
      }
    }, this.options.heartbeatInterval)
  }

  // Stop heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // Process queued messages
  private processMessageQueue(): void {
    if (this.messageQueue.length === 0) return

    console.log(`Processing ${this.messageQueue.length} queued messages`)

    const queue = [...this.messageQueue]
    this.messageQueue = []

    queue.forEach((message) => {
      this.sendMessage(message)
    })
  }
}

// Create and export a singleton instance
const signalingService = new WebSocketSignalingService({
  // This URL will only be used in production mode
  url: process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL || "wss://socketsbay.com/wss/v2/1/demo/",
})

export default signalingService
