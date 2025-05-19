"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, Download, Filter, MapPin, MessageSquare, Search, User, FileText } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Sample data
const sampleReports = [
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
    },
    status: "inProgress",
    riskLevel: "high",
    assignedTo: "Dr. Olivia Patel",
  },
]

export function ExpertReportsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: "all",
    riskLevel: "all",
    region: "all",
    timeFrame: "all",
  })

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "inProgress":
        return "bg-blue-100 text-blue-800"
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

  // Filter reports based on active tab and search query
  const filteredReports = sampleReports.filter((report) => {
    // Filter by tab
    if (activeTab === "new" && report.status !== "new") return false
    if (activeTab === "inProgress" && report.status !== "inProgress") return false
    if (activeTab === "resolved" && report.status !== "resolved") return false

    // Filter by search query
    if (
      searchQuery &&
      !report.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !report.problemCategory.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !report.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by category
    if (filters.category !== "all" && report.problemCategory !== filters.category) {
      return false
    }

    // Filter by risk level
    if (filters.riskLevel !== "all" && report.riskLevel !== filters.riskLevel) {
      return false
    }

    // Filter by region
    if (filters.region !== "all" && report.location.region !== filters.region) {
      return false
    }

    // Filter by time frame
    if (filters.timeFrame !== "all") {
      const now = new Date()
      const reportDate = new Date(report.reportTime)

      if (filters.timeFrame === "today") {
        return reportDate.toDateString() === now.toDateString()
      } else if (filters.timeFrame === "week") {
        const weekAgo = new Date(now)
        weekAgo.setDate(now.getDate() - 7)
        return reportDate >= weekAgo
      } else if (filters.timeFrame === "month") {
        const monthAgo = new Date(now)
        monthAgo.setMonth(now.getMonth() - 1)
        return reportDate >= monthAgo
      }
    }

    return true
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Reports & Cases</CardTitle>
              <CardDescription>View and manage reports in your expertise areas</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Gender-Based Violence">Gender-Based Violence</SelectItem>
                    <SelectItem value="Depression">Depression</SelectItem>
                    <SelectItem value="Anxiety">Anxiety</SelectItem>
                    <SelectItem value="Family Conflict">Family Conflict</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.riskLevel}
                  onValueChange={(value) => setFilters({ ...filters, riskLevel: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="all">All Reports</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No reports found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters or search query</p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className={`border rounded-lg overflow-hidden ${
                      selectedReport === report.id
                        ? "border-[#6C63FF] ring-1 ring-[#6C63FF]"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                    >
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
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">{report.userName}</h4>
                              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                <span className="flex items-center">
                                  <Clock size={12} className="mr-1" />
                                  {formatDate(report.reportTime)} at {formatTime(report.reportTime)}
                                </span>
                                {report.location && (
                                  <span className="flex items-center ml-2">
                                    <MapPin size={12} className="mr-1" />
                                    {report.location.town}, {report.location.region}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex mt-2 sm:mt-0 space-x-2">
                              <Badge variant="outline" className={getStatusColor(report.status)}>
                                {report.status === "inProgress"
                                  ? "In Progress"
                                  : report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                              <Badge variant="outline" className={getRiskLevelColor(report.riskLevel)}>
                                {report.riskLevel.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Badge variant="secondary" className="mb-2">
                              {report.problemCategory}
                            </Badge>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{report.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedReport === report.id && (
                      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <User size={14} className="mr-1" />
                              <span>
                                {report.age} years old, {report.gender}
                              </span>
                            </div>
                            {report.assignedTo && (
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span>Assigned to: {report.assignedTo}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contact User
                            </Button>
                            {report.status === "new" ? (
                              <Button size="sm" variant="outline">
                                Take Case
                              </Button>
                            ) : report.status === "inProgress" ? (
                              <Button size="sm" variant="outline">
                                Mark Resolved
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                Resolved
                              </Button>
                            )}
                          </div>
                        </div>

                        {report.riskLevel === "high" && (
                          <div className="mt-4 flex items-start p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                High Risk Case - Immediate Attention Required
                              </p>
                              <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                                This case has been flagged as high risk. Please prioritize and take appropriate action
                                as soon as possible.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
