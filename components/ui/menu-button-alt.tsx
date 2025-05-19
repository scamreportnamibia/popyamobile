import type React from "react"
import { cn } from "@/lib/utils"

interface MenuButtonAltProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: number | string
}

export function MenuButtonAlt({ icon, label, active = false, badge, className, ...props }: MenuButtonAltProps) {
  return (
    <button
      className={cn(
        "relative flex flex-col items-center justify-center w-full max-w-[80px] py-2 transition-all duration-300",
        className,
      )}
      {...props}
    >
      {/* Modern hexagonal icon container */}
      <div className="relative flex items-center justify-center mb-1">
        {/* Hexagonal background for active state */}
        {active && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/20 to-[#8B5CF6]/20 rounded-xl transform rotate-45 scale-[0.7]" />
        )}

        {/* Icon container with drop shadow */}
        <div
          className={cn(
            "relative z-10 p-2 transition-all duration-300",
            active ? "text-[#6C63FF] drop-shadow-md" : "text-gray-500",
          )}
        >
          {icon}
        </div>

        {/* Notification badge */}
        {badge && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full px-1 z-20 shadow-sm">
            {typeof badge === "number" && badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>

      {/* Label with proper text handling */}
      <span
        className={cn(
          "text-xs font-medium truncate w-full text-center px-1 transition-all duration-300",
          active ? "text-[#6C63FF]" : "text-gray-500",
        )}
      >
        {label}
      </span>

      {/* Modern active indicator - pill shape */}
      {active && <div className="absolute bottom-0 w-6 h-1.5 bg-[#6C63FF] rounded-full" />}
    </button>
  )
}
