"use client"

import { usePathname, useRouter } from "next/navigation"
import { UltraModernButton } from "@/components/ui/ultra-modern-button"
import { Home, Users, MessageCircle, User, Plus } from "lucide-react"

export function UltraModernNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      icon: <Home size={24} strokeWidth={2} />,
      label: "Home",
      path: "/",
    },
    {
      icon: <Users size={24} strokeWidth={2} />,
      label: "Groups",
      path: "/groups",
    },
    {
      icon: <Plus size={28} strokeWidth={2.5} />,
      isAction: true,
      path: "/create",
    },
    {
      icon: <MessageCircle size={24} strokeWidth={2} />,
      label: "Chat",
      path: "/share-feelings",
      badge: 3,
    },
    {
      icon: <User size={24} strokeWidth={2} />,
      label: "Profile",
      path: "/profile",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-1 bg-white/80 backdrop-blur-lg border-t border-gray-100 shadow-lg">
      {navItems.map((item) => (
        <UltraModernButton
          key={item.path}
          icon={item.icon}
          label={item.label}
          active={pathname === item.path}
          badge={item.badge || 0}
          isAction={item.isAction}
          onClick={() => router.push(item.path)}
        />
      ))}
    </div>
  )
}
