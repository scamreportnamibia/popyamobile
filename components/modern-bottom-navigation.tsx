"use client"

import { usePathname, useRouter } from "next/navigation"
import { ModernMenuButton } from "@/components/ui/modern-menu-button"
import { Home, Users, Clock, MessageCircle, User } from "lucide-react"

export function ModernBottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      icon: <Home size={22} strokeWidth={2} />,
      label: "Home",
      path: "/",
      badge: 0,
    },
    {
      icon: <Users size={22} strokeWidth={2} />,
      label: "Groups",
      path: "/groups",
      badge: 0,
    },
    {
      icon: <Clock size={22} strokeWidth={2} />,
      label: "Dailies",
      path: "/dailies",
      badge: 3,
    },
    {
      icon: <MessageCircle size={22} strokeWidth={2} />,
      label: "Feelings",
      path: "/share-feelings",
      badge: 2,
    },
    {
      icon: <User size={22} strokeWidth={2} />,
      label: "Profile",
      path: "/profile",
      badge: 0,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around p-2 bg-white/80 backdrop-blur-lg border-t border-gray-100 shadow-lg">
      {navItems.map((item) => (
        <ModernMenuButton
          key={item.path}
          icon={item.icon}
          label={item.label}
          active={pathname === item.path}
          badge={item.badge}
          onClick={() => router.push(item.path)}
        />
      ))}
    </div>
  )
}
