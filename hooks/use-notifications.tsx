"use client"

import { useEffect, useState } from "react"
import { notificationService, Notification } from "@/services/notification-service"

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [permission, setPermission] = useState<NotificationPermission | null>(null)

  useEffect(() => {
    // Handle incoming notifications
    const handleNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
    }

    // Add notification handler
    notificationService.addNotificationHandler(handleNotification)

    // Check permission status
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission)
    }

    // Cleanup
    return () => {
      notificationService.removeNotificationHandler(handleNotification)
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    const granted = await notificationService.requestPermission()
    if (granted && typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission)
    }
    return granted
  }

  const scheduleDiaryReminder = (time?: Date) => {
    notificationService.scheduleDiaryReminder(time)
  }

  const scheduleInactivityReminder = (daysInactive: number) => {
    notificationService.scheduleInactivityReminder(daysInactive)
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    unreadCount,
    permission,
    requestPermission,
    scheduleDiaryReminder,
    scheduleInactivityReminder,
    markAsRead,
    deleteNotification,
  }
}
