"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bell, X } from "lucide-react"
import { notificationService } from "@/services/notification-service"

export const PermissionHandler = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [permissionState, setPermissionState] = useState<NotificationPermission | null>(null)

  useEffect(() => {
    // Check if notification permissions already granted
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = window.Notification.permission
      setPermissionState(permission)

      if (permission !== "granted" && permission !== "denied") {
        // Only show the prompt if permission status is default (not decided yet)
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000)
      }
    }
  }, [])

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission()
    setPermissionState(granted ? "granted" : "denied")
    setShowPrompt(false)
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg z-40 p-4 max-w-md mx-auto"
      >
        <div className="flex">
          <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-full flex items-center justify-center">
            <Bell size={24} className="text-[#6C63FF]" />
          </div>
          <div className="ml-3 flex-1">
            <div className="flex justify-between">
              <h3 className="font-medium text-gray-900">Enable Notifications</h3>
              <button onClick={dismissPrompt} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Stay updated with diary reminders, expert responses, and important mental health updates.
            </p>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleRequestPermission}
                className="flex-1 bg-[#6C63FF] text-white py-2 px-4 rounded-lg text-sm font-medium"
              >
                Enable
              </button>
              <button
                onClick={dismissPrompt}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
