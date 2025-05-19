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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, MoreHorizontal, Trash, BarChart, Calendar, Users, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

// Sample data for polls
const samplePolls = [
  {
    id: "poll1",
    question: "What topics would you like to discuss in our next session?",
    options: [
      { id: "opt1", text: "Coping with anxiety", votes: 12 },
      { id: "opt2", text: "Stress management techniques", votes: 8 },
      { id: "opt3", text: "Mindfulness practices", votes: 15 },
      { id: "opt4", text: "Sleep improvement", votes: 7 },
    ],
    group: {
      id: "group1",
      name: "Anxiety Support Group",
    },
    createdBy: {
      id: "e1",
      name: "Dr. Sarah Johnson",
    },
    createdAt: "2025-05-15T10:30:00",
    expiresAt: "2025-05-22T10:30:00",
    status: "active",
    totalVotes: 42,
  },
  {
    id: "poll2",
    question: "Which day works best for our weekly group meetings?",
    options: [
      { id: "opt1", text: "Monday evenings", votes: 5 },
      { id: "opt2", text: "Wednesday evenings", votes: 10 },
      { id: "opt3", text: "Saturday mornings", votes: 8 },
    ],
    group: {
      id: "group2",
      name: "Teen Depression Support",
    },
    createdBy: {
      id: "e2",
      name: "Dr. Michael Chen",
    },
    createdAt: "2025-05-10T14:15:00",
    expiresAt: "2025-05-17T14:15:00",
    status: "expired",
    totalVotes: 23,
  },
  {
    id: "poll3",
    question: "What resources would be most helpful for you right now?",
    options: [
      { id: "opt1", text: "Reading materials", votes: 6 },
      { id: "opt2", text: "Video tutorials", votes: 14 },
      { id: "opt3", text: "One-on-one sessions", votes: 9 },
      { id: "opt4", text: "Group exercises", votes: 11 },
    ],
    group: {
      id: "group3",
      name: "Grief & Loss",
    },
    createdBy: {
      id: "e3",
      name: "Dr. Olivia Patel",
    },
    createdAt: "2025-05-12T09:45:00",
    expiresAt: "2025-05-26T09:45:00",
    status: "active",
    totalVotes: 40,
  },
]

