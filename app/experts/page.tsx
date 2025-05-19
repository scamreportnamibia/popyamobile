"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpertCard, type Expert } from "@/components/expert-card"
import { toast } from "@/hooks/use-toast"

type Message = {
  id: string
  expertId: string
  content: string
  timestamp: Date
  isExpert: boolean
}

// Update sample data with categories, followers, and likes
const experts: Expert[] = [
  {
    id: "ai-doc",
    name: "Dr. We Don't Judge",
    avatar: "/dr-we-dont-judge.jpg",
    specialty: "AI Mental Health Assistant",
    category: "Confidential Support",
    experience: "Always available",
    rating: 4.9,
    reviews: 328,
    followers: 1205,
    isFollowing: false,
    likes: 982,
    isLiked: false,
    about:
      "I'm an AI doctor designed to provide a judgment-free space for you to discuss your mental health concerns. While I'm not a replacement for professional medical advice, I'm here to listen, support, and guide you 24/7.",
    education: ["Trained on extensive mental health resources", "Continuously learning from the latest research"],
    languages: ["English", "Spanish", "French", "German", "Mandarin", "And many more..."],
    availability: "24/7, always available",
    isAI: true,
    isOnline: true,
  },
  {
    id: "e1",
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=200&width=200",
    specialty: "Counseling Psychologist",
    category: "Anxiety & Depression", // Added category
    experience: "10+ years",
    rating: 4.9,
    reviews: 142,
    followers: 356, // Added followers
    isFollowing: false, // Added following state
    likes: 278, // Added likes
    isLiked: false, // Added liked state
    about:
      "I specialize in anxiety, depression, and stress management. My approach is client-centered and compassionate, focusing on practical solutions tailored to your unique situation.",
    education: [
      "Ph.D. in Clinical Psychology, Stanford University",
      "M.A. in Counseling Psychology, Columbia University",
    ],
    languages: ["English", "Spanish"],
    availability: "Mon, Wed, Fri",
    isOnline: true,
  },
  {
    id: "e2",
    name: "Dr. Michael Chen",
    avatar: "/placeholder.svg?height=200&width=200",
    specialty: "Clinical Psychologist",
    category: "Trauma & PTSD", // Added category
    experience: "8 years",
    rating: 4.7,
    reviews: 98,
    followers: 245, // Added followers
    isFollowing: true, // Added following state
    likes: 189, // Added likes
    isLiked: true, // Added liked state
    about:
      "I focus on evidence-based therapies for trauma, PTSD, and relationship issues. I believe in creating a safe space for healing and growth through collaborative therapy.",
    education: ["Psy.D. in Clinical Psychology, University of California", "B.A. in Psychology, Yale University"],
    languages: ["English", "Mandarin"],
    availability: "Tue, Thu, Sat",
    isOnline: false,
  },
  {
    id: "e3",
    name: "Dr. Olivia Patel",
    avatar: "/placeholder.svg?height=200&width=200",
    specialty: "Psychiatrist",
    category: "Medication Management",
    experience: "12 years",
    rating: 4.8,
    reviews: 156,
    followers: 412,
    isFollowing: false,
    likes: 321,
    isLiked: false,
    about:
      "I specialize in medication management for depression, bipolar disorder, and anxiety. I take a holistic approach to mental health, considering both biological and psychological factors.",
    education: ["M.D., Johns Hopkins University", "Residency in Psychiatry, Mayo Clinic"],
    languages: ["English", "Hindi", "Gujarati"],
    availability: "Mon, Tue, Thu, Fri",
    isOnline: true,
  },
  {
    id: "e4",
    name: "Dr. James Wilson",
    avatar: "/placeholder.svg?height=200&width=200",
    specialty: "Trauma Specialist",
    category: "Trauma Recovery",
    experience: "15 years",
    rating: 4.9,
    reviews: 187,
    followers: 523,
    isFollowing: true,
    likes: 456,
    isLiked: true,
    about:
      "I specialize in helping individuals recover from traumatic experiences using EMDR and cognitive processing therapy. I provide a compassionate and non-judgmental space for healing.",
    education: ["Ph.D. in Clinical Psychology, University of Michigan", "Certified EMDR Practitioner"],
    languages: ["English"],
    availability: "Mon-Fri",
    isOnline: false,
  },
  {
    id: "e5",
    name: "Dr. Amara Okafor",
    avatar: "/placeholder.svg?height=200&width=200",
    specialty: "Child & Adolescent Psychologist",
    category: "Child Psychology",
    experience: "9 years",
    rating: 4.6,
    reviews: 112,
    followers: 289,
    isFollowing: false,
    likes: 210,
    isLiked: false,
    about:
      "I specialize in working with children and adolescents facing anxiety, depression, and behavioral challenges. My approach integrates play therapy, CBT, and family systems.",
    education: ["Ph.D. in Child Psychology, University of Chicago", "M.S. in School Psychology, NYU"],
    languages: ["English", "French"],
    availability: "Wed, Thu, Fri",
    isOnline: true,
  },
  {
    id: "lifeline1",
    name: "Lifeline Counselor",
    avatar: "/placeholder.svg?height=200&width=200",
    specialty: "Crisis Intervention",
    category: "Emergency Support",
    experience: "5+ years",
    rating: 4.8,
    reviews: 203,
    followers: 178,
    isFollowing: false,
    likes: 245,
    isLiked: false,
    about:
      "I provide immediate support for those in crisis. Available 24/7 for confidential conversations about any mental health concerns you may be experiencing.",
    education: ["Certified Crisis Counselor", "Mental Health First Aid Certified"],
    languages: ["English", "Oshiwambo", "Afrikaans"],
    availability: "24/7",
    isOnline: true,
    isFree: true,
    organization: "Lifeline/Childline",
  },
  {
    id: "grn1",
    name: "Dr. Thomas Shikongo",
    avatar: "/placeholder.svg?height=200&width=200",
    specialty: "Public Health Psychiatrist",
    category: "General Mental Health",
    experience: "7 years",
    rating: 4.5,
    reviews: 87,
    followers: 124,
    isFollowing: false,
    likes: 156,
    isLiked: false,
    about:
      "I work with the Ministry of Health to provide accessible mental health services. My focus is on depression, anxiety, and substance abuse disorders.",
    education: ["M.D., University of Namibia", "Public Health Certification"],
    languages: ["English", "Oshiwambo", "Afrikaans"],
    availability: "Mon-Fri, 8AM-4PM",
    isOnline: true,
    isFree: true,
    organization: "GRN",
  },
  {
    id: "nampol1",
    name: "Officer Maria Nangolo",
    avatar: "/placeholder.svg?height=200&width=200",
    specialty: "Trauma & Crisis Counselor",
    category: "Trauma Support",
    experience: "6 years",
    rating: 4.7,
    reviews: 65,
    followers: 98,
    isFollowing: false,
    likes: 112,
    isLiked: false,
    about:
      "I'm a trained counselor with the Namibian Police Force, specializing in trauma support for victims of crime and violence. I provide confidential support and can help connect you with additional resources.",
    education: ["Trauma Counseling Certification", "Criminal Psychology Diploma"],
    languages: ["English", "Oshiwambo", "Afrikaans"],
    availability: "Mon-Fri, 9AM-5PM",
    isOnline: false,
    isFree: true,
    organization: "NAMPOL",
  },
]

