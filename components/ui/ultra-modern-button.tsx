"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface UltraModernButtonProps {
  icon: React.ReactNode
  label?: string
  active?: boolean
  badge?: number
  onClick?: () => void
  isAction?: boolean
}

export function UltraModernButton({
  icon,
  label,
  active = false,
  badge = 0,
  onClick,
  isAction = false,
}: UltraModernButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) return null

  return (
    <motion.button
      className={cn("relative flex flex-col items-center justify-center", isAction ? "w-16 h-16" : "w-16 py-2")}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Button background */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl transition-all duration-300",
          isAction ? "bg-gradient-to-br from-purple-600 to-indigo-700" : "",
          active && !isAction ? "bg-gradient-to-br from-purple-600 to-indigo-700" : "",
          !active && !isAction ? "bg-transparent" : "",
        )}
      />

      {/* Icon container with glass effect */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center transition-all duration-300",
          isAction ? "w-16 h-16 rounded-full" : "w-12 h-12 rounded-2xl",
          isAction ? "bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg shadow-purple-500/30" : "",
          active && !isAction ? "bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg shadow-purple-500/30" : "",
          !active && !isAction ? "bg-gray-100/90 backdrop-blur-sm" : "",
          isHovered && !active && !isAction ? "bg-gray-200/90" : "",
        )}
      >
        {/* Icon with dynamic color */}
        <div className={cn("transition-all duration-300", active || isAction ? "text-white" : "text-gray-600")}>
          {icon}
        </div>

        {/* Animated ring for active state */}
        {active && !isAction && (
          <motion.div
            className="absolute -inset-1 rounded-2xl border-2 border-purple-500/50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Notification badge */}
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-medium text-white bg-red-500 rounded-full shadow-sm">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>

      {/* Label */}
      {label && !isAction && (
        <span
          className={cn(
            "mt-1 text-xs font-medium transition-colors duration-300",
            active ? "text-purple-600" : "text-gray-500",
          )}
        >
          {label}
        </span>
      )}

      {/* Action button glow effect */}
      {isAction && <div className="absolute inset-0 -z-10 rounded-full bg-purple-500/20 blur-xl" />}
    </motion.button>
  )
}
