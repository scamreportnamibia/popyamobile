"use client"

import type React from "react"
import { useState } from "react"
import { Heart, MessageSquare, Clock, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type FeelingPost = {
  id: string
  userCode: string
  content: string
  timestamp: Date
  isUserPost: boolean
  comments: Comment[]
  liked: boolean
  likeCount: number
}

type Comment = {
  id: string
  userCode: string
  isExpert: boolean
  content: string
  timestamp: Date
}

// Sample data
const initialFeelings: FeelingPost[] = [
  {
    id: "1",
    userCode: "12345",
    content:
      "I've been feeling overwhelmed with work and family responsibilities. It's getting harder to balance everything and I'm not sleeping well.",
    timestamp: new Date("2025-05-17T15:30:00"),
    isUserPost: false,
    liked: false,
    likeCount: 3,
    comments: [
      {
        id: "c1",
        userCode: "EXPERT-001",
        isExpert: true,
        content:
          "I understand how challenging it can be to balance multiple responsibilities. Have you tried scheduling specific times for rest? I'd like to discuss some strategies with you.",
        timestamp: new Date("2025-05-17T16:15:00"),
      },
    ],
  },
  {
    id: "2",
    userCode: "67890",
    content:
      "Today I managed to go for a walk in the park instead of staying in bed all day. It's a small win, but I'm proud of myself.",
    timestamp: new Date("2025-05-17T12:20:00"),
    isUserPost: false,
    liked: true,
    likeCount: 7,
    comments: [
      {
        id: "c2",
        userCode: "23456",
        isExpert: false,
        content: "That's wonderful! Small steps lead to big changes. Proud of you! 💖",
        timestamp: new Date("2025-05-17T12:45:00"),
      },
      {
        id: "c3",
        userCode: "EXPERT-003",
        isExpert: true,
        content:
          "Celebrating these victories is so important. Nature can be very healing. Would you like to discuss other activities that might help?",
        timestamp: new Date("2025-05-17T13:30:00"),
      },
    ],
  },
  {
    id: "3",
    userCode: "54321",
    content: "I'm struggling with negative thoughts again. Everything feels pointless today.",
    timestamp: new Date("2025-05-17T09:10:00"),
    isUserPost: true,
    liked: false,
    likeCount: 2,
    comments: [
      {
        id: "c4",
        userCode: "EXPERT-002",
        isExpert: true,
        content:
          "Thank you for sharing this difficult moment. Negative thoughts can be overwhelming, but you're not alone. Let's talk more about what you're experiencing and find some strategies to help.",
        timestamp: new Date("2025-05-17T09:25:00"),
      },
    ],
  },
]

export const FeelingsFeed: React.FC = () => {
  const [feelings, setFeelings] = useState<FeelingPost[]>(initialFeelings)
  const [newComment, setNewComment] = useState<string>("")
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null)

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const toggleLike = (id: string) => {
    setFeelings(
      feelings.map((feeling) => {
        if (feeling.id === id) {
          const liked = !feeling.liked
          return {
            ...feeling,
            liked,
            likeCount: liked ? feeling.likeCount + 1 : feeling.likeCount - 1,
          }
        }
        return feeling
      }),
    )
  }

  const toggleComments = (id: string) => {
    setActiveCommentId(activeCommentId === id ? null : id)
  }

  const handleCommentSubmit = (postId: string) => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `c${Math.random().toString(36).substring(2, 9)}`,
      userCode: "54321", // Current user code
      isExpert: false,
      content: newComment,
      timestamp: new Date(),
    }

    setFeelings(
      feelings.map((feeling) => {
        if (feeling.id === postId) {
          return {
            ...feeling,
            comments: [...feeling.comments, comment],
          }
        }
        return feeling
      }),
    )

    setNewComment("")
  }

  return (
    <div className="space-y-4">
      {feelings.map((feeling) => (
        <motion.div
          key={feeling.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`bg-white p-4 rounded-xl shadow-sm border ${
            feeling.isUserPost ? "border-[#6C63FF]/30" : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  feeling.isUserPost ? "bg-[#6C63FF]" : "bg-gray-200"
                }`}
              >
                <User size={16} className={feeling.isUserPost ? "text-white" : "text-gray-500"} />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-700">User #{feeling.userCode}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  {formatTimeAgo(feeling.timestamp)}
                </div>
              </div>
            </div>
            {feeling.isUserPost && (
              <span className="text-xs py-1 px-2 bg-[#6C63FF]/10 text-[#6C63FF] rounded-full">You</span>
            )}
          </div>

          <p className="text-gray-800 my-2">{feeling.content}</p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => toggleLike(feeling.id)}
              className={`flex items-center text-sm ${feeling.liked ? "text-[#FF6584]" : "text-gray-500"}`}
            >
              <Heart size={16} className="mr-1" fill={feeling.liked ? "#FF6584" : "none"} />
              {feeling.likeCount}
            </button>

            <button onClick={() => toggleComments(feeling.id)} className="flex items-center text-sm text-gray-500">
              <MessageSquare size={16} className="mr-1" />
              {feeling.comments.length} {feeling.comments.length === 1 ? "comment" : "comments"}
            </button>
          </div>

          <AnimatePresence>
            {activeCommentId === feeling.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 pt-3 border-t border-gray-100"
              >
                <div className="space-y-3 mb-3">
                  {feeling.comments.map((comment) => (
                    <div key={comment.id} className="flex">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          comment.isExpert ? "bg-[#43C6AC]" : "bg-gray-200"
                        }`}
                      >
                        <User size={12} className={comment.isExpert ? "text-white" : "text-gray-500"} />
                      </div>
                      <div className="ml-2 flex-1">
                        <div className="flex items-center">
                          <p className="text-xs font-medium text-gray-700">
                            {comment.isExpert ? "Expert" : `User #${comment.userCode}`}
                          </p>
                          <span className="text-xs text-gray-500 ml-2">{formatTimeAgo(comment.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 text-sm p-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                  />
                  <button
                    onClick={() => handleCommentSubmit(feeling.id)}
                    disabled={!newComment.trim()}
                    className="px-3 py-2 bg-[#6C63FF] text-white text-sm rounded-r-lg disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
