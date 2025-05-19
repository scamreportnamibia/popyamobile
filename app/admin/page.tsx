"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowLeft,
  BarChart2,
  Bell,
  Calendar,
  ChevronDown,
  Download,
  ImageIcon,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
  FileText,
  LineChart,
  PieChart,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
type Advertisement = {
  id: string
  title: string
  image: string
  startDate: Date
  endDate: Date
  status: "active" | "scheduled" | "expired"
  clicks: number
  views: number
}

type Report = {
  id: string
  userId: string
  userName: string
  userImage: string
  age?: number
  gender?: string
  problemCategory: string
  description: string
  reportTime: Date
  location?: {
    region: string
    town: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  status: "new" | "inProgress" | "resolved"
  riskLevel: "low" | "medium" | "high"
  assignedTo?: string
}

type UserAnalytics = {
  totalUsers: number
  activeUsers: number
  newUsers: number
  usersByAge: {
    "Under 18": number
    "18-24": number
    "25-34": number
    "35-44": number
    "45+": number
  }
  usersByGender: {
    male: number
    female: number
    other: number
  }
  usersByRegion: Record<string, number>
}

type CallTranscript = {
  id: string
  callId: string
  userId: string
  userName: string
  expertId: string
  expertName: string
  duration: number
  startTime: Date
  keywords: string[]
  overallSentiment: "positive" | "neutral" | "negative"
  riskLevel: "low" | "medium" | "high"
}

// Sample data
const sampleAds: Advertisement[] = [
  {
    id: "ad1",
    title: "Mental Health Awareness Month",
    image: "/placeholder.svg?height=200&width=400",
    startDate: new Date("2025-05-01"),
    endDate: new Date("2025-08-01"),
    status: "active",
    clicks: 342,
    views: 2156,
  },
  {
    id: "ad2",
    title: "Therapy Session Discount",
    image: "/placeholder.svg?height=200&width=400",
    startDate: new Date("2025-06-15"),
    endDate: new Date("2025-09-15"),
    status: "scheduled",
    clicks: 0,
    views: 0,
  },
  {
    id: "ad3",
    title: "Wellness Workshop Series",
    image: "/placeholder.svg?height=200&width=400",
    startDate: new Date("2025-04-10"),
    endDate: new Date("2025-07-10"),
    status: "active",
    clicks: 189,
    views: 1245,
  },
  {
    id: "ad4",
    title: "Self-Care Product Launch",
    image: "/placeholder.svg?height=200&width=400",
    startDate: new Date("2025-02-15"),
    endDate: new Date("2025-05-15"),
    status: "expired",
    clicks: 567,
    views: 3421,
  },
]

const sampleReports: Report[] = [
  {
    id: "rep1",
    userId: "user123",
    userName: "Jane Doe",
    userImage: "/placeholder.svg?height=100&width=100",
    age: 24,
    gender: "female",
    problemCategory: "Gender-Based Violence",
    description: "Experiencing harassment and threats from an ex-partner",
    reportTime: new Date("2025-05-18T14:30:00"),
    location: {
      region: "Khomas",
      town: "Windhoek",
      coordinates: {
        latitude: -22.5609,
        longitude: 17.0658,
      },
    },
    status: "new",
    riskLevel: "high",
  },
  {
    id: "rep2",
    userId: "user456",
    userName: "John Smith",
    userImage: "/placeholder.svg?height=100&width=100",
    age: 19,
    gender: "male",
    problemCategory: "Depression",
    description: "Feeling increasingly hopeless and isolated. Having trouble sleeping and eating.",
    reportTime: new Date("2025-05-17T10:15:00"),
    location: {
      region: "Erongo",
      town: "Swakopmund",
    },
    status: "inProgress",
    riskLevel: "medium",
    assignedTo: "Dr. Sarah Johnson",
  },
  {
    id: "rep3",
    userId: "user789",
    userName: "Amara Nkosi",
    userImage: "/placeholder.svg?height=100&width=100",
    age: 32,
    gender: "female",
    problemCategory: "Anxiety",
    description: "Experiencing panic attacks at work and having trouble functioning day-to-day.",
    reportTime: new Date("2025-05-16T16:45:00"),
    location: {
      region: "Oshana",
      town: "Oshakati",
    },
    status: "resolved",
    riskLevel: "low",
    assignedTo: "Dr. Michael Chen",
  },
  {
    id: "rep4",
    userId: "user101",
    userName: "David Mulumba",
    userImage: "/placeholder.svg?height=100&width=100",
    age: 16,
    gender: "male",
    problemCategory: "Family Conflict",
    description: "Experiencing verbal abuse at home and considering running away.",
    reportTime: new Date("2025-05-18T09:20:00"),
    location: {
      region: "Khomas",
      town: "Windhoek",
    },
    status: "new",
    riskLevel: "high",
  },
  {
    id: "rep5",
    userId: "user202",
    userName: "Maria Santos",
    userImage: "/placeholder.svg?height=100&width=100",
    age: 28,
    gender: "female",
    problemCategory: "Gender-Based Violence",
    description: "Experiencing physical abuse from spouse. Needs immediate assistance.",
    reportTime: new Date("2025-05-18T11:05:00"),
    location: {
      region: "Karas",
      town: "Keetmanshoop",
      coordinates: {
        latitude: -26.5833,
        longitude: 18.1333,
      },
    },
    status: "inProgress",
    riskLevel: "high",
    assignedTo: "Dr. Olivia Patel",
  },
]

const sampleCallTranscripts: CallTranscript[] = [
  {
    id: "call1",
    callId: "c12345",
    userId: "user123",
    userName: "Jane Doe",
    expertId: "e1",
    expertName: "Dr. Sarah Johnson",
    duration: 35 * 60, // 35 minutes in seconds
    startTime: new Date("2025-05-18T15:30:00"),
    keywords: ["anxiety", "work stress", "insomnia", "coping strategies"],
    overallSentiment: "negative",
    riskLevel: "medium",
  },
  {
    id: "call2",
    callId: "c67890",
    userId: "user456",
    userName: "John Smith",
    expertId: "e2",
    expertName: "Dr. Michael Chen",
    duration: 42 * 60, // 42 minutes in seconds
    startTime: new Date("2025-05-17T11:15:00"),
    keywords: ["depression", "isolation", "support network", "medication"],
    overallSentiment: "neutral",
    riskLevel: "medium",
  },
  {
    id: "call3",
    callId: "c13579",
    userId: "user789",
    userName: "Amara Nkosi",
    expertId: "e3",
    expertName: "Dr. Olivia Patel",
    duration: 28 * 60, // 28 minutes in seconds
    startTime: new Date("2025-05-16T17:45:00"),
    keywords: ["panic attacks", "breathing techniques", "workplace stress", "progress"],
    overallSentiment: "positive",
    riskLevel: "low",
  },
  {
    id: "call4",
    callId: "c24680",
    userId: "user101",
    userName: "David Mulumba",
    expertId: "ai-doc",
    expertName: "Dr. We Don't Judge",
    duration: 15 * 60, // 15 minutes in seconds
    startTime: new Date("2025-05-18T09:45:00"),
    keywords: ["family conflict", "shelter", "safety plan", "resources"],
    overallSentiment: "negative",
    riskLevel: "high",
  },
]

const sampleUserAnalytics: UserAnalytics = {
  totalUsers: 2456,
  activeUsers: 1823,
  newUsers: 342,
  usersByAge: {
    "Under 18": 468,
    "18-24": 875,
    "25-34": 642,
    "35-44": 315,
    "45+": 156,
  },
  usersByGender: {
    male: 1125,
    female: 1283,
    other: 48,
  },
  usersByRegion: {
    Khomas: 876,
    Erongo: 432,
    Oshana: 356,
    Ohangwena: 278,
    Kavango: 201,
    Karas: 167,
    Otjozondjupa: 146,
  },
}

type DashboardStat = {
  label: string
  value: string | number
  change: number
  icon: React.ReactNode
}

const dashboardStats: DashboardStat[] = [
  {
    label: "Total Users",
    value: "2,456",
    change: 12.5,
    icon: <Users size={20} className="text-[#6C63FF]" />,
  },
  {
    label: "Active Groups",
    value: 32,
    change: 8.3,
    icon: <Users size={20} className="text-[#FF6584]" />,
  },
  {
    label: "Posts Today",
    value: 187,
    change: -3.2,
    icon: <BarChart2 size={20} className="text-[#43C6AC]" />,
  },
  {
    label: "Active Ads",
    value: 8,
    change: 25,
    icon: <ImageIcon size={20} className="text-[#FFC75F]" />,
  },
]

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "advertisements" | "reports" | "analytics" | "settings">(
    "dashboard",
  )
  const [showNewAdForm, setShowNewAdForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDuration, setSelectedDuration] = useState<"3" | "6" | "9" | "12">("3")
  const [newAd, setNewAd] = useState({
    title: "",
    image: "",
    startDate: new Date().toISOString().split("T")[0],
    duration: "3",
  })

  // Report filters
  const [reportsFilter, setReportsFilter] = useState({
    status: "all",
    riskLevel: "all",
    category: "all",
    region: "all",
    timeFrame: "all",
  })

  // Call transcript filters
  const [transcriptsFilter, setTranscriptsFilter] = useState({
    sentiment: "all",
    riskLevel: "all",
    expertId: "all",
    timeFrame: "all",
  })

  // Function to filter reports based on current filters
  const getFilteredReports = () => {
    return sampleReports.filter((report) => {
      const matchesSearch =
        report.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.problemCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = reportsFilter.status === "all" || report.status === reportsFilter.status
      const matchesRisk = reportsFilter.riskLevel === "all" || report.riskLevel === reportsFilter.riskLevel
      const matchesCategory = reportsFilter.category === "all" || report.problemCategory === reportsFilter.category
      const matchesRegion = reportsFilter.region === "all" || report.location?.region === reportsFilter.region

      // Time frame filtering
      let matchesTimeFrame = true
      const now = new Date()
      const reportDate = new Date(report.reportTime)

      if (reportsFilter.timeFrame === "today") {
        matchesTimeFrame = reportDate.toDateString() === now.toDateString()
      } else if (reportsFilter.timeFrame === "week") {
        const weekAgo = new Date(now)
        weekAgo.setDate(now.getDate() - 7)
        matchesTimeFrame = reportDate >= weekAgo
      } else if (reportsFilter.timeFrame === "month") {
        const monthAgo = new Date(now)
        monthAgo.setMonth(now.getMonth() - 1)
        matchesTimeFrame = reportDate >= monthAgo
      }

      return matchesSearch && matchesStatus && matchesRisk && matchesCategory && matchesRegion && matchesTimeFrame
    })
  }

  // Function to filter call transcripts
  const getFilteredTranscripts = () => {
    return sampleCallTranscripts.filter((transcript) => {
      const matchesSearch =
        transcript.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transcript.expertName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSentiment =
        transcriptsFilter.sentiment === "all" || transcript.overallSentiment === transcriptsFilter.sentiment
      const matchesRisk = transcriptsFilter.riskLevel === "all" || transcript.riskLevel === transcriptsFilter.riskLevel
      const matchesExpert = transcriptsFilter.expertId === "all" || transcript.expertId === transcriptsFilter.expertId

      // Time frame filtering
      let matchesTimeFrame = true
      const now = new Date()
      const callDate = new Date(transcript.startTime)

      if (transcriptsFilter.timeFrame === "today") {
        matchesTimeFrame = callDate.toDateString() === now.toDateString()
      } else if (transcriptsFilter.timeFrame === "week") {
        const weekAgo = new Date(now)
        weekAgo.setDate(now.getDate() - 7)
        matchesTimeFrame = callDate >= weekAgo
      } else if (transcriptsFilter.timeFrame === "month") {
        const monthAgo = new Date(now)
        monthAgo.setMonth(now.getMonth() - 1)
        matchesTimeFrame = callDate >= monthAgo
      }

      return matchesSearch && matchesSentiment && matchesRisk && matchesExpert && matchesTimeFrame
    })
  }

  const filteredAds = sampleAds.filter((ad) => ad.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredReports = getFilteredReports()
  const filteredTranscripts = getFilteredTranscripts()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewAd({
      ...newAd,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowNewAdForm(false)
      // In a real app, you would add the new ad to the list
    }, 1500)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateTime = (date: Date) => {
    return `${formatDate(date)} at ${formatTime(date)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "resolved":
        return "bg-green-100 text-green-800"
      case "scheduled":
      case "inProgress":
        return "bg-blue-100 text-blue-800"
      case "expired":
      case "new":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "neutral":
        return "bg-blue-100 text-blue-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Export functions
  const exportToPDF = (data: any, type: string) => {
    // In a real implementation, you would generate a PDF
    console.log(`Exporting ${type} data to PDF:`, data)
    alert(`PDF export of ${type} data would be generated here.`)

    // Simulate download
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-export-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToCSV = (data: any, type: string) => {
    // In a real implementation, you would generate a CSV
    console.log(`Exporting ${type} data to CSV:`, data)
    alert(`CSV export of ${type} data would be generated here.`)

    // Simulate download
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-export-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="p-1 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold ml-3 text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6]">
              Popya Admin
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[57px] z-40">
        <div className="flex overflow-x-auto max-w-screen-lg mx-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === "dashboard"
                ? "text-[#6C63FF] border-b-2 border-[#6C63FF]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === "reports"
                ? "text-[#6C63FF] border-b-2 border-[#6C63FF]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Reports & GBV Cases
          </button>
          <button
            onClick={() => setActiveTab("advertisements")}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === "advertisements"
                ? "text-[#6C63FF] border-b-2 border-[#6C63FF]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Advertisements
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === "analytics"
                ? "text-[#6C63FF] border-b-2 border-[#6C63FF]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === "settings"
                ? "text-[#6C63FF] border-b-2 border-[#6C63FF]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto p-4">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <AnimatedContainer>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium flex items-center text-gray-600">
                    <FileText size={16} className="mr-1.5" />
                    Export Report
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {dashboardStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {stat.icon}
                      </div>
                    </div>
                    <div className={`mt-2 text-xs font-medium ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {stat.change >= 0 ? "+" : ""}
                      {stat.change}% from last week
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Reports */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Recent Reports</h3>
                      <Link
                        href="#"
                        onClick={() => setActiveTab("reports")}
                        className="text-sm text-[#6C63FF] hover:underline"
                      >
                        View All
                      </Link>
                    </div>
                  </div>

                  <div className="divide-y">
                    {sampleReports.slice(0, 3).map((report) => (
                      <div key={report.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 relative flex-shrink-0">
                            <Image
                              src={report.userImage || "/placeholder.svg"}
                              alt={report.userName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-800">{report.userName}</h4>
                                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                  <span className="flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {formatDateTime(report.reportTime)}
                                  </span>
                                  {report.location && (
                                    <span className="flex items-center ml-2">
                                      <MapPin size={12} className="mr-1" />
                                      {report.location.town}, {report.location.region}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(report.riskLevel)}`}
                              >
                                {report.riskLevel.toUpperCase()}
                              </span>
                            </div>
                            <div className="mt-1">
                              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                                {report.problemCategory}
                              </span>
                            </div>
                            <p className="mt-1.5 text-sm text-gray-700 line-clamp-2">{report.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Call Transcripts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Recent Call Transcripts</h3>
                      <Link
                        href="#"
                        onClick={() => setActiveTab("analytics")}
                        className="text-sm text-[#6C63FF] hover:underline"
                      >
                        View All
                      </Link>
                    </div>
                  </div>

                  <div className="divide-y">
                    {sampleCallTranscripts.slice(0, 3).map((transcript) => (
                      <div key={transcript.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">{transcript.userName}</h4>
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                              <span>with {transcript.expertName}</span>
                              <span className="mx-1.5">•</span>
                              <span>{formatDateTime(transcript.startTime)}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(transcript.overallSentiment)}`}
                            >
                              {transcript.overallSentiment.toUpperCase()}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(transcript.riskLevel)}`}
                            >
                              {transcript.riskLevel.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {transcript.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <button className="text-xs text-[#6C63FF] hover:underline">View Transcript</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <AnimatedContainer>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Reports & GBV Cases</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportToPDF(filteredReports, "reports")}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium flex items-center text-gray-600"
                  >
                    <Download size={16} className="mr-1.5" />
                    Export PDF
                  </button>
                  <button
                    onClick={() => exportToCSV(filteredReports, "reports")}
                    className="px-3 py-1.5 bg-[#6C63FF] text-white rounded-lg text-sm font-medium flex items-center"
                  >
                    <Download size={16} className="mr-1.5" />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search reports..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                    />
                  </div>
                </div>

                <div className="p-4 border-b bg-gray-50">
                  <div className="flex flex-wrap gap-3">
                    <div>
                      <label htmlFor="status-filter" className="block text-xs font-medium text-gray-500 mb-1">
                        Status
                      </label>
                      <select
                        id="status-filter"
                        value={reportsFilter.status}
                        onChange={(e) => setReportsFilter({ ...reportsFilter, status: e.target.value })}
                        className="text-sm border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                      >
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="inProgress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="risk-filter" className="block text-xs font-medium text-gray-500 mb-1">
                        Risk Level
                      </label>
                      <select
                        id="risk-filter"
                        value={reportsFilter.riskLevel}
                        onChange={(e) => setReportsFilter({ ...reportsFilter, riskLevel: e.target.value })}
                        className="text-sm border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                      >
                        <option value="all">All Risk Levels</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="category-filter" className="block text-xs font-medium text-gray-500 mb-1">
                        Category
                      </label>
                      <select
                        id="category-filter"
                        value={reportsFilter.category}
                        onChange={(e) => setReportsFilter({ ...reportsFilter, category: e.target.value })}
                        className="text-sm border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                      >
                        <option value="all">All Categories</option>
                        <option value="Gender-Based Violence">GBV</option>
                        <option value="Depression">Depression</option>
                        <option value="Anxiety">Anxiety</option>
                        <option value="Family Conflict">Family Conflict</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="region-filter" className="block text-xs font-medium text-gray-500 mb-1">
                        Region
                      </label>
                      <select
                        id="region-filter"
                        value={reportsFilter.region}
                        onChange={(e) => setReportsFilter({ ...reportsFilter, region: e.target.value })}
                        className="text-sm border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                      >
                        <option value="all">All Regions</option>
                        <option value="Khomas">Khomas</option>
                        <option value="Erongo">Erongo</option>
                        <option value="Oshana">Oshana</option>
                        <option value="Karas">Karas</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="time-filter" className="block text-xs font-medium text-gray-500 mb-1">
                        Time Frame
                      </label>
                      <select
                        id="time-filter"
                        value={reportsFilter.timeFrame}
                        onChange={(e) => setReportsFilter({ ...reportsFilter, timeFrame: e.target.value })}
                        className="text-sm border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Report Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Risk Level
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 relative flex-shrink-0">
                                <Image
                                  src={report.userImage || "/placeholder.svg"}
                                  alt={report.userName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">{report.userName}</p>
                                <div className="text-xs text-gray-500">
                                  {report.age && `${report.age} yrs`}
                                  {report.gender && <span className="ml-1">• {report.gender}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                              {report.problemCategory}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <p className="text-sm text-gray-800">{formatDate(report.reportTime)}</p>
                            <p className="text-xs text-gray-500">{formatTime(report.reportTime)}</p>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {report.location ? (
                              <div className="text-sm">
                                <p className="text-gray-800">{report.location.town}</p>
                                <p className="text-xs text-gray-500">{report.location.region}</p>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">Unknown</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}
                            >
                              {report.status === "inProgress"
                                ? "In Progress"
                                : report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(report.riskLevel)}`}
                            >
                              {report.riskLevel.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <button className="text-[#6C63FF] text-sm hover:underline">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredReports.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No reports found matching your filters</p>
                  </div>
                )}
              </div>

              {/* Report Map View */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-800">Geographic Distribution</h3>
                </div>
                <div className="p-4 aspect-video bg-gray-50 flex items-center justify-center">
                  {/* In a real implementation, this would be a map component */}
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">Interactive map would be displayed here</p>
                    <p className="text-sm text-gray-500">Showing geographical distribution of reports across Namibia</p>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        )}

        {activeTab === "advertisements" && (
          <div className="space-y-6">
            <AnimatedContainer>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Advertisements</h2>
                <button
                  onClick={() => setShowNewAdForm(true)}
                  className="px-3 py-2 bg-[#6C63FF] text-white rounded-lg text-sm font-medium flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  New Ad
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search advertisements..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Advertisement
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAds.map((ad) => (
                        <tr key={ad.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={ad.image || "/placeholder.svg"}
                                  alt={ad.title}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">{ad.title}</p>
                                <p className="text-xs text-gray-500">ID: {ad.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <p className="text-sm text-gray-800">
                              {formatDate(ad.startDate)} - {formatDate(ad.endDate)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {Math.round((ad.endDate.getTime() - ad.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))}{" "}
                              months
                            </p>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ad.status)}`}>
                              {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm text-gray-800">
                                <span className="font-medium">{ad.clicks}</span> clicks
                              </p>
                              <p className="text-xs text-gray-500">
                                <span className="font-medium">{ad.views}</span> impressions
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <button className="p-1 text-gray-500 hover:text-gray-700">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredAds.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No advertisements found</p>
                  </div>
                )}
              </div>
            </AnimatedContainer>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <AnimatedContainer>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Analytics & Insights</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportToPDF(sampleUserAnalytics, "analytics")}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium flex items-center text-gray-600"
                  >
                    <Download size={16} className="mr-1.5" />
                    Export PDF
                  </button>
                </div>
              </div>

              <Tabs defaultValue="user-analytics" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="user-analytics">User Analytics</TabsTrigger>
                  <TabsTrigger value="call-analytics">Call Transcripts</TabsTrigger>
                  <TabsTrigger value="sentiment-analysis">Sentiment Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="user-analytics">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Users by Age Group</h3>
                      <div className="h-64 flex items-center justify-center">
                        <PieChart size={24} className="text-gray-300" />
                        <span className="ml-2 text-gray-500">Pie chart would be displayed here</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {Object.entries(sampleUserAnalytics.usersByAge).map(([ageGroup, count]) => (
                          <div key={ageGroup} className="flex justify-between items-center text-sm">
                            <span>{ageGroup}</span>
                            <span className="font-medium">{count} users</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Users by Gender</h3>
                      <div className="h-64 flex items-center justify-center">
                        <PieChart size={24} className="text-gray-300" />
                        <span className="ml-2 text-gray-500">Pie chart would be displayed here</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {Object.entries(sampleUserAnalytics.usersByGender).map(([gender, count]) => (
                          <div key={gender} className="flex justify-between items-center text-sm">
                            <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
                            <span className="font-medium">{count} users</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Users by Region</h3>
                      <div className="h-64 flex items-center justify-center">
                        <MapPin size={24} className="text-gray-300" />
                        <span className="ml-2 text-gray-500">Map chart would be displayed here</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {Object.entries(sampleUserAnalytics.usersByRegion).map(([region, count]) => (
                          <div key={region} className="flex justify-between items-center text-sm">
                            <span>{region}</span>
                            <span className="font-medium">{count} users</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">User Growth Over Time</h3>
                    <div className="h-80 flex items-center justify-center">
                      <LineChart size={24} className="text-gray-300" />
                      <span className="ml-2 text-gray-500">Line chart would be displayed here</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="call-analytics">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Call Transcript Analysis</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => exportToPDF(filteredTranscripts, "call-transcripts")}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium flex items-center text-gray-600"
                          >
                            <Download size={16} className="mr-1.5" />
                            Export PDF
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex flex-wrap gap-3">
                        <div>
                          <label htmlFor="sentiment-filter" className="block text-xs font-medium text-gray-500 mb-1">
                            Sentiment
                          </label>
                          <select
                            id="sentiment-filter"
                            value={transcriptsFilter.sentiment}
                            onChange={(e) => setTranscriptsFilter({ ...transcriptsFilter, sentiment: e.target.value })}
                            className="text-sm border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                          >
                            <option value="all">All Sentiments</option>
                            <option value="positive">Positive</option>
                            <option value="neutral">Neutral</option>
                            <option value="negative">Negative</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="risk-filter" className="block text-xs font-medium text-gray-500 mb-1">
                            Risk Level
                          </label>
                          <select
                            id="risk-filter"
                            value={transcriptsFilter.riskLevel}
                            onChange={(e) => setTranscriptsFilter({ ...transcriptsFilter, riskLevel: e.target.value })}
                            className="text-sm border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                          >
                            <option value="all">All Risk Levels</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="expert-filter" className="block text-xs font-medium text-gray-500 mb-1">
                            Expert
                          </label>
                          <select
                            id="expert-filter"
                            value={transcriptsFilter.expertId}
                            onChange={(e) => setTranscriptsFilter({ ...transcriptsFilter, expertId: e.target.value })}
                            className="text-sm border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                          >
                            <option value="all">All Experts</option>
                            <option value="ai-doc">Dr. We Don't Judge (AI)</option>
                            <option value="e1">Dr. Sarah Johnson</option>
                            <option value="e2">Dr. Michael Chen</option>
                            <option value="e3">Dr. Olivia Patel</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="time-filter" className="block text-xs font-medium text-gray-500 mb-1">
                            Time Frame
                          </label>
                          <select
                            id="time-filter"
                            value={transcriptsFilter.timeFrame}
                            onChange={(e) => setTranscriptsFilter({ ...transcriptsFilter, timeFrame: e.target.value })}
                            className="text-sm border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                          >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Expert
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Duration
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Keywords
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sentiment
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Risk Level
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredTranscripts.map((transcript) => (
                            <tr key={transcript.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap">
                                <p className="text-sm font-medium text-gray-800">{transcript.userName}</p>
                                <p className="text-xs text-gray-500">ID: {transcript.userId}</p>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-800">{transcript.expertName}</p>
                                <p className="text-xs text-gray-500">ID: {transcript.expertId}</p>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-800">{formatDate(transcript.startTime)}</p>
                                <p className="text-xs text-gray-500">{formatTime(transcript.startTime)}</p>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-800">{Math.floor(transcript.duration / 60)} mins</p>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {transcript.keywords.map((keyword, index) => (
                                    <span
                                      key={index}
                                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                                    >
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(transcript.overallSentiment)}`}
                                >
                                  {transcript.overallSentiment.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(transcript.riskLevel)}`}
                                >
                                  {transcript.riskLevel.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-right">
                                <button className="text-[#6C63FF] text-sm hover:underline">View Transcript</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredTranscripts.length === 0 && (
                      <div className="py-8 text-center">
                        <p className="text-gray-500">No transcripts found matching your filters</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="sentiment-analysis">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Overall Sentiment Trends</h3>
                      <div className="h-80 flex items-center justify-center">
                        <LineChart size={24} className="text-gray-300" />
                        <span className="ml-2 text-gray-500">Line chart would be displayed here</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Sentiment by Problem Category</h3>
                      <div className="h-80 flex items-center justify-center">
                        <BarChart2 size={24} className="text-gray-300" />
                        <span className="ml-2 text-gray-500">Bar chart would be displayed here</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Common Topics by Sentiment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-3">
                        <h4 className="text-sm font-medium text-green-600 mb-2">Positive Sentiment Topics</h4>
                        <ul className="space-y-1">
                          <li className="text-sm flex justify-between">
                            <span>Recovery progress</span>
                            <span className="font-medium">43%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Therapy benefits</span>
                            <span className="font-medium">38%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Support systems</span>
                            <span className="font-medium">35%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Coping skills</span>
                            <span className="font-medium">31%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Mindfulness</span>
                            <span className="font-medium">27%</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <h4 className="text-sm font-medium text-blue-600 mb-2">Neutral Sentiment Topics</h4>
                        <ul className="space-y-1">
                          <li className="text-sm flex justify-between">
                            <span>Daily routines</span>
                            <span className="font-medium">52%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Medication</span>
                            <span className="font-medium">47%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Sleep patterns</span>
                            <span className="font-medium">41%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Diet & nutrition</span>
                            <span className="font-medium">36%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Exercise</span>
                            <span className="font-medium">33%</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <h4 className="text-sm font-medium text-red-600 mb-2">Negative Sentiment Topics</h4>
                        <ul className="space-y-1">
                          <li className="text-sm flex justify-between">
                            <span>Anxiety symptoms</span>
                            <span className="font-medium">63%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Depression</span>
                            <span className="font-medium">58%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Relationship conflicts</span>
                            <span className="font-medium">52%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Work stress</span>
                            <span className="font-medium">49%</span>
                          </li>
                          <li className="text-sm flex justify-between">
                            <span>Financial concerns</span>
                            <span className="font-medium">44%</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AnimatedContainer>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <AnimatedContainer>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Settings</h2>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">System Configuration</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">AI Risk Detection Settings</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" checked className="rounded text-[#6C63FF] focus:ring-[#6C63FF]" />
                          <span className="ml-2 text-sm">Enable real-time risk alerts</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          Notify admins when high-risk messages are detected
                        </p>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" checked className="rounded text-[#6C63FF] focus:ring-[#6C63FF]" />
                          <span className="ml-2 text-sm">Save AI analysis for all calls</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          Store sentiment analysis and transcripts for all calls
                        </p>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" checked className="rounded text-[#6C63FF] focus:ring-[#6C63FF]" />
                          <span className="ml-2 text-sm">Enable predictive risk assessment</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          Use AI to predict potential mental health crises
                        </p>
                      </div>

                      <div className="pt-2">
                        <label className="block text-sm mb-1">Risk detection sensitivity</label>
                        <select className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]">
                          <option>High - More alerts, some false positives</option>
                          <option selected>Medium - Balanced approach</option>
                          <option>Low - Fewer alerts, might miss some cases</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Data Collection & Privacy</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" checked className="rounded text-[#6C63FF] focus:ring-[#6C63FF]" />
                          <span className="ml-2 text-sm">Collect demographic data</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Age, gender, region for statistical analysis</p>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" checked className="rounded text-[#6C63FF] focus:ring-[#6C63FF]" />
                          <span className="ml-2 text-sm">Collect location data (when enabled by user)</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1 ml-6">GPS coordinates for emergency response</p>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" checked className="rounded text-[#6C63FF] focus:ring-[#6C63FF]" />
                          <span className="ml-2 text-sm">Data anonymization for reports</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          Remove personally identifiable information in exports
                        </p>
                      </div>

                      <div className="pt-2">
                        <label className="block text-sm mb-1">Data retention period</label>
                        <select className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]">
                          <option>1 month</option>
                          <option>3 months</option>
                          <option selected>6 months</option>
                          <option>1 year</option>
                          <option>Indefinitely</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Notification Settings</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" checked className="rounded text-[#6C63FF] focus:ring-[#6C63FF]" />
                          <span className="ml-2 text-sm">Email notifications for high-risk cases</span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" checked className="rounded text-[#6C63FF] focus:ring-[#6C63FF]" />
                          <span className="ml-2 text-sm">SMS alerts for emergencies</span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" checked className="rounded text-[#6C63FF] focus:ring-[#6C63FF]" />
                          <span className="ml-2 text-sm">Daily summary reports</span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" checked className="rounded text-[#6C63FF] focus:ring-[#6C63FF]" />
                          <span className="ml-2 text-sm">Weekly analytics digest</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button className="px-4 py-2 bg-[#6C63FF] text-white rounded-lg text-sm font-medium">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        )}
      </div>

      {/* New Advertisement Modal */}
      {showNewAdForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Create New Advertisement</h3>
              <button onClick={() => setShowNewAdForm(false)} className="p-1 rounded-full hover:bg-gray-100">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Advertisement Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newAd.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                  placeholder="Enter advertisement title"
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Advertisement Image
                </label>
                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div className="flex flex-col items-center">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">JPG, PNG (max. 2MB)</p>
                  </div>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="hidden"
                    accept="image/jpeg, image/png"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={newAd.startDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <div className="relative">
                  <select
                    id="duration"
                    name="duration"
                    value={newAd.duration}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF] appearance-none pr-10"
                    required
                  >
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="9">9 months</option>
                    <option value="12">12 months</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-[#6C63FF] text-white rounded-lg font-medium flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Advertisement"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
