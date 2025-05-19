"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Clock,
  Copy,
  LinkIcon,
  Plus,
  Share2,
  Users,
  Video,
  Mic,
  PhoneOff,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

// Sample data
const upcomingMeetings = [
  {
    id: "meeting1",
    title: "Anxiety Support Group Session",
    date: new Date("2025-05-24T18:00:00"),
    duration: 60,
    attendees: 12,
    link: "https://meet.popya.com/anxiety-support-123",
    isRecurring: true,
  },
  {
    id: "meeting2",
    title: "One-on-One with Jane Doe",
    date: new Date("2025-05-20T15:30:00"),
    duration: 45,
    attendees: 1,
    link: "https://meet.popya.com/jane-doe-456",
    isRecurring: false,
  },
  {
    id: "meeting3",
    title: "Depression Support Group",
    date: new Date("2025-05-26T19:00:00"),
    duration: 90,
    attendees: 8,
    link: "https://meet.popya.com/depression-support-789",
    isRecurring: true,
  },
]

export function ExpertVideoConference() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [showMockVideoCall, setShowMockVideoCall] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")

  // New meeting form state
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
    duration: "60",
    isRecurring: false,
    description: "",
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCreateMeeting = () => {
    // In a real app, this would send data to your API
    console.log("Creating meeting:", newMeeting)
    setShowCreateDialog(false)
    // Reset form
    setNewMeeting({
      title: "",
      date: "",
      time: "",
      duration: "60",
      isRecurring: false,
      description: "",
    })
  }

  const handleJoinMeeting = (meetingId: string) => {
    // In a real app, this would join the actual meeting
    console.log("Joining meeting:", meetingId)
    setShowMockVideoCall(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Video Conferences</CardTitle>
              <CardDescription>Schedule and manage video sessions with individuals or groups</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowJoinDialog(true)}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Join Meeting
              </Button>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Meetings</TabsTrigger>
              <TabsTrigger value="recordings">Recordings</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <Card key={meeting.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium">{meeting.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1 gap-y-1 sm:gap-x-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{formatDate(meeting.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>
                                {formatTime(meeting.date)} ({meeting.duration} min)
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>
                                {meeting.attendees} attendee{meeting.attendees !== 1 ? "s" : ""}
                              </span>
                            </div>
                            {meeting.isRecurring && (
                              <Badge variant="outline" className="ml-0 sm:ml-2">
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 sm:flex-none"
                            onClick={() => {
                              navigator.clipboard.writeText(meeting.link)
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => handleJoinMeeting(meeting.id)}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past">
              <div className="text-center py-8">
                <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No past meetings</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Your past meetings will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="recordings">
              <div className="text-center py-8">
                <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No recordings</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Your meeting recordings will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Meeting Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
            <DialogDescription>Create a new video conference session for individuals or groups.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-title">Meeting Title</Label>
              <Input
                id="meeting-title"
                placeholder="Enter meeting title"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-date">Date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-time">Time</Label>
                <Input
                  id="meeting-time"
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-duration">Duration (minutes)</Label>
                <select
                  id="meeting-duration"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-recurring">Recurring Meeting</Label>
                <select
                  id="meeting-recurring"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                  onChange={(e) => setNewMeeting({ ...newMeeting, isRecurring: e.target.value === "true" })}
                >
                  <option value="false">No</option>
                  <option value="true">Yes, weekly</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-description">Description (Optional)</Label>
              <Textarea
                id="meeting-description"
                placeholder="Add meeting details"
                value={newMeeting.description}
                onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateMeeting}>Schedule Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Meeting Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Join Meeting</DialogTitle>
            <DialogDescription>Enter a meeting link or ID to join an existing meeting.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-link">Meeting Link or ID</Label>
              <Input id="meeting-link" placeholder="https://meet.popya.com/... or meeting ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display-name">Your Display Name</Label>
              <Input id="display-name" placeholder="Enter your name" defaultValue="Dr. Sarah Johnson" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowJoinDialog(false)
                setShowMockVideoCall(true)
              }}
            >
              Join Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mock Video Call Interface */}
      {showMockVideoCall && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 bg-gray-900">
            <h3 className="text-white font-medium">Anxiety Support Group Session</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-white border-white">
                <Clock className="h-3 w-3 mr-1" />
                00:05:23
              </Badge>
              <Badge variant="outline" className="text-white border-white">
                <Users className="h-3 w-3 mr-1" />5 Participants
              </Badge>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-2 p-2 bg-gray-900">
            <div className="bg-gray-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="You (Host)"
                  width={400}
                  height={300}
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                You (Host)
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Jane Doe"
                  width={400}
                  height={300}
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">Jane Doe</div>
            </div>
            <div className="bg-gray-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="John Smith"
                  width={400}
                  height={300}
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                John Smith
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Sarah Johnson"
                  width={400}
                  height={300}
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                Sarah Johnson
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-900 flex justify-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <Video className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <Users className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full"
                onClick={() => setShowMockVideoCall(false)}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
