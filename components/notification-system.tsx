"use client"

import { useState, useEffect } from "react"
import { Bell, X, MessageSquare, Heart, Calendar, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { notificationService, type Notification } from "@/services/notification-service"
import { useAuth } from "@/contexts/auth-context"

export const NotificationSystem = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [newNotification, setNewNotification] = useState<Notification | null>(null)
  const [showToast, setShowToast] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Don't show notifications for admin or expert users
  if (user?.role === "super_admin" || user?.role === "expert") {
    return null
  }

  useEffect(() => {
    // Handle incoming notifications
    const handleNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
      setNewNotification(notification)
      setShowToast(true)

      // Play notification sound based on type with proper error handling
      const soundEnabled = localStorage.getItem("soundEnabled") !== "false"
      if (soundEnabled && typeof window !== "undefined") {
        try {
          // Default to a simple click sound that's likely to exist
          const soundFile = "click.mp3"

          const audio = new Audio()
          audio.addEventListener("error", () => {
            console.log(`Notification sound not available: ${soundFile}`)
          })
          audio.src = `/sounds/${soundFile}`
          audio.play().catch((e) => {
            console.log(`Could not play notification sound: ${soundFile}`, e)
          })
        } catch (e) {
          console.log("Sound playback not supported", e)
        }
      }

      // Hide toast after 5 seconds
      setTimeout(() => {
        setShowToast(false)
        setNewNotification(null)
      }, 5000)
    }

    // Request notification permission on initial load
    const requestPermission = async () => {
      const granted = await notificationService.requestPermission()
      if (granted) {
        console.log("Notification permission granted")

        // Schedule daily reminder
        notificationService.scheduleDiaryReminder()
      }
    }

    requestPermission()

    // Example: Schedule inactivity reminder for demo purposes
    setTimeout(() => {
      notificationService.scheduleInactivityReminder(3)
    }, 15000)

    // Cleanup
    return () => {
      notificationService.removeNotificationHandler(handleNotification)
    }
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare size={16} className="text-[#6C63FF]" />
      case "diary":
        return <BookOpen size={16} className="text-[#43C6AC]" />
      case "inactivity":
        return <Heart size={16} className="text-[#FF6584]" />
      case "reminder":
        return <Calendar size={16} className="text-[#FFC75F]" />
      default:
        return <Bell size={16} className="text-gray-500" />
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diffMs = now - timestamp
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          <Bell size={20} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowNotifications(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className="p-3 border-b flex justify-between items-center bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white">
                <h3 className="font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Bell size={24} className="mx-auto mb-2 text-gray-400" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? "bg-[#6C63FF]/5" : ""}`}
                    >
                      <div className="flex">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="ml-2 flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                            <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{notification.body}</p>
                          <div className="flex justify-between items-center mt-2">
                            {notification.data?.link ? (
                              <Link
                                href={notification.data.link}
                                className="text-xs text-[#6C63FF] font-medium"
                                onClick={() => {
                                  markAsRead(notification.id)
                                  setShowNotifications(false)
                                }}
                              >
                                View
                              </Link>
                            ) : (
                              <div></div>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && newNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 left-4 bg-white rounded-lg shadow-lg z-50 overflow-hidden max-w-md mx-auto"
          >
            <div className="p-3 flex">
              <div className="w-10 h-10 rounded-full bg-[#6C63FF]/10 flex items-center justify-center flex-shrink-0">
                {getNotificationIcon(newNotification.type)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{newNotification.title}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{newNotification.body}</p>
                  </div>
                  <button onClick={() => setShowToast(false)} className="p-1 rounded-full hover:bg-gray-100">
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-1 bg-[#6C63FF] animate-[shrink_5s_linear] origin-left"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
