"use client"

import { useEffect, useState } from "react"
import { Bell, AlertTriangle } from "lucide-react"
import { websocketService } from "@/services/websocket-service"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

type Notification = {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  timestamp: number
  read: boolean
}

export function AdminRealTimeUpdates() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    // Only initialize for admin users
    if (user?.role !== "super_admin" && user?.role !== "admin") {
      return
    }

    // Initialize WebSocket connection with user info
    websocketService.initialize(user?.id, user?.role)

    // Add message handler for admin alerts
    websocketService.addMessageHandler("admin_alert", (message) => {
      console.log("Received admin alert:", message)

      // Create notification from message
      const notification: Notification = {
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: message.data.title || "New Alert",
        message: message.data.message || "You have a new notification",
        type: message.data.type || "info",
        timestamp: message.timestamp,
        read: false,
      }

      // Add to notifications
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)

      // Show toast
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === "error" ? "destructive" : "default",
      })
    })

    // Add message handler for reports
    websocketService.addMessageHandler("report_submitted", (message) => {
      console.log("Received new report:", message)

      // Create notification from message
      const notification: Notification = {
        id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: "New Report Submitted",
        message: `A new ${message.data.category || "issue"} report has been submitted`,
        type: message.data.riskLevel === "high" ? "error" : "warning",
        timestamp: message.timestamp,
        read: false,
      }

      // Add to notifications
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)

      // Show toast for high-risk reports
      if (message.data.riskLevel === "high") {
        toast({
          title: "High Risk Report",
          description: notification.message,
          variant: "destructive",
        })
      }
    })

    // Cleanup
    return () => {
      websocketService.removeMessageHandler("admin_alert", () => {})
      websocketService.removeMessageHandler("report_submitted", () => {})
    }
  }, [user, toast])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev)
  }

  return (
    <div className="relative">
      <button className="relative p-2 rounded-full hover:bg-gray-100" onClick={toggleNotifications}>
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button className="text-xs text-[#6C63FF] hover:underline" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <AlertTriangle size={24} className="mx-auto mb-2 text-gray-400" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        notification.type === "error"
                          ? "bg-red-100 text-red-800"
                          : notification.type === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : notification.type === "success"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
