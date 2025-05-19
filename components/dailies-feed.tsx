"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Pause, Play, X, Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Daily = {
  id: string
  user: {
    id: string
    name: string
    avatar: string
  }
  content: {
    type: "image" | "video"
    url: string
    caption?: string
  }
  timestamp: string
  views: number
  likes: number
}

// Sample data
const sampleDailies: Daily[] = [
  {
    id: "d1",
    user: {
      id: "u1",
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    content: {
      type: "image",
      url: "/placeholder.svg?height=800&width=400",
      caption: "5 Minute Mindfulness Meditation to help you center yourself and reduce anxiety.",
    },
    timestamp: "2 hours ago",
    views: 342,
    likes: 28,
  },
  {
    id: "d2",
    user: {
      id: "u2",
      name: "Dr. Michael Chen",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    content: {
      type: "image",
      url: "/placeholder.svg?height=800&width=400",
      caption: "Overcoming Negative Thoughts: Learn a simple cognitive behavioral technique.",
    },
    timestamp: "4 hours ago",
    views: 287,
    likes: 42,
  },
  {
    id: "d3",
    user: {
      id: "u3",
      name: "Dr. Olivia Patel",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    content: {
      type: "image",
      url: "/placeholder.svg?height=800&width=400",
      caption: "Quick Stress Relief Exercise you can do anywhere to immediately reduce stress and anxiety.",
    },
    timestamp: "6 hours ago",
    views: 198,
    likes: 15,
  },
  {
    id: "d4",
    user: {
      id: "u4",
      name: "Dr. James Wilson",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    content: {
      type: "image",
      url: "/placeholder.svg?height=800&width=400",
      caption: "Building Self-Compassion: Learn how to be kinder to yourself with this short guide.",
    },
    timestamp: "8 hours ago",
    views: 256,
    likes: 34,
  },
  {
    id: "d5",
    user: {
      id: "u5",
      name: "Dr. Amara Okafor",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    content: {
      type: "image",
      url: "/placeholder.svg?height=800&width=400",
      caption: "Grounding Technique for Anxiety: A simple 5-4-3-2-1 technique to help manage anxiety.",
    },
    timestamp: "10 hours ago",
    views: 312,
    likes: 47,
  },
]

const DailiesFeed = () => {
  const [dailies, setDailies] = useState<Daily[]>(sampleDailies)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Load dailies
  useEffect(() => {
    // In a real app, you would fetch from an API
    setDailies(sampleDailies)
  }, [])

  // Handle timer for status progression
  useEffect(() => {
    if (activeIndex !== null && !isPaused) {
      // Reset progress
      setProgress(0)

      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Set up new timer
      const duration = 60 * 10 // 60 seconds * 10 (for smoother progress)
      const interval = 100 // Update every 100ms
      let elapsed = 0

      timerRef.current = setInterval(() => {
        elapsed += 1
        const newProgress = (elapsed / duration) * 100
        setProgress(newProgress)

        if (newProgress >= 100) {
          // Move to next daily
          if (activeIndex < dailies.length - 1) {
            setActiveIndex(activeIndex + 1)
          } else {
            // Close the viewer if we're at the last daily
            setActiveIndex(null)
            if (timerRef.current) {
              clearInterval(timerRef.current)
            }
          }
        }
      }, interval)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    }
  }, [activeIndex, isPaused, dailies.length])

  const openDaily = (index: number) => {
    setActiveIndex(index)
    setIsPaused(false)
    setIsLiked(false)
  }

  const closeViewer = () => {
    setActiveIndex(null)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const goToPrevious = () => {
    if (activeIndex !== null && activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }

  const goToNext = () => {
    if (activeIndex !== null && activeIndex < dailies.length - 1) {
      setActiveIndex(activeIndex + 1)
    } else {
      closeViewer()
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
    // In a real app, you would send this to an API
  }

  const shareDaily = () => {
    // In a real app, you would implement sharing functionality
    alert("Sharing functionality would be implemented here")
  }

  return (
    <div className="relative">
      {/* Status Circles (WhatsApp style) */}
      <div className="flex overflow-x-auto pb-4 gap-4 px-2 no-scrollbar">
        {dailies.map((daily, index) => (
          <div key={daily.id} className="flex flex-col items-center cursor-pointer" onClick={() => openDaily(index)}>
            <div
              className={`w-16 h-16 rounded-full p-[2px] ${
                activeIndex === index ? "bg-gradient-to-tr from-purple-500 to-pink-500" : "bg-gray-300"
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={daily.user.avatar || "/placeholder.svg"}
                  alt={daily.user.name}
                  width={60}
                  height={60}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <span className="text-xs mt-1 text-center w-16 truncate">{daily.user.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>

      {/* Status Viewer (WhatsApp style) */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between text-white">
              <div className="flex items-center">
                <button onClick={closeViewer} className="mr-4">
                  <X size={24} />
                </button>
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={dailies[activeIndex].user.avatar || "/placeholder.svg"}
                    alt={dailies[activeIndex].user.name}
                  />
                  <AvatarFallback>{dailies[activeIndex].user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{dailies[activeIndex].user.name}</p>
                  <p className="text-xs opacity-70">{dailies[activeIndex].timestamp}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button onClick={togglePause} className="p-2">
                  {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>
              </div>
            </div>

            {/* Progress bars */}
            <div className="px-4 flex gap-1">
              {dailies.map((_, index) => (
                <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                  {index < activeIndex ? (
                    <div className="h-full w-full bg-white"></div>
                  ) : index === activeIndex ? (
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    ></div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center relative">
              {/* Navigation buttons */}
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-white z-10"
                disabled={activeIndex === 0}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-white z-10"
              >
                <ChevronRight size={24} />
              </button>

              {/* Daily content */}
              <div className="w-full h-full flex items-center justify-center">
                {dailies[activeIndex].content.type === "image" ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={dailies[activeIndex].content.url || "/placeholder.svg"}
                      alt="Daily content"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    src={dailies[activeIndex].content.url}
                    className="max-h-full max-w-full"
                    autoPlay
                    playsInline
                    muted
                    loop
                  />
                )}
              </div>

              {/* Caption */}
              {dailies[activeIndex].content.caption && (
                <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-center">{dailies[activeIndex].content.caption}</p>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="p-4 flex items-center justify-center gap-8">
              <button
                onClick={toggleLike}
                className={`flex flex-col items-center ${isLiked ? "text-red-500" : "text-white"}`}
              >
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
                <span className="text-xs mt-1">Like</span>
              </button>
              <button onClick={() => {}} className="flex flex-col items-center text-white">
                <MessageCircle size={24} />
                <span className="text-xs mt-1">Reply</span>
              </button>
              <button onClick={shareDaily} className="flex flex-col items-center text-white">
                <Share2 size={24} />
                <span className="text-xs mt-1">Share</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DailiesFeed
