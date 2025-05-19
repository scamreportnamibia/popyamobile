"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const phone = searchParams.get("phone") || ""
  const isExpert = searchParams.get("expert") === "true"

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      const newOtp = [...otp]
      newOtp[index - 1] = ""
      setOtp(newOtp)

      // Focus previous input
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleResendOtp = () => {
    if (!canResend) return

    // Reset countdown
    setCountdown(60)
    setCanResend(false)

    // Show toast
    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent to your phone.",
    })
  }

  const handleVerifyOtp = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      if (isExpert) {
        // Show expert application confirmation toast
        toast({
          title: "Application Submitted",
          description: "Your expert application has been submitted for review. We'll contact you soon.",
        })
      } else {
        // Show success toast for regular users
        toast({
          title: "Account Created",
          description: "Your account has been created successfully.",
        })
      }

      // Redirect to home page after successful verification
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-md mx-auto pt-10">
        <Link
          href={isExpert ? "/auth/register/expert" : "/auth/register/user"}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-20 h-20 bg-gradient-to-r from-[#6C63FF]/20 to-[#8B5CF6]/20 rounded-full flex items-center justify-center mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">Verify Your Phone</h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              We've sent a 6-digit verification code to your phone number {phone ? `ending in ${phone.slice(-4)}` : ""}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-2 mb-8"
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleVerifyOtp}
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full py-3.5 bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white rounded-xl font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-70 disabled:hover:translate-y-0 mb-4"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </motion.button>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-400 text-center"
          >
            {canResend ? (
              <button onClick={handleResendOtp} className="text-[#6C63FF] font-medium">
                Resend Code
              </button>
            ) : (
              <span>
                Resend code in <span className="text-[#6C63FF] font-medium">{countdown}s</span>
              </span>
            )}
          </motion.p>

          <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              Proudly powered by{" "}
              <a href="https://www.popya.org" className="text-[#6C63FF] dark:text-[#8B5CF6]">
                Popya Assistance Foundation
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
