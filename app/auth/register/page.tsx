"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, User, Shield, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterTypePage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<"user" | "expert" | null>(null)

  const handleContinue = () => {
    if (selectedType === "user") {
      router.push("/auth/register/user")
    } else if (selectedType === "expert") {
      router.push("/auth/register/expert")
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-md mx-auto pt-10">
        <Link
          href="/auth"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to login
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Join Popya</h1>
          <p className="text-gray-600 dark:text-gray-400">Choose how you want to use Popya</p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all ${
              selectedType === "user"
                ? "border-[#6C63FF] bg-[#6C63FF]/5 dark:bg-[#6C63FF]/10"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            onClick={() => setSelectedType("user")}
          >
            <div className="flex items-start">
              <div className="bg-gradient-to-r from-[#6C63FF]/20 to-[#8B5CF6]/20 p-3 rounded-lg mr-4">
                <User className="h-6 w-6 text-[#6C63FF]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">I need support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sign up as a user to access mental health resources and connect with experts
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Access to mental health resources</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Connect with mental health professionals</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Track your mood and mental wellbeing</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedType === "user" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 h-6 w-6 bg-[#6C63FF] rounded-full flex items-center justify-center"
              >
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all ${
              selectedType === "expert"
                ? "border-[#6C63FF] bg-[#6C63FF]/5 dark:bg-[#6C63FF]/10"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            onClick={() => setSelectedType("expert")}
          >
            <div className="flex items-start">
              <div className="bg-gradient-to-r from-[#6C63FF]/20 to-[#8B5CF6]/20 p-3 rounded-lg mr-4">
                <Shield className="h-6 w-6 text-[#6C63FF]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">I'm a mental health professional</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Apply as an expert to provide mental health services through Popya
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Offer your professional services</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Connect with people who need support</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                    <span>Application requires verification</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedType === "expert" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 h-6 w-6 bg-[#6C63FF] rounded-full flex items-center justify-center"
              >
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={handleContinue}
          disabled={!selectedType}
          className="w-full mt-8 py-3.5 bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white rounded-xl font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-70 disabled:hover:translate-y-0"
        >
          Continue
          <ArrowRight size={18} className="ml-2" />
        </motion.button>

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
