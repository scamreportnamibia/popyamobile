"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Eye, EyeOff, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function UserRegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    birthday: "",
    gender: "",
    idNumber: "",
    region: "",
    town: "",
    profession: "",
    interests: [] as string[],
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  })

  // Areas of interest options
  const interestOptions = [
    "Depression",
    "Anxiety",
    "Stress Management",
    "Anger Management",
    "Grief & Loss",
    "Relationship Issues",
    "Self-Esteem",
    "Trauma",
    "Addiction",
    "Sleep Issues",
  ]

  // Namibian regions
  const namibianRegions = [
    "Erongo",
    "Hardap",
    "Karas",
    "Kavango East",
    "Kavango West",
    "Khomas",
    "Kunene",
    "Ohangwena",
    "Omaheke",
    "Omusati",
    "Oshana",
    "Oshikoto",
    "Otjozondjupa",
    "Zambezi",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (interest: string) => {
    const updatedInterests = [...formData.interests]
    if (updatedInterests.includes(interest)) {
      const index = updatedInterests.indexOf(interest)
      updatedInterests.splice(index, 1)
    } else {
      updatedInterests.push(interest)
    }
    setFormData({ ...formData, interests: updatedInterests })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    let valid = true
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    }

    if (!formData.name) {
      newErrors.name = "Name is required"
      valid = false
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
      valid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)

    if (!valid) {
      setIsLoading(false)
      return
    }

    try {
      // Register user
      await register(formData.name, formData.email, formData.password, formData.phone)

      // Redirect to OTP verification
      router.push("/auth/verify-otp?phone=" + encodeURIComponent(formData.phone))
    } catch (error) {
      console.error("Registration error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-md mx-auto pt-6 pb-20">
        <Link
          href="/auth/register"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Create Your Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Fill in your details to get started</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-3 border ${
                errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
              placeholder="Enter your full name"
              required
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 border ${
                errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full p-3 border ${
                errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
              placeholder="Enter your phone number"
              required
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ID Number
            </label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Enter your ID number"
              required
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Region
            </label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="">Select region</option>
              {namibianRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="town" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Town/City
            </label>
            <input
              type="text"
              id="town"
              name="town"
              value={formData.town}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Enter your town or city"
              required
            />
          </div>

          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Profession
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Enter your profession"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Areas of Interest</label>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`interest-${interest}`}
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleCheckboxChange(interest)}
                    className="h-4 w-4 text-[#6C63FF] focus:ring-[#6C63FF] border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`interest-${interest}`}
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full p-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full p-3 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10`}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white rounded-xl font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-70 disabled:hover:translate-y-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            By continuing, you agree to Popya's Terms of Service and Privacy Policy. Your data will be handled according
            to our privacy guidelines.
          </p>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
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
