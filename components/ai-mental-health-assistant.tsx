"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Bot, AlertTriangle, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react"
import aiMentalHealthService, { isDevelopmentMode, type Resource } from "@/services/ai-mental-health-service"

interface AIMentalHealthAssistantProps {
  isOpen: boolean
  onClose: () => void
}

const AIMentalHealthAssistant = ({ isOpen, onClose }: AIMentalHealthAssistantProps) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi there! I'm your mental health assistant. How are you feeling today?" },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resources, setResources] = useState<Resource[]>([])
  const [showResources, setShowResources] = useState(false)
  const [feedback, setFeedback] = useState<Record<number, boolean | null>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, resources, isLoading])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Analyze text for potential risk factors using local method first for quick response
      const initialAnalysis = aiMentalHealthService.analyzeText(input)

      // Check for urgent risk factors
      if (initialAnalysis.riskFactors.length > 0) {
        setResources([
          {
            title: "Crisis Text Line",
            description: "Text HOME to 741741 to connect with a Crisis Counselor",
            type: "contact",
          },
          {
            title: "National Suicide Prevention Lifeline",
            description: "Call 988 or 1-800-273-8255",
            type: "contact",
          },
        ])
        setShowResources(true)
      }

      // Get AI response using the OpenAI integration
      const response = await aiMentalHealthService.getChatResponse([
        ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
        userMessage,
      ])

      // Add assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: response.content }])

      // If we didn't already show crisis resources, perform a more thorough sentiment analysis
      if (!initialAnalysis.riskFactors.length && !isDevelopmentMode) {
        const detailedAnalysis = await aiMentalHealthService.analyzeTextSentiment(input)

        if (detailedAnalysis.riskLevel === "high") {
          setResources([
            {
              title: "Crisis Text Line",
              description: "Text HOME to 741741 to connect with a Crisis Counselor",
              type: "contact",
            },
            {
              title: "National Suicide Prevention Lifeline",
              description: "Call 988 or 1-800-273-8255",
              type: "contact",
            },
          ])
          setShowResources(true)
        } else if (detailedAnalysis.recommendedResources && detailedAnalysis.recommendedResources.length) {
          // Create custom resources based on the analysis
          const customResources: Resource[] = detailedAnalysis.recommendedResources.map((type) => {
            switch (type) {
              case "meditation":
                return {
                  title: "Meditation Guide",
                  description: "Simple meditation exercises for mental wellbeing",
                  url: "https://www.mindful.org/how-to-meditate/",
                  type: "exercise",
                }
              case "breathing_exercise":
                return {
                  title: "Breathing Techniques",
                  description: "Breathing exercises to help manage stress and anxiety",
                  type: "exercise",
                }
              case "therapy_resources":
                return {
                  title: "Finding a Therapist",
                  description: "Resources for finding professional mental health support",
                  url: "https://www.psychologytoday.com/us/therapists",
                  type: "article",
                }
              default:
                return {
                  title: "Mental Health Resources",
                  description: "General mental health support and information",
                  url: "https://www.mind.org.uk/",
                  type: "article",
                }
            }
          })

          setResources(customResources.slice(0, 2))
          setShowResources(true)
        }
      }
    } catch (error) {
      console.error("Error fetching AI response:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I'm having trouble connecting. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = (messageIndex: number, helpful: boolean) => {
    setFeedback((prev) => ({
      ...prev,
      [messageIndex]: helpful,
    }))

    // In a real application, you would send this feedback to your backend
    console.log(`Message ${messageIndex} feedback: ${helpful ? "helpful" : "not helpful"}`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#6C63FF]/20 flex items-center justify-center mr-2">
              <Bot size={18} className="text-[#6C63FF]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Mental Health Assistant</h2>
              <p className="text-xs text-gray-500">Confidential support</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-[#6C63FF] text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {message.role === "assistant" && (
                    <div className="mt-2 flex justify-end items-center gap-1">
                      <button
                        onClick={() => handleFeedback(index, true)}
                        className={`p-1 rounded ${feedback[index] === true ? "bg-green-100" : "hover:bg-gray-100"}`}
                        aria-label="Helpful"
                      >
                        <ThumbsUp size={14} className={feedback[index] === true ? "text-green-600" : "text-gray-500"} />
                      </button>
                      <button
                        onClick={() => handleFeedback(index, false)}
                        className={`p-1 rounded ${feedback[index] === false ? "bg-red-100" : "hover:bg-gray-100"}`}
                        aria-label="Not helpful"
                      >
                        <ThumbsDown
                          size={14}
                          className={feedback[index] === false ? "text-red-600" : "text-gray-500"}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Resources section */}
            {showResources && resources.length > 0 && (
              <div className="my-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center mb-3">
                  <AlertTriangle size={18} className="text-yellow-600 mr-2" />
                  <h3 className="text-yellow-800 font-medium">Helpful Resources</h3>
                </div>
                <div className="space-y-3">
                  {resources.map((resource, index) => (
                    <ResourceCard key={index} resource={resource} />
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-3 border-t">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !isLoading && handleSendMessage()}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6C63FF]"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className={`px-4 py-2 rounded-r-lg flex items-center justify-center ${
                isLoading || !input.trim() ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#6C63FF] text-white"
              }`}
            >
              <Send size={18} />
            </button>
          </div>

          {isDevelopmentMode && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              Running in development mode with simulated responses
            </div>
          )}

          <div className="mt-2 text-xs text-gray-500 text-center">
            This is an AI assistant. For immediate crisis support, please contact a mental health professional or
            emergency services.
          </div>
        </div>
      </div>
    </div>
  )
}

// Resource card component
function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
      <div className="flex justify-between">
        <h4 className="font-medium text-gray-800">{resource.title}</h4>
        {resource.type === "article" && resource.url && (
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-[#6C63FF] hover:underline">
            <ExternalLink size={16} />
          </a>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
      <div className="mt-2">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            resource.type === "contact"
              ? "bg-red-100 text-red-700"
              : resource.type === "article"
                ? "bg-blue-100 text-blue-700"
                : resource.type === "video"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
          }`}
        >
          {resource.type}
        </span>
      </div>
    </div>
  )
}

export default AIMentalHealthAssistant
