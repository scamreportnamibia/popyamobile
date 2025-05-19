"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  X,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Shield,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  EyeOff,
  HelpCircle,
  Users,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type AbuseCategory = {
  id: string
  name: string
  description: string
  examples: string[]
  icon: React.ReactNode
}

const abuseCategories: AbuseCategory[] = [
  {
    id: "physical",
    name: "Physical Abuse",
    description: "Any intentional act causing injury or trauma through bodily contact.",
    examples: [
      "Hitting, slapping, or punching",
      "Pushing or shoving",
      "Physical restraint or confinement",
      "Assault with weapons or objects",
    ],
    icon: <Shield className="text-red-500" size={20} />,
  },
  {
    id: "emotional",
    name: "Emotional/Psychological Abuse",
    description:
      "Behavior that may result in psychological trauma, including anxiety, depression, or post-traumatic stress disorder.",
    examples: [
      "Constant criticism or humiliation",
      "Threats and intimidation",
      "Isolation from friends and family",
      "Gaslighting or manipulation",
    ],
    icon: <MessageSquare className="text-purple-500" size={20} />,
  },
  {
    id: "sexual",
    name: "Sexual Abuse",
    description: "Any unwanted sexual activity, with perpetrators using force, making threats, or taking advantage.",
    examples: [
      "Sexual assault or rape",
      "Unwanted touching or groping",
      "Sexual harassment",
      "Sharing intimate images without consent",
    ],
    icon: <AlertTriangle className="text-pink-500" size={20} />,
  },
  {
    id: "financial",
    name: "Financial Abuse",
    description: "Controlling a person's ability to acquire, use, and maintain financial resources.",
    examples: [
      "Taking money without permission",
      "Preventing someone from working",
      "Controlling all financial decisions",
      "Identity theft or fraud",
    ],
    icon: <FileText className="text-green-500" size={20} />,
  },
  {
    id: "online",
    name: "Online Harassment",
    description: "Using digital platforms to bully, harass, stalk, or intimidate another person.",
    examples: [
      "Cyberbullying or trolling",
      "Doxxing (sharing personal information)",
      "Online stalking",
      "Impersonation or fake profiles",
    ],
    icon: <Mail className="text-blue-500" size={20} />,
  },
  {
    id: "other",
    name: "Other Forms of Abuse",
    description: "Any other form of abuse not covered by the categories above.",
    examples: ["Neglect", "Spiritual or religious abuse", "Institutional abuse", "Human trafficking"],
    icon: <HelpCircle className="text-gray-500" size={20} />,
  },
]

type Region = {
  id: string
  name: string
}

const regions: Region[] = [
  { id: "khomas", name: "Khomas" },
  { id: "erongo", name: "Erongo" },
  { id: "hardap", name: "Hardap" },
  { id: "karas", name: "Karas" },
  { id: "kunene", name: "Kunene" },
  { id: "ohangwena", name: "Ohangwena" },
  { id: "omaheke", name: "Omaheke" },
  { id: "omusati", name: "Omusati" },
  { id: "oshana", name: "Oshana" },
  { id: "oshikoto", name: "Oshikoto" },
  { id: "otjozondjupa", name: "Otjozondjupa" },
  { id: "zambezi", name: "Zambezi" },
  { id: "kavango_east", name: "Kavango East" },
  { id: "kavango_west", name: "Kavango West" },
]

