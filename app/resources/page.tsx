"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Search, Filter, Calendar, Video, FileText, ImageIcon, Star, X, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Types for our resources
type ResourceType = "article" | "video" | "poster" | "event"

interface Resource {
  id: string
  type: ResourceType
  title: string
  description: string
  image: string
  author: {
    name: string
    avatar: string
    credentials: string
  }
  date: string
  duration?: string // For videos and articles (read time)
  tags: string[]
  featured?: boolean
  url?: string
  location?: string // For events
  eventDate?: string // For events
}

interface Advertisement {
  id: string
  title: string
  description: string
  image: string
  url: string
  sponsor: string
}

// Sample data
const sampleResources: Resource[] = [
  {
    id: "a1",
    type: "article",
    title: "Understanding Anxiety: Causes and Coping Mechanisms",
    description:
      "Learn about the root causes of anxiety and discover effective strategies to manage symptoms in daily life.",
    image: "/placeholder.svg?height=400&width=600",
    author: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=50&width=50",
      credentials: "Clinical Psychologist",
    },
    date: "May 12, 2023",
    duration: "8 min read",
    tags: ["anxiety", "mental health", "coping strategies"],
    featured: true,
  },
  {
    id: "v1",
    type: "video",
    title: "5-Minute Mindfulness Meditation for Stress Relief",
    description: "A quick guided meditation you can do anywhere to immediately reduce stress and anxiety.",
    image: "/placeholder.svg?height=400&width=600",
    author: {
      name: "Dr. Michael Chen",
      avatar: "/placeholder.svg?height=50&width=50",
      credentials: "Mindfulness Expert",
    },
    date: "June 3, 2023",
    duration: "5:23",
    tags: ["meditation", "mindfulness", "stress relief"],
  },
  {
    id: "p1",
    type: "poster",
    title: "Signs of Depression: What to Look For",
    description: "An informative poster highlighting the common signs and symptoms of depression.",
    image: "/placeholder.svg?height=800&width=600",
    author: {
      name: "Mental Health America",
      avatar: "/placeholder.svg?height=50&width=50",
      credentials: "Organization",
    },
    date: "April 18, 2023",
    tags: ["depression", "awareness", "symptoms"],
  },
  {
    id: "e1",
    type: "event",
    title: "Virtual Support Group: Coping with Loss",
    description:
      "Join our online support group for those experiencing grief and loss. Share experiences and learn coping strategies.",
    image: "/placeholder.svg?height=400&width=600",
    author: {
      name: "Grief Support Network",
      avatar: "/placeholder.svg?height=50&width=50",
      credentials: "Support Organization",
    },
    date: "Posted May 5, 2023",
    tags: ["grief", "support group", "virtual event"],
    location: "Zoom Meeting",
    eventDate: "May 25, 2023 • 7:00 PM EST",
  },
  {
    id: "a2",
    type: "article",
    title: "The Connection Between Sleep and Mental Health",
    description: "Explore how sleep affects your mental wellbeing and learn techniques for better sleep hygiene.",
    image: "/placeholder.svg?height=400&width=600",
    author: {
      name: "Dr. Olivia Patel",
      avatar: "/placeholder.svg?height=50&width=50",
      credentials: "Sleep Specialist",
    },
    date: "May 20, 2023",
    duration: "6 min read",
    tags: ["sleep", "mental health", "wellness"],
  },
  {
    id: "v2",
    type: "video",
    title: "Understanding Cognitive Behavioral Therapy (CBT)",
    description: "An introduction to CBT and how it can help change negative thought patterns.",
    image: "/placeholder.svg?height=400&width=600",
    author: {
      name: "Dr. James Wilson",
      avatar: "/placeholder.svg?height=50&width=50",
      credentials: "CBT Specialist",
    },
    date: "June 10, 2023",
    duration: "12:45",
    tags: ["CBT", "therapy", "cognitive behavioral therapy"],
  },
  {
    id: "p2",
    type: "poster",
    title: "Grounding Techniques for Anxiety",
    description: "A visual guide to grounding techniques that can help during anxiety attacks.",
    image: "/placeholder.svg?height=800&width=600",
    author: {
      name: "Anxiety Alliance",
      avatar: "/placeholder.svg?height=50&width=50",
      credentials: "Organization",
    },
    date: "May 8, 2023",
    tags: ["anxiety", "grounding", "techniques"],
  },
  {
    id: "e2",
    type: "event",
    title: "Workshop: Building Resilience in Challenging Times",
    description:
      "Learn practical skills to build emotional resilience and navigate life's challenges with greater ease.",
    image: "/placeholder.svg?height=400&width=600",
    author: {
      name: "Resilience Institute",
      avatar: "/placeholder.svg?height=50&width=50",
      credentials: "Educational Organization",
    },
    date: "Posted June 1, 2023",
    tags: ["resilience", "workshop", "coping skills"],
    location: "Community Center & Online",
    eventDate: "June 15, 2023 • 2:00 PM EST",
  },
]

