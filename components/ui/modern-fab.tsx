"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

interface ModernFabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  variant?: "primary" | "secondary"
  size?: "default" | "large"
}

export function ModernFab({
  icon = <Plus size={24} />,
  variant = "primary",
  size = "default",
  className,
  ...props
}: ModernFabProps) {
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white",
    secondary: "bg-gradient-to-r from-pink-500 to-rose-500 text-white",
  }

  const sizes = {
    default: "w-14 h-14",
    large: "w-16 h-16",
  }

  return (
    <motion.button
      className={cn(
        "fixed bottom-20 right-4 z-50 flex items-center justify-center rounded-full shadow-lg",
        "shadow-indigo-500/30 hover:shadow-indigo-500/40",
        variants[variant],
        sizes[size],
        className,
      )}
      whileHover={{ scale: 1.05, rotate: 90 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {icon}

      {/* Subtle glow effect */}
      <span className="absolute inset-0 rounded-full bg-white opacity-30 blur-md -z-10" />
    </motion.button>
  )
}
