"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import {
  TrendingUp,
  Calendar,
  ArrowRight,
  Heart,
  UserPlus,
  Shield,
  AlertCircle,
  Users,
  CalendarIcon,
} from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface MoodEntry {
  timestamp: string
  mood: {
    emoji: string
    name: string
    gradient: string
  }
  reason: string
}

interface Expert {
  id: string
  name: string
  title: string
  organization?: string
  isFree: boolean
  imageUrl: string
  isVerified: boolean
  isOnline: boolean
  followers: number
  likes: number
}

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  imageUrl: string
  organizer: string
  isVirtual: boolean
  isFree: boolean
  attendees: number
}

interface SupportGroup {
  id: string
  name: string
  description: string
  members: number
  imageUrl: string
  category: string
  isPrivate: boolean
  meetingFrequency: string
  isVerified: boolean
}

export default function Home() {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const [greeting, setGreeting] = useState("")
  const [userName, setUserName] = useState("Friend")
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [showMoodPrompt, setShowMoodPrompt] = useState(false)
  const [specialMessage, setSpecialMessage] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const [showMoodReasonPrompt, setShowMoodReasonPrompt] = useState(false)
  const [selectedMood, setSelectedMood] = useState<{ emoji: string; name: string } | null>(null)
  const [moodReason, setMoodReason] = useState("")
  const [displayedGreeting, setDisplayedGreeting] = useState("")
  const [displayedMessage, setDisplayedMessage] = useState("")
  const [experts, setExperts] = useState<Expert[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([])
  const [likedExperts, setLikedExperts] = useState<Record<string, boolean>>({})
  const [followedExperts, setFollowedExperts] = useState<Record<string, boolean>>({})
  const [interestedEvents, setInterestedEvents] = useState<Record<string, boolean>>({})
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Refs for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const greetingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Emoji reactions with sounds
  const emojiReactions = [
    { emoji: "😊", sound: "happy.mp3", name: "happy" },
    { emoji: "😌", sound: "relaxed.mp3", name: "relaxed" },
    { emoji: "😐", sound: "neutral.mp3", name: "neutral" },
    { emoji: "😔", sound: "sad.mp3", name: "sad" },
    { emoji: "😠", sound: "angry.mp3", name: "angry" },
  ].map((reaction) => ({
    ...reaction,
    // Fallback to a default sound if specific ones aren't available
    sound: "click.mp3",
  }))

  // Sample experts data
  const sampleExperts: Expert[] = [
    {
      id: "1",
      name: "Dr. Maria Ndapewa",
      title: "Clinical Psychologist",
      isFree: false,
      imageUrl: "/placeholder.svg?height=100&width=100",
      isVerified: true,
      isOnline: true,
      followers: 245,
      likes: 128,
    },
    {
      id: "2",
      name: "Officer Thomas",
      title: "Counseling Officer",
      organization: "NAMPOL",
      isFree: true,
      imageUrl: "/placeholder.svg?height=100&width=100",
      isVerified: true,
      isOnline: false,
      followers: 87,
      likes: 42,
    },
    {
      id: "3",
      name: "Sarah Johnson",
      title: "Trauma Therapist",
      isFree: false,
      imageUrl: "/placeholder.svg?height=100&width=100",
      isVerified: true,
      isOnline: true,
      followers: 312,
      likes: 189,
    },
    {
      id: "4",
      name: "Dr. James Hamukwaya",
      title: "Psychiatrist",
      organization: "MOHSS",
      isFree: true,
      imageUrl: "/placeholder.svg?height=100&width=100",
      isVerified: true,
      isOnline: true,
      followers: 156,
      likes: 98,
    },
    {
      id: "5",
      name: "Emma Nangolo",
      title: "Youth Counselor",
      organization: "Lifeline/Childline",
      isFree: true,
      imageUrl: "/placeholder.svg?height=100&width=100",
      isVerified: true,
      isOnline: false,
      followers: 203,
      likes: 117,
    },
    {
      id: "6",
      name: "Dr. Michael Tjivikua",
      title: "Addiction Specialist",
      isFree: false,
      imageUrl: "/placeholder.svg?height=100&width=100",
      isVerified: true,
      isOnline: true,
      followers: 178,
      likes: 84,
    },
  ]

  // Sample events data
  const sampleEvents: Event[] = [
    {
      id: "1",
      title: "Mental Health Awareness Workshop",
      date: "2023-06-15",
      time: "14:00-16:00",
      location: "Windhoek Community Center",
      imageUrl: "/placeholder.svg?height=100&width=100",
      organizer: "Namibia Mental Health Association",
      isVirtual: false,
      isFree: true,
      attendees: 45,
    },
    {
      id: "2",
      title: "Stress Management Webinar",
      date: "2023-06-20",
      time: "18:00-19:30",
      location: "Online",
      imageUrl: "/placeholder.svg?height=100&width=100",
      organizer: "Dr. Maria Ndapewa",
      isVirtual: true,
      isFree: false,
      attendees: 120,
    },
    {
      id: "3",
      title: "Youth Support Group Meeting",
      date: "2023-06-18",
      time: "15:00-17:00",
      location: "Katutura Youth Center",
      imageUrl: "/placeholder.svg?height=100&width=100",
      organizer: "Lifeline/Childline",
      isVirtual: false,
      isFree: true,
      attendees: 28,
    },
    {
      id: "4",
      title: "Trauma Healing Workshop",
      date: "2023-06-25",
      time: "09:00-12:00",
      location: "Swakopmund Community Hall",
      imageUrl: "/placeholder.svg?height=100&width=100",
      organizer: "Coastal Wellness Center",
      isVirtual: false,
      isFree: true,
      attendees: 35,
    },
    {
      id: "5",
      title: "Mindfulness Meditation Session",
      date: "2023-06-17",
      time: "07:00-08:00",
      location: "Online",
      imageUrl: "/placeholder.svg?height=100&width=100",
      organizer: "Wellness Namibia",
      isVirtual: true,
      isFree: true,
      attendees: 67,
    },
    {
      id: "6",
      title: "Family Counseling Workshop",
      date: "2023-06-30",
      time: "16:00-18:00",
      location: "Family First Center, Windhoek",
      imageUrl: "/placeholder.svg?height=100&width=100",
      organizer: "Family Support Network",
      isVirtual: false,
      isFree: false,
      attendees: 22,
    },
  ]

  // Sample support groups data
  const sampleSupportGroups: SupportGroup[] = [
    {
      id: "1",
      name: "Youth Mental Health",
      description: "Support group for young adults dealing with mental health challenges",
      members: 45,
      imageUrl: "/placeholder.svg?height=100&width=100",
      category: "Youth",
      isPrivate: false,
      meetingFrequency: "Weekly",
      isVerified: true,
    },
    {
      id: "2",
      name: "Grief & Loss Support",
      description: "A safe space for those experiencing grief and loss",
      members: 32,
      imageUrl: "/placeholder.svg?height=100&width=100",
      category: "Grief",
      isPrivate: false,
      meetingFrequency: "Bi-weekly",
      isVerified: true,
    },
    {
      id: "3",
      name: "Anxiety Management",
      description: "Learn techniques to manage anxiety and stress",
      members: 67,
      imageUrl: "/placeholder.svg?height=100&width=100",
      category: "Anxiety",
      isPrivate: false,
      meetingFrequency: "Weekly",
      isVerified: true,
    },
    {
      id: "4",
      name: "Depression Support Circle",
      description: "Support for individuals dealing with depression",
      members: 41,
      imageUrl: "/placeholder.svg?height=100&width=100",
      category: "Depression",
      isPrivate: true,
      meetingFrequency: "Weekly",
      isVerified: true,
    },
    {
      id: "5",
      name: "PTSD Recovery Group",
      description: "Support for trauma survivors and those with PTSD",
      members: 28,
      imageUrl: "/placeholder.svg?height=100&width=100",
      category: "Trauma",
      isPrivate: true,
      meetingFrequency: "Weekly",
      isVerified: true,
    },
    {
      id: "6",
      name: "Family Support Network",
      description: "Support for families affected by mental health issues",
      members: 53,
      imageUrl: "/placeholder.svg?height=100&width=100",
      category: "Family",
      isPrivate: false,
      meetingFrequency: "Monthly",
      isVerified: true,
    },
  ]

  const handleEmojiClick = (emoji: string, sound: string, name: string) => {
    setSelectedEmoji(emoji)
    setSelectedMood({ emoji, name })

    // Play sound effect with proper error handling
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false"
    if (soundEnabled) {
      try {
        // Check if we're in a browser environment
        if (typeof window !== "undefined") {
          const audio = new Audio()

          // Add event listeners for error handling
          audio.addEventListener("error", (e) => {
            console.log(`Sound not available: ${sound}`, e)
          })

          // Set source after adding error listener
          audio.src = `/sounds/${sound}`

          // Play with catch for browsers that throw instead of firing error event
          audio.play().catch((e) => {
            console.log(`Could not play sound: ${sound}`, e)
          })
        }
      } catch (e) {
        console.log("Sound playback not supported", e)
      }
    }

    // Show the mood reason prompt
    setShowMoodReasonPrompt(true)

    // Reset selected emoji after animation completes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => setSelectedEmoji(null), 500)
  }

  const handleMoodReasonSubmit = () => {
    if (!selectedMood) return

    // Create a new mood entry
    const newMoodEntry: MoodEntry = {
      timestamp: new Date().toISOString(),
      mood: {
        emoji: selectedMood.emoji,
        name: selectedMood.name,
        gradient: getMoodGradient(selectedMood.name),
      },
      reason: moodReason,
    }

    // Update mood history
    const updatedHistory = [newMoodEntry, ...(moodHistory || [])]
    setMoodHistory(updatedHistory)

    // Save to localStorage
    try {
      localStorage.setItem("moodHistory", JSON.stringify(updatedHistory))
    } catch (e) {
      console.error("Failed to save mood history:", e)
    }

    // Reset the form
    setMoodReason("")
    setSelectedMood(null)
    setShowMoodReasonPrompt(false)

    // Show confirmation toast
    toast({
      title: "Mood logged",
      description: "Your mood has been recorded successfully.",
    })
  }

  const handleLikeExpert = (expertId: string) => {
    setLikedExperts((prev) => ({
      ...prev,
      [expertId]: !prev[expertId],
    }))

    // Play sound effect
    try {
      const audio = new Audio("/sounds/click.mp3")
      audio.play().catch((e) => console.log("Could not play sound", e))
    } catch (e) {
      console.log("Sound playback not supported", e)
    }

    // Update the expert's likes count in the state
    setExperts((prev) =>
      prev.map((expert) =>
        expert.id === expertId
          ? {
              ...expert,
              likes: likedExperts[expertId] ? expert.likes - 1 : expert.likes + 1,
            }
          : expert,
      ),
    )
  }

  const handleFollowExpert = (expertId: string) => {
    setFollowedExperts((prev) => ({
      ...prev,
      [expertId]: !prev[expertId],
    }))

    // Play sound effect
    try {
      const audio = new Audio("/sounds/click.mp3")
      audio.play().catch((e) => console.log("Could not play sound", e))
    } catch (e) {
      console.log("Sound playback not supported", e)
    }

    // Update the expert's followers count in the state
    setExperts((prev) =>
      prev.map((expert) =>
        expert.id === expertId
          ? {
              ...expert,
              followers: followedExperts[expertId] ? expert.followers - 1 : expert.followers + 1,
            }
          : expert,
      ),
    )

    // Show toast notification
    toast({
      title: followedExperts[expertId] ? "Unfollowed" : "Following",
      description: followedExperts[expertId] ? "You have unfollowed this expert" : "You are now following this expert",
    })
  }

  const handleInterestedEvent = (eventId: string) => {
    setInterestedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }))

    // Play sound effect
    try {
      const audio = new Audio("/sounds/click.mp3")
      audio.play().catch((e) => console.log("Could not play sound", e))
    } catch (e) {
      console.log("Sound playback not supported", e)
    }

    // Update the event's attendees count in the state
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              attendees: interestedEvents[eventId] ? event.attendees - 1 : event.attendees + 1,
            }
          : event,
      ),
    )

    // Show toast notification
    toast({
      title: interestedEvents[eventId] ? "Not Interested" : "Interested",
      description: interestedEvents[eventId]
        ? "You are no longer interested in this event"
        : "You have marked interest in this event",
    })
  }

  const handleJoinGroup = (groupId: string) => {
    setJoinedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))

    // Play sound effect
    try {
      const audio = new Audio("/sounds/click.mp3")
      audio.play().catch((e) => console.log("Could not play sound", e))
    } catch (e) {
      console.log("Sound playback not supported", e)
    }

    // Update the group's members count in the state
    setSupportGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: joinedGroups[groupId] ? group.members - 1 : group.members + 1,
            }
          : group,
      ),
    )

    // Show toast notification
    toast({
      title: joinedGroups[groupId] ? "Left Group" : "Joined Group",
      description: joinedGroups[groupId] ? "You have left this support group" : "You have joined this support group",
    })
  }

  // Helper function to get gradient based on mood
  const getMoodGradient = (mood: string) => {
    switch (mood) {
      case "happy":
        return "from-green-400 to-green-500"
      case "relaxed":
        return "from-blue-400 to-blue-500"
      case "neutral":
        return "from-yellow-400 to-yellow-500"
      case "sad":
        return "from-purple-400 to-purple-500"
      case "angry":
        return "from-red-400 to-red-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  // Animated typing effect for greeting
  const typeGreeting = (text: string) => {
    let i = 0
    const typing = () => {
      if (i < text.length) {
        setDisplayedGreeting(text.substring(0, i + 1))
        i++
        greetingTimeoutRef.current = setTimeout(typing, 50)
      }
    }
    typing()
  }

  // Animated typing effect for message
  const typeMessage = (text: string) => {
    let i = 0
    const typing = () => {
      if (i < text.length) {
        setDisplayedMessage(text.substring(0, i + 1))
        i++
        messageTimeoutRef.current = setTimeout(typing, 30)
      } else {
        setIsLoaded(true)
      }
    }
    typing()
  }

  useEffect(() => {
    // Check if user is logged in
    if (!user && typeof window !== "undefined") {
      router.push("/auth")
      return
    }

    // Set greeting based on time of day
    const hour = new Date().getHours()
    let greetingText = ""
    if (hour < 12) greetingText = "Good morning, my friend"
    else if (hour < 18) greetingText = "Good afternoon, my friend"
    else greetingText = "Good evening, my friend"

    setGreeting(greetingText)

    // Start typing animation for greeting after a short delay
    setTimeout(() => {
      typeGreeting(greetingText)
    }, 500)

    // Check for special days in Namibian calendar
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()

    // Check for Namibian holidays and special days
    let messageText = ""
    if (month === 3 && day === 21) {
      messageText = "Happy Independence Day! 🇳🇦"
    } else if (month === 5 && day === 4) {
      messageText = "Happy Cassinga Day! 🕊️"
    } else if (month === 5 && day === 25) {
      messageText = "Happy Africa Day! 🌍"
    } else if (month === 8 && day === 26) {
      messageText = "Happy Heroes' Day! 🦁"
    } else if (month === 12 && day === 25) {
      messageText = "Merry Christmas! 🎄"
    } else {
      // Random motivational messages for regular days
      const motivationalMessages = [
        "You're doing great today!",
        "Every small step matters.",
        "Your mental health is a priority.",
        "Take a moment to breathe deeply.",
        "You are stronger than you think.",
      ]
      messageText = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
    }

    setSpecialMessage(messageText)

    // Start typing animation for message after greeting is complete
    setTimeout(() => {
      typeMessage(messageText)
    }, 1500)

    // Check if user has checked in today
    const storedHistory = localStorage.getItem("moodHistory")
    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory) as MoodEntry[]
        setMoodHistory(history)

        // Check if user has logged mood today
        const today = new Date().toDateString()
        const hasLoggedToday = history.some((entry) => new Date(entry.timestamp).toDateString() === today)

        setShowMoodPrompt(!hasLoggedToday)
      } catch (e) {
        console.error("Failed to parse mood history:", e)
        setShowMoodPrompt(true)
      }
    } else {
      setShowMoodPrompt(true)
    }

    // Load user name if available
    if (user?.name) {
      setUserName(user.name)
    } else {
      const storedName = localStorage.getItem("userName")
      if (storedName) {
        setUserName(storedName)
      }
    }

    // Load experts data
    setExperts(sampleExperts)

    // Load events data
    setEvents(sampleEvents)

    // Load support groups data
    setSupportGroups(sampleSupportGroups)

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current)
      }
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current)
      }
    }
  }, [router, user])

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white p-4 pt-6">
        <h1 className="text-2xl font-bold mb-1 min-h-[2rem]">
          {displayedGreeting}
          {displayedGreeting.length < greeting.length && <span className="animate-pulse">|</span>}
        </h1>
        <p className="text-white/80 min-h-[1.5rem]">
          {displayedMessage}
          {displayedMessage.length < specialMessage.length && <span className="animate-pulse">|</span>}
        </p>

        {/* Interactive Emoji Reactions */}
        <div className="flex justify-center mt-6 space-x-4">
          {emojiReactions.map((reaction) => (
            <motion.button
              key={reaction.name}
              onClick={() => handleEmojiClick(reaction.emoji, reaction.sound, reaction.name)}
              whileTap={{ scale: 1.4 }}
              whileHover={{ y: -5 }}
              animate={{
                scale: selectedEmoji === reaction.emoji ? [1, 1.8, 1] : 1,
                rotate: selectedEmoji === reaction.emoji ? [0, 15, -15, 0] : 0,
                transition: { duration: 0.5 },
              }}
              className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:bg-white/40 transition-all shadow-lg"
              aria-label={`Feeling ${reaction.name}`}
            >
              {reaction.emoji}
            </motion.button>
          ))}
        </div>
        <p className="text-white/90 text-center text-sm mt-3 font-medium">How are you feeling today?</p>
      </div>

      {/* Main Content */}
      <div className="p-4 -mt-4">
        {/* Mood History Quick View */}
        {moodHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <TrendingUp size={18} className="text-[#6C63FF] dark:text-[#8B5CF6] mr-2" />
                <h2 className="font-medium text-gray-800 dark:text-gray-200">Your Mood Trends</h2>
              </div>
              <Link
                href="/mood-tracker"
                className="text-xs font-medium text-[#6C63FF] dark:text-[#8B5CF6] flex items-center"
              >
                View All
                <ArrowRight size={12} className="ml-1" />
              </Link>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {moodHistory.slice(0, 7).map((entry, index) => (
                <div key={index} className="flex-shrink-0 text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-1 bg-gradient-to-br ${entry.mood.gradient} mx-auto`}
                  >
                    {entry.mood.emoji}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: "short" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
          <h2 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Daily Activities</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/diaries"
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] text-white p-4 rounded-xl flex flex-col"
            >
              <Calendar size={24} className="mb-2" />
              <h3 className="font-medium">Journal</h3>
              <p className="text-xs text-white/80 mt-1">Record your thoughts</p>
            </Link>

            <Link
              href="/mood-tracker"
              className="bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white p-4 rounded-xl flex flex-col"
            >
              <TrendingUp size={24} className="mb-2" />
              <h3 className="font-medium">Mood Tracker</h3>
              <p className="text-xs text-white/80 mt-1">View your progress</p>
            </Link>
          </div>
        </div>

        {/* Meet the Experts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium text-gray-800 dark:text-gray-200">Meet the Experts</h2>
            <Link href="/experts" className="text-xs font-medium text-[#6C63FF] dark:text-[#8B5CF6] flex items-center">
              View All
              <ArrowRight size={12} className="ml-1" />
            </Link>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-2 -mx-1 px-1">
            {experts.map((expert) => (
              <div
                key={expert.id}
                className="flex-shrink-0 w-36 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="relative">
                  <div className="aspect-square relative">
                    <Image
                      src={expert.imageUrl || "/placeholder.svg"}
                      alt={expert.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Online indicator */}
                  <div className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-600">
                    {expert.isOnline && (
                      <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse"></span>
                    )}
                  </div>

                  {/* Organization badge */}
                  {expert.organization && (
                    <div className="absolute top-1 left-1">
                      {expert.organization === "NAMPOL" && (
                        <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5">NAMPOL</Badge>
                      )}
                      {expert.organization === "MOHSS" && (
                        <Badge className="bg-green-600 text-white text-xs px-1.5 py-0.5">MOHSS</Badge>
                      )}
                      {expert.organization === "Lifeline/Childline" && (
                        <Badge className="bg-red-600 text-white text-xs px-1.5 py-0.5">Lifeline</Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{expert.name}</h3>
                    {expert.isVerified && (
                      <svg className="h-3.5 w-3.5 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{expert.title}</p>

                  <div className="mt-1.5 flex items-center">
                    {expert.isFree ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-1.5 py-0.5">
                        Free
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs px-1.5 py-0.5">
                        Paid
                      </Badge>
                    )}

                    {expert.organization && (
                      <div className="ml-1">
                        {expert.organization === "NAMPOL" && <Shield className="h-3 w-3 text-blue-600" />}
                        {expert.organization === "MOHSS" && <Shield className="h-3 w-3 text-green-600" />}
                        {expert.organization === "Lifeline/Childline" && (
                          <AlertCircle className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex justify-between">
                    <button
                      onClick={() => handleLikeExpert(expert.id)}
                      className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-[#6C63FF] dark:hover:text-[#8B5CF6]"
                      aria-label={likedExperts[expert.id] ? "Unlike" : "Like"}
                    >
                      <Heart size={14} className={likedExperts[expert.id] ? "text-red-500 fill-red-500" : ""} />
                      <span className="ml-1">{likedExperts[expert.id] ? expert.likes + 1 : expert.likes}</span>
                    </button>

                    <button
                      onClick={() => handleFollowExpert(expert.id)}
                      className={`flex items-center text-xs ${
                        followedExperts[expert.id]
                          ? "text-[#6C63FF] dark:text-[#8B5CF6]"
                          : "text-gray-500 dark:text-gray-400 hover:text-[#6C63FF] dark:hover:text-[#8B5CF6]"
                      }`}
                      aria-label={followedExperts[expert.id] ? "Unfollow" : "Follow"}
                    >
                      <UserPlus size={14} />
                      <span className="ml-1">{followedExperts[expert.id] ? "Following" : "Follow"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium text-gray-800 dark:text-gray-200">Upcoming Events</h2>
            <Link href="/events" className="text-xs font-medium text-[#6C63FF] dark:text-[#8B5CF6] flex items-center">
              View All
              <ArrowRight size={12} className="ml-1" />
            </Link>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-2 -mx-1 px-1">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex-shrink-0 w-36 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="relative">
                  <div className="aspect-square relative">
                    <Image src={event.imageUrl || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  </div>

                  {/* Virtual badge */}
                  {event.isVirtual && (
                    <div className="absolute top-1 left-1">
                      <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5">Virtual</Badge>
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{event.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <CalendarIcon size={12} className="mr-1" />
                    {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>

                  <div className="mt-1.5 flex items-center">
                    {event.isFree ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-1.5 py-0.5">
                        Free
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs px-1.5 py-0.5">
                        Paid
                      </Badge>
                    )}
                  </div>

                  <div className="mt-2 flex justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span>{event.attendees} attending</span>
                    </div>

                    <button
                      onClick={() => handleInterestedEvent(event.id)}
                      className={`flex items-center text-xs ${
                        interestedEvents[event.id]
                          ? "text-[#6C63FF] dark:text-[#8B5CF6]"
                          : "text-gray-500 dark:text-gray-400 hover:text-[#6C63FF] dark:hover:text-[#8B5CF6]"
                      }`}
                      aria-label={interestedEvents[event.id] ? "Not Interested" : "Interested"}
                    >
                      {interestedEvents[event.id] ? "Interested" : "Join"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Groups */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium text-gray-800 dark:text-gray-200">Join Support Groups</h2>
            <Link href="/groups" className="text-xs font-medium text-[#6C63FF] dark:text-[#8B5CF6] flex items-center">
              View All
              <ArrowRight size={12} className="ml-1" />
            </Link>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-2 -mx-1 px-1">
            {supportGroups.map((group) => (
              <div
                key={group.id}
                className="flex-shrink-0 w-36 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="relative">
                  <div className="aspect-square relative">
                    <Image src={group.imageUrl || "/placeholder.svg"} alt={group.name} fill className="object-cover" />
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-1 left-1">
                    <Badge
                      className={`text-white text-xs px-1.5 py-0.5 ${
                        group.category === "Youth"
                          ? "bg-blue-600"
                          : group.category === "Grief"
                            ? "bg-purple-600"
                            : group.category === "Anxiety"
                              ? "bg-yellow-600"
                              : group.category === "Depression"
                                ? "bg-indigo-600"
                                : group.category === "Trauma"
                                  ? "bg-red-600"
                                  : "bg-green-600"
                      }`}
                    >
                      {group.category}
                    </Badge>
                  </div>

                  {/* Private indicator */}
                  {group.isPrivate && (
                    <div className="absolute top-1 right-1">
                      <Badge className="bg-gray-700 text-white text-xs px-1.5 py-0.5">Private</Badge>
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{group.name}</h3>
                    {group.isVerified && (
                      <svg className="h-3.5 w-3.5 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    <Users size={12} className="inline mr-1" />
                    {group.members} members
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{group.meetingFrequency} meetings</p>

                  <div className="mt-2">
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      className={`w-full text-center text-xs py-1 rounded-md ${
                        joinedGroups[group.id]
                          ? "bg-[#6C63FF] text-white"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-[#6C63FF]/10 hover:text-[#6C63FF]"
                      }`}
                      aria-label={joinedGroups[group.id] ? "Leave Group" : "Join Group"}
                    >
                      {joinedGroups[group.id] ? "Joined" : "Join Group"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More content sections */}
        {/* ... */}
      </div>

      {/* Footer */}
      <div className="mt-8 mb-20 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          Proudly powered by{" "}
          <a href="https://www.popya.org" className="text-[#6C63FF] dark:text-[#8B5CF6]">
            Popya Assistance Foundation
          </a>
        </p>
      </div>

      {/* Mood Reason Modal */}
      {showMoodReasonPrompt && selectedMood && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-md">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center text-3xl mx-auto mb-2">
                {selectedMood.emoji}
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Why do you feel {selectedMood.name} today?
              </h3>
            </div>

            <textarea
              value={moodReason}
              onChange={(e) => setMoodReason(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6] min-h-[100px] resize-none mb-4"
              aria-label="Describe why you feel this way"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setShowMoodReasonPrompt(false)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleMoodReasonSubmit}
                className="flex-1 py-2 px-4 bg-[#6C63FF] hover:bg-[#5A52D5] text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
