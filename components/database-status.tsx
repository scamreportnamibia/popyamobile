"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const response = await fetch("/api/db-status")
        const data = await response.json()

        if (data.connected) {
          setStatus("connected")
          setMessage(data.message || "Database is connected and working properly.")
        } else {
          setStatus("error")
          setMessage(data.message || "Failed to connect to database.")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Error checking database status.")
      }
    }

    checkDatabaseStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Database Status
          <Badge variant={status === "connected" ? "default" : "destructive"}>
            {status === "loading" ? "Checking..." : status === "connected" ? "Connected" : "Error"}
          </Badge>
        </CardTitle>
        <CardDescription>Connection status to Neon PostgreSQL</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{message}</p>
      </CardContent>
    </Card>
  )
}
