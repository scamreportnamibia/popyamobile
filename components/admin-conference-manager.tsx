"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, Users, Video, Search, Plus, Edit, Trash2, CheckCircle, XCircle, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// Types
type ConferenceStatus = "scheduled" | "live" | "completed" | "cancelled"

type Conference = {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: string
  maxAttendees: number
  currentAttendees: number
  host: {
    id: string
    name: string
    role: string
  }
  status: ConferenceStatus
  joinLink: string
}

// Sample data
const sampleConferences: Conference[] = [
  {
    id: "conf-1",
    title: "Mental Health Awareness in the Workplace",
    description: "Discussion on promoting mental health awareness and support systems in workplace environments.",
    date: "2025-06-15",
    time: "14:00",
    duration: "60",
    maxAttendees: 50,
    currentAttendees: 32,
    host: {
      id: "expert-1",
      name: "Dr. Maria Ndapewa",
      role: "Clinical Psychologist",
    },
    status: "scheduled",
    joinLink: "https://meet.example.com/conf-1",
  },
  {
    id: "conf-2",
    title: "Coping with Anxiety: Expert Panel",
    description: "A panel of mental health experts discussing strategies for managing anxiety disorders.",
    date: "2025-06-10",
    time: "18:30",
    duration: "90",
    maxAttendees: 100,
    currentAttendees: 78,
    host: {
      id: "expert-2",
      name: "Dr. James Hamukwaya",
      role: "Psychiatrist",
    },
    status: "scheduled",
    joinLink: "https://meet.example.com/conf-2",
  },
  {
    id: "conf-3",
    title: "Depression Support Group Session",
    description: "A guided support group session for individuals experiencing depression.",
    date: "2025-06-05",
    time: "19:00",
    duration: "120",
    maxAttendees: 30,
    currentAttendees: 30,
    host: {
      id: "expert-3",
      name: "Emma Nangolo",
      role: "Counselor",
    },
    status: "live",
    joinLink: "https://meet.example.com/conf-3",
  },
  {
    id: "conf-4",
    title: "Mindfulness Techniques for Stress Reduction",
    description: "Learn practical mindfulness techniques to reduce stress and improve mental wellbeing.",
    date: "2025-05-28",
    time: "16:00",
    duration: "60",
    maxAttendees: 75,
    currentAttendees: 62,
    host: {
      id: "expert-4",
      name: "Thomas Shilongo",
      role: "Mindfulness Coach",
    },
    status: "completed",
    joinLink: "https://meet.example.com/conf-4",
  },
  {
    id: "conf-5",
    title: "Youth Mental Health: Challenges and Solutions",
    description: "Addressing the unique mental health challenges faced by young people in today's world.",
    date: "2025-05-20",
    time: "15:30",
    duration: "90",
    maxAttendees: 60,
    currentAttendees: 0,
    host: {
      id: "expert-5",
      name: "Dr. Lisa Nakambe",
      role: "Child Psychologist",
    },
    status: "cancelled",
    joinLink: "https://meet.example.com/conf-5",
  },
]

