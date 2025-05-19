"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, Users, Video, Link, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConferenceSchedulerProps {
  groupId: string
  groupName: string
  expertId: string
  expertName: string
  onConferenceScheduled?: () => void
}

export default function ConferenceScheduler({
  groupId,
  groupName,
  expertId,
  expertName,
  onConferenceScheduled,
}: ConferenceSchedulerProps) {
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [conferenceData, setConferenceData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "60",
    maxParticipants: "20",
    isRecorded: false,
    isPrivate: false,
    sendNotifications: true,
  })

  // Sample upcoming conferences
  const upcomingConferences = [
    {
      id: "conf1",
      title: "Anxiety Management Strategies",
      scheduledFor: "2025-05-24T18:00:00",
      duration: 60,
      participants: 12,
      maxParticipants: 20,
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConferenceData({ ...conferenceData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setConferenceData({ ...conferenceData, [name]: value })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setConferenceData({ ...conferenceData, [name]: checked })
  }

  const handleScheduleConference = () => {
    setIsSubmitting(true)

    // Validate inputs
    if (!conferenceData.title.trim() || !conferenceData.date || !conferenceData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // In a real app, this would send data to your API
    console.log("Scheduling conference:", {
      ...conferenceData,
      groupId,
      expertId,
    })

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsCreating(false)
      setConferenceData({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: "60",
        maxParticipants: "20",
        isRecorded: false,
        isPrivate: false,
        sendNotifications: true,
      })

      toast({
        title: "Conference scheduled",
        description: "Your video conference has been scheduled successfully.",
      })

      if (onConferenceScheduled) {
        onConferenceScheduled()
      }
    }, 1000)
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

  if (isCreating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Schedule Conference</CardTitle>
          <CardDescription>Schedule a new video conference for {groupName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Conference Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter conference title"
                value={conferenceData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the purpose of this conference"
                value={conferenceData.description}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={conferenceData.date} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" value={conferenceData.time} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={conferenceData.duration}
                  onValueChange={(value) => handleSelectChange("duration", value)}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Select
                  value={conferenceData.maxParticipants}
                  onValueChange={(value) => handleSelectChange("maxParticipants", value)}
                >
                  <SelectTrigger id="maxParticipants">
                    <SelectValue placeholder="Select limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 participants</SelectItem>
                    <SelectItem value="15">15 participants</SelectItem>
                    <SelectItem value="20">20 participants</SelectItem>
                    <SelectItem value="25">25 participants</SelectItem>
                    <SelectItem value="30">30 participants</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRecorded"
                  checked={conferenceData.isRecorded}
                  onCheckedChange={(checked) => handleCheckboxChange("isRecorded", checked as boolean)}
                />
                <Label htmlFor="isRecorded">Record conference</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrivate"
                  checked={conferenceData.isPrivate}
                  onCheckedChange={(checked) => handleCheckboxChange("isPrivate", checked as boolean)}
                />
                <Label htmlFor="isPrivate">Private conference (invite only)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendNotifications"
                  checked={conferenceData.sendNotifications}
                  onCheckedChange={(checked) => handleCheckboxChange("sendNotifications", checked as boolean)}
                />
                <Label htmlFor="sendNotifications">Send notifications to group members</Label>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleConference} disabled={isSubmitting}>
                {isSubmitting ? "Scheduling..." : "Schedule Conference"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Video Conferences</CardTitle>
        <CardDescription>Schedule and manage video conferences for this group</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingConferences.length > 0 ? (
            <>
              <h3 className="text-sm font-medium">Upcoming Conferences</h3>
              <div className="space-y-3">
                {upcomingConferences.map((conf) => (
                  <div key={conf.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{conf.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(conf.scheduledFor)}</span>
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{conf.duration} min</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Users className="h-3 w-3 mr-1" />
                          <span>
                            {conf.participants}/{conf.maxParticipants} participants
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="flex items-center">
                        <Link className="h-3 w-3 mr-1" />
                        Copy Link
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <Video className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium">No Upcoming Conferences</h3>
              <p className="text-sm text-gray-500 mt-1">Schedule a video conference for this group</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Conference
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
