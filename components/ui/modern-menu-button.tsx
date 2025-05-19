"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ModernMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: number
}

export function ModernMenuButton({ icon, label, active = false, badge, className, ...props }: ModernMenuButtonProps) {
  return (
    <motion.button
      className={cn("relative flex flex-col items-center justify-center w-full py-2", className)}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {/* Modern icon container with glass effect when active */}
      <div className="relative mb-1">
        {/* Background effect for active state */}
        {active && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-2xl blur-sm"
            layoutId="menuBackground"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}

        {/* Icon container */}
        <div
          className={cn(
            "relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
            active
              ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25"
              : "bg-gray-100/80 text-gray-500 hover:bg-gray-200/80",
          )}
        >
          {icon}
        </div>

        {/* Notification badge */}
        {badge && badge > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-medium text-white bg-red-500 rounded-full shadow-sm">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>

      {/* Label with proper text handling */}
      <span className={cn("text-xs font-medium transition-colors", active ? "text-indigo-600" : "text-gray-500")}>
        {label}
      </span>
    </motion.button>
  )
}
