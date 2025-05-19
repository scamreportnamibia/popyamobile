"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, ChevronRight, Heart, Share2, MessageCircle, User, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Types
type ContentType = "article" | "event" | "advertisement"

type Author = {
  id: string
  name: string
  role: string
  avatar: string
}

type Article = {
  id: string
  type: "article"
  title: string
  excerpt: string
  coverImage: string
  author: Author
  publishedAt: string
  readTime: string
  category: string
  likes: number
  comments: number
  shares: number
  link: string
}

type Event = {
  id: string
  type: "event"
  title: string
  description: string
  coverImage: string
  date: string
  time: string
  location: string
  organizer: Author
  attendees: number
  link: string
}

type Advertisement = {
  id: string
  type: "advertisement"
  title: string
  description: string
  image: string
  sponsor: string
  ctaText: string
  ctaLink: string
}

type ContentItem = Article | Event | Advertisement

// Sample data
const sampleContent: ContentItem[] = [
  {
    id: "article-1",
    type: "article",
    title: "Understanding Anxiety: Signs, Symptoms and Coping Strategies",
    excerpt:
      "Anxiety is more than just feeling stressed. Learn how to identify anxiety symptoms and effective ways to manage them in daily life.",
    coverImage: "/placeholder.svg?height=300&width=600",
    author: {
      id: "author-1",
      name: "Dr. Maria Ndapewa",
      role: "Clinical Psychologist",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    publishedAt: "May 15, 2025",
    readTime: "5 min read",
    category: "Mental Health",
    likes: 24,
    comments: 7,
    shares: 5,
    link: "/articles/understanding-anxiety",
  },
  {
    id: "event-1",
    type: "event",
    title: "Mental Health Awareness Workshop",
    description:
      "Join us for an interactive workshop on mental health awareness and learn practical techniques for managing stress and anxiety.",
    coverImage: "/placeholder.svg?height=300&width=600",
    date: "June 10, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Windhoek Community Center, Main Hall",
    organizer: {
      id: "author-2",
      name: "Thomas Shilongo",
      role: "Mindfulness Coach",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    attendees: 42,
    link: "/events/mental-health-workshop",
  },
  {
    id: "ad-1",
    type: "advertisement",
    title: "Mental Health Support Line",
    description:
      "24/7 confidential support for anyone experiencing emotional distress. Our trained counselors are here to help.",
    image: "/placeholder.svg?height=300&width=600",
    sponsor: "Namibia Mental Health Association",
    ctaText: "Call Now",
    ctaLink: "tel:+264612345678",
  },
  {
    id: "article-2",
    type: "article",
    title: "The Power of Mindfulness in Daily Life",
    excerpt:
      "Discover how incorporating mindfulness practices into your daily routine can improve your mental wellbeing and reduce stress.",
    coverImage: "/placeholder.svg?height=300&width=600",
    author: {
      id: "author-3",
      name: "Dr. James Hamukwaya",
      role: "Psychiatrist",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    publishedAt: "May 12, 2025",
    readTime: "7 min read",
    category: "Mindfulness",
    likes: 36,
    comments: 12,
    shares: 18,
    link: "/articles/power-of-mindfulness",
  },
  {
    id: "event-2",
    type: "event",
    title: "Support Group Meeting: Dealing with Depression",
    description: "A safe space to share experiences and learn coping strategies for depression. Open to all adults.",
    coverImage: "/placeholder.svg?height=300&width=600",
    date: "June 15, 2025",
    time: "6:00 PM - 7:30 PM",
    location: "Virtual (Zoom)",
    organizer: {
      id: "author-4",
      name: "Emma Nangolo",
      role: "Counselor",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    attendees: 28,
    link: "/events/depression-support-group",
  },
]

// User greeting data
type TimeOfDay = "morning" | "afternoon" | "evening" | "night"

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return "morning"
  if (hour >= 12 && hour < 17) return "afternoon"
  if (hour >= 17 && hour < 22) return "evening"
  return "night"
}

const getGreeting = (timeOfDay: TimeOfDay): string => {
  switch (timeOfDay) {
    case "morning":
      return "Good morning"
    case "afternoon":
      return "Good afternoon"
    case "evening":
      return "Good evening"
    case "night":
      return "Good night"
  }
}

const getWellnessMessage = (timeOfDay: TimeOfDay): string => {
  switch (timeOfDay) {
    case "morning":
      return "Start your day with a moment of mindfulness."
    case "afternoon":
      return "Take a break and breathe deeply for a minute."
    case "evening":
      return "Reflect on three positive moments from today."
    case "night":
      return "Prepare for restful sleep by letting go of today's worries."
  }
}

export function RedesignedExpertFeed() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay())
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({})
  const [dismissedAds, setDismissedAds] = useState<Record<string, boolean>>({})
  const [userName, setUserName] = useState("there")

  // Load content
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      // In a real app, you would fetch from an API
      setTimeout(() => {
        setContent(sampleContent)
        setLoading(false)
      }, 1000)
    }

    fetchContent()

    // Update time of day every hour
    const interval = setInterval(
      () => {
        setTimeOfDay(getTimeOfDay())
      },
      60 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [])

  // Toggle like
  const toggleLike = (id: string) => {
    setLikedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Dismiss ad
  const dismissAd = (id: string) => {
    setDismissedAds((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  // Render loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Greeting skeleton */}
        <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>

        {/* Content skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] rounded-xl p-6 text-white"
      >
        <h2 className="text-xl font-bold mb-1">
          {getGreeting(timeOfDay)}, {userName}!
        </h2>
        <p className="text-white/90">{getWellnessMessage(timeOfDay)}</p>

        <div className="flex items-center mt-4">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-white/70">Today's Mood</div>
            <div className="flex mt-1 space-x-2">
              {["😊", "😌", "😐", "😔", "😠"].map((emoji) => (
                <button
                  key={emoji}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg hover:bg-white/30 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <Link
            href="/mental-health-check"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
          >
            Daily Check-in
          </Link>
        </div>
      </motion.div>

      {/* Content Feed */}
      <div className="space-y-6">
        {content.map((item, index) => {
          // Skip dismissed ads
          if (item.type === "advertisement" && dismissedAds[item.id]) {
            return null
          }

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {item.type === "article" && (
                <Card className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image src={item.coverImage || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <Badge className="mb-2 bg-[#6C63FF] hover:bg-[#5A52D5]">{item.category}</Badge>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
                        <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{item.author.name}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{item.publishedAt}</span>
                          <span className="mx-1">•</span>
                          <span>{item.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">{item.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => toggleLike(item.id)}
                          className={`flex items-center text-sm ${likedItems[item.id] ? "text-red-500" : "text-gray-500"}`}
                        >
                          <Heart size={16} className="mr-1" fill={likedItems[item.id] ? "currentColor" : "none"} />
                          <span>{likedItems[item.id] ? item.likes + 1 : item.likes}</span>
                        </button>
                        <button className="flex items-center text-sm text-gray-500">
                          <MessageCircle size={16} className="mr-1" />
                          <span>{item.comments}</span>
                        </button>
                        <button className="flex items-center text-sm text-gray-500">
                          <Share2 size={16} className="mr-1" />
                          <span>{item.shares}</span>
                        </button>
                      </div>

                      <Link
                        href={item.link}
                        className="text-[#6C63FF] hover:text-[#5A52D5] text-sm font-medium flex items-center"
                      >
                        Read more <ChevronRight size={16} />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {item.type === "event" && (
                <Card className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <Image src={item.coverImage || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#FF6584] hover:bg-[#FF4D73]">Event</Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 text-[#6C63FF] mt-0.5 mr-2" />
                        <span className="text-sm">{item.date}</span>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-4 h-4 text-[#6C63FF] mt-0.5 mr-2" />
                        <span className="text-sm">{item.time}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-[#6C63FF] mt-0.5 mr-2" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                      <div className="flex items-start">
                        <User className="w-4 h-4 text-[#6C63FF] mt-0.5 mr-2" />
                        <span className="text-sm">{item.attendees} attending</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={item.organizer.avatar || "/placeholder.svg"} alt={item.organizer.name} />
                          <AvatarFallback>{item.organizer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">Organized by {item.organizer.name}</span>
                      </div>

                      <Link href={item.link}>
                        <Button size="sm" className="bg-[#6C63FF] hover:bg-[#5A52D5]">
                          Register
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {item.type === "advertisement" && (
                <motion.div
                  className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 p-0.5"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => dismissAd(item.id)}
                    className="absolute top-2 right-2 z-10 p-1 bg-black/20 hover:bg-black/30 rounded-full text-white"
                    aria-label="Dismiss advertisement"
                  >
                    <X size={14} />
                  </button>

                  <div className="bg-white dark:bg-gray-800 rounded-[0.65rem] overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-40 md:h-auto md:w-1/3">
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      </div>

                      <div className="p-4 md:w-2/3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-amber-500 border-amber-500">
                            Sponsored
                          </Badge>
                          <span className="text-xs text-gray-500">{item.sponsor}</span>
                        </div>

                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>

                        <Link href={item.ctaLink}>
                          <Button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600">
                            {item.ctaText}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* View More Button */}
      <div className="flex justify-center">
        <Button variant="outline" className="border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white">
          Load More Content
        </Button>
      </div>
    </div>
  )
}