export default function ReportAbusePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [reportId, setReportId] = useState("")

  // Location information
  const [region, setRegion] = useState<string>("")
  const [town, setTown] = useState("")
  const [incidentDate, setIncidentDate] = useState("")
  const [incidentTime, setIncidentTime] = useState("")

  // Reporter information
  const [reporterType, setReporterType] = useState<"self" | "other">("self")
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")

  // Intervention preferences
  const [interventionType, setInterventionType] = useState<"police_station" | "home_visit" | "phone" | "none">("none")

  // Sharing options
  const [shareWithPolice, setShareWithPolice] = useState(true)
  const [shareWithExperts, setShareWithExperts] = useState(true)

  // Risk assessment
  const [isUrgent, setIsUrgent] = useState(false)
  const [isSafe, setIsSafe] = useState(true)
  const [ageGroup, setAgeGroup] = useState<"child" | "teen" | "adult" | "elder" | "unknown">("unknown")

  // Add real-time status indicators
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setExpandedCategory(null)
  }

  const handleAddAttachment = () => {
    // In a real app, this would open a file picker
    // For this demo, we'll just add a placeholder
    setAttachments([...attachments, "/placeholder.svg?height=200&width=200"])
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Update the handleSubmit function to simulate real-time data sending
  const handleSubmit = () => {
    if (!selectedCategory || !description.trim()) return

    setIsSubmitting(true)
    setIsUploading(true)

    // Simulate file upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simulate API call
    setTimeout(() => {
      clearInterval(uploadInterval)
      setIsSubmitting(false)
      setIsUploading(false)
      setIsSubmitted(true)
      setReportId(`RPT-${Math.floor(100000 + Math.random() * 900000)}`)
    }, 2000)
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between mb-6 px-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step < currentStep
                  ? "bg-green-500 text-white"
                  : step === currentStep
                    ? "bg-[#6C63FF] text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {step < currentStep ? <CheckCircle size={16} /> : <span className="text-sm">{step}</span>}
            </div>
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              {step === 1 && "Type"}
              {step === 2 && "Details"}
              {step === 3 && "Location"}
              {step === 4 && "Contact"}
              {step === 5 && "Review"}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Type of Abuse</h3>

            <div className="space-y-2">
              {abuseCategories.map((category) => (
                <div
                  key={category.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <div
                    className={`flex items-center justify-between p-3 cursor-pointer ${
                      selectedCategory === category.id ? "bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20 border-[#6C63FF]" : ""
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedCategory === category.id
                            ? "border-[#6C63FF] bg-[#6C63FF]"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {selectedCategory === category.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="ml-3 flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{category.name}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleCategoryExpand(category.id)
                      }}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {expandedCategory === category.id ? (
                        <ChevronUp size={18} className="text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedCategory === category.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 pt-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{category.description}</p>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Examples:</p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                            {category.examples.map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center mb-2">
                <AlertTriangle size={16} className="text-yellow-500 mr-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Is this an emergency?</h4>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Mark as urgent if immediate help is needed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Urgent reports are prioritized for immediate response
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={() => setIsUrgent(!isUrgent)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>

              {isUrgent && (
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-400 flex items-center">
                    <AlertTriangle size={16} className="mr-2" />
                    If someone is in immediate danger, please also call emergency services at{" "}
                    <span className="font-bold ml-1">10111</span>
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center mb-2">
                <User size={16} className="text-gray-700 dark:text-gray-300 mr-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Who are you reporting for?</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setReporterType("self")}
                  className={`p-3 rounded-lg border ${
                    reporterType === "self"
                      ? "border-[#6C63FF] bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20"
                      : "border-gray-200 dark:border-gray-700"
                  } flex flex-col items-center`}
                >
                  <User
                    size={24}
                    className={reporterType === "self" ? "text-[#6C63FF]" : "text-gray-500 dark:text-gray-400"}
                  />
                  <span
                    className={`text-sm mt-1 ${
                      reporterType === "self" ? "text-[#6C63FF] font-medium" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Myself
                  </span>
                </button>

                <button
                  onClick={() => setReporterType("other")}
                  className={`p-3 rounded-lg border ${
                    reporterType === "other"
                      ? "border-[#6C63FF] bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20"
                      : "border-gray-200 dark:border-gray-700"
                  } flex flex-col items-center`}
                >
                  <Users
                    size={24}
                    className={reporterType === "other" ? "text-[#6C63FF]" : "text-gray-500 dark:text-gray-400"}
                  />
                  <span
                    className={`text-sm mt-1 ${
                      reporterType === "other" ? "text-[#6C63FF] font-medium" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Someone else
                  </span>
                </button>
              </div>

              {reporterType === "other" && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Thank you for helping someone in need. You'll be able to provide their details later.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center mb-2">
                <Shield size={16} className="text-gray-700 dark:text-gray-300 mr-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Age group of the affected person</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAgeGroup("child")}
                  className={`p-2 rounded-lg border ${
                    ageGroup === "child"
                      ? "border-[#6C63FF] bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      ageGroup === "child" ? "text-[#6C63FF] font-medium" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Child (0-12)
                  </span>
                </button>

                <button
                  onClick={() => setAgeGroup("teen")}
                  className={`p-2 rounded-lg border ${
                    ageGroup === "teen"
                      ? "border-[#6C63FF] bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      ageGroup === "teen" ? "text-[#6C63FF] font-medium" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Teen (13-17)
                  </span>
                </button>

                <button
                  onClick={() => setAgeGroup("adult")}
                  className={`p-2 rounded-lg border ${
                    ageGroup === "adult"
                      ? "border-[#6C63FF] bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      ageGroup === "adult" ? "text-[#6C63FF] font-medium" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Adult (18-64)
                  </span>
                </button>

                <button
                  onClick={() => setAgeGroup("elder")}
                  className={`p-2 rounded-lg border ${
                    ageGroup === "elder"
                      ? "border-[#6C63FF] bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      ageGroup === "elder" ? "text-[#6C63FF] font-medium" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Elder (65+)
                  </span>
                </button>
              </div>

              {(ageGroup === "child" || ageGroup === "teen") && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Reports involving minors are prioritized and handled with special care.
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Incident Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what happened. Include any details that might be relevant."
                className="w-full min-h-[150px] p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Safety Assessment
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">Is the affected person currently safe?</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSafe}
                      onChange={() => setIsSafe(!isSafe)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 peer-unchecked:bg-red-500"></div>
                  </label>
                </div>

                {!isSafe && (
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-xs text-red-700 dark:text-red-400 flex items-center">
                      <AlertTriangle size={14} className="mr-1 flex-shrink-0" />
                      If someone is in immediate danger, please also call emergency services at{" "}
                      <span className="font-bold ml-1">10111</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Attachments (Optional)
              </label>

              <div className="flex flex-wrap gap-3 mb-3">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <Image
                      src={attachment || "/placeholder.svg"}
                      alt={`Attachment ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => handleRemoveAttachment(index)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleAddAttachment}
                  className="w-20 h-20 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Camera size={20} />
                  <span className="text-xs mt-1">Add</span>
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                You can upload photos, screenshots, or documents that provide evidence of the abuse. All files are kept
                confidential.
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">Submit Anonymously</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Your identity will not be revealed to the reported person.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={() => setIsAnonymous(!isAnonymous)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C63FF]"></div>
                </label>
              </div>

              {isAnonymous && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex">
                    <div className="mr-2 mt-0.5">
                      <Eye size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Your personal information will be hidden from the reported person.
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                        Note: Authorities may still need your information for legal proceedings.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Location Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6]"
              >
                <option value="">Select a region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Town/City</label>
              <input
                type="text"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                placeholder="Enter town or city name"
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Incident
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6]"
                  />
                  <Calendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time (Approximate)
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6]"
                  />
                  <Clock className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center mb-2">
                <MapPin size={16} className="text-gray-700 dark:text-gray-300 mr-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Preferred Intervention Location</h4>
              </div>

              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="interventionType"
                    checked={interventionType === "police_station"}
                    onChange={() => setInterventionType("police_station")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      interventionType === "police_station"
                        ? "border-[#6C63FF] bg-[#6C63FF]"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {interventionType === "police_station" && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">At the police station</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">I can go to the nearest police station</p>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="interventionType"
                    checked={interventionType === "home_visit"}
                    onChange={() => setInterventionType("home_visit")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      interventionType === "home_visit"
                        ? "border-[#6C63FF] bg-[#6C63FF]"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {interventionType === "home_visit" && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Home visit</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">I need police to come to my location</p>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="interventionType"
                    checked={interventionType === "phone"}
                    onChange={() => setInterventionType("phone")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      interventionType === "phone"
                        ? "border-[#6C63FF] bg-[#6C63FF]"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {interventionType === "phone" && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Phone consultation</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">I prefer to be contacted by phone first</p>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="interventionType"
                    checked={interventionType === "none"}
                    onChange={() => setInterventionType("none")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      interventionType === "none"
                        ? "border-[#6C63FF] bg-[#6C63FF]"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {interventionType === "none" && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Information only</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      I'm just reporting, no intervention needed
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Contact Information</h3>

            {!isAnonymous && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full p-3 pl-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6]"
                    />
                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full p-3 pl-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6]"
                    />
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  </div>
                </div>
              </>
            )}

            {isAnonymous && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex">
                  <EyeOff size={20} className="text-blue-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-1">Anonymous Reporting</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-500">
                      You've chosen to remain anonymous. No personal information will be collected.
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                      Note: This may limit our ability to follow up with you about the report.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Sharing Options</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Share with Police</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      For serious cases, we recommend sharing with law enforcement
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareWithPolice}
                      onChange={() => setShareWithPolice(!shareWithPolice)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C63FF]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Share with Experts</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Our mental health experts can provide support and guidance
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareWithExperts}
                      onChange={() => setShareWithExperts(!shareWithExperts)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C63FF]"></div>
                  </label>
                </div>
              </div>

              {!shareWithPolice && !shareWithExperts && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-center">
                    <AlertTriangle size={16} className="mr-2" />
                    Your report won't be shared with any authorities or experts. It will only be recorded in our system.
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Review Your Report</h3>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Type of Abuse</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedCategory ? abuseCategories.find((c) => c.id === selectedCategory)?.name : "Not specified"}
              </p>

              {isUrgent && (
                <div className="mt-2 flex items-center">
                  <AlertTriangle size={16} className="text-red-500 mr-2" />
                  <p className="text-sm text-red-600 dark:text-red-400">Marked as urgent</p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Incident Details</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                {description || "No description provided"}
              </p>

              {attachments.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments:</p>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                      >
                        <Image
                          src={attachment || "/placeholder.svg"}
                          alt={`Attachment ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Location & Time</h4>

              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <MapPin size={16} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {region ? regions.find((r) => r.id === region)?.name : "Region not specified"}
                      {town ? `, ${town}` : ""}
                    </p>
                  </div>
                </div>

                {(incidentDate || incidentTime) && (
                  <div className="flex items-start">
                    <Calendar size={16} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {incidentDate ? new Date(incidentDate).toLocaleDateString() : "Date not specified"}
                        {incidentTime ? ` at ${incidentTime}` : ""}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <Shield size={16} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {interventionType === "police_station" && "Will visit police station"}
                      {interventionType === "home_visit" && "Requesting home visit"}
                      {interventionType === "phone" && "Requesting phone consultation"}
                      {interventionType === "none" && "Information only, no intervention needed"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Contact & Sharing</h4>

              <div className="space-y-2 text-sm">
                {isAnonymous ? (
                  <div className="flex items-center">
                    <EyeOff size={16} className="text-blue-500 mr-2" />
                    <p className="text-gray-700 dark:text-gray-300">Reporting anonymously</p>
                  </div>
                ) : (
                  <>
                    {contactName && (
                      <div className="flex items-start">
                        <User size={16} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
                        <p className="text-gray-700 dark:text-gray-300">{contactName}</p>
                      </div>
                    )}

                    {contactPhone && (
                      <div className="flex items-start">
                        <Phone size={16} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
                        <p className="text-gray-700 dark:text-gray-300">{contactPhone}</p>
                      </div>
                    )}

                    {contactEmail && (
                      <div className="flex items-start">
                        <Mail size={16} className="text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
                        <p className="text-gray-700 dark:text-gray-300">{contactEmail}</p>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">
                    Sharing with:{" "}
                    {shareWithPolice && shareWithExperts
                      ? "Police and Mental Health Experts"
                      : shareWithPolice
                        ? "Police only"
                        : shareWithExperts
                          ? "Mental Health Experts only"
                          : "Not sharing with authorities"}
                  </p>
                </div>
              </div>
            </div>

            {isUploading && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">Uploading Report</h4>
                  <span className="text-sm text-[#6C63FF] dark:text-[#8B5CF6]">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-[#6C63FF] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Your report is being securely uploaded to our servers
                </p>
              </div>
            )}

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-start">
                <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                By submitting this report, you confirm that the information provided is accurate to the best of your
                knowledge. False reporting may have legal consequences.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-[56px] bg-white dark:bg-gray-800 z-30 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center">
        <Link href="/" className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Report Abuse</h1>
      </div>

      <div className="p-4">
        {!isSubmitted ? (
          <>
            <div className="mb-4">
              <div className="bg-gradient-to-r from-[#FF6584]/10 to-[#F472B6]/10 dark:from-[#FF6584]/5 dark:to-[#F472B6]/5 p-4 rounded-xl">
                <h2 className="text-base font-medium text-[#FF6584] dark:text-[#F472B6]">Safe Space</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your report will be handled with care and confidentiality. We're here to help and support you through
                  this process.
                </p>
              </div>
            </div>

            {renderStepIndicator()}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 mb-6">
              {renderStepContent()}
            </div>

            <div className="flex justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 5 ? (
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-[#6C63FF] hover:bg-[#5A52D5] text-white rounded-lg font-medium transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedCategory || !description.trim() || isSubmitting}
                  className={`px-6 py-2 rounded-lg text-white font-medium flex items-center 
                    ${isSubmitting ? "bg-gray-400 dark:bg-gray-600" : "bg-[#6C63FF] hover:bg-[#5A52D5]"} disabled:opacity-50 transition-colors`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Submit Report
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="w-20 h-20 bg-[#4CAF50]/10 dark:bg-[#4CAF50]/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle size={40} className="text-[#4CAF50]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Report Submitted</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Thank you for your courage in reporting this incident. Your report has been received and will be reviewed
              by our team.
              {shareWithPolice && shareWithExperts && (
                <span className="block mt-2">
                  Your report has been shared with our mental health experts and law enforcement as requested.
                </span>
              )}
              {shareWithPolice && !shareWithExperts && (
                <span className="block mt-2">Your report has been shared with law enforcement as requested.</span>
              )}
              {!shareWithPolice && shareWithExperts && (
                <span className="block mt-2">
                  Your report has been shared with our mental health experts as requested.
                </span>
              )}
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg inline-block border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Report Reference Number</p>
              <p className="text-lg font-mono font-semibold text-[#6C63FF] dark:text-[#8B5CF6]">{reportId}</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 mb-4">
              A member of our support team will contact you within 24 hours. If this is an emergency, please contact
              local emergency services immediately.
            </p>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-[#6C63FF] hover:bg-[#5A52D5] text-white rounded-lg font-medium transition-colors"
              >
                Return to Home
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