export function AdminConferenceManager() {
  const [conferences, setConferences] = useState<Conference[]>(sampleConferences)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ConferenceStatus | "all">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentConference, setCurrentConference] = useState<Conference | null>(null)

  // Form state for new/edit conference
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    maxAttendees: "",
    host: "",
    joinLink: "",
  })

  // Filter conferences based on search query and status filter
  const filteredConferences = conferences.filter((conference) => {
    const matchesSearch =
      conference.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conference.host.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || conference.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Open edit dialog and populate form
  const handleEditClick = (conference: Conference) => {
    setCurrentConference(conference)
    setFormData({
      title: conference.title,
      description: conference.description,
      date: conference.date,
      time: conference.time,
      duration: conference.duration,
      maxAttendees: conference.maxAttendees.toString(),
      host: conference.host.id,
      joinLink: conference.joinLink,
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const handleDeleteClick = (conference: Conference) => {
    setCurrentConference(conference)
    setIsDeleteDialogOpen(true)
  }

  // Add new conference
  const handleAddConference = () => {
    const newConference: Conference = {
      id: `conf-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      maxAttendees: Number.parseInt(formData.maxAttendees),
      currentAttendees: 0,
      host: {
        id: formData.host,
        name: "Dr. New Host", // In a real app, you would fetch the host details
        role: "Expert",
      },
      status: "scheduled",
      joinLink: formData.joinLink,
    }

    setConferences((prev) => [newConference, ...prev])
    setIsAddDialogOpen(false)
    resetForm()
  }

  // Update existing conference
  const handleUpdateConference = () => {
    if (!currentConference) return

    const updatedConferences = conferences.map((conf) => {
      if (conf.id === currentConference.id) {
        return {
          ...conf,
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          maxAttendees: Number.parseInt(formData.maxAttendees),
          host: {
            ...conf.host,
            id: formData.host,
          },
          joinLink: formData.joinLink,
        }
      }
      return conf
    })

    setConferences(updatedConferences)
    setIsEditDialogOpen(false)
    resetForm()
  }

  // Delete conference
  const handleDeleteConference = () => {
    if (!currentConference) return

    setConferences((prev) => prev.filter((conf) => conf.id !== currentConference.id))
    setIsDeleteDialogOpen(false)
    setCurrentConference(null)
  }

  // Change conference status
  const handleStatusChange = (conferenceId: string, newStatus: ConferenceStatus) => {
    const updatedConferences = conferences.map((conf) => {
      if (conf.id === conferenceId) {
        return {
          ...conf,
          status: newStatus,
        }
      }
      return conf
    })

    setConferences(updatedConferences)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      maxAttendees: "",
      host: "",
      joinLink: "",
    })
    setCurrentConference(null)
  }

  // Get status badge
  const getStatusBadge = (status: ConferenceStatus) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>
      case "live":
        return <Badge className="bg-green-500">Live</Badge>
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Video Conferences</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search conferences..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ConferenceStatus | "all")}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6C63FF] hover:bg-[#5A52D5]">
                <Plus className="mr-2 h-4 w-4" /> Add Conference
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Conference</DialogTitle>
                <DialogDescription>Create a new video conference for mental health experts.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duration (min)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxAttendees" className="text-right">
                    Max Attendees
                  </Label>
                  <Input
                    id="maxAttendees"
                    name="maxAttendees"
                    type="number"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="host" className="text-right">
                    Host
                  </Label>
                  <Select
                    name="host"
                    value={formData.host}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, host: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select host" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expert-1">Dr. Maria Ndapewa</SelectItem>
                      <SelectItem value="expert-2">Dr. James Hamukwaya</SelectItem>
                      <SelectItem value="expert-3">Emma Nangolo</SelectItem>
                      <SelectItem value="expert-4">Thomas Shilongo</SelectItem>
                      <SelectItem value="expert-5">Dr. Lisa Nakambe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="joinLink" className="text-right">
                    Join Link
                  </Label>
                  <Input
                    id="joinLink"
                    name="joinLink"
                    value={formData.joinLink}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#6C63FF] hover:bg-[#5A52D5]"
                  onClick={handleAddConference}
                  disabled={!formData.title || !formData.date || !formData.time || !formData.host}
                >
                  Create Conference
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Conferences Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conference Details</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConferences.length > 0 ? (
              filteredConferences.map((conference) => (
                <TableRow key={conference.id}>
                  <TableCell>
                    <div className="font-medium">{conference.title}</div>
                    <div className="text-sm text-gray-500">Host: {conference.host.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{new Date(conference.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="mr-2 h-4 w-4 text-gray-500" />
                      <span>
                        {conference.time} ({conference.duration} min)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-gray-500" />
                      <span>
                        {conference.currentAttendees}/{conference.maxAttendees}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(conference.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {conference.status === "scheduled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleStatusChange(conference.id, "live")}
                        >
                          <Video className="mr-1 h-3 w-3" /> Start
                        </Button>
                      )}

                      {conference.status === "live" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-gray-600 border-gray-600 hover:bg-gray-50"
                          onClick={() => handleStatusChange(conference.id, "completed")}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" /> End
                        </Button>
                      )}

                      {conference.status === "scheduled" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleEditClick(conference)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleStatusChange(conference.id, "cancelled")}
                          >
                            <XCircle className="mr-1 h-3 w-3" /> Cancel
                          </Button>
                        </>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <LinkIcon className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteClick(conference)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No conferences found. Try adjusting your filters or create a new conference.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Conference</DialogTitle>
            <DialogDescription>Update the details of this video conference.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right">
                Date
              </Label>
              <Input
                id="edit-date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-time" className="text-right">
                Time
              </Label>
              <Input
                id="edit-time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-duration" className="text-right">
                Duration (min)
              </Label>
              <Input
                id="edit-duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-maxAttendees" className="text-right">
                Max Attendees
              </Label>
              <Input
                id="edit-maxAttendees"
                name="maxAttendees"
                type="number"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-host" className="text-right">
                Host
              </Label>
              <Select
                name="host"
                value={formData.host}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, host: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select host" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expert-1">Dr. Maria Ndapewa</SelectItem>
                  <SelectItem value="expert-2">Dr. James Hamukwaya</SelectItem>
                  <SelectItem value="expert-3">Emma Nangolo</SelectItem>
                  <SelectItem value="expert-4">Thomas Shilongo</SelectItem>
                  <SelectItem value="expert-5">Dr. Lisa Nakambe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-joinLink" className="text-right">
                Join Link
              </Label>
              <Input
                id="edit-joinLink"
                name="joinLink"
                value={formData.joinLink}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#6C63FF] hover:bg-[#5A52D5]"
              onClick={handleUpdateConference}
              disabled={!formData.title || !formData.date || !formData.time || !formData.host}
            >
              Update Conference
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conference? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {currentConference && (
            <div className="py-4">
              <p className="font-medium">{currentConference.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(currentConference.date).toLocaleDateString()} at {currentConference.time}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConference}>
              Delete Conference
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
