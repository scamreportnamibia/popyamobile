// Real WebSocket-based signaling service for WebRTC
export type SignalingMessage = {
  type: "offer" | "answer" | "ice-candidate" | "call-ended" | "join-call"
  from: string
  to: string
  payload: any
  name?: string
}

export class WebRTCSignalingService {
  private socket: WebSocket | null = null
  private userId: string | null = null
  private serverUrl = "wss://your-signaling-server.com" // Replace with your actual server URL
  private messageCallbacks: Map<string, (message: SignalingMessage) => void> = new Map()
  private connectionStateCallback: ((state: "connected" | "disconnected" | "error") => void) | null = null

  // Connect to the signaling server
  public async connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.userId = userId
        this.socket = new WebSocket(`${this.serverUrl}?userId=${userId}`)

        this.socket.onopen = () => {
          console.log(`SignalingService: Connected with user ID ${userId}`)
          if (this.connectionStateCallback) {
            this.connectionStateCallback("connected")
          }
          resolve()
        }

        this.socket.onclose = () => {
          console.log("SignalingService: Connection closed")
          if (this.connectionStateCallback) {
            this.connectionStateCallback("disconnected")
          }
        }

        this.socket.onerror = (error) => {
          console.error("SignalingService: WebSocket error", error)
          if (this.connectionStateCallback) {
            this.connectionStateCallback("error")
          }
          reject(error)
        }

        this.socket.onmessage = (event) => {
          try {
            const message: SignalingMessage = JSON.parse(event.data)
            if (message.to === this.userId) {
              const callback = this.messageCallbacks.get(message.type)
              if (callback) {
                callback(message)
              } else {
                console.warn(`No handler for message type: ${message.type}`)
              }
            }
          } catch (error) {
            console.error("Error parsing signaling message:", error)
          }
        }
      } catch (error) {
        console.error("Error connecting to signaling server:", error)
        reject(error)
      }
    })
  }

  // Disconnect from the signaling server
  public disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  // Send a message to another user
  public sendMessage(message: SignalingMessage): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("Cannot send message: WebSocket not connected")
      return
    }

    this.socket.send(JSON.stringify(message))
  }

  // Register a callback for a specific message type
  public on(messageType: string, callback: (message: SignalingMessage) => void): void {
    this.messageCallbacks.set(messageType, callback)
  }

  // Register a callback for connection state changes
  public onConnectionStateChange(callback: (state: "connected" | "disconnected" | "error") => void): void {
    this.connectionStateCallback = callback
  }

  // Send an offer to a remote peer
  public sendOffer(offer: RTCSessionDescriptionInit, to: string, name: string): void {
    this.sendMessage({
      type: "offer",
      from: this.userId!,
      to,
      payload: offer,
      name,
    })
  }

  // Send an answer to a remote peer
  public sendAnswer(answer: RTCSessionDescriptionInit, to: string): void {
    this.sendMessage({
      type: "answer",
      from: this.userId!,
      to,
      payload: answer,
    })
  }

  // Send an ICE candidate to a remote peer
  public sendIceCandidate(candidate: RTCIceCandidateInit, to: string): void {
    this.sendMessage({
      type: "ice-candidate",
      from: this.userId!,
      to,
      payload: candidate,
    })
  }

  // Send a call ended signal
  public sendCallEnded(to: string): void {
    this.sendMessage({
      type: "call-ended",
      from: this.userId!,
      to,
      payload: null,
    })
  }
}
