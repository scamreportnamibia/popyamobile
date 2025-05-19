"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, LinkIcon, Video, Youtube } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ExpertContentCreator() {
  const [activeTab, setActiveTab] = useState("article")
  const [previewMode, setPreviewMode] = useState(false)

  // Form states for different content types
  const [articleForm, setArticleForm] = useState({
    title: "",
    content: "",
    image: null,
    imagePreview: "",
  })

  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    thumbnail: null,
    thumbnailPreview: "",
  })

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: null,
    imagePreview: "",
  })

  const [groupForm, setGroupForm] = useState({
    title: "",
    description: "",
    meetingFrequency: "",
    joinLink: "",
    image: null,
    imagePreview: "",
  })

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, formType: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imagePreview = event.target?.result as string

      switch (formType) {
        case "article":
          setArticleForm({ ...articleForm, image: file, imagePreview })
          break
        case "video":
          setVideoForm({ ...videoForm, thumbnail: file, thumbnailPreview: imagePreview })
          break
        case "event":
          setEventForm({ ...eventForm, image: file, imagePreview })
          break
        case "group":
          setGroupForm({ ...groupForm, image: file, imagePreview })
          break
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would send this data to your API
    console.log("Publishing content:", activeTab)
    switch (activeTab) {
      case "article":
        console.log(articleForm)
        break
      case "video":
        console.log(videoForm)
        break
      case "event":
        console.log(eventForm)
        break
      case "group":
        console.log(groupForm)
        break
    }

    // Show success message or redirect
    alert("Content published successfully!")

    // Reset forms
    resetForms()
  }

  const resetForms = () => {
    setArticleForm({
      title: "",
      content: "",
      image: null,
      imagePreview: "",
    })

    setVideoForm({
      title: "",
      description: "",
      youtubeUrl: "",
      thumbnail: null,
      thumbnailPreview: "",
    })

    setEventForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      image: null,
      imagePreview: "",
    })

    setGroupForm({
      title: "",
      description: "",
      meetingFrequency: "",
      joinLink: "",
      image: null,
      imagePreview: "",
    })

    setPreviewMode(false)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Create Content</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Share your expertise with the community</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="article" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Article</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center">
              <Youtube className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Video</span>
            </TabsTrigger>
            <TabsTrigger value="event" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Event</span>
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center">
              <LinkIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Group</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4">
          {/* Article Form */}
          <TabsContent value="article">
            {!previewMode ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="article-title">Title</Label>
                    <Input
                      id="article-title"
                      placeholder="Enter a compelling title"
                      value={articleForm.title}
                      onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="article-content">Content</Label>
                    <Textarea
                      id="article-content"
                      placeholder="Write your article content here..."
                      className="min-h-[200px]"
                      value={articleForm.content}
                      onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="article-image">Featured Image</Label>
                    <div className="mt-1 flex items-center">
                      <label className="block">
                        <span className="sr-only">Choose file</span>
                        <input
                          id="article-image"
                          type="file"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "article")}
                        />
                      </label>
                    </div>

                    {articleForm.imagePreview && (
                      <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                        <img
                          src={articleForm.imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          onClick={() => setArticleForm({ ...articleForm, image: null, imagePreview: "" })}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setPreviewMode(true)}>
                      Preview
                    </Button>
                    <Button type="submit">Publish Article</Button>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-2">
                        <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Your Name" />
                        <AvatarFallback>YN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Your Name</p>
                        <p className="text-xs text-gray-500">Mental Health Professional • Just now</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {articleForm.title || "Article Title Preview"}
                    </h3>

                    {articleForm.imagePreview && (
                      <div className="mt-2 mb-4 relative w-full h-48 rounded-md overflow-hidden">
                        <img
                          src={articleForm.imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {articleForm.content || "Your article content will appear here..."}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setPreviewMode(false)}>
                    Edit
                  </Button>
                  <Button onClick={handleSubmit}>Publish Article</Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Video Form */}
          <TabsContent value="video">
            {!previewMode ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="video-title">Title</Label>
                    <Input
                      id="video-title"
                      placeholder="Enter video title"
                      value={videoForm.title}
                      onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="video-description">Description</Label>
                    <Textarea
                      id="video-description"
                      placeholder="Describe what your video is about..."
                      className="min-h-[100px]"
                      value={videoForm.description}
                      onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="video-url">YouTube URL</Label>
                    <Input
                      id="video-url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videoForm.youtubeUrl}
                      onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste the full YouTube URL or just the video ID</p>
                  </div>

                  <div>
                    <Label htmlFor="video-thumbnail">Custom Thumbnail (Optional)</Label>
                    <div className="mt-1 flex items-center">
                      <label className="block">
                        <span className="sr-only">Choose file</span>
                        <input
                          id="video-thumbnail"
                          type="file"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "video")}
                        />
                      </label>
                    </div>

                    {videoForm.thumbnailPreview && (
                      <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                        <img
                          src={videoForm.thumbnailPreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          onClick={() => setVideoForm({ ...videoForm, thumbnail: null, thumbnailPreview: "" })}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setPreviewMode(true)}>
                      Preview
                    </Button>
                    <Button type="submit">Publish Video</Button>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-2">
                        <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Your Name" />
                        <AvatarFallback>YN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Your Name</p>
                        <p className="text-xs text-gray-500">Mental Health Professional • Just now</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {videoForm.title || "Video Title Preview"}
                    </h3>

                    <div className="relative w-full h-0 pb-[56.25%] mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      {videoForm.youtubeUrl ? (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${videoForm.youtubeUrl.split("v=")[1] || videoForm.youtubeUrl}`}
                          title={videoForm.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Video className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300">
                      {videoForm.description || "Your video description will appear here..."}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setPreviewMode(false)}>
                    Edit
                  </Button>
                  <Button onClick={handleSubmit}>Publish Video</Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Event Form */}
          <TabsContent value="event">
            {!previewMode ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input
                      id="event-title"
                      placeholder="Enter event title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Describe your event..."
                      className="min-h-[100px]"
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-date">Date</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="event-time">Time</Label>
                      <Input
                        id="event-time"
                        type="time"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="event-location">Location</Label>
                    <Input
                      id="event-location"
                      placeholder="Enter event location"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="event-image">Event Image</Label>
                    <div className="mt-1 flex items-center">
                      <label className="block">
                        <span className="sr-only">Choose file</span>
                        <input
                          id="event-image"
                          type="file"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "event")}
                        />
                      </label>
                    </div>

                    {eventForm.imagePreview && (
                      <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                        <img
                          src={eventForm.imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          onClick={() => setEventForm({ ...eventForm, image: null, imagePreview: "" })}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setPreviewMode(true)}>
                      Preview
                    </Button>
                    <Button type="submit">Publish Event</Button>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-2">
                        <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Your Name" />
                        <AvatarFallback>YN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Your Name</p>
                        <p className="text-xs text-gray-500">Mental Health Professional • Just now</p>
                      </div>
                    </div>

                    {eventForm.imagePreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                        <img
                          src={eventForm.imagePreview || "/placeholder.svg"}
                          alt="Event"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-800/90 text-xs font-medium px-2 py-1 rounded-full">
                          Event
                        </div>
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {eventForm.title || "Event Title Preview"}
                    </h3>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-3">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-[rgb(156,39,176)] mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {eventForm.date
                              ? new Date(eventForm.date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Event Date"}
                            {eventForm.time ? ` | ${eventForm.time}` : ""}
                          </p>
                          {eventForm.location && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{eventForm.location}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300">
                      {eventForm.description || "Your event description will appear here..."}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setPreviewMode(false)}>
                    Edit
                  </Button>
                  <Button onClick={handleSubmit}>Publish Event</Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Group Form */}
          <TabsContent value="group">
            {!previewMode ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="group-title">Group Name</Label>
                    <Input
                      id="group-title"
                      placeholder="Enter support group name"
                      value={groupForm.title}
                      onChange={(e) => setGroupForm({ ...groupForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="group-description">Description</Label>
                    <Textarea
                      id="group-description"
                      placeholder="Describe your support group..."
                      className="min-h-[100px]"
                      value={groupForm.description}
                      onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="group-frequency">Meeting Frequency</Label>
                    <Select
                      value={groupForm.meetingFrequency}
                      onValueChange={(value) => setGroupForm({ ...groupForm, meetingFrequency: value })}
                    >
                      <SelectTrigger id="group-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="group-link">Join Link</Label>
                    <Input
                      id="group-link"
                      placeholder="https://meet.google.com/..."
                      value={groupForm.joinLink}
                      onChange={(e) => setGroupForm({ ...groupForm, joinLink: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Provide a link where users can join your group (Zoom, Google Meet, etc.)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="group-image">Group Image</Label>
                    <div className="mt-1 flex items-center">
                      <label className="block">
                        <span className="sr-only">Choose file</span>
                        <input
                          id="group-image"
                          type="file"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "group")}
                        />
                      </label>
                    </div>

                    {groupForm.imagePreview && (
                      <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                        <img
                          src={groupForm.imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          onClick={() => setGroupForm({ ...groupForm, image: null, imagePreview: "" })}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setPreviewMode(true)}>
                      Preview
                    </Button>
                    <Button type="submit">Publish Group</Button>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-2">
                        <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Your Name" />
                        <AvatarFallback>YN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Your Name</p>
                        <p className="text-xs text-gray-500">Mental Health Professional • Just now</p>
                      </div>
                    </div>

                    {groupForm.imagePreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                        <img
                          src={groupForm.imagePreview || "/placeholder.svg"}
                          alt="Group"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-800/90 text-xs font-medium px-2 py-1 rounded-full">
                          Support Group
                        </div>
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {groupForm.title || "Support Group Title Preview"}
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {groupForm.description || "Your group description will appear here..."}
                    </p>

                    {groupForm.meetingFrequency && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium">Frequency:</span>{" "}
                        {groupForm.meetingFrequency.charAt(0).toUpperCase() + groupForm.meetingFrequency.slice(1)}{" "}
                        meetings
                      </p>
                    )}

                    {groupForm.joinLink && (
                      <div className="px-4 py-3 bg-[rgb(3,169,244)]/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Join this support group</p>
                          <a
                            href={groupForm.joinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[rgb(3,169,244)] text-white text-xs font-medium rounded-full flex items-center"
                          >
                            <LinkIcon className="w-3 h-3 mr-1" /> Join Group
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setPreviewMode(false)}>
                    Edit
                  </Button>
                  <Button onClick={handleSubmit}>Publish Group</Button>
                </div>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
