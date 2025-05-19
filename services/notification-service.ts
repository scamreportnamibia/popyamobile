import { initializeApp } from "firebase/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"
import { websocketService } from "./websocket-service"

// Firebase configuration - would come from environment variables in production
const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-auth-domain.firebaseapp.com",
  projectId: "mock-project-id",
  storageBucket: "mock-storage-bucket.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export type Notification = {
  id: string
  title: string
  body: string
  timestamp: number
  data?: Record<string, string>
  read: boolean
  type: "message" | "reminder" | "diary" | "inactivity" | "system"
}

export class NotificationService {
  private static instance: NotificationService
  private fcmToken: string | null = null
  private handlers: ((notification: Notification) => void)[] = []
  private reminderSchedules: Map<string, NodeJS.Timeout> = new Map()

  private constructor() {
    this.setupMessageListener()
    this.setupWebSocketListener()
    this.setupDefaultReminders()

    // Initialize websocket service
    if (typeof window !== "undefined") {
      websocketService.initialize()
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Request permission and get FCM token
  public async requestPermission(): Promise<boolean> {
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        const permission = await Notification.requestPermission()

        if (permission === "granted") {
          await this.getFCMToken()
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Permission request failed:", error)
      return false
    }
  }

  // Get FCM token for this device
  private async getFCMToken(): Promise<string | null> {
    try {
      const token = await getToken(messaging, {
        vapidKey: "YOUR_VAPID_KEY",
      })

      this.fcmToken = token

      // In a real app, you would send this token to your server to associate it with the user
      console.log("FCM Token:", token)

      return token
    } catch (error) {
      console.error("Error getting FCM token:", error)
      return null
    }
  }

  // Set up listener for incoming messages from Firebase
  private setupMessageListener(): void {
    if (typeof window !== "undefined") {
      onMessage(messaging, (payload) => {
        console.log("Message received from Firebase:", payload)

        // Convert the FCM message to our app's notification format
        const notification: Notification = {
          id: payload.messageId || `notification-${Date.now()}`,
          title: payload.notification?.title || "Popya Notification",
          body: payload.notification?.body || "",
          timestamp: Date.now(),
          data: payload.data,
          read: false,
          type: (payload.data?.type as any) || "system",
        }

        // Notify all handlers
        this.notifyHandlers(notification)
      })
    }
  }

  // Set up listener for incoming messages from WebSocket
  private setupWebSocketListener(): void {
    websocketService.addMessageHandler("notification", (message) => {
      console.log("Notification received from WebSocket:", message)

      const notification: Notification = {
        id: `ws-${Date.now()}`,
        title: message.data.title || "Popya Notification",
        body: message.data.body || "",
        timestamp: message.timestamp,
        data: message.data,
        read: false,
        type: message.data.type || "system",
      }

      this.notifyHandlers(notification)
    })
  }

  // Set up default reminders
  private setupDefaultReminders(): void {
    // Daily journal reminder at 8 PM
    this.scheduleDailyReminder(
      "journal-reminder",
      "Daily Journal Reminder",
      "Take a moment to record your thoughts and feelings in your journal.",
      { hour: 20, minute: 0 },
      "diary",
    )

    // Daily mood check at 10 AM
    this.scheduleDailyReminder(
      "mood-check",
      "How are you feeling?",
      "Take a moment to check in with yourself and record your mood.",
      { hour: 10, minute: 0 },
      "reminder",
    )

    // Weekly check-in on Sundays at 6 PM
    this.scheduleWeeklyReminder(
      "weekly-check",
      "Weekly Check-in",
      "How was your week? Take a moment to reflect on your mental health journey.",
      { day: 0, hour: 18, minute: 0 },
      "system",
    )
  }

  // Schedule a daily reminder
  public scheduleDailyReminder(
    id: string,
    title: string,
    body: string,
    time: { hour: number; minute: number },
    type: Notification["type"] = "reminder",
  ): void {
    // Clear any existing reminder with this ID
    if (this.reminderSchedules.has(id)) {
      clearTimeout(this.reminderSchedules.get(id)!)
    }

    const now = new Date()
    const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time.hour, time.minute, 0)

    // If the time has already passed today, schedule for tomorrow
    if (reminderTime.getTime() <= now.getTime()) {
      reminderTime.setDate(reminderTime.getDate() + 1)
    }

    const delay = reminderTime.getTime() - now.getTime()

    const timeout = setTimeout(() => {
      this.showLocalNotification(title, body, type)
      // Reschedule for the next day
      this.scheduleDailyReminder(id, title, body, time, type)
    }, delay)

    this.reminderSchedules.set(id, timeout)
  }

  // Schedule a weekly reminder
  public scheduleWeeklyReminder(
    id: string,
    title: string,
    body: string,
    time: { day: number; hour: number; minute: number },
    type: Notification["type"] = "reminder",
  ): void {
    // Clear any existing reminder with this ID
    if (this.reminderSchedules.has(id)) {
      clearTimeout(this.reminderSchedules.get(id)!)
    }

    const now = new Date()
    const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time.hour, time.minute, 0)

    // Set to the correct day of the week (0 = Sunday, 6 = Saturday)
    const currentDay = now.getDay()
    const daysToAdd = (time.day - currentDay + 7) % 7
    reminderTime.setDate(reminderTime.getDate() + daysToAdd)

    // If the time has already passed today and it's the target day, schedule for next week
    if (daysToAdd === 0 && reminderTime.getTime() <= now.getTime()) {
      reminderTime.setDate(reminderTime.getDate() + 7)
    }

    const delay = reminderTime.getTime() - now.getTime()

    const timeout = setTimeout(() => {
      this.showLocalNotification(title, body, type)
      // Reschedule for the next week
      this.scheduleWeeklyReminder(id, title, body, time, type)
    }, delay)

    this.reminderSchedules.set(id, timeout)
  }

