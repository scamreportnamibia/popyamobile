"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Users,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Library,
  Plus,
  MessageCircle,
  Calendar,
  FileText,
  Menu,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function BottomNavigation() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)

  // Only show notifications for regular users
  const [notifications, setNotifications] = useState(
    user?.role === "user"
      ? [
          {
            id: 1,
            title: "New group session",
            message: "Anxiety Support Group session starts in 30 minutes",
            time: "30m ago",
            read: false,
          },
          {
            id: 2,
            title: "Diary reminder",
            message: "Don't forget to log your mood today",
            time: "2h ago",
            read: false,
          },
          {
            id: 3,
            title: "New article",
            message: "Check out the new article on mindfulness techniques",
            time: "1d ago",
            read: true,
          },
        ]
      : [],
  )

  // Refs for event listeners and timeouts
  const menuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const quickActionsRef = useRef<HTMLDivElement>(null)
  const soundTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Quick actions
  const quickActions = [
    {
      icon: <MessageCircle size={20} className="text-white" />,
      label: "Chat",
      color: "from-green-400 to-green-600",
      href: "/chat",
    },
    {
      icon: <Calendar size={20} className="text-white" />,
      label: "Journal",
      color: "from-blue-400 to-blue-600",
      href: "/diaries",
    },
    {
      icon: <FileText size={20} className="text-white" />,
      label: "Resources",
      color: "from-purple-400 to-purple-600",
      href: "/resources",
    },
  ]

  // Update the toggleMenu function with better error handling
  const toggleMenu = () => {
    setShowMenu(!showMenu)
    if (showNotifications) setShowNotifications(false)
    if (showQuickActions) setShowQuickActions(false)

    // Play sound with proper error handling
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false"
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const audio = new Audio()
        audio.addEventListener("error", () => {
          console.log("Click sound not available")
        })
        audio.src = "/sounds/click.mp3"
        audio.play().catch((e) => {
          console.log("Could not play click sound", e)
        })
      } catch (e) {
        console.log("Sound playback not supported", e)
      }
    }
  }

  // Don't show notifications panel for admin or expert users
  const toggleNotifications = () => {
    if (user?.role !== "user") return

    setShowNotifications(!showNotifications)
    if (showMenu) setShowMenu(false)
    if (showQuickActions) setShowQuickActions(false)

    // Play sound with proper error handling
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false"
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const audio = new Audio()
        audio.addEventListener("error", () => {
          console.log("Notification sound not available")
        })
        audio.src = "/sounds/click.mp3" // Fallback to click sound
        audio.play().catch((e) => {
          console.log("Could not play notification sound", e)
        })
      } catch (e) {
        console.log("Sound playback not supported", e)
      }
    }
  }

  // Don't show quick actions for admin or expert users
  const toggleQuickActions = () => {
    if (user?.role !== "user") return

    setShowQuickActions(!showQuickActions)
    if (showMenu) setShowMenu(false)
    if (showNotifications) setShowNotifications(false)

    // Play sound with proper error handling
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false"
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const audio = new Audio()
        audio.addEventListener("error", () => {
          console.log("Click sound not available")
        })
        audio.src = "/sounds/click.mp3"
        audio.play().catch((e) => {
          console.log("Could not play click sound", e)
        })
      } catch (e) {
        console.log("Sound playback not supported", e)
      }
    }
  }

  // Update the markAllAsRead function with better error handling
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )

    // Play sound with proper error handling
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false"
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const audio = new Audio()
        audio.addEventListener("error", () => {
          console.log("Click sound not available")
        })
        audio.src = "/sounds/click.mp3"
        audio.play().catch((e) => {
          console.log("Could not play click sound", e)
        })
      } catch (e) {
        console.log("Sound playback not supported", e)
      }
    }
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setShowQuickActions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      if (soundTimeoutRef.current) {
        clearTimeout(soundTimeoutRef.current)
      }
    }
  }, [])

  // Close menus when route changes
  useEffect(() => {
    setShowMenu(false)
    setShowNotifications(false)
    setShowQuickActions(false)
  }, [pathname])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Don't show navigation on auth pages
  if (pathname.startsWith("/auth")) {
    return null
  }

  return (
    <>
      {/* Overlay for menu and notifications */}
      <AnimatePresence>
        {(showMenu || showNotifications || showQuickActions) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setShowMenu(false)
              setShowNotifications(false)
              setShowQuickActions(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Menu Panel */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-50 w-56 overflow-hidden"
          >
            <div className="p-2">
              <Link
                href="/profile"
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Profile</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Settings</span>
              </Link>
              <Link
                href="/help"
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HelpCircle size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Help & Support</span>
              </Link>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <Link
                href="/auth"
                className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
              >
                <LogOut size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Log Out</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            ref={notificationsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-50 w-72 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Notifications</h3>
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#6C63FF] dark:text-[#8B5CF6] hover:underline"
                aria-label="Mark all as read"
              >
                Mark all as read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-200 dark:border-gray-700 ${
                      !notification.read ? "bg-[#6C63FF]/5 dark:bg-[#6C63FF]/10" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4
                        className={`text-sm ${
                          !notification.read
                            ? "font-medium text-gray-800 dark:text-gray-200"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">No notifications yet</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions Panel */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            ref={quickActionsRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 flex space-x-4">
              {quickActions.map((action, index) => (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200`}
                    >
                      {action.icon}
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 mt-1">{action.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30">
        <div className="flex items-center justify-around h-16">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-16 h-full ${
              pathname === "/" ? "text-[#6C63FF] dark:text-[#8B5CF6]" : "text-gray-500 dark:text-gray-400"
            }`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            href="/resources"
            className={`flex flex-col items-center justify-center w-16 h-full ${
              pathname === "/resources" ? "text-[#6C63FF] dark:text-[#8B5CF6]" : "text-gray-500 dark:text-gray-400"
            }`}
            aria-current={pathname === "/resources" ? "page" : undefined}
          >
            <Library size={20} />
            <span className="text-xs mt-1">Resources</span>
          </Link>

          {/* Quick actions button - Only for regular users */}
          {user?.role === "user" && (
            <button
              onClick={toggleQuickActions}
              className="flex flex-col items-center justify-center w-16 h-full relative"
              aria-label="Quick actions"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center shadow-lg"
              >
                <Plus size={24} className="text-white" />
              </motion.div>
            </button>
          )}

          <Link
            href="/experts"
            className={`flex flex-col items-center justify-center w-16 h-full ${
              pathname === "/experts" ? "text-[#6C63FF] dark:text-[#8B5CF6]" : "text-gray-500 dark:text-gray-400"
            }`}
            aria-current={pathname === "/experts" ? "page" : undefined}
          >
            <Users size={20} />
            <span className="text-xs mt-1">Experts</span>
          </Link>

          <button
            onClick={toggleMenu}
            className="flex flex-col items-center justify-center w-16 h-full"
            aria-label="Menu"
          >
            <Menu size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">Menu</span>
          </button>
        </div>
      </div>
    </>
  )
}
