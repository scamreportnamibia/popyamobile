"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import appConfig from "@/config/app-config"

export function DevModeIndicator() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show in development or when explicitly in development mode
    setVisible(appConfig.isDevelopment || !appConfig.isProductionMode)
  }, [])

  if (!visible) return null

  return (
    <Alert className="mb-4 border-yellow-400 bg-yellow-50">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-700">
        <strong>Development Mode Active</strong> - Using free WebSocket service for testing.
        {appConfig.useMockData && " AI features are using mock data."}
      </AlertDescription>
    </Alert>
  )
}

export default DevModeIndicator
