import { io, type Socket } from "socket.io-client"

export type MessageType =
  | "chat_message"
  | "expert_status"
  | "call_request"
  | "notification"
  | "system_alert"
  | "profile_update"
  | "admin_alert"
  | "expert_alert"

export interface SocketMessage {
  type: MessageType
  data: any
  timestamp: number
  sender?: string
  recipient?: string
}

class WebSocketService {
  private socket: Socket | null = null
  private connected = false
  private messageHandlers: Map<string, ((message: SocketMessage) => void)[]> = new Map()
  private connectionHandlers: ((status: boolean) => void)[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private userId: string | null = null
  private userRole: string | null = null

  constructor() {
    // Initialize is called separately to allow for environment variables to be loaded
  }

  public initialize(userId?: string, userRole?: string) {
    if (this.socket) return

    this.userId = userId || null
    this.userRole = userRole || null

    const serverUrl = process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL || "wss://api.popya.com"

    try {
      this.socket = io(serverUrl, {
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 10000,
        transports: ["websocket"],
        query: {
          userId: this.userId || "anonymous",
          userRole: this.userRole || "anonymous",
        },
      })

      this.setupEventListeners()
    } catch (error) {
      console.error("Failed to initialize WebSocket connection:", error)
    }
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on("connect", () => {
      console.log("WebSocket connected")
      this.connected = true
      this.reconnectAttempts = 0
      this.notifyConnectionHandlers(true)

      // Join role-specific rooms for targeted updates
      if (this.userRole === "super_admin") {
        this.socket.emit("join_room", "admin_updates")
      } else if (this.userRole === "expert") {
        this.socket.emit("join_room", "expert_updates")
      } else if (this.userId) {
        this.socket.emit("join_room", `user_${this.userId}`)
      }
    })

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected")
      this.connected = false
      this.notifyConnectionHandlers(false)
    })

    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`WebSocket reconnection attempt ${attemptNumber}`)
      this.reconnectAttempts = attemptNumber
    })

    this.socket.on("reconnect_failed", () => {
      console.log("WebSocket reconnection failed")
    })

    this.socket.on("message", (message: SocketMessage) => {
      this.handleIncomingMessage(message)
    })

    // Handle specific message types
    this.socket.on("chat_message", (message: SocketMessage) => {
      this.handleIncomingMessage({ ...message, type: "chat_message" })
    })

    this.socket.on("expert_status", (message: SocketMessage) => {
      this.handleIncomingMessage({ ...message, type: "expert_status" })
    })

    this.socket.on("call_request", (message: SocketMessage) => {
      this.handleIncomingMessage({ ...message, type: "call_request" })
    })

    this.socket.on("notification", (message: SocketMessage) => {
      this.handleIncomingMessage({ ...message, type: "notification" })
    })

    // New message types for real-time updates
    this.socket.on("profile_update", (message: SocketMessage) => {
      this.handleIncomingMessage({ ...message, type: "profile_update" })
    })

    this.socket.on("admin_alert", (message: SocketMessage) => {
      this.handleIncomingMessage({ ...message, type: "admin_alert" })
    })

    this.socket.on("expert_alert", (message: SocketMessage) => {
      this.handleIncomingMessage({ ...message, type: "expert_alert" })
    })
  }

  private handleIncomingMessage(message: SocketMessage) {
    const handlers = this.messageHandlers.get(message.type) || []
    handlers.forEach((handler) => {
      try {
        handler(message)
      } catch (error) {
        console.error(`Error in message handler for type ${message.type}:`, error)
      }
    })
  }

  private notifyConnectionHandlers(status: boolean) {
    this.connectionHandlers.forEach((handler) => {
      try {
        handler(status)
      } catch (error) {
        console.error("Error in connection handler:", error)
      }
    })
  }

  public sendMessage(message: Omit<SocketMessage, "timestamp">) {
    if (!this.socket || !this.connected) {
      console.warn("Cannot send message: WebSocket not connected")
      return false
    }

    try {
      const fullMessage: SocketMessage = {
        ...message,
        timestamp: Date.now(),
      }

      this.socket.emit(message.type, fullMessage)
      return true
    } catch (error) {
      console.error("Failed to send message:", error)
      return false
    }
  }

  // Method to broadcast updates to admin panel
  public broadcastAdminUpdate(data: any) {
    return this.sendMessage({
      type: "admin_alert",
      data,
      sender: this.userId || undefined,
    })
  }

  // Method to broadcast updates to expert panel
  public broadcastExpertUpdate(data: any) {
    return this.sendMessage({
      type: "expert_alert",
      data,
      sender: this.userId || undefined,
    })
  }

  // Method to send profile updates
  public sendProfileUpdate(data: any) {
    return this.sendMessage({
      type: "profile_update",
      data,
      sender: this.userId || undefined,
    })
  }

  public addMessageHandler(type: MessageType, handler: (message: SocketMessage) => void) {
    const handlers = this.messageHandlers.get(type) || []
    handlers.push(handler)
    this.messageHandlers.set(type, handlers)
  }

  public removeMessageHandler(type: MessageType, handler: (message: SocketMessage) => void) {
    const handlers = this.messageHandlers.get(type) || []
    const index = handlers.indexOf(handler)
    if (index !== -1) {
      handlers.splice(index, 1)
      this.messageHandlers.set(type, handlers)
    }
  }

  public addConnectionHandler(handler: (status: boolean) => void) {
    this.connectionHandlers.push(handler)

    // Immediately notify with current status
    if (this.connected !== undefined) {
      try {
        handler(this.connected)
      } catch (error) {
        console.error("Error in connection handler:", error)
      }
    }
  }

  public removeConnectionHandler(handler: (status: boolean) => void) {
    const index = this.connectionHandlers.indexOf(handler)
    if (index !== -1) {
      this.connectionHandlers.splice(index, 1)
    }
  }

  public isConnected(): boolean {
    return this.connected
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
    }
  }
}

// Export a singleton instance
export const websocketService = new WebSocketService()
