// This file would be deployed on your server, not in the client app

import WebSocket from "ws"
import { v4 as uuidv4 } from "uuid"

// Define message types
interface SignalingMessage {
  type: "register" | "offer" | "answer" | "ice-candidate" | "call-ended" | "error"
  from?: string
  to?: string
  data?: any
  name?: string
}

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 })

// Store connected clients
const clients: Map<string, WebSocket> = new Map()

console.log("Signaling server started on port 8080")

wss.on("connection", (ws) => {
  let userId: string | undefined

  console.log("New client connected")

  ws.on("message", (message) => {
    try {
      const parsedMessage: SignalingMessage = JSON.parse(message.toString())

      switch (parsedMessage.type) {
        case "register":
          // Register new user
          userId = parsedMessage.from || uuidv4()
          clients.set(userId, ws)

          // Confirm registration
          ws.send(
            JSON.stringify({
              type: "register",
              data: { userId, success: true },
            }),
          )

          console.log(`User registered: ${userId}`)
          break

        case "offer":
          // Forward offer to recipient
          if (parsedMessage.to && clients.has(parsedMessage.to)) {
            clients.get(parsedMessage.to)?.send(
              JSON.stringify({
                type: "offer",
                from: parsedMessage.from,
                data: parsedMessage.data,
                name: parsedMessage.name,
              }),
            )
            console.log(`Offer forwarded from ${parsedMessage.from} to ${parsedMessage.to}`)
          } else {
            // Recipient not found
            ws.send(
              JSON.stringify({
                type: "error",
                data: { message: "Recipient not found" },
              }),
            )
          }
          break

        case "answer":
          // Forward answer to recipient
          if (parsedMessage.to && clients.has(parsedMessage.to)) {
            clients.get(parsedMessage.to)?.send(
              JSON.stringify({
                type: "answer",
                from: parsedMessage.from,
                data: parsedMessage.data,
              }),
            )
            console.log(`Answer forwarded from ${parsedMessage.from} to ${parsedMessage.to}`)
          }
          break

        case "ice-candidate":
          // Forward ICE candidate to recipient
          if (parsedMessage.to && clients.has(parsedMessage.to)) {
            clients.get(parsedMessage.to)?.send(
              JSON.stringify({
                type: "ice-candidate",
                from: parsedMessage.from,
                data: parsedMessage.data,
              }),
            )
          }
          break

        case "call-ended":
          // Forward call ended signal to recipient
          if (parsedMessage.to && clients.has(parsedMessage.to)) {
            clients.get(parsedMessage.to)?.send(
              JSON.stringify({
                type: "call-ended",
                from: parsedMessage.from,
              }),
            )
            console.log(`Call ended signal forwarded from ${parsedMessage.from} to ${parsedMessage.to}`)
          }
          break

        default:
          console.warn(`Unknown message type: ${parsedMessage.type}`)
      }
    } catch (error) {
      console.error("Error processing message:", error)
      ws.send(
        JSON.stringify({
          type: "error",
          data: { message: "Invalid message format" },
        }),
      )
    }
  })

  ws.on("close", () => {
    // Remove client when disconnected
    if (userId) {
      clients.delete(userId)
      console.log(`User disconnected: ${userId}`)
    }
  })
})