const sampleAds: Advertisement[] = [
  {
    id: "ad1",
    title: "Try MindfulMe Premium",
    description: "Get unlimited access to guided meditations and sleep stories.",
    image: "/placeholder.svg?height=300&width=600",
    url: "#",
    sponsor: "MindfulMe App",
  },
  {
    id: "ad2",
    title: "Online Therapy Sessions",
    description: "Connect with licensed therapists from the comfort of your home.",
    image: "/placeholder.svg?height=300&width=600",
    url: "#",
    sponsor: "TherapyConnect",
  },
]

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(sampleResources)
  const [ads, setAds] = useState<Advertisement[]>(sampleAds)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get all unique tags from resources
  const allTags = Array.from(new Set(resources.flatMap((resource) => resource.tags)))

  // Filter resources based on search query, active tab, and selected tags
  const filteredResources = resources.filter((resource) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by resource type (tab)
    const matchesTab = activeTab === "all" || resource.type === activeTab

    // Filter by selected tags
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => resource.tags.includes(tag))

    return matchesSearch && matchesTab && matchesTags
  })

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }

    // Play sound with proper error handling
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false"
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const audio = new Audio()
        audio.addEventListener("error", () => {
          console.log("Click sound not available")
        })
        audio.src = "/sounds/click.mp3"
        audio.play().catch((e) => {
          console.log("Could not play click sound", e)
        })
      } catch (e) {
        console.log("Sound playback not supported", e)
      }
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([])
    setSearchQuery("")

    // Play sound with proper error handling
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false"
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const audio = new Audio()
        audio.addEventListener("error", () => {
          console.log("Click sound not available")
        })
        audio.src = "/sounds/click.mp3"
        audio.play().catch((e) => {
          console.log("Could not play click sound", e)
        })
      } catch (e) {
        console.log("Sound playback not supported", e)
      }
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Play sound with proper error handling
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false"
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const audio = new Audio()
        audio.addEventListener("error", () => {
          console.log("Click sound not available")
        })
        audio.src = "/sounds/click.mp3"
        audio.play().catch((e) => {
          console.log("Could not play click sound", e)
        })
      } catch (e) {
        console.log("Sound playback not supported", e)
      }
    }
  }

  // Get icon based on resource type
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case "article":
        return <FileText className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "poster":
        return <ImageIcon className="w-4 h-4" />
      case "event":
        return <Calendar className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white z-30 border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="ml-3 text-lg font-semibold">Resources</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setShowFilters(!showFilters)
              // Play sound
              const soundEnabled = localStorage.getItem("soundEnabled") !== "false"
              if (soundEnabled && typeof window !== "undefined") {
                try {
                  const audio = new Audio()
                  audio.addEventListener("error", () => {
                    console.log("Click sound not available")
                  })
                  audio.src = "/sounds/click.mp3"
                  audio.play().catch((e) => {
                    console.log("Could not play click sound", e)
                  })
                } catch (e) {
                  console.log("Sound playback not supported", e)
                }
              }
            }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Filter size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search resources..."
            className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Filter by Tags</h3>
                {selectedTags.length > 0 && (
                  <button onClick={clearFilters} className="text-xs text-[#6C63FF] hover:underline flex items-center">
                    <X size={12} className="mr-1" />
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedTags.includes(tag) ? "bg-[#6C63FF] hover:bg-[#5A52CC]" : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="px-4 py-2 border-b overflow-x-auto no-scrollbar">
          <TabsList className="bg-transparent p-0 h-auto flex space-x-2">
            <TabsTrigger
              value="all"
              className={`px-4 py-2 rounded-full text-sm ${
                activeTab === "all" ? "bg-[#6C63FF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="article"
              className={`px-4 py-2 rounded-full text-sm flex items-center ${
                activeTab === "article" ? "bg-[#6C63FF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FileText size={14} className="mr-1" />
              Articles
            </TabsTrigger>
            <TabsTrigger
              value="video"
              className={`px-4 py-2 rounded-full text-sm flex items-center ${
                activeTab === "video" ? "bg-[#6C63FF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Video size={14} className="mr-1" />
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="poster"
              className={`px-4 py-2 rounded-full text-sm flex items-center ${
                activeTab === "poster" ? "bg-[#6C63FF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ImageIcon size={14} className="mr-1" />
              Posters
            </TabsTrigger>
            <TabsTrigger
              value="event"
              className={`px-4 py-2 rounded-full text-sm flex items-center ${
                activeTab === "event" ? "bg-[#6C63FF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Calendar size={14} className="mr-1" />
              Events
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <ResourcesList resources={filteredResources} ads={ads} />
        </TabsContent>
        <TabsContent value="article" className="mt-0">
          <ResourcesList resources={filteredResources} ads={ads} />
        </TabsContent>
        <TabsContent value="video" className="mt-0">
          <ResourcesList resources={filteredResources} ads={ads} />
        </TabsContent>
        <TabsContent value="poster" className="mt-0">
          <ResourcesList resources={filteredResources} ads={ads} />
        </TabsContent>
        <TabsContent value="event" className="mt-0">
          <ResourcesList resources={filteredResources} ads={ads} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Component to display the list of resources with ads interspersed
function ResourcesList({ resources, ads }: { resources: Resource[]; ads: Advertisement[] }) {
  // Function to insert ads between resources
  const resourcesWithAds = [...resources]
  if (resources.length > 2 && ads.length > 0) {
    resourcesWithAds.splice(2, 0, { type: "ad", ad: ads[0] } as any)
  }
  if (resources.length > 5 && ads.length > 1) {
    resourcesWithAds.splice(6, 0, { type: "ad", ad: ads[1] } as any)
  }

  if (resources.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No resources found matching your criteria.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Reset Filters
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Featured Resource (if any) */}
      {resources.some((r) => r.featured) && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Featured Resource
          </h2>
          {resources
            .filter((r) => r.featured)
            .slice(0, 1)
            .map((resource) => (
              <FeaturedResourceCard key={resource.id} resource={resource} />
            ))}
        </div>
      )}

      {/* Resources List with Ads */}
      <div className="grid grid-cols-1 gap-4">
        {resourcesWithAds.map((item: any, index) => {
          if (item.type === "ad") {
            return <AdvertisementCard key={`ad-${index}`} ad={item.ad} />
          } else {
            return <ResourceCard key={item.id} resource={item} />
          }
        })}
      </div>
    </div>
  )
}

// Featured Resource Card
function FeaturedResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="relative h-48 w-full">
        <Image src={resource.image || "/placeholder.svg"} alt={resource.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-4 text-white">
            <div className="flex items-center mb-2">
              {getResourceTypeIcon(resource.type)}
              <span className="text-xs font-medium ml-1 capitalize">{resource.type}</span>
              <span className="mx-2">•</span>
              <span className="text-xs">{resource.date}</span>
            </div>
            <h3 className="text-xl font-bold mb-1">{resource.title}</h3>
            <p className="text-sm text-white/80 line-clamp-2">{resource.description}</p>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={resource.author.avatar || "/placeholder.svg"} alt={resource.author.name} />
              <AvatarFallback>{resource.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{resource.author.name}</p>
              <p className="text-xs text-gray-500">{resource.author.credentials}</p>
            </div>
          </div>
          <Button size="sm" className="bg-[#6C63FF] hover:bg-[#5A52CC]">
            Read Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Regular Resource Card
function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-32 sm:h-auto sm:w-1/3">
          <Image src={resource.image || "/placeholder.svg"} alt={resource.title} fill className="object-cover" />
          {resource.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 sm:w-2/3">
          <div className="flex items-center mb-2">
            {getResourceTypeIcon(resource.type)}
            <span className="text-xs font-medium ml-1 capitalize">{resource.type}</span>
            {resource.duration && (
              <>
                <span className="mx-2">•</span>
                <span className="text-xs">{resource.duration}</span>
              </>
            )}
          </div>
          <h3 className="font-semibold mb-1 line-clamp-2">{resource.title}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{resource.description}</p>

          {resource.type === "event" && resource.eventDate && (
            <div className="flex items-center text-xs text-[#6C63FF] mb-2">
              <Calendar size={12} className="mr-1" />
              {resource.eventDate}
              {resource.location && (
                <>
                  <span className="mx-1">•</span>
                  {resource.location}
                </>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={resource.author.avatar || "/placeholder.svg"} alt={resource.author.name} />
                <AvatarFallback>{resource.author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">{resource.author.name}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-[#6C63FF] hover:text-[#5A52CC] hover:bg-[#6C63FF]/10 p-0 h-8 px-2"
            >
              <span className="mr-1">View</span>
              <ExternalLink size={12} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Advertisement Card
function AdvertisementCard({ ad }: { ad: Advertisement }) {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-black/70 text-white text-xs">
            Sponsored
          </Badge>
        </div>
        <div className="relative h-32">
          <Image src={ad.image || "/placeholder.svg"} alt={ad.title} fill className="object-cover" />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-1">{ad.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">by {ad.sponsor}</span>
            <Button size="sm" className="bg-[#6C63FF] hover:bg-[#5A52CC]">
              Learn More
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

// Helper function to get icon based on resource type
function getResourceTypeIcon(type: ResourceType) {
  switch (type) {
    case "article":
      return <FileText className="w-3 h-3 text-blue-500" />
    case "video":
      return <Video className="w-3 h-3 text-red-500" />
    case "poster":
      return <ImageIcon className="w-3 h-3 text-green-500" />
    case "event":
      return <Calendar className="w-3 h-3 text-purple-500" />
    default:
      return <FileText className="w-3 h-3" />
  }
}
