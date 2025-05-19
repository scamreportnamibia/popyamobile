"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { motion } from "framer-motion"

export default function ShareFeelingsPage() {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showAutoResponse, setShowAutoResponse] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setShowAutoResponse(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-[56px] bg-white z-30 border-b px-4 py-2 flex items-center">
        <Link href="/" className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="ml-3 text-lg font-semibold">Share My Feelings</h1>
      </div>

      <div className="p-4">
        <AnimatedContainer className="mb-4">
          <div className="bg-gradient-to-r from-[#6C63FF]/10 to-[#8B5CF6]/10 p-4 rounded-xl">
            <h2 className="text-base font-medium text-[#6C63FF]">Your Safe Space</h2>
            <p className="text-sm text-gray-600 mt-1">
              Share your thoughts, feelings, or experiences. Your post will only be visible to you and our trusted
              professionals who can offer support.
            </p>
          </div>
        </AnimatedContainer>

        {!isSubmitted ? (
          <AnimatedContainer
            animation="slide"
            delay={0.1}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <form onSubmit={handleSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind today? How are you feeling?"
                className="w-full min-h-[150px] p-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF] resize-none"
              />

              <div className="flex justify-end mt-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!content.trim() || isSubmitting}
                  className={`flex items-center px-4 py-2 rounded-lg text-white font-medium 
                    ${
                      isSubmitting ? "bg-gray-400" : "bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6]"
                    } disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      Share <Send size={16} className="ml-2" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </AnimatedContainer>
        ) : (
          <>
            <AnimatedContainer
              animation="bounce"
              className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-4"
            >
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-[#6C63FF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send size={24} className="text-[#6C63FF]" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Thank You For Sharing</h2>
                <p className="text-gray-600 mt-2">Your feelings have been shared. You've taken an important step.</p>
              </div>
            </AnimatedContainer>

            {showAutoResponse && (
              <AnimatedContainer
                animation="slide"
                delay={0.2}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
              >
                <div className="flex mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#43C6AC] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium">Popya Support</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
                <div className="p-3 bg-[#43C6AC]/10 rounded-lg">
                  <p className="text-sm text-gray-800">
                    Thank you for your bravery in sharing your feelings with us. It takes courage to express what you're
                    going through. An expert will reach out to you soon to provide support. In the meantime, please take
                    care of yourself and remember that you're not alone.
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">An expert typically responds within 4 hours</p>
              </AnimatedContainer>
            )}
          </>
        )}
      </div>
    </div>
  )
}
