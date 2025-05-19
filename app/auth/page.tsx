"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, ChevronLeft, Heart, Shield, Users, MessageCircle, Brain } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface SlideProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  background: string
}

const slides: SlideProps[] = [
  {
    title: "Welcome to Popya",
    description: "Your mental health companion for support, resources, and community.",
    icon: <Heart className="h-12 w-12 text-white" />,
    color: "from-rose-500 to-pink-600",
    background: "bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/30",
  },
  {
    title: "Expert Support",
    description: "Connect with mental health professionals for guidance and counseling.",
    icon: <Shield className="h-12 w-12 text-white" />,
    color: "from-blue-500 to-cyan-600",
    background: "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30",
  },
  {
    title: "Community Groups",
    description: "Join supportive communities with people who understand your journey.",
    icon: <Users className="h-12 w-12 text-white" />,
    color: "from-violet-500 to-purple-600",
    background: "bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/30",
  },
  {
    title: "AI Assistance",
    description: "Get 24/7 support from our AI mental health assistant.",
    icon: <Brain className="h-12 w-12 text-white" />,
    color: "from-emerald-500 to-teal-600",
    background: "bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/30",
  },
  {
    title: "Share Your Journey",
    description: "Express your feelings and track your mental health progress.",
    icon: <MessageCircle className="h-12 w-12 text-white" />,
    color: "from-amber-500 to-orange-600",
    background: "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/30",
  },
]

export default function AuthPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // If user is already logged in, redirect based on role
    if (user) {
      if (user.role === "super_admin") {
        router.push("/admin/dashboard")
      } else if (user.role === "expert") {
        router.push("/expert-dashboard")
      } else {
        router.push("/")
      }
    }
  }, [user, router])

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1))
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1))
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  }

  // Floating animation for background elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const,
    },
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={floatingAnimation}
            className="absolute top-[10%] left-[10%] w-20 h-20 rounded-full bg-purple-500/10 dark:bg-purple-500/20"
          />
          <motion.div
            animate={{
              ...floatingAnimation,
              transition: { ...floatingAnimation.transition, delay: 0.5 },
            }}
            className="absolute top-[30%] right-[15%] w-32 h-32 rounded-full bg-blue-500/10 dark:bg-blue-500/20"
          />
          <motion.div
            animate={{
              ...floatingAnimation,
              transition: { ...floatingAnimation.transition, delay: 1 },
            }}
            className="absolute bottom-[20%] left-[20%] w-24 h-24 rounded-full bg-pink-500/10 dark:bg-pink-500/20"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Popya</h1>
          <p className="text-gray-600 dark:text-gray-400">Mental Health Support Platform</p>
        </div>

        <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-lg" style={{ height: "400px" }}>
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`absolute inset-0 p-6 flex flex-col items-center justify-center text-center ${slides[currentSlide].background}`}
                >
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-r ${slides[currentSlide].color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    {slides[currentSlide].icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">{slides[currentSlide].description}</p>

                  {/* Slide indicators */}
                  <div className="flex space-x-2 mt-auto">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          index === currentSlide
                            ? `bg-gradient-to-r ${slides[currentSlide].color} w-6`
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              {currentSlide > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              )}

              {currentSlide < slides.length - 1 && (
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col space-y-4">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full bg-[#6C63FF] hover:bg-[#5A52D5] text-white">Sign In</Button>
          </Link>
          <Link href="/auth/register" className="w-full">
            <Button variant="outline" className="w-full">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            Proudly powered by{" "}
            <a href="https://www.popya.org" className="text-[#6C63FF] dark:text-[#8B5CF6]">
              Popya Assistance Foundation
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
