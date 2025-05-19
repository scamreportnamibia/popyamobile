import type React from "react"
import { cn } from "@/lib/utils"

interface MenuButtonPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: number | string
}

export function MenuButtonPill({ icon, label, active = false, badge, className, ...props }: MenuButtonPillProps) {
  return (
    <button
      className={cn(
        "relative group flex items-center justify-center w-full max-w-[80px] transition-all duration-300",
        active ? "scale-105" : "scale-100",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center py-2 px-3 rounded-full transition-all duration-300 w-full",
          active ? "bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] shadow-md" : "bg-transparent hover:bg-gray-100",
        )}
      >
        {/* Icon with dynamic color */}
        <div
          className={cn(
            "relative transition-all duration-300",
            active ? "text-white" : "text-gray-500 group-hover:text-gray-700",
          )}
        >
          {icon}

          {/* Notification badge */}
          {badge && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full px-1 z-20 shadow-sm">
              {typeof badge === "number" && badge > 99 ? "99+" : badge}
            </span>
          )}
        </div>

        {/* Label with proper text handling */}
        <span
          className={cn(
            "text-xs font-medium truncate w-full text-center mt-1 transition-all duration-300",
            active ? "text-white" : "text-gray-500 group-hover:text-gray-700",
          )}
        >
          {label}
        </span>
      </div>
    </button>
  )
}
