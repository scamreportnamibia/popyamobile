"use client"

import { useState, useEffect, useRef } from "react"
import { Send, User, Bot, AlertTriangle, Loader2, X, Sparkles } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"

interface Expert {
  id: string
  name: string
  avatar: string
  specialty: string
  [key: string]: any
}

interface AIDoctorChatProps {
  expert: Expert
  onClose: () => void
}

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export function AIDoctorChat({ expert, onClose }: AIDoctorChatProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "You are a professional mental health assistant named Dr. We Don't Judge. You provide empathetic, supportive responses to users seeking mental health guidance. Always maintain a professional tone while being warm and understanding. Never diagnose but offer general guidance and suggest professional help when appropriate.",
      timestamp: new Date(),
    },
    {
      role: "assistant",
      content:
        "Hello, I'm Dr. We Don't Judge, an AI mental health assistant. Before we begin, I want to be clear that I'm an artificial intelligence, not a human therapist or doctor. Would you be comfortable chatting with me about your mental health concerns?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Check if this is the first user message (consent response)
      if (!consentGiven) {
        // Check if the user's message indicates consent
        const lowerCaseInput = input.toLowerCase()
        const consentIndicated =
          lowerCaseInput.includes("yes") ||
          lowerCaseInput.includes("sure") ||
          lowerCaseInput.includes("okay") ||
          lowerCaseInput.includes("ok") ||
          lowerCaseInput.includes("fine")

        if (consentIndicated) {
          setConsentGiven(true)
          const assistantMessage: Message = {
            role: "assistant",
            content:
              "Thank you for your consent. I should mention that I don't master human interaction perfectly, but I can provide information based on research and general mental health principles. I'm here to listen and offer support. How can I help you today?",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
        } else {
          const assistantMessage: Message = {
            role: "assistant",
            content:
              "I understand your hesitation. If you'd prefer to speak with a human professional, I recommend reaching out to a licensed therapist or counselor. Would you like information about finding mental health resources instead?",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
        }
        setIsLoading(false)
        return
      }

      // Use mock responses for the AI doctor
      const mockResponses = [
        "I understand how you're feeling. Would you like to talk more about what's going on?",
        "That sounds challenging. How have you been coping with these feelings?",
        "Thank you for sharing that with me. What support would be most helpful for you right now?",
        "I'm here to listen without judgment. Would you like to explore some strategies that might help?",
        "Your feelings are valid. Have you spoken to anyone else about this?",
        "It's important to remember that seeking help is a sign of strength. Would you like to discuss some resources that might be helpful?",
        "I'm hearing that this has been difficult for you. What has helped you manage similar situations in the past?",
        "Taking care of your mental health is just as important as physical health. What self-care activities do you enjoy?",
        "It sounds like you're going through a lot right now. Would it help to break down these challenges into smaller, more manageable parts?",
        "I appreciate you trusting me with your thoughts. How can I best support you today?",
      ]

      const responseIndex = Math.floor(Math.random() * mockResponses.length)
      const responseContent = mockResponses[responseIndex]

      const assistantMessage: Message = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Can we try again in a moment?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col relative">
      <CardHeader className="bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10 border-2 border-white">
              <img src={expert.avatar || "/placeholder.svg"} alt={expert.name} />
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{expert.name}</h2>
              <p className="text-sm opacity-90">{expert.specialty}</p>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <AlertTriangle size={18} className="text-white" />
          </button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 w-64"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">About AI Assistant</h3>
              <button onClick={() => setShowInfo(false)} className="text-gray-500 hover:text-gray-700">
                <X size={14} />
              </button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              This AI assistant provides supportive conversations but is not a replacement for professional mental
              health care. All responses are generated by AI using general information.
            </p>
            <div className="flex items-center text-xs">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-gray-600 dark:text-gray-400">Using simulated responses</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardContent className="flex-grow p-0 relative">
        <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages
              .filter((msg) => msg.role !== "system")
              .map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20 text-gray-800 dark:text-gray-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.role === "user" ? (
                        <User size={14} className="text-[#6C63FF] dark:text-[#8B5CF6] mr-1" />
                      ) : (
                        <Bot size={14} className="text-gray-600 dark:text-gray-400 mr-1" />
                      )}
                      <span className="text-xs font-medium">{message.role === "user" ? "You" : expert.name}</span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700">
                  <div className="flex items-center mb-1">
                    <Bot size={14} className="text-gray-600 dark:text-gray-400 mr-1" />
                    <span className="text-xs font-medium">{expert.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex w-full space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="bg-[#6C63FF] hover:bg-[#5A52D5] text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>

      <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 text-xs text-yellow-700 dark:text-yellow-400 flex items-center">
        <Sparkles size={14} className="mr-1" />
        This is a simulated AI conversation using pre-defined responses.
      </div>
    </Card>
  )
}
