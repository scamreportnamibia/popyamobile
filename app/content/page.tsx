"use client"

import { useState } from "react"
import { ExpertContentFeed } from "@/components/expert-content-feed"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileText, Video, Calendar, Users, Search, Filter } from "lucide-react"

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Expert Content</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Articles, videos, and resources from mental health professionals
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search content..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center">
          <Filter className="mr-2" size={18} />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center">
            <Video className="w-4 h-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ExpertContentFeed />
        </TabsContent>

        <TabsContent value="articles">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Showing articles from mental health professionals</p>
          <ExpertContentFeed />
        </TabsContent>

        <TabsContent value="videos">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Showing videos from mental health professionals</p>
          <ExpertContentFeed />
        </TabsContent>

        <TabsContent value="events">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Showing upcoming events and workshops</p>
          <ExpertContentFeed />
        </TabsContent>

        <TabsContent value="groups">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Showing support groups you can join</p>
          <ExpertContentFeed />
        </TabsContent>
      </Tabs>
    </div>
  )
}
