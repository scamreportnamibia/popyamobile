"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function ExpertDashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for expert dashboard
  const expertData = {
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    role: "Psychologist",
    institution: "Windhoek Central Hospital",
    specialization: "Anxiety & Depression",
    joinDate: "2025-01-10",
    stats: {
      groups: 3,
      activeClients: 42,
      conferences: 24,
      responseRate: 98,
    },
  }

  // Sample data for groups
  const expertGroups = [
    {
      id: "group1",
      name: "Anxiety Support Group",
      members: 24,
      lastActive: "2025-05-17T14:30:00",
      nextMeeting: "2025-05-24T18:00:00",
    },
    {
      id: "group2",
      name: "Women's Mental Health",
      members: 18,
      lastActive: "2025-05-16T16:45:00",
      nextMeeting: "2025-05-23T17:30:00",
    },
    {
      id: "group3",
      name: "Stress Management",
      members: 15,
      lastActive: "2025-05-15T19:20:00",
      nextMeeting: "2025-05-22T19:00:00",
    },
  ]

  // Sample data for client requests
  const clientRequests = [
    {
      id: "req1",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      type: "one_on_one",
      message: "I've been struggling with anxiety lately and would like to schedule a one-on-one session.",
      timestamp: "2025-05-18T10:30:00",
      status: "pending",
    },
    {
      id: "req2",
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      type: "question",
      message: "Can you recommend some resources for managing panic attacks?",
      timestamp: "2025-05-17T15:45:00",
      status: "pending",
    },
    {
      id: "req3",
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      type: "one_on_one",
      message: "I'd like to discuss some personal issues in a private session.",
      timestamp: "2025-05-16T09:20:00",
      status: "approved",
      scheduledFor: "2025-05-20T14:00:00",
    },
  ]

  // Sample data for upcoming conferences
  const upcomingConferences = [
    {
      id: "conf1",
      title: "Anxiety Management Strategies",
      group: "Anxiety Support Group",
      scheduledFor: "2025-05-24T18:00:00",
      duration: 60,
      participants: 12,
      maxParticipants: 20,
    },
    {
      id: "conf2",
      title: "Stress Relief Techniques",
      group: "Stress Management",
      scheduledFor: "2025-05-22T19:00:00",
      duration: 45,
      participants: 8,
      maxParticipants: 15,
    },
  ]

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
    <ProtectedRoute allowedRoles={["expert"]}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Expert Dashboard</h1>
            <p className="text-gray-500">Manage your groups, clients, and sessions</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="conferences">Conferences</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Expert Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={expertData.avatar || "/placeholder.svg"} alt={expertData.name} />
                    <AvatarFallback>{expertData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold mt-4">{expertData.name}</h2>
                  <p className="text-gray-500">{expertData.role}</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-300">{expertData.specialization}</Badge>
                  <p className="text-sm text-gray-500 mt-4">{expertData.institution}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Member since {new Date(expertData.joinDate).toLocaleDateString()}
                  </p>

                  <div className="w-full mt-6">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/profile/edit">Edit Profile</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Your activity statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-purple-600 text-sm font-medium">Groups</p>
                    <h3 className="text-2xl font-bold">{expertData.stats.groups}</h3>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-600 text-sm font-medium">Active Clients</p>
                    <h3 className="text-2xl font-bold">{expertData.stats.activeClients}</h3>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-600 text-sm font-medium">Conferences</p>
                    <h3 className="text-2xl font-bold">{expertData.stats.conferences}</h3>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-amber-600 text-sm font-medium">Response Rate</p>
                    <h3 className="text-2xl font-bold">{expertData.stats.responseRate}%</h3>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">Upcoming Conferences</h3>
                  <div className="space-y-3">
                    {upcomingConferences.map((conf) => (
                      <div key={conf.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{conf.title}</h4>
                            <p className="text-sm text-gray-500">{conf.group}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(conf.scheduledFor)} · {conf.duration} minutes
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {conf.participants}/{conf.maxParticipants} Participants
                          </Badge>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm" variant="default">
                            Join
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Client Requests</CardTitle>
                <CardDescription>Manage your client requests and inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={request.user.avatar || "/placeholder.svg"} alt={request.user.name} />
                          <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{request.user.name}</h4>
                            <div className="flex items-center">
                              <Badge
                                className={
                                  request.status === "pending"
                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                    : "bg-green-100 text-green-800 border-green-300"
                                }
                              >
                                {request.status === "pending" ? "Pending" : "Approved"}
                              </Badge>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(request.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="mt-1 mb-2">
                            {request.type === "one_on_one" ? "One-on-One Session" : "Question"}
                          </Badge>
                          <p className="text-sm text-gray-700">{request.message}</p>

                          {request.status === "approved" && request.scheduledFor && (
                            <p className="text-xs text-green-600 mt-2">
                              Scheduled for {formatDate(request.scheduledFor)}
                            </p>
                          )}

                          {request.status === "pending" && (
                            <div className="mt-3 flex space-x-2">
                              <Button size="sm" variant="default">
                                Approve
                              </Button>
                              <Button size="sm" variant="outline">
                                Decline
                              </Button>
                              <Button size="sm" variant="ghost">
                                Message
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Groups</CardTitle>
                  <CardDescription>Manage your support groups</CardDescription>
                </div>
                <Button>Create New Group</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expertGroups.map((group) => (
                  <div key={group.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{group.name}</h3>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2">
                            {group.members} Members
                          </Badge>
                          <p className="text-xs text-gray-500">Last active: {formatDate(group.lastActive)}</p>
                        </div>
                      </div>
                      <div>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          Next meeting: {formatDate(group.nextMeeting)}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm">Manage Group</Button>
                      <Button size="sm" variant="outline">
                        Schedule Meeting
                      </Button>
                      <Button size="sm" variant="ghost">
                        Message All
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>Manage your individual clients</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">Client management interface will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conferences">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Conference Management</CardTitle>
                  <CardDescription>Schedule and manage your video conferences</CardDescription>
                </div>
                <Button>Schedule Conference</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingConferences.map((conf) => (
                  <div key={conf.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{conf.title}</h3>
                        <p className="text-sm text-gray-500">{conf.group}</p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2">
                            {conf.duration} minutes
                          </Badge>
                          <p className="text-xs text-gray-500">{formatDate(conf.scheduledFor)}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        {conf.participants}/{conf.maxParticipants} Participants
                      </Badge>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm">Join Conference</Button>
                      <Button size="sm" variant="outline">
                        Edit Details
                      </Button>
                      <Button size="sm" variant="ghost">
                        Send Reminder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </ProtectedRoute>
  )
}
