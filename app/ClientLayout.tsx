"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  BookOpen,
  User,
  MessageSquare,
  Plus,
  FileText,
  Shield,
  AlertTriangle,
  Users,
  Stethoscope,
} from "lucide-react"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { DailyReminder } from "@/components/daily-reminder"
import { useAuth } from "@/contexts/auth-context"
import { BottomNavigation } from "@/components/bottom-navigation"
// Import the service worker registration function
import { registerServiceWorker } from "@/utils/register-service-worker"

interface QuickActionItem {
  icon: React.ReactNode
  label: string
  href: string
  position: { x: number; y: number }
}

interface NavigationItem {
  icon: React.ReactNode
  label: string
  href: string
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const quickActionsRef = useRef<HTMLDivElement>(null)
  const [isOnline, setIsOnline] = useState(true)

  // Check if we're on an auth page
  const isAuthPage = pathname?.startsWith("/auth")

  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith("/admin")

  // Check if we're on an expert page
  const isExpertPage = pathname?.startsWith("/expert-dashboard")

  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Set initial status
    setIsOnline(navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Skip auth check for auth pages
    if (pathname.startsWith("/auth")) {
      return
    }

    // If not loading and no user, redirect to auth
    if (!isLoading && !user && isClient) {
      router.push("/auth")
    }
  }, [pathname, router, user, isLoading, isClient])

  // Don't show bottom navigation on auth, admin, or expert pages
  const showBottomNav = !isAuthPage && !isAdminPage && !isExpertPage && user

  // Hide bottom navigation on admin and expert dashboard pages
  const hideNavigation = pathname?.includes("/admin") || pathname?.includes("/expert-dashboard")

  // Define quick action items with wider arch positions
  const quickActionItems: QuickActionItem[] = [
    {
      icon: <FileText size={20} />,
      label: "Diary",
      href: "/diaries",
      position: { x: -120, y: -40 }, // Spread further left
    },
    {
      icon: <Shield size={20} />,
      label: "Report",
      href: "/report-abuse",
      position: { x: -60, y: -100 }, // Spread further left and up
    },
    {
      icon: <AlertTriangle size={20} />,
      label: "Assessment",
      href: "/depression-assessment",
      position: { x: 0, y: -120 }, // Spread further up
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Share Feelings",
      href: "/share-feelings",
      position: { x: 60, y: -100 }, // Spread further right and up
    },
  ]

  // Define navigation items with updated Resources icon instead of Dailies
  const navigationItems: NavigationItem[] = [
    { icon: <Home size={24} />, label: "Home", href: "/" },
    { icon: <BookOpen size={24} />, label: "Resources", href: "/resources" },
    { icon: <Users size={24} />, label: "Groups", href: "/groups" },
    { icon: <Stethoscope size={24} />, label: "Experts", href: "/experts" },
    { icon: <User size={24} />, label: "Profile", href: "/profile" },
  ]

  // Close quick actions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showQuickActions && quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setShowQuickActions(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [showQuickActions])

  // Add useEffect to register service worker
  useEffect(() => {
    // Register service worker for PWA support
    const registerSW = async () => {
      try {
        await registerServiceWorker()
      } catch (error) {
        // Silently fail - service worker is a progressive enhancement
        console.warn("Service worker registration failed, but app will continue to work:", error)
      }
    }

    registerSW()
  }, [])

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Offline indicator */}
          {!isOnline && (
            <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-1 text-sm z-50">
              You are currently offline. Some features may be limited.
            </div>
          )}

          {/* Main Content */}
          <main className={`pb-16 ${!isOnline ? "pt-6" : ""}`}>{children}</main>

          {/* Daily Reminder Component - Only for regular users */}
          {user && user.role === "user" && <DailyReminder />}

          {/* Bottom Navigation - MODERNIZED */}
          {showBottomNav && (
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-40 shadow-lg">
              <div className="flex justify-around items-center h-16 px-2">
                {navigationItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className="group relative flex flex-col items-center justify-center"
                      aria-label={item.label}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {/* Active indicator pill */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/10 to-[#8B5CF6]/10 rounded-xl"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}

                      {/* Icon container */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] shadow-md shadow-[#6C63FF]/20"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <div className={`${isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
                          {item.icon}
                        </div>
                      </div>

                      {/* Label */}
                      <span
                        className={`text-xs mt-1 transition-colors ${
                          isActive
                            ? "text-[#6C63FF] dark:text-[#8B5CF6] font-medium"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick Action Button - WIDER ARCH FORMATION */}
          {!hideNavigation && user && user.role === "user" && (
            <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50">
              <div className="relative" ref={quickActionsRef}>
                {/* Main action button with modern design */}
                <motion.button
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white flex items-center justify-center shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowQuickActions(!showQuickActions)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Quick actions"
                  aria-expanded={showQuickActions}
                >
                  <Plus size={24} />
                </motion.button>

                {/* Quick action items in wider arch formation */}
                <AnimatePresence>
                  {showQuickActions && (
                    <div className="absolute top-0 left-0 w-0 h-0">
                      {quickActionItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            x: item.position.x,
                            y: item.position.y,
                            transition: {
                              delay: index * 0.05,
                              duration: 0.4,
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            },
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.8,
                            x: 0,
                            y: 0,
                            transition: { duration: 0.2 },
                          }}
                          className="absolute"
                          style={{
                            left: "7px", // Center point adjustment
                            top: "7px", // Center point adjustment
                          }}
                        >
                          <Link
                            href={item.href}
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={item.label}
                          >
                            {/* Cute, proportional button */}
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-[#6C63FF] dark:text-[#8B5CF6] border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md">
                              {item.icon}
                            </div>

                            {/* Text label positioned below */}
                            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] font-medium bg-white dark:bg-gray-800 text-[#6C63FF] dark:text-[#8B5CF6] px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Bottom Navigation Component */}
          {!hideNavigation && <BottomNavigation />}
        </div>
      </ThemeProvider>
    </AuthProvider>
  )
}
