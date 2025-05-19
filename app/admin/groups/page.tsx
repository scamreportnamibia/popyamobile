"use client"

import type React from "react"

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
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  Users,
  Calendar,
  Clock,
  Lock,
  Unlock,
  MessageSquare,
  BarChart,
  Upload,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

// Sample data for groups
const sampleGroups = [
  {
    id: "group1",
    name: "Anxiety Support Group",
    description: "A safe space for people dealing with anxiety to share experiences and coping strategies.",
    category: "Anxiety & Stress",
    members: 24,
    createdAt: "2025-03-15T10:00:00",
    lastActive: "2025-05-17T14:30:00",
    meetingFrequency: "Weekly",
    nextMeeting: "2025-05-24T18:00:00",
    isPasswordProtected: false,
    status: "active",
    expert: {
      id: "e1",
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "group2",
    name: "Teen Depression Support",
    description: "Support group specifically for teenagers dealing with depression and related issues.",
    category: "Depression",
    members: 18,
    createdAt: "2025-04-02T09:15:00",
    lastActive: "2025-05-16T16:45:00",
    meetingFrequency: "Bi-weekly",
    nextMeeting: "2025-05-30T17:30:00",
    isPasswordProtected: true,
    status: "active",
    expert: {
      id: "e2",
      name: "Dr. Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "group3",
    name: "Grief & Loss",
    description: "For those who have experienced loss and are going through the grieving process.",
    category: "Grief & Loss",
    members: 15,
    createdAt: "2025-02-10T11:30:00",
    lastActive: "2025-05-15T19:20:00",
    meetingFrequency: "Monthly",
    nextMeeting: "2025-06-10T19:00:00",
    isPasswordProtected: false,
    status: "active",
    expert: {
      id: "e3",
      name: "Dr. Olivia Patel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "group4",
    name: "LGBTQ+ Mental Health",
    description: "A supportive community for LGBTQ+ individuals to discuss mental health challenges.",
    category: "LGBTQ+ Support",
    members: 22,
    createdAt: "2025-01-20T14:00:00",
    lastActive: "2025-05-14T18:15:00",
    meetingFrequency: "Weekly",
    nextMeeting: "2025-05-21T18:00:00",
    isPasswordProtected: true,
    status: "inactive",
    expert: {
      id: "e4",
      name: "Dr. James Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function GroupsManagementPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedGroup, setSelectedGroup] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)

  // New group form state
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    category: "",
    meetingFrequency: "weekly",
    isPasswordProtected: false,
    password: "",
    expert: "",
    image: null,
    imagePreview: "",
  })

  // Filter groups based on search query, category, status, and tab
  const filteredGroups = sampleGroups.filter((group) => {
    // Filter by search query
    if (
      searchQuery &&
      !group.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !group.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !group.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by category
    if (selectedCategory && group.category !== selectedCategory) {
      return false
    }

    // Filter by status
    if (selectedStatus && group.status !== selectedStatus) {
      return false
    }

    // Filter by tab
    if (activeTab === "active" && group.status !== "active") return false
    if (activeTab === "inactive" && group.status !== "inactive") return false

    return true
  })

  const handleCreateGroup = () => {
    // In a real app, this would send data to your API
    console.log("Creating group:", newGroup)
    setShowCreateDialog(false)
    // Reset form
    setNewGroup({
      name: "",
      description: "",
      category: "",
      meetingFrequency: "weekly",
      isPasswordProtected: false,
      password: "",
      expert: "",
      image: null,
      imagePreview: "",
    })
  }

  const handleEditGroup = () => {
    // In a real app, this would send data to your API
    console.log("Editing group:", selectedGroup)
    setShowEditDialog(false)
  }

  const handleDeleteGroup = () => {
    // In a real app, this would send data to your API
    console.log("Deleting group:", selectedGroup)
    setShowDeleteDialog(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imagePreview = event.target?.result as string
      setNewGroup({ ...newGroup, image: file, imagePreview: imagePreview })
    }
    reader.readAsDataURL(file)
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

  // Extract unique categories for filter
  const categories = Array.from(new Set(sampleGroups.map((group) => group.category)))

  return (
    <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Support Groups</CardTitle>
                <CardDescription>Manage support groups in the system</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Groups</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search groups..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus || "all"}
                  onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <Image src={group.image || "/placeholder.svg"} alt={group.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-white font-medium">{group.name}</h3>
                      <div className="flex items-center text-white/80 text-sm">
                        <Users size={14} className="mr-1" />
                        <span>{group.members} members</span>
                        {group.isPasswordProtected && (
                          <>
                            <span className="mx-1">•</span>
                            <Lock size={14} className="mr-1" />
                            <span>Protected</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`absolute top-2 right-2 ${
                        group.status === "active"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-gray-100 text-gray-800 border-gray-300"
                      }`}
                    >
                      {group.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                        {group.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{group.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <Calendar size={12} className="mr-1" />
                      <span>Next meeting: {formatDate(group.nextMeeting)}</span>
                    </div>
                    <div className="flex items-center mb-3">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={group.expert.avatar || "/placeholder.svg"} alt={group.expert.name} />
                        <AvatarFallback>{group.expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">Led by {group.expert.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedGroup(group)
                          setShowViewDialog(true)
                        }}
                      >
                        View Details
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedGroup(group)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View Discussions
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Manage Members
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart className="h-4 w-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedGroup(group)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Group Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Support Group</DialogTitle>
              <DialogDescription>Create a new support group for users to join and share experiences.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="Enter group name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-description">Description</Label>
                  <Textarea
                    id="group-description"
                    placeholder="Describe the purpose of this group"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="group-category">Category</Label>
                  <Select
                    value={newGroup.category}
                    onValueChange={(value) => setNewGroup({ ...newGroup, category: value })}
                  >
                    <SelectTrigger id="group-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Anxiety & Stress">Anxiety & Stress</SelectItem>
                      <SelectItem value="Depression">Depression</SelectItem>
                      <SelectItem value="Trauma & PTSD">Trauma & PTSD</SelectItem>
                      <SelectItem value="Grief & Loss">Grief & Loss</SelectItem>
                      <SelectItem value="Addiction">Addiction</SelectItem>
                      <SelectItem value="LGBTQ+ Support">LGBTQ+ Support</SelectItem>
                      <SelectItem value="Youth & Teens">Youth & Teens</SelectItem>
                      <SelectItem value="Relationships">Relationships</SelectItem>
                      <SelectItem value="General Mental Health">General Mental Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-frequency">Meeting Frequency</Label>
                  <Select
                    value={newGroup.meetingFrequency}
                    onValueChange={(value) => setNewGroup({ ...newGroup, meetingFrequency: value })}
                  >
                    <SelectTrigger id="meeting-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-expert">Assign Expert</Label>
                <Select value={newGroup.expert} onValueChange={(value) => setNewGroup({ ...newGroup, expert: value })}>
                  <SelectTrigger id="group-expert">
                    <SelectValue placeholder="Select expert" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="e1">Dr. Sarah Johnson</SelectItem>
                    <SelectItem value="e2">Dr. Michael Chen</SelectItem>
                    <SelectItem value="e3">Dr. Olivia Patel</SelectItem>
                    <SelectItem value="e4">Dr. James Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-image">Group Image</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4">
                  <div className="flex items-center justify-center">
                    <label
                      htmlFor="group-image"
                      className="flex flex-col items-center justify-center w-full cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG, GIF up to 2MB</span>
                      <Input
                        id="group-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  {newGroup.imagePreview && (
                    <div className="mt-4 relative">
                      <div className="relative w-full h-40 rounded-md overflow-hidden">
                        <Image
                          src={newGroup.imagePreview || "/placeholder.svg"}
                          alt="Group image preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setNewGroup({ ...newGroup, image: null, imagePreview: "" })}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="password-protection"
                  checked={newGroup.isPasswordProtected}
                  onCheckedChange={(checked) => setNewGroup({ ...newGroup, isPasswordProtected: checked })}
                />
                <Label htmlFor="password-protection">Password Protection</Label>
              </div>
              {newGroup.isPasswordProtected && (
                <div className="space-y-2">
                  <Label htmlFor="group-password">Group Password</Label>
                  <Input
                    id="group-password"
                    type="password"
                    placeholder="Enter password"
                    value={newGroup.password}
                    onChange={(e) => setNewGroup({ ...newGroup, password: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">This password will be required for users to join the group.</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Group Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Group Details</DialogTitle>
              <DialogDescription>View detailed information about this support group</DialogDescription>
            </DialogHeader>
            {selectedGroup && (
              <div className="grid gap-6 py-4">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={selectedGroup.image || "/placeholder.svg"}
                    alt={selectedGroup.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h2 className="text-xl font-semibold text-white">{selectedGroup.name}</h2>
                    <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-800 border-blue-200">
                      {selectedGroup.category}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className={`absolute top-4 right-4 ${
                      selectedGroup.status === "active"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-gray-100 text-gray-800 border-gray-300"
                    }`}
                  >
                    {selectedGroup.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">About</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedGroup.description}</p>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">Group Leader</h4>
                      <div className="flex items-center mt-2">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={selectedGroup.expert.avatar || "/placeholder.svg"}
                            alt={selectedGroup.expert.name}
                          />
                          <AvatarFallback>{selectedGroup.expert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{selectedGroup.expert.name}</p>
                          <p className="text-xs text-gray-500">Expert</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium">{selectedGroup.members} Members</p>
                          <p className="text-xs text-gray-500">Active participants</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium">{selectedGroup.meetingFrequency} Meetings</p>
                          <p className="text-xs text-gray-500">Regular schedule</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Next Meeting: {formatDate(selectedGroup.nextMeeting)}</p>
                          <p className="text-xs text-gray-500">Upcoming session</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        {selectedGroup.isPasswordProtected ? (
                          <Lock className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        ) : (
                          <Unlock className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {selectedGroup.isPasswordProtected ? "Password Protected" : "Open Access"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedGroup.isPasswordProtected
                              ? "Requires password to join"
                              : "Anyone can join this group"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Created: {formatDate(selectedGroup.createdAt)}</p>
                          <p className="text-xs text-gray-500">Group creation date</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Last Activity: {formatDate(selectedGroup.lastActive)}</p>
                          <p className="text-xs text-gray-500">Recent engagement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowViewDialog(false)
                  setShowEditDialog(true)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Group Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Support Group</DialogTitle>
              <DialogDescription>Update the information for this support group.</DialogDescription>
            </DialogHeader>
            {selectedGroup && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-group-name">Group Name</Label>
                    <Input id="edit-group-name" defaultValue={selectedGroup.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-group-description">Description</Label>
                    <Textarea
                      id="edit-group-description"
                      defaultValue={selectedGroup.description}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-group-category">Category</Label>
                    <Select defaultValue={selectedGroup.category}>
                      <SelectTrigger id="edit-group-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Anxiety & Stress">Anxiety & Stress</SelectItem>
                        <SelectItem value="Depression">Depression</SelectItem>
                        <SelectItem value="Trauma & PTSD">Trauma & PTSD</SelectItem>
                        <SelectItem value="Grief & Loss">Grief & Loss</SelectItem>
                        <SelectItem value="Addiction">Addiction</SelectItem>
                        <SelectItem value="LGBTQ+ Support">LGBTQ+ Support</SelectItem>
                        <SelectItem value="Youth & Teens">Youth & Teens</SelectItem>
                        <SelectItem value="Relationships">Relationships</SelectItem>
                        <SelectItem value="General Mental Health">General Mental Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-meeting-frequency">Meeting Frequency</Label>
                    <Select defaultValue={selectedGroup.meetingFrequency.toLowerCase()}>
                      <SelectTrigger id="edit-meeting-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-group-expert">Assign Expert</Label>
                  <Select defaultValue={selectedGroup.expert.id}>
                    <SelectTrigger id="edit-group-expert">
                      <SelectValue placeholder="Select expert" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="e1">Dr. Sarah Johnson</SelectItem>
                      <SelectItem value="e2">Dr. Michael Chen</SelectItem>
                      <SelectItem value="e3">Dr. Olivia Patel</SelectItem>
                      <SelectItem value="e4">Dr. James Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-group-status">Status</Label>
                  <Select defaultValue={selectedGroup.status}>
                    <SelectTrigger id="edit-group-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="edit-password-protection" checked={selectedGroup.isPasswordProtected} />
                  <Label htmlFor="edit-password-protection">Password Protection</Label>
                </div>
                {selectedGroup.isPasswordProtected && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-group-password">Group Password</Label>
                    <Input
                      id="edit-group-password"
                      type="password"
                      placeholder="Enter new password (leave blank to keep current)"
                    />
                    <p className="text-xs text-gray-500">Leave blank to keep the current password.</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditGroup}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Group Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this group? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedGroup && (
              <div className="py-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden">
                    <Image
                      src={selectedGroup.image || "/placeholder.svg"}
                      alt={selectedGroup.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{selectedGroup.name}</p>
                    <p className="text-sm text-gray-500">{selectedGroup.members} members</p>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                  <p>
                    Deleting this group will remove all associated data, including discussions, polls, and member
                    information. Members will be notified that the group has been deleted.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteGroup}>
                Delete Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
