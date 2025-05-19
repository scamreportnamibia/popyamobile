"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { pushNotificationService } from "@/services/push-notification-service"

export function DailyReminder() {
  const router = useRouter()
  const [showReminder, setShowReminder] = useState(false)
  const [reminderType, setReminderType] = useState<"journal" | "mood" | "inactive">("journal")
  const [lastActive, setLastActive] = useState<Date | null>(null)

  // Check if user has been inactive
  useEffect(() => {
    // Simulate checking last activity time from localStorage or API
    const checkLastActivity = () => {
      const lastActivityStr = localStorage.getItem("lastActivity")
      if (lastActivityStr) {
        const lastActivity = new Date(lastActivityStr)
        setLastActive(lastActivity)

        // If last activity was more than 2 days ago, show inactive reminder
        const twoDaysAgo = new Date()
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

        if (lastActivity < twoDaysAgo) {
          setReminderType("inactive")
          setShowReminder(true)
        }
      }
    }

    // Check for journal entry today
    const checkJournalEntry = () => {
      const lastJournalStr = localStorage.getItem("lastJournalEntry")
      const currentDate = new Date().toDateString()

      if (!lastJournalStr || new Date(lastJournalStr).toDateString() !== currentDate) {
        // No journal entry today, show reminder
        setReminderType("journal")
        setShowReminder(true)
      }
    }

    // Check for mood entry today
    const checkMoodEntry = () => {
      const lastMoodStr = localStorage.getItem("lastMoodEntry")
      const currentDate = new Date().toDateString()

      if (!lastMoodStr || new Date(lastMoodStr).toDateString() !== currentDate) {
        // No mood entry today, show reminder
        setReminderType("mood")
        setShowReminder(true)
      }
    }

    // Determine which reminder to show based on priority
    const determineReminder = () => {
      checkLastActivity()

      if (!showReminder) {
        checkJournalEntry()
      }

      if (!showReminder) {
        checkMoodEntry()
      }
    }

    // Check after a delay to not interrupt initial app loading
    const timer = setTimeout(() => {
      determineReminder()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Update last activity time
  useEffect(() => {
    const updateLastActivity = () => {
      const now = new Date()
      localStorage.setItem("lastActivity", now.toISOString())
      setLastActive(now)
    }

    // Update on page load
    updateLastActivity()

    // Set up event listeners for user activity
    const events = ["mousedown", "keydown", "touchstart", "scroll"]

    const handleActivity = () => {
      updateLastActivity()
    }

    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [])

  // Handle reminder actions
  const handleReminderAction = () => {
    setShowReminder(false)

    if (reminderType === "journal") {
      router.push("/diaries")
      localStorage.setItem("lastJournalEntry", new Date().toISOString())
    } else if (reminderType === "mood") {
      router.push("/share-feelings")
      localStorage.setItem("lastMoodEntry", new Date().toISOString())
    } else {
      // Just acknowledge the welcome back
    }
  }

  // Request notification permission
  const requestNotificationPermission = async () => {
    try {
      await pushNotificationService.subscribe()
      setShowReminder(false)
    } catch (error) {
      console.error("Failed to subscribe to notifications:", error)
    }
  }

  // Get reminder content based on type
  const getReminderContent = () => {
    switch (reminderType) {
      case "journal":
        return {
          title: "Daily Journal Reminder",
          message: "How are you feeling today? Take a moment to write in your journal.",
          actionText: "Write Now",
        }
      case "mood":
        return {
          title: "Mood Check-in",
          message: "We haven't heard from you today. How are you feeling?",
          actionText: "Share Mood",
        }
      case "inactive":
        return {
          title: "We Miss You!",
          message: "It's been a while since your last visit. How have you been?",
          actionText: "I'm Back",
        }
    }
  }

  const reminderContent = getReminderContent()

  return (
    <AnimatePresence>
      {showReminder && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-4 right-4 z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mx-auto max-w-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{reminderContent.title}</h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowReminder(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{reminderContent.message}</p>
            <div className="flex gap-2">
              <Button variant="default" className="flex-1" onClick={handleReminderAction}>
                {reminderContent.actionText}
              </Button>
              <Button variant="outline" className="flex items-center gap-1" onClick={requestNotificationPermission}>
                <Bell className="h-4 w-4" />
                <span>Remind Me</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
