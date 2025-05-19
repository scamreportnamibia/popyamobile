"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Eye, EyeOff, ChevronLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ExpertRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
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
    specialization: "",
    yearsOfExperience: "",
    licenseNumber: "",
    university: "",
    graduationYear: "",
    bio: "",
    organization: "",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    profession: "",
    specialization: "",
    licenseNumber: "",
    acceptTerms: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number }[]>([])

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

  // Profession options
  const professionOptions = [
    "Psychologist",
    "Psychiatrist",
    "Counselor",
    "Social Worker",
    "Therapist",
    "Mental Health Nurse",
    "Life Coach",
    "Other",
  ]

  // Specialization options
  const specializationOptions = [
    "Anxiety & Depression",
    "Trauma Recovery",
    "Addiction",
    "Child & Adolescent Mental Health",
    "Relationship Counseling",
    "Grief & Loss",
    "Stress Management",
    "PTSD",
    "Eating Disorders",
    "Other",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement
      setFormData({ ...formData, [name]: target.checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file) => ({
        name: file.name,
        size: file.size,
      }))
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }

  const handleSubmit = (e: React.FormEvent) => {
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
      profession: "",
      specialization: "",
      licenseNumber: "",
      acceptTerms: "",
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

    if (!formData.profession) {
      newErrors.profession = "Profession is required"
      valid = false
    }

    if (!formData.specialization) {
      newErrors.specialization = "Specialization is required"
      valid = false
    }

    if (!formData.licenseNumber) {
      newErrors.licenseNumber = "License number is required"
      valid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions"
      valid = false
    }

    setErrors(newErrors)

    if (!valid) {
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Save expert info to localStorage for demo purposes
      localStorage.setItem("userName", formData.name || "Expert")
      localStorage.setItem("userEmail", formData.email)
      localStorage.setItem("userType", "expert")
      localStorage.setItem("expertPending", "true")

      // Show success toast
      toast({
        title: "Application Submitted",
        description: "Your expert application has been submitted for review.",
      })

      // Redirect to OTP verification
      router.push("/auth/verify-otp?phone=" + encodeURIComponent(formData.phone) + "&expert=true")
    }, 1500)
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Expert Application</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Apply to become a verified mental health professional on Popya
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Application Process</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Your application will be reviewed by our team. We'll verify your credentials and contact you within 3-5
              business days. All applications are sent to info@popya.org.
            </p>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
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
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
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

          <div className="grid grid-cols-2 gap-4">
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
                <option value="">Select</option>
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
                placeholder="Enter your town"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Profession
            </label>
            <select
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              className={`w-full p-3 border ${
                errors.profession ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
              required
            >
              <option value="">Select profession</option>
              {professionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.profession && <p className="mt-1 text-xs text-red-500">{errors.profession}</p>}
          </div>

          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Specialization
            </label>
            <select
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className={`w-full p-3 border ${
                errors.specialization ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
              required
            >
              <option value="">Select specialization</option>
              {specializationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.specialization && <p className="mt-1 text-xs text-red-500">{errors.specialization}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="yearsOfExperience"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Years of Experience
              </label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="0"
                max="50"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Years"
                required
              />
            </div>

            <div>
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                License Number
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className={`w-full p-3 border ${
                  errors.licenseNumber ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                placeholder="License #"
                required
              />
              {errors.licenseNumber && <p className="mt-1 text-xs text-red-500">{errors.licenseNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                University/Institution
              </label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="University name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="graduationYear"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Graduation Year
              </label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleInputChange}
                min="1950"
                max={new Date().getFullYear()}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Year"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organization (if applicable)
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Organization name"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Professional Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
              placeholder="Tell us about your professional background and approach"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Documents</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center">
              <input
                type="file"
                id="documents"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="documents"
                className="flex flex-col items-center justify-center cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs mt-1">
                  Upload your certificates, licenses, and other relevant documents (PDF, DOC, JPG)
                </span>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="bg-[#6C63FF]/10 p-2 rounded-md mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-[#6C63FF]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

          <div className="mt-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="h-4 w-4 text-[#6C63FF] focus:ring-[#6C63FF] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="text-gray-700 dark:text-gray-300">
                  I confirm that all information provided is accurate and I agree to Popya's{" "}
                  <a href="#" className="text-[#6C63FF] hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#6C63FF] hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            {errors.acceptTerms && <p className="mt-1 text-xs text-red-500">{errors.acceptTerms}</p>}
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
                Submitting Application...
              </>
            ) : (
              <>
                Apply Now
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </motion.button>
        </form>

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