// Mock data for experts
const mockExperts: Expert[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Clinical Psychologist",
    specialization: "Anxiety & Depression",
    imageUrl: "/placeholder.svg?height=192&width=384&text=Dr.+Sarah",
    isOnline: true,
    isFree: false,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    name: "Michael Ndume",
    title: "Counselor",
    specialization: "Relationship Counseling",
    imageUrl: "/placeholder.svg?height=192&width=384&text=Michael",
    isOnline: false,
    isFree: false,
    rating: 4.5,
    reviewCount: 87,
  },
  {
    id: "3",
    name: "Lifeline Support",
    title: "Crisis Counselor",
    specialization: "Crisis Intervention",
    imageUrl: "/placeholder.svg?height=192&width=384&text=Lifeline",
    isOnline: true,
    isFree: true,
    organization: "Lifeline/Childline",
    rating: 4.9,
    reviewCount: 215,
  },
  {
    id: "4",
    name: "Officer Amupanda",
    title: "Police Counselor",
    specialization: "Trauma & Abuse Support",
    imageUrl: "/placeholder.svg?height=192&width=384&text=Officer",
    isOnline: true,
    isFree: true,
    organization: "NAMPOL",
    rating: 4.7,
    reviewCount: 92,
  },
  {
    id: "5",
    name: "Dr. Nangolo",
    title: "Government Psychiatrist",
    specialization: "Mental Health Services",
    imageUrl: "/placeholder.svg?height=192&width=384&text=Dr.+Nangolo",
    isOnline: false,
    isFree: true,
    organization: "GRN",
    rating: 4.6,
    reviewCount: 108,
  },
]

export default function ExpertsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>(mockExperts)
  const [activeTab, setActiveTab] = useState("all")

  // Filter experts based on search query and active tab
  useEffect(() => {
    let filtered = mockExperts

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (expert) =>
          expert.name.toLowerCase().includes(query) ||
          expert.specialization.toLowerCase().includes(query) ||
          expert.title.toLowerCase().includes(query),
      )
    }

    // Apply tab filter
    if (activeTab === "online") {
      filtered = filtered.filter((expert) => expert.isOnline)
    } else if (activeTab === "free") {
      filtered = filtered.filter((expert) => expert.isFree)
    }

    setFilteredExperts(filtered)
  }, [searchQuery, activeTab])

  // Handle expert interactions
  const handleCallClick = (expertId: string, type: "audio" | "video") => {
    const expert = mockExperts.find((e) => e.id === expertId)
    if (!expert) return

    if (expert.isOnline) {
      // Navigate to call page with expert ID and call type
      router.push(`/video-call?expert=${expertId}&type=${type}`)
      toast({
        title: `Starting ${type} call`,
        description: `Connecting with ${expert.name}...`,
      })
    } else {
      // Show scheduling dialog (handled in ExpertCard component)
    }
  }

  const handleChatClick = (expertId: string) => {
    const expert = mockExperts.find((e) => e.id === expertId)
    if (!expert) return

    // Navigate to chat page with expert ID
    router.push(`/chat?expert=${expertId}`)
    toast({
      title: "Opening chat",
      description: `Starting conversation with ${expert.name}`,
    })
  }

  const handleScheduleClick = (expertId: string) => {
    const expert = mockExperts.find((e) => e.id === expertId)
    if (!expert) return

    toast({
      title: "Appointment scheduled",
      description: `Your appointment with ${expert.name} has been scheduled. You'll receive a notification before the session.`,
    })
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mental Health Experts</h1>

      {/* Search and Filter */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search experts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="all">All Experts</TabsTrigger>
          <TabsTrigger value="online">Online Now</TabsTrigger>
          <TabsTrigger value="free">Free Services</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Expert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExperts.length > 0 ? (
          filteredExperts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onCallClick={handleCallClick}
              onChatClick={handleChatClick}
              onScheduleClick={handleScheduleClick}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-500">No experts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
