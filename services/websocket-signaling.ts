// This file would replace the mock signaling service in webrtc-call-service.ts

export class WebSocketSignalingService {
  private socket: WebSocket | null = null
  private userId: string | null = null
  private serverUrl: string
  private isConnected = false
  private messageQueue: any[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000 // Start with 1 second

  // Event handlers
  public onOffer: ((offer: RTCSessionDescriptionInit, from: string, name: string) => void) | null = null
  public onAnswer: ((answer: RTCSessionDescriptionInit, from: string) => void) | null = null
  public onIceCandidate: ((candidate: RTCIceCandidateInit, from: string) => void) | null = null
  public onCallEnded: ((from: string) => void) | null = null
  public onConnectionStateChange: ((state: "connecting" | "connected" | "disconnected" | "failed") => void) | null =
    null

  constructor(serverUrl = "wss://your-signaling-server.com") {
    this.serverUrl = serverUrl
  }

  public async connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.userId = userId

        // Create WebSocket connection
        this.socket = new WebSocket(this.serverUrl)

        // Set up event handlers
        this.socket.onopen = () => {
          console.log("WebSocket connection established")
          this.isConnected = true
          this.reconnectAttempts = 0

          // Register with the signaling server
          this.sendMessage({
            type: "register",
            from: userId,
          })

          // Process any queued messages
          this.processQueue()

          if (this.onConnectionStateChange) {
            this.onConnectionStateChange("connected")
          }

          resolve()
        }

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.socket.onclose = () => {
          console.log("WebSocket connection closed")
          this.isConnected = false

          if (this.onConnectionStateChange) {
            this.onConnectionStateChange("disconnected")
          }

          // Attempt to reconnect
          this.attemptReconnect()
        }

        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error)

          if (this.onConnectionStateChange) {
            this.onConnectionStateChange("failed")
          }

          reject(error)
        }

        if (this.onConnectionStateChange) {
          this.onConnectionStateChange("connecting")
        }
      } catch (error) {
        console.error("Error connecting to signaling server:", error)
        reject(error)
      }
    })
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Maximum reconnection attempts reached")
      return
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
    console.log(`Attempting to reconnect in ${delay}ms...`)

    setTimeout(() => {
      this.reconnectAttempts++
      this.connect(this.userId || "unknown").catch((error) => {
        console.error("Reconnection failed:", error)
      })
    }, delay)
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data)

      switch (message.type) {
        case "register":
          console.log("Registration response:", message.data)
          break

        case "offer":
          if (this.onOffer && message.from && message.data) {
            this.onOffer(message.data, message.from, message.name || "Unknown")
          }
          break

        case "answer":
          if (this.onAnswer && message.from && message.data) {
            this.onAnswer(message.data, message.from)
          }
          break

        case "ice-candidate":
          if (this.onIceCandidate && message.from && message.data) {
            this.onIceCandidate(message.data, message.from)
          }
          break

        case "call-ended":
          if (this.onCallEnded && message.from) {
            this.onCallEnded(message.from)
          }
          break

        case "error":
          console.error("Signaling server error:", message.data)
          break

        default:
          console.warn("Unknown message type:", message.type)
      }
    } catch (error) {
      console.error("Error parsing message:", error)
    }
  }

  private sendMessage(message: any): void {
    if (this.isConnected && this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    } else {
      // Queue message to send when connection is established
      this.messageQueue.push(message)
    }
  }

  private processQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      this.sendMessage(message)
    }
  }

  public sendOffer(offer: RTCSessionDescriptionInit, to: string, name: string): void {
    this.sendMessage({
      type: "offer",
      from: this.userId,
      to,
      data: offer,
      name,
    })
  }

  public sendAnswer(answer: RTCSessionDescriptionInit, to: string): void {
    this.sendMessage({
      type: "answer",
      from: this.userId,
      to,
      data: answer,
    })
  }

  public sendIceCandidate(candidate: RTCIceCandidateInit, to: string): void {
    this.sendMessage({
      type: "ice-candidate",
      from: this.userId,
      to,
      data: candidate,
    })
  }

  public sendCallEnded(to: string): void {
    this.sendMessage({
      type: "call-ended",
      from: this.userId,
      to,
    })
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }

    this.isConnected = false
    this.userId = null
  }
}
