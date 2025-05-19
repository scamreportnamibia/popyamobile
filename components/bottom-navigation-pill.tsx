"use client"
import { usePathname, useRouter } from "next/navigation"
import { MenuButtonPill } from "@/components/ui/menu-button-pill"
import { Home, Users, Calendar, MessageCircle, User } from "lucide-react"

export function BottomNavigationPill() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      icon: <Home size={20} />,
      label: "Home",
      path: "/",
      badge: null,
    },
    {
      icon: <Users size={20} />,
      label: "Groups",
      path: "/groups",
      badge: null,
    },
    {
      icon: <Calendar size={20} />,
      label: "Dailies",
      path: "/dailies",
      badge: 3,
    },
    {
      icon: <MessageCircle size={20} />,
      label: "Feelings",
      path: "/share-feelings",
      badge: null,
    },
    {
      icon: <User size={20} />,
      label: "Profile",
      path: "/profile",
      badge: null,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around p-2 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-lg">
      {navItems.map((item) => (
        <MenuButtonPill
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
