"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, KeyRound, ShieldAlert } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ApiKeySetup() {
  const [apiKey, setApiKey] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey.trim()) {
      setStatus("error")
      setMessage("Please enter an API key")
      return
    }

    setStatus("loading")

    try {
      const response = await fetch("/api/setup-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("API key set successfully. Please restart the application for changes to take effect.")
        setApiKey("")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to set API key")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred while setting the API key")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          OpenAI API Key Setup
        </CardTitle>
        <CardDescription>Enter your OpenAI API key to enable enhanced AI capabilities</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">{message}</AlertDescription>
          </Alert>
        )}

        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Security Notice</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your API key will be stored securely as an environment variable. Never share your API key publicly.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-gray-500">
                Your API key starts with &quot;sk-&quot; and can be found in your OpenAI dashboard
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Setting up..." : "Save API Key"}
        </Button>
      </CardFooter>
    </Card>
  )
}
