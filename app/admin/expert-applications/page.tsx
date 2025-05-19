"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  FileText,
  Calendar,
  MapPin,
  User,
  Building,
  Award,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

// Sample data for expert applications
const sampleApplications = [
  {
    id: "app1",
    name: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    phone: "+264 81 123 4567",
    expertType: "Psychologist",
    institution: "University of Namibia",
    position: "Clinical Psychologist",
    yearsOfExperience: "6-10",
    region: "Khomas",
    town: "Windhoek",
    licenseNumber: "PSY-2025-1234",
    specializations: ["trauma", "anxiety", "depression"],
    languages: ["english", "afrikaans", "oshiwambo"],
    status: "pending",
    submittedAt: "2025-05-10T14:30:00",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "app2",
    name: "Sarah Nangolo",
    email: "sarah.nangolo@example.com",
    phone: "+264 81 234 5678",
    expertType: "Counselor",
    institution: "Ministry of Health and Social Services",
    position: "Senior Counselor",
    yearsOfExperience: "11-15",
    region: "Erongo",
    town: "Swakopmund",
    licenseNumber: "COUN-2025-5678",
    specializations: ["grief", "relationships", "youth"],
    languages: ["english", "oshiwambo", "afrikaans"],
    status: "pending",
    submittedAt: "2025-05-09T10:15:00",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "app3",
    name: "John Muller",
    email: "john.muller@example.com",
    phone: "+264 81 345 6789",
    expertType: "Social Worker",
    institution: "Namibian Red Cross Society",
    position: "Social Worker",
    yearsOfExperience: "3-5",
    region: "Oshana",
    town: "Oshakati",
    licenseNumber: "SW-2025-9012",
    specializations: ["addiction", "family", "stress"],
    languages: ["english", "afrikaans", "german"],
    status: "approved",
    submittedAt: "2025-05-05T09:45:00",
    approvedAt: "2025-05-07T11:20:00",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "app4",
    name: "Maria Shikongo",
    email: "maria.shikongo@example.com",
    phone: "+264 81 456 7890",
    expertType: "Therapist",
    institution: "Private Practice",
    position: "Family Therapist",
    yearsOfExperience: "16+",
    region: "Kavango East",
    town: "Rundu",
    licenseNumber: "THER-2025-3456",
    specializations: ["family", "relationships", "youth"],
    languages: ["english", "rukwangali", "portuguese"],
    status: "rejected",
    submittedAt: "2025-05-03T16:20:00",
    rejectedAt: "2025-05-06T14:10:00",
    rejectionReason: "Incomplete documentation. License verification failed.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function ExpertApplicationsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  // Filter applications based on search query, status, and tab
  const filteredApplications = sampleApplications.filter((app) => {
    // Filter by search query
    if (
      searchQuery &&
      !app.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.institution.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by status
    if (selectedStatus && app.status !== selectedStatus) {
      return false
    }

    // Filter by tab
    if (activeTab === "pending" && app.status !== "pending") return false
    if (activeTab === "approved" && app.status !== "approved") return false
    if (activeTab === "rejected" && app.status !== "rejected") return false

    return true
  })

  const handleApproveApplication = () => {
    // In a real app, this would send data to your API
    console.log("Approving application:", selectedApplication?.id)
    setShowApproveDialog(false)
  }

  const handleRejectApplication = () => {
    // In a real app, this would send data to your API
    console.log("Rejecting application:", selectedApplication?.id, "Reason:", rejectionReason)
    setShowRejectDialog(false)
    setRejectionReason("")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Expert Applications</CardTitle>
                <CardDescription>Review and manage expert applications</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {}}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Applications</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedStatus || ""} onValueChange={(value) => setSelectedStatus(value || null)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Applicant</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Profession</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Institution
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Submitted</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {filteredApplications.map((app) => (
                      <tr
                        key={app.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={app.avatar || "/placeholder.svg"} alt={app.name} />
                              <AvatarFallback>{app.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{app.name}</div>
                              <div className="text-xs text-gray-500">{app.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">{app.expertType}</td>
                        <td className="p-4 align-middle">{app.institution}</td>
                        <td className="p-4 align-middle">
                          {app.town}, {app.region}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant="outline"
                            className={
                              app.status === "approved"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : app.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : "bg-red-100 text-red-800 border-red-300"
                            }
                          >
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">{formatDate(app.submittedAt)}</td>
                        <td className="p-4 align-middle">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedApplication(app)
                                  setShowViewDialog(true)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {app.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedApplication(app)
                                      setShowApproveDialog(true)
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedApplication(app)
                                      setShowRejectDialog(true)
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download Documents
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Application Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>Review the expert application information</DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="grid gap-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedApplication.avatar || "/placeholder.svg"}
                      alt={selectedApplication.name}
                    />
                    <AvatarFallback>{selectedApplication.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedApplication.name}</h3>
                    <p className="text-sm text-gray-500">{selectedApplication.expertType}</p>
                    <div className="flex items-center mt-1">
                      <Badge
                        variant="outline"
                        className={
                          selectedApplication.status === "approved"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : selectedApplication.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-red-100 text-red-800 border-red-300"
                        }
                      >
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-2">
                        Submitted: {formatDate(selectedApplication.submittedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-start">
                          <User className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{selectedApplication.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <svg
                            className="h-4 w-4 text-gray-500 mt-0.5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                          <div>
                            <p className="text-sm">{selectedApplication.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <svg
                            className="h-4 w-4 text-gray-500 mt-0.5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            ></path>
                          </svg>
                          <div>
                            <p className="text-sm">{selectedApplication.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Professional Information</h4>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-start">
                          <Award className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{selectedApplication.expertType}</p>
                            <p className="text-xs text-gray-500">Professional Type</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Building className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{selectedApplication.institution}</p>
                            <p className="text-xs text-gray-500">Institution/Organization</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{selectedApplication.position}</p>
                            <p className="text-xs text-gray-500">Position/Title</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{selectedApplication.yearsOfExperience} years</p>
                            <p className="text-xs text-gray-500">Experience</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{selectedApplication.licenseNumber}</p>
                            <p className="text-xs text-gray-500">License/Registration Number</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Location</h4>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium">
                              {selectedApplication.town}, {selectedApplication.region}
                            </p>
                            <p className="text-xs text-gray-500">Town/City, Region</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Specializations</h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedApplication.specializations.map((spec: string) => (
                          <Badge key={spec} variant="secondary" className="capitalize">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Languages</h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedApplication.languages.map((lang: string) => (
                          <Badge key={lang} variant="outline" className="capitalize">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Documents</h4>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">License Certificate</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">CV/Resume</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedApplication.status === "rejected" && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <h4 className="text-sm font-medium text-red-800">Rejection Reason</h4>
                    <p className="text-sm text-red-700 mt-1">{selectedApplication.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
              {selectedApplication?.status === "pending" && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowViewDialog(false)
                      setShowRejectDialog(true)
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setShowViewDialog(false)
                      setShowApproveDialog(true)
                    }}
                  >
                    Approve
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approve Application Dialog */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Approve Application</DialogTitle>
              <DialogDescription>Are you sure you want to approve this expert application?</DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="py-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedApplication.avatar || "/placeholder.svg"}
                      alt={selectedApplication.name}
                    />
                    <AvatarFallback>{selectedApplication.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedApplication.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedApplication.expertType} at {selectedApplication.institution}
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
                  <p>
                    Approving this application will create an expert account for this user and send them an email with
                    instructions to set up their profile.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleApproveApplication}>Approve Application</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Application Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reject Application</DialogTitle>
              <DialogDescription>Please provide a reason for rejecting this expert application.</DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="py-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedApplication.avatar || "/placeholder.svg"}
                      alt={selectedApplication.name}
                    />
                    <AvatarFallback>{selectedApplication.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedApplication.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedApplication.expertType} at {selectedApplication.institution}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Rejection Reason</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please explain why this application is being rejected..."
                    className="min-h-[100px]"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    This reason will be included in the email sent to the applicant.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectApplication} disabled={!rejectionReason.trim()}>
                Reject Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