export default function PollsManagementPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [viewPoll, setViewPoll] = useState<any>(null)
  const [deletePoll, setDeletePoll] = useState<any>(null)

  // New poll form state
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", ""],
    group: "",
    expiresIn: "7",
  })

  // Filter polls based on search query, group, status, and tab
  const filteredPolls = samplePolls.filter((poll) => {
    // Filter by search query
    if (
      searchQuery &&
      !poll.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !poll.group.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by group
    if (selectedGroup && poll.group.id !== selectedGroup) {
      return false
    }

    // Filter by status
    if (selectedStatus && poll.status !== selectedStatus) {
      return false
    }

    // Filter by tab
    if (activeTab === "active" && poll.status !== "active") return false
    if (activeTab === "expired" && poll.status !== "expired") return false

    return true
  })

  const handleCreatePoll = () => {
    // In a real app, this would send data to your API
    console.log("Creating poll:", newPoll)
    setShowCreateDialog(false)
    // Reset form
    setNewPoll({
      question: "",
      options: ["", ""],
      group: "",
      expiresIn: "7",
    })
  }

  const handleDeletePoll = () => {
    // In a real app, this would send data to your API
    console.log("Deleting poll:", deletePoll)
    setShowDeleteDialog(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateTimeLeft = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffMs = expiry.getTime() - now.getTime()

    if (diffMs <= 0) return "Expired"

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h left`
    } else {
      return `${diffHours}h left`
    }
  }

  // Extract unique groups for filter
  const groups = Array.from(new Set(samplePolls.map((poll) => poll.group)))

  return (
    <ProtectedRoute allowedRoles={["super_admin", "admin", "expert"]}>
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Polls Management</CardTitle>
                <CardDescription>Create and manage polls for support groups</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Poll
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Polls</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search polls..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedGroup || "all"} onValueChange={(value) => setSelectedGroup(value || null)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus || "all"} onValueChange={(value) => setSelectedStatus(value || null)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
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
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Question</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Group</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created By</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Votes</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Expires</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {filteredPolls.map((poll) => (
                      <tr
                        key={poll.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="font-medium line-clamp-1">{poll.question}</div>
                          <div className="text-xs text-gray-500 mt-1">{poll.options.length} options</div>
                        </td>
                        <td className="p-4 align-middle">{poll.group.name}</td>
                        <td className="p-4 align-middle">{poll.createdBy.name}</td>
                        <td className="p-4 align-middle">{poll.totalVotes}</td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant="outline"
                            className={
                              poll.status === "active"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-gray-100 text-gray-800 border-gray-300"
                            }
                          >
                            {poll.status === "active" ? "Active" : "Expired"}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="text-sm">{formatDate(poll.expiresAt)}</div>
                          {poll.status === "active" && (
                            <div className="text-xs text-gray-500 mt-1">{calculateTimeLeft(poll.expiresAt)}</div>
                          )}
                        </td>
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
                                  setViewPoll(poll)
                                  setShowViewDialog(true)
                                }}
                              >
                                <BarChart className="h-4 w-4 mr-2" />
                                View Results
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setDeletePoll(poll)
                                  setShowDeleteDialog(true)
                                }}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
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

        {/* Create Poll Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Poll</DialogTitle>
              <DialogDescription>Create a poll for group members to vote on.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                        <X className="h-4 w-4" />
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
                <Label htmlFor="poll-group">Group</Label>
                <Select value={newPoll.group} onValueChange={(value) => setNewPoll({ ...newPoll, group: value || "" })}>
                  <SelectTrigger id="poll-group">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="poll-expires">Poll Expires In</Label>
                <Select
                  value={newPoll.expiresIn}
                  onValueChange={(value) => setNewPoll({ ...newPoll, expiresIn: value })}
                >
                  <SelectTrigger id="poll-expires">
                    <SelectValue placeholder="Select expiry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="14">2 weeks</SelectItem>
                    <SelectItem value="30">1 month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePoll}>Create Poll</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Poll Results Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Poll Results</DialogTitle>
              <DialogDescription>View the current results for this poll.</DialogDescription>
            </DialogHeader>
            {viewPoll && (
              <div className="grid gap-4 py-4">
                <div>
                  <h3 className="text-lg font-medium">{viewPoll.question}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{viewPoll.totalVotes} votes</span>
                    <span className="mx-1">•</span>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Created {formatDate(viewPoll.createdAt)}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Badge
                      variant="outline"
                      className={
                        viewPoll.status === "active"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-gray-100 text-gray-800 border-gray-300"
                      }
                    >
                      {viewPoll.status === "active" ? "Active" : "Expired"}
                    </Badge>
                    {viewPoll.status === "active" && (
                      <span className="text-xs text-gray-500 ml-2">
                        Expires: {formatDate(viewPoll.expiresAt)} ({calculateTimeLeft(viewPoll.expiresAt)})
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mt-2">
                  {viewPoll.options.map((option: any) => {
                    const percentage =
                      viewPoll.totalVotes > 0 ? Math.round((option.votes / viewPoll.totalVotes) * 100) : 0
                    return (
                      <div key={option.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{option.text}</span>
                          <span className="font-medium">
                            {percentage}% ({option.votes})
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 mt-2">
                  <div className="flex items-center">
                    <div className="text-sm font-medium">Group:</div>
                    <div className="text-sm ml-2">{viewPoll.group.name}</div>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="text-sm font-medium">Created by:</div>
                    <div className="text-sm ml-2">{viewPoll.createdBy.name}</div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Poll Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this poll? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {deletePoll && (
              <div className="py-4">
                <div className="mb-4">
                  <p className="font-medium">{deletePoll.question}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {deletePoll.totalVotes} votes • {deletePoll.group.name}
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                  <p>
                    Deleting this poll will remove all associated data, including all votes and results. Members will no
                    longer be able to see or vote on this poll.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePoll}>
                Delete Poll
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