  // Add a handler for incoming notifications
  public addNotificationHandler(handler: (notification: Notification) => void): void {
    this.handlers.push(handler)
  }

  // Remove a notification handler
  public removeNotificationHandler(handler: (notification: Notification) => void): void {
    this.handlers = this.handlers.filter((h) => h !== handler)
  }

  // Notify all handlers about a new notification
  private notifyHandlers(notification: Notification): void {
    // Play notification sound
    this.playNotificationSound(notification.type)

    this.handlers.forEach((handler) => {
      try {
        handler(notification)
      } catch (error) {
        console.error("Error in notification handler:", error)
      }
    })
  }

  // Show a local notification
  public showLocalNotification(
    title: string,
    body: string,
    type: Notification["type"] = "system",
    data?: Record<string, string>,
  ): void {
    const notification: Notification = {
      id: `local-${Date.now()}`,
      title,
      body,
      timestamp: Date.now(),
      data,
      read: false,
      type,
    }

    // Show browser notification if permission is granted
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body })
    }

    // Notify handlers
    this.notifyHandlers(notification)
  }

  // Schedule local notifications (for reminders)
  public async scheduleLocalNotification(
    title: string,
    body: string,
    scheduledTime: Date,
    type: Notification["type"] = "reminder",
    data?: Record<string, string>,
  ): Promise<string> {
    if (typeof window !== "undefined" && "Notification" in window) {
      // Generate a unique ID for this notification
      const id = `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // Calculate delay in milliseconds
      const delay = scheduledTime.getTime() - Date.now()

      // Schedule the notification
      setTimeout(
        () => {
          const notification: Notification = {
            id,
            title,
            body,
            timestamp: Date.now(),
            data,
            read: false,
            type,
          }

          // Create browser notification
          new Notification(title, { body })

          // Notify handlers
          this.notifyHandlers(notification)
        },
        Math.max(0, delay),
      )

      return id
    }

    throw new Error("Notifications not supported")
  }

  // Schedule diary reminder
  public scheduleDiaryReminder(scheduledTime?: Date): void {
    const time = scheduledTime || this.getDefaultReminderTime()

    this.scheduleLocalNotification(
      "Daily Reflection",
      "Take a moment to record your thoughts and feelings in your diary.",
      time,
      "diary",
    )
  }

  // Schedule inactivity reminder
  public scheduleInactivityReminder(daysInactive: number): void {
    // Schedule for tomorrow morning
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)

    this.scheduleLocalNotification(
      "We miss you!",
      `It's been ${daysInactive} days since you last used Popya. Take a moment for your mental health today.`,
      tomorrow,
      "inactivity",
    )
  }

  // Get default reminder time (8:00 PM today)
  private getDefaultReminderTime(): Date {
    const time = new Date()
    time.setHours(20, 0, 0, 0)

    // If it's already past 8 PM, schedule for tomorrow
    if (time.getTime() < Date.now()) {
      time.setDate(time.getDate() + 1)
    }

    return time
  }

  // Add this method to play notification sounds
  private playNotificationSound(type = "default"): void {
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false"
    if (!soundEnabled || typeof window === "undefined") return

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

  // Check if the user has been inactive
  public checkUserInactivity(): void {
    const lastActive = localStorage.getItem("lastActiveTimestamp")
    if (!lastActive) {
      localStorage.setItem("lastActiveTimestamp", Date.now().toString())
      return
    }

    const lastActiveDate = new Date(Number.parseInt(lastActive))
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays >= 3) {
      // User has been inactive for 3 or more days
      this.scheduleInactivityReminder(diffDays)
      // Update last active timestamp
      localStorage.setItem("lastActiveTimestamp", Date.now().toString())
    }
  }

  // Update last active timestamp
  public updateLastActive(): void {
    localStorage.setItem("lastActiveTimestamp", Date.now().toString())
  }

  // Add a method to check for app updates
  public checkForAppUpdates(): void {
    // This would check for app updates and show a notification if available
    this.showLocalNotification(
      "App Update Available",
      "A new version of Popya is available. Update now for the latest features.",
      "system",
    )
  }
}

export const notificationService = NotificationService.getInstance()
