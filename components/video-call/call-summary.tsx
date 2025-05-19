"use client"

import { useState } from "react"
import { X, Download, Share2, Clock, MessageSquare, CheckCircle, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import type { CallSummary } from "@/services/ai-call-assistant"

interface CallSummaryProps {
  summary: CallSummary
  transcripts: { userId: string; text: string; timestamp: number }[]
  onClose: () => void
}

export default function CallSummaryComponent({ summary, transcripts, onClose }: CallSummaryProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "transcript">("summary")

  // Format call duration
  const formatCallDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [hours > 0 ? `${hours}h` : null, minutes > 0 ? `${minutes}m` : null, `${secs}s`].filter(Boolean).join(" ")
  }

  // Download transcript as text file
  const downloadTranscript = () => {
    const text = transcripts
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((t) => `[${new Date(t.timestamp).toLocaleTimeString()}] ${t.userId}: ${t.text}`)
      .join("\n")

    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `call-transcript-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Share summary
  const shareSummary = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Call Summary",
          text: `Call Duration: ${formatCallDuration(summary.duration)}\n\nKey Points:\n${summary.keyPoints.join(
            "\n",
          )}\n\nAction Items:\n${summary.actionItems.join("\n")}`,
        })
        .catch((error) => console.log("Error sharing:", error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert("Sharing is not supported in this browser")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex flex-col"
    >
      <div className="flex justify-between items-center p-4 bg-black/50">
        <h2 className="text-xl font-bold text-white">Call Summary</h2>
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-3xl mx-auto p-4">
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-4">
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-2 font-medium ${
                activeTab === "summary"
                  ? "text-[#6C63FF] border-b-2 border-[#6C63FF]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("transcript")}
              className={`px-4 py-2 font-medium ${
                activeTab === "transcript"
                  ? "text-[#6C63FF] border-b-2 border-[#6C63FF]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Full Transcript
            </button>
          </div>

          {/* Summary Tab */}
          {activeTab === "summary" && (
            <div className="space-y-6">
              {/* Call Info */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <Clock size={20} className="text-gray-400 mr-2" />
                  <h3 className="text-white font-medium">Call Duration</h3>
                </div>
                <p className="text-2xl font-bold text-white">{formatCallDuration(summary.duration)}</p>
              </div>

              {/* Overall Sentiment */}
              <div
                className={`rounded-lg p-4 ${
                  summary.sentiment.includes("Positive")
                    ? "bg-green-900/30"
                    : summary.sentiment.includes("Negative")
                      ? "bg-red-900/30"
                      : "bg-gray-800"
                }`}
              >
                <div className="flex items-center mb-4">
                  {summary.sentiment.includes("Positive") ? (
                    <CheckCircle size={20} className="text-green-400 mr-2" />
                  ) : summary.sentiment.includes("Negative") ? (
                    <AlertTriangle size={20} className="text-red-400 mr-2" />
                  ) : (
                    <MessageSquare size={20} className="text-gray-400 mr-2" />
                  )}
                  <h3 className="text-white font-medium">Overall Sentiment</h3>
                </div>
                <p className="text-xl font-bold text-white">{summary.sentiment}</p>
              </div>

              {/* Topics */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-4">Topics Discussed</h3>
                <div className="flex flex-wrap gap-2">
                  {summary.topics.map((topic, index) => (
                    <span key={index} className="px-3 py-1 bg-[#6C63FF]/20 text-[#6C63FF] rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Points */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-4">Key Points</h3>
                <ul className="space-y-2">
                  {summary.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-[#6C63FF]/20 text-[#6C63FF] flex items-center justify-center mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-white">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Items */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-4">Action Items</h3>
                <ul className="space-y-2">
                  {summary.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={18} className="text-[#6C63FF] mr-2 mt-0.5" />
                      <span className="text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Transcript Tab */}
          {activeTab === "transcript" && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-4">Full Conversation Transcript</h3>
              <div className="space-y-4">
                {transcripts.length === 0 ? (
                  <p className="text-gray-400">No transcript available for this call.</p>
                ) : (
                  transcripts
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map((transcript, index) => (
                      <div key={index} className="flex">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0 mr-3">
                          {/* You would use actual avatars here */}
                          <div className="w-full h-full flex items-center justify-center text-white font-bold">
                            {transcript.userId.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium text-white">{transcript.userId}</span>
                            <span className="text-xs text-gray-400 ml-2">
                              {new Date(transcript.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-200 mt-1">{transcript.text}</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 bg-black/50 flex justify-center">
        <div className="flex space-x-4">
          <button
            onClick={downloadTranscript}
            className="flex items-center px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20"
          >
            <Download size={18} className="mr-2" />
            Download Transcript
          </button>
          <button
            onClick={shareSummary}
            className="flex items-center px-4 py-2 bg-[#6C63FF] text-white rounded-md hover:bg-[#5A52D5]"
          >
            <Share2 size={18} className="mr-2" />
            Share Summary
          </button>
        </div>
      </div>
    </motion.div>
  )
}
