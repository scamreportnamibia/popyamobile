"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Edit,
  FileText,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Trash2,
  Upload,
  User,
  Users,
} from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

// Sample data
const sampleGroups = [
  {
    id: "group1",
    name: "Anxiety Support Group",
    description: "A safe space for people dealing with anxiety to share experiences and coping strategies.",
    members: 24,
    createdAt: new Date("2025-03-15"),
    lastActive: new Date("2025-05-17"),
    meetingFrequency: "Weekly",
    nextMeeting: new Date("2025-05-24T18:00:00"),
    isPasswordProtected: false,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "group2",
    name: "Teen Depression Support",
    description: "Support group specifically for teenagers dealing with depression and related issues.",
    members: 18,
    createdAt: new Date("2025-04-02"),
    lastActive: new Date("2025-05-16"),
    meetingFrequency: "Bi-weekly",
    nextMeeting: new Date("2025-05-30T17:30:00"),
    isPasswordProtected: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "group3",
    name: "Grief & Loss",
    description: "For those who have experienced loss and are going through the grieving process.",
    members: 15,
    createdAt: new Date("2025-02-10"),
    lastActive: new Date("2025-05-15"),
    meetingFrequency: "Monthly",
    nextMeeting: new Date("2025-06-10T19:00:00"),
    isPasswordProtected: false,
    image: "/placeholder.svg?height=200&width=200",
  },
]

// Sample group members
const sampleMembers = [
  {
    id: "user1",
    name: "Jane Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: new Date("2025-03-20"),
    lastActive: new Date("2025-05-17"),
    role: "member",
  },
  {
    id: "user2",
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: new Date("2025-03-22"),
    lastActive: new Date("2025-05-16"),
    role: "member",
  },
  {
    id: "user3",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: new Date("2025-04-05"),
    lastActive: new Date("2025-05-15"),
    role: "moderator",
  },
  {
    id: "user4",
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: new Date("2025-04-10"),
    lastActive: new Date("2025-05-12"),
    role: "member",
  },
  {
    id: "user5",
    name: "Emily Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: new Date("2025-04-15"),
    lastActive: new Date("2025-05-10"),
    role: "member",
  },
]

export function ExpertGroupManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showMembersDialog, setShowMembersDialog] = useState(false)
  const [showPollDialog, setShowPollDialog] = useState(false)

  // New group form state
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    meetingFrequency: "Weekly",
    isPasswordProtected: false,
    password: "",
  })

  // New poll form state
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", ""],
    expiresIn: "7",
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

  // Filter groups based on search query
  const filteredGroups = sampleGroups.filter((group) => {
    if (
      searchQuery &&
      !group.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !group.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
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
      meetingFrequency: "Weekly",
      isPasswordProtected: false,
      password: "",
    })
  }

  const handleCreatePoll = () => {
    // In a real app, this would send data to your API
    console.log("Creating poll:", newPoll)
    setShowPollDialog(false)
    // Reset form
    setNewPoll({
      question: "",
      options: ["", ""],
      expiresIn: "7",
    })
  }

  const addPollOption = () => {
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, ""],
    })
  }

  const updatePollOption = (index: number, value: string) => {
    const updatedOptions = [...newPoll.options]
    updatedOptions[index] = value
    setNewPoll({
      ...newPoll,
      options: updatedOptions,
    })
  }

  const removePollOption = (index: number) => {
    if (newPoll.options.length <= 2) return
    const updatedOptions = [...newPoll.options]
    updatedOptions.splice(index, 1)
    setNewPoll({
      ...newPoll,
      options: updatedOptions,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Support Groups</CardTitle>
              <CardDescription>Create and manage support groups for your patients</CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search groups..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Groups List */}
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
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{group.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <Calendar size={12} className="mr-1" />
                      <span>
                        Next meeting: {formatDate(group.nextMeeting)} at {formatTime(group.nextMeeting)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <Button size="sm" variant="outline" onClick={() => setSelectedGroup(group.id)}>
                        Manage
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setShowMembersDialog(true)}>
                            <Users className="h-4 w-4 mr-2" />
                            View Members
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Group Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setShowPollDialog(true)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Create Poll
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Group
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Group Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Support Group</DialogTitle>
            <DialogDescription>
              Create a new support group for your patients to join and share experiences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
            <div className="space-y-2">
              <Label htmlFor="meeting-frequency">Meeting Frequency</Label>
              <select
                id="meeting-frequency"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                value={newGroup.meetingFrequency}
                onChange={(e) => setNewGroup({ ...newGroup, meetingFrequency: e.target.value })}
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-image">Group Image</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 2MB</p>
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
                <p className="text-xs text-gray-500">
                  This password will be required for underage users to join the group.
                </p>
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

      {/* View Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Group Members</DialogTitle>
            <DialogDescription>Manage members of the support group.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search members..." className="pl-9" />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {sampleMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 relative">
                      <Image
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{member.name}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>Joined {formatDate(member.joinedAt)}</span>
                        <span className="mx-1">•</span>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove from Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMembersDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Poll Dialog */}
      <Dialog open={showPollDialog} onOpenChange={setShowPollDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Poll</DialogTitle>
            <DialogDescription>Create a poll for group members to vote on.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="poll-question">Question</Label>
              <Input
                id="poll-question"
                placeholder="Enter your question"
                value={newPoll.question}
                onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Options</Label>
              {newPoll.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                  />
                  {newPoll.options.length > 2 && (
                    <Button size="sm" variant="ghost" onClick={() => removePollOption(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addPollOption} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="poll-expires">Poll Expires In</Label>
              <select
                id="poll-expires"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                value={newPoll.expiresIn}
                onChange={(e) => setNewPoll({ ...newPoll, expiresIn: e.target.value })}
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">1 week</option>
                <option value="14">2 weeks</option>
                <option value="30">1 month</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPollDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePoll}>Create Poll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
