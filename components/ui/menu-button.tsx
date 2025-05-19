import type React from "react"
import { cn } from "@/lib/utils"

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: number | string
}

export function MenuButton({ icon, label, active = false, badge, className, ...props }: MenuButtonProps) {
  return (
    <button
      className={cn(
        "relative flex flex-col items-center justify-center w-full max-w-[80px] py-2 transition-all duration-300",
        className,
      )}
      {...props}
    >
      {/* Icon Container with modern shape */}
      <div
        className={cn(
          "relative flex items-center justify-center mb-1 transition-all duration-300",
          active ? "text-[#6C63FF]" : "text-gray-500",
        )}
      >
        {/* Background shape that changes based on active state */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300",
            active ? "bg-[#6C63FF]/10 rounded-2xl scale-110" : "bg-transparent rounded-xl scale-100",
          )}
        />

        {/* Icon */}
        <div className="relative z-10 p-2">{icon}</div>

        {/* Notification badge */}
        {badge && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full px-1 z-20">
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

      {/* Active indicator */}
      {active && <div className="absolute bottom-0 w-1.5 h-1.5 bg-[#6C63FF] rounded-full" />}
    </button>
  )
}
