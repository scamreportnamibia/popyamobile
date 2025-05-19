"use client"

import { useState, useEffect } from "react"
import { Phone, Brain, AlertCircle, Info } from "lucide-react"
import WebRTCCallInterface from "@/components/video-call/webrtc-call-interface"
import AIMentalHealthAssistant from "@/components/ai-mental-health-assistant"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function VideoCallPage() {
  const [isCallOpen, setIsCallOpen] = useState(false)
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(true) // Default to true for safety

  // Mock user data
  const userId = "user-123"
  const userName = "You"
  const expertId = "expert-456"
  const expertName = "Mental Health Expert"
  const expertAvatar = "/placeholder.svg?height=200&width=200"

  useEffect(() => {
    // Check if we're using development mode
    const usingDevMode = !process.env.NEXT_PUBLIC_PRODUCTION_MODE || process.env.NEXT_PUBLIC_PRODUCTION_MODE === "false"
    setIsDevelopmentMode(usingDevMode)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Popya Video Call</h1>

        {isDevelopmentMode && (
          <Alert className="mb-6 border-yellow-400 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              <strong>Development Mode Active:</strong> Using free WebSocket service (socketsbay.com) for testing. Video
              calls will simulate connections but may not establish reliable calls. AI analysis is using local fallbacks
              instead of OpenAI API.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#6C63FF]/20 flex items-center justify-center">
                <Phone size={24} className="text-[#6C63FF]" />
              </div>
              <div className="ml-3">
                <h2 className="text-xl font-semibold">Video Call</h2>
                <p className="text-gray-500">Connect with a mental health expert</p>
              </div>
            </div>
            <p className="mb-4">
              Talk to a mental health professional through a secure video call. Get support, guidance, and advice for
              your mental wellbeing.
            </p>
            <button
              onClick={() => setIsCallOpen(true)}
              className="w-full py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5A52D5] transition-colors"
            >
              Start Video Call
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#6C63FF]/20 flex items-center justify-center">
                <Brain size={24} className="text-[#6C63FF]" />
              </div>
              <div className="ml-3">
                <h2 className="text-xl font-semibold">AI Assistant</h2>
                <p className="text-gray-500">Get immediate support</p>
              </div>
            </div>
            <p className="mb-4">
              Chat with our AI mental health assistant for immediate support, resources, and guidance. Available 24/7
              whenever you need someone to talk to.
            </p>
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="w-full py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5A52D5] transition-colors"
            >
              Talk to AI Assistant
            </button>
          </div>
        </div>

        {isDevelopmentMode && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div>
                <h3 className="font-medium text-blue-700">Development Configuration</h3>
                <p className="text-sm text-blue-600 mt-1">
                  When going live, you'll need to update the following environment variables with values from MTC and TN
                  Mobile:
                </p>
                <ul className="mt-2 text-sm text-blue-600 list-disc pl-5 space-y-1">
                  <li>
                    <code>NEXT_PUBLIC_SIGNALING_SERVER_URL</code> - WebSocket server for video calls
                  </li>
                  <li>
                    <code>NEXT_PUBLIC_PRODUCTION_MODE</code> - Set to "true" for production
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-[#6C63FF]/20 flex items-center justify-center mr-3 mt-1">
                <span className="text-[#6C63FF] font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium">Choose Your Support Option</h3>
                <p className="text-gray-600">
                  Select either video call with a professional or chat with our AI assistant based on your needs.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-[#6C63FF]/20 flex items-center justify-center mr-3 mt-1">
                <span className="text-[#6C63FF] font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium">Connect Securely</h3>
                <p className="text-gray-600">
                  Our WebRTC technology ensures your conversations are private, secure, and zero-rated.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-[#6C63FF]/20 flex items-center justify-center mr-3 mt-1">
                <span className="text-[#6C63FF] font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium">Get Support</h3>
                <p className="text-gray-600">
                  Discuss your concerns, receive guidance, and access resources to support your mental wellbeing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Call Interface */}
      <WebRTCCallInterface
        userId={userId}
        userName={userName}
        remoteUserId={expertId}
        remoteUserName={expertName}
        remoteUserAvatar={expertAvatar}
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        initialMode="video"
      />

      {/* AI Mental Health Assistant */}
      <AIMentalHealthAssistant isOpen={isAIAssistantOpen} onClose={() => setIsAIAssistantOpen(false)} />
    </div>
  )
}
