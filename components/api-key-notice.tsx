"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ApiKeyNotice() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null)

  useEffect(() => {
    // Since we're not using API keys, always set to false
    setHasApiKey(false)
  }, [])

  if (hasApiKey === null) {
    return null // Loading state
  }

  if (hasApiKey) {
    return (
      <Alert className="bg-green-50 border-green-200 mb-4">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">OpenAI API Connected</AlertTitle>
        <AlertDescription className="text-green-700">
          The app is using the OpenAI API for enhanced AI capabilities.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="bg-amber-50 border-amber-200 mb-4">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Using Mock AI Responses</AlertTitle>
      <AlertDescription className="text-amber-700">
        The app is using mock AI responses. For enhanced capabilities, add your OpenAI API key.
      </AlertDescription>
    </Alert>
  )
}
