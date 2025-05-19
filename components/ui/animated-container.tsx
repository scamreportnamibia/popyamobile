"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

type AnimationType = "fade" | "slide" | "scale" | "bounce"

interface AnimatedContainerProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  className?: string
}

export function AnimatedContainer({ children, animation = "fade", delay = 0, className = "" }: AnimatedContainerProps) {
  const getAnimationProps = () => {
    switch (animation) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5, delay },
        }
      case "slide":
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay },
        }
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5, delay },
        }
      case "bounce":
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 200,
            delay,
          },
        }
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5, delay },
        }
    }
  }

  return (
    <motion.div className={className} {...getAnimationProps()}>
      {children}
    </motion.div>
  )
}
