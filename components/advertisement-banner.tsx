"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { X } from "lucide-react"

type Advertisement = {
  id: string
  title: string
  description: string
  image: string
  link: string
  color: string
}

// Sample advertisements
const advertisements: Advertisement[] = [
  {
    id: "mental-health-workshop",
    title: "Free Mental Health Workshop",
    description: "Join our virtual workshop on stress management techniques this Saturday.",
    image: "/placeholder.svg?height=80&width=80",
    link: "/events/mental-health-workshop",
    color: "from-[rgb(41,121,255)] to-[rgb(94,53,177)]",
  },
  {
    id: "therapy-sessions",
    title: "50% Off First Therapy Session",
    description: "Connect with licensed therapists at a discounted rate for your first session.",
    image: "/placeholder.svg?height=80&width=80",
    link: "/offers/therapy-discount",
    color: "from-[rgb(0,200,83)] to-[rgb(29,233,182)]",
  },
  {
    id: "support-group",
    title: "New Support Group Starting",
    description: "Join our weekly support group for young adults dealing with anxiety.",
    image: "/placeholder.svg?height=80&width=80",
    link: "/groups/anxiety-support",
    color: "from-[rgb(244,67,54)] to-[rgb(255,82,82)]",
  },
]

export function AdvertisementBanner() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const currentAd = advertisements[currentAdIndex]

  // Auto-rotate ads every 10 seconds
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % advertisements.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [isVisible])

  if (dismissed) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r ${currentAd.color} mb-4`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-white blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 flex items-center">
        <div className="w-20 h-20 rounded-xl overflow-hidden relative flex-shrink-0 bg-white/20 backdrop-blur-sm p-1">
          <Image
            src={currentAd.image || "/placeholder.svg"}
            alt={currentAd.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="ml-4 flex-1">
          <h3 className="font-bold text-white text-lg">{currentAd.title}</h3>
          <p className="text-white/90 text-sm">{currentAd.description}</p>

          <button className="mt-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
            Learn More
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/20 backdrop-blur-sm text-white"
        >
          <X size={14} />
        </button>

        {/* Ad indicator dots */}
        {advertisements.length > 1 && (
          <div className="absolute bottom-2 right-2 flex space-x-1">
            {advertisements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`w-2 h-2 rounded-full ${index === currentAdIndex ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
