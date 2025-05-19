class PushNotificationService {
  private vapidKey = ""
  private isSubscribed = false
  private registration: ServiceWorkerRegistration | null = null
  private keyFetched = false

  constructor() {
    this.initialize()
  }

  private async initialize() {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      console.log("Push notifications not supported")
      return
    }

    try {
      this.registration = await navigator.serviceWorker.ready
      const subscription = await this.registration.pushManager.getSubscription()
      this.isSubscribed = !!subscription

      if (this.isSubscribed) {
        console.log("User is already subscribed to push notifications")
      }
    } catch (error) {
      console.error("Failed to initialize push notifications:", error)
    }
  }

  private async getVapidKey(): Promise<string> {
    if (this.vapidKey && this.keyFetched) {
      return this.vapidKey
    }

    try {
      const response = await fetch("/api/push/vapid-key")
      const data = await response.json()

      if (!data.success || !data.publicKey) {
        throw new Error("Failed to fetch VAPID key")
      }

      this.vapidKey = data.publicKey
      this.keyFetched = true
      return this.vapidKey
    } catch (error) {
      console.error("Error fetching VAPID key:", error)
      return ""
    }
  }

  public async subscribe() {
    if (!this.registration) {
      console.warn("Service worker not ready")
      return false
    }

    try {
      const vapidKey = await this.getVapidKey()
      if (!vapidKey) {
        throw new Error("VAPID key not available")
      }

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidKey),
      })

      // Send the subscription to your server
      await this.sendSubscriptionToServer(subscription)

      this.isSubscribed = true
      return true
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error)
      return false
    }
  }

  public async unsubscribe() {
    if (!this.registration) return false

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        // Notify server about unsubscription
        await this.removeSubscriptionFromServer(subscription)
      }

      this.isSubscribed = false
      return true
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error)
      return false
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription) {
    // Send the subscription to your backend
    try {
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      })

      if (!response.ok) {
        throw new Error("Failed to send subscription to server")
      }

      return true
    } catch (error) {
      console.error("Error sending subscription to server:", error)
      return false
    }
  }

  private async removeSubscriptionFromServer(subscription: PushSubscription) {
    // Remove the subscription from your backend
    try {
      const response = await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove subscription from server")
      }

      return true
    } catch (error) {
      console.error("Error removing subscription from server:", error)
      return false
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  }

  public getSubscriptionStatus(): boolean {
    return this.isSubscribed
  }
}

export const pushNotificationService = new PushNotificationService()
