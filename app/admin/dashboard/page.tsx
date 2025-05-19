"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  UserPlus,
  Video,
  FileText,
  AlertTriangle,
  Activity,
  Calendar,
  Settings,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("week")

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your mental health platform</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Link href="/admin/settings">
            <Button size="sm" className="bg-[#6C63FF] hover:bg-[#5A52D5]">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">8,249</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Badge className="bg-green-500 text-white">+12%</Badge>
              <span className="text-gray-500 ml-2">vs. last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Experts</p>
                <h3 className="text-2xl font-bold mt-1">42</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Badge className="bg-green-500 text-white">+5%</Badge>
              <span className="text-gray-500 ml-2">vs. last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Groups</p>
                <h3 className="text-2xl font-bold mt-1">156</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Badge className="bg-green-500 text-white">+18%</Badge>
              <span className="text-gray-500 ml-2">vs. last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Urgent Cases</p>
                <h3 className="text-2xl font-bold mt-1">7</h3>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Badge className="bg-red-500 text-white">+2</Badge>
              <span className="text-gray-500 ml-2">new cases today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Charts */}
      <Tabs defaultValue="users" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="users">User Activity</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              variant={timeRange === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("day")}
              className={timeRange === "day" ? "bg-[#6C63FF] hover:bg-[#5A52D5]" : ""}
            >
              Day
            </Button>
            <Button
              variant={timeRange === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("week")}
              className={timeRange === "week" ? "bg-[#6C63FF] hover:bg-[#5A52D5]" : ""}
            >
              Week
            </Button>
            <Button
              variant={timeRange === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("month")}
              className={timeRange === "month" ? "bg-[#6C63FF] hover:bg-[#5A52D5]" : ""}
            >
              Month
            </Button>
            <Button
              variant={timeRange === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("year")}
              className={timeRange === "year" ? "bg-[#6C63FF] hover:bg-[#5A52D5]" : ""}
            >
              Year
            </Button>
          </div>
        </div>

        <TabsContent value="users" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Overview of user registrations, active users, and engagement metrics.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-16 w-16 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">User activity chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Content Metrics</CardTitle>
              <CardDescription>Overview of content creation, engagement, and popular topics.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">Content metrics chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Group Activity</CardTitle>
              <CardDescription>Overview of group creation, member activity, and engagement.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-16 w-16 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">Group activity chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experts" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Expert Performance</CardTitle>
              <CardDescription>Overview of expert activity, user ratings, and session metrics.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-16 w-16 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">Expert performance chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and events on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Expert Application</p>
                  <p className="text-xs text-gray-500">Dr. John Smith applied to become an expert</p>
                  <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Urgent Case Reported</p>
                  <p className="text-xs text-gray-500">User #12345 reported suicidal thoughts</p>
                  <p className="text-xs text-gray-400 mt-1">45 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Video className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Conference Scheduled</p>
                  <p className="text-xs text-gray-500">Anxiety Support Group - Tomorrow at 3:00 PM</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Content Published</p>
                  <p className="text-xs text-gray-500">Dr. Maria Ndapewa published "Understanding Anxiety"</p>
                  <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-[#6C63FF]">
              View All Activity <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Shortcuts to important admin functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/users">
                <div className="border rounded-lg p-4 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-[#6C63FF]" />
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <h3 className="font-medium">User Management</h3>
                  <p className="text-xs text-gray-500 mt-1">Manage users and permissions</p>
                </div>
              </Link>

              <Link href="/admin/expert-applications">
                <div className="border rounded-lg p-4 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <UserPlus className="h-5 w-5 text-[#6C63FF]" />
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <h3 className="font-medium">Expert Applications</h3>
                  <p className="text-xs text-gray-500 mt-1">Review and approve experts</p>
                </div>
              </Link>

              <Link href="/admin/groups">
                <div className="border rounded-lg p-4 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-[#6C63FF]" />
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <h3 className="font-medium">Group Management</h3>
                  <p className="text-xs text-gray-500 mt-1">Manage support groups</p>
                </div>
              </Link>

              <Link href="/admin/conferences">
                <div className="border rounded-lg p-4 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <Video className="h-5 w-5 text-[#6C63FF]" />
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <h3 className="font-medium">Video Conferences</h3>
                  <p className="text-xs text-gray-500 mt-1">Manage online sessions</p>
                </div>
              </Link>

              <Link href="/admin/polls">
                <div className="border rounded-lg p-4 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="h-5 w-5 text-[#6C63FF]" />
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <h3 className="font-medium">Poll Management</h3>
                  <p className="text-xs text-gray-500 mt-1">Create and manage polls</p>
                </div>
              </Link>

              <Link href="/admin/settings">
                <div className="border rounded-lg p-4 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <Settings className="h-5 w-5 text-[#6C63FF]" />
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <h3 className="font-medium">System Settings</h3>
                  <p className="text-xs text-gray-500 mt-1">Configure application settings</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Scheduled conferences, group sessions, and important dates</CardDescription>
            </div>
            <Link href="/admin/conferences">
              <Button variant="outline" size="sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-blue-500">Conference</Badge>
                <span className="text-xs text-gray-500">Tomorrow</span>
              </div>
              <h3 className="font-medium">Mental Health Awareness Workshop</h3>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>May 19, 2025 • 2:00 PM</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Users className="mr-2 h-4 w-4" />
                <span>32 attendees registered</span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-green-500">Group Session</Badge>
                <span className="text-xs text-gray-500">In 3 days</span>
              </div>
              <h3 className="font-medium">Anxiety Support Group Meeting</h3>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>May 21, 2025 • 6:30 PM</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Users className="mr-2 h-4 w-4" />
                <span>18 attendees registered</span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-purple-500">Expert Training</Badge>
                <span className="text-xs text-gray-500">Next week</span>
              </div>
              <h3 className="font-medium">Crisis Intervention Training</h3>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>May 25, 2025 • 10:00 AM</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Users className="mr-2 h-4 w-4" />
                <span>12 experts registered</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Server Uptime</span>
                  <span className="text-sm text-green-500">99.9%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "99.9%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">API Response Time</span>
                  <span className="text-sm text-green-500">120ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Database Load</span>
                  <span className="text-sm text-yellow-500">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Storage Usage</span>
                  <span className="text-sm text-blue-500">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Trends</CardTitle>
            <CardDescription>User growth and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">New Users</p>
                  <div className="flex items-center">
                    <h3 className="text-xl font-bold">+248</h3>
                    <Badge className="ml-2 bg-green-500 text-white">+12%</Badge>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active Users</p>
                  <div className="flex items-center">
                    <h3 className="text-xl font-bold">3,842</h3>
                    <Badge className="ml-2 bg-green-500 text-white">+8%</Badge>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Session Duration</p>
                  <div className="flex items-center">
                    <h3 className="text-xl font-bold">12:42</h3>
                    <Badge className="ml-2 bg-green-500 text-white">+5%</Badge>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Bounce Rate</p>
                  <div className="flex items-center">
                    <h3 className="text-xl font-bold">24%</h3>
                    <Badge className="ml-2 bg-red-500 text-white">+2%</Badge>
                  </div>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>System and user alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">High Priority Alert</p>
                  <p className="text-xs text-gray-500">User reported suicidal thoughts</p>
                  <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Medium Priority Alert</p>
                  <p className="text-xs text-gray-500">Database approaching capacity</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Medium Priority Alert</p>
                  <p className="text-xs text-gray-500">Multiple failed login attempts</p>
                  <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Low Priority Alert</p>
                  <p className="text-xs text-gray-500">System update available</p>
                  <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-[#6C63FF]">
              View All Alerts <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
