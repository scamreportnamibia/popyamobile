export async function registerServiceWorker() {
  // Only register service worker in production and in browser environment
  if (typeof window === "undefined" || typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    console.log("Service Worker not supported in this environment")
    return
  }

  // Skip service worker registration in development or non-HTTPS environments
  // except for localhost which is allowed for testing
  if (
    process.env.NODE_ENV !== "production" &&
    window.location.hostname !== "localhost" &&
    !window.location.protocol.includes("https")
  ) {
    console.log("Skipping Service Worker registration in development or non-HTTPS environment")
    return
  }

  try {
    // Check if service worker is already registered
    const registrations = await navigator.serviceWorker.getRegistrations()
    if (registrations.length > 0) {
      console.log("Service Worker already registered")
      return
    }

    // Register the service worker
    const registration = await navigator.serviceWorker.register("/service-worker.js", {
      scope: "/",
    })

    console.log("Service Worker registered successfully:", registration.scope)

    return registration
  } catch (error) {
    console.warn("Service Worker registration failed:", error)
    // Don't throw the error - allow the app to continue working without service worker
    return null
  }
}
