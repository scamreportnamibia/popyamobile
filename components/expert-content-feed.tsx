"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  Video,
  MessageSquare,
  FileText,
  Calendar,
  Lightbulb,
  Heart,
  Share2,
  ThumbsUp,
  LinkIcon,
  Youtube,
  Download,
  ExternalLink,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin } from "lucide-react"

type ContentType = "article" | "video" | "announcement" | "tip" | "event" | "group" | "youtube" | "document" | "image"

type Author = {
  id: string
  name: string
  role: string
  avatar: string
}

type Comment = {
  id: string
  author: {
    id: string
    name: string
    avatar: string
  }
  text: string
  date: string
  likes: number
}

type Advertisement = {
  id: string
  title: string
  description: string
  image: string
  link: string
  sponsor: string
}

type ExpertContent = {
  id: string
  type: ContentType
  title: string
  excerpt: string
  image?: string
  author?: Author
  date: string
  readTime?: string
  duration?: string
  link: string
  color: string
  likes: number
  shares: number
  comments: Comment[]
  youtubeUrl?: string
  eventDate?: string
  eventLocation?: string
  groupLink?: string
  documentUrl?: string
  documentType?: string
}

// Sample expert content
const generateExpertContent = (startIndex: number, count: number): ExpertContent[] => {
  const types: ContentType[] = [
    "article",
    "video",
    "announcement",
    "tip",
    "event",
    "group",
    "youtube",
    "document",
    "image",
  ]
  const authors = [
    {
      id: "author1",
      name: "Dr. Maria Ndapewa",
      role: "Clinical Psychologist",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "author2",
      name: "Thomas Shilongo",
      role: "Mindfulness Coach",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "author3",
      name: "Dr. James Hamukwaya",
      role: "Psychiatrist",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "author4",
      name: "Emma Nangolo",
      role: "Counselor",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  ]
  const colors = [
    "from-[rgb(41,121,255)] to-[rgb(94,53,177)]",
    "from-[rgb(244,67,54)] to-[rgb(255,82,82)]",
    "from-[rgb(0,200,83)] to-[rgb(29,233,182)]",
    "from-[rgb(255,0,0)] to-[rgb(200,0,0)]",
    "from-[rgb(156,39,176)] to-[rgb(123,31,162)]",
    "from-[rgb(3,169,244)] to-[rgb(33,150,243)]",
  ]

  const result: ExpertContent[] = []

  for (let i = 0; i < count; i++) {
    const index = startIndex + i
    const type = types[index % types.length]
    const author = authors[index % authors.length]
    const color = colors[index % colors.length]

    const content: ExpertContent = {
      id: `content-${index}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Content #${index}`,
      excerpt: `This is a sample ${type} about mental health and wellbeing. It provides valuable insights and practical advice.`,
      author,
      image: "/placeholder.svg?height=200&width=400",
      date: `May ${(index % 30) + 1}, 2025`,
      readTime: type === "article" ? `${(index % 10) + 3} min read` : undefined,
      duration: type === "video" ? `${(index % 10) + 2}:${(index % 60).toString().padStart(2, "0")}` : undefined,
      link: `/${type}s/sample-${type}-${index}`,
      color,
      likes: (index % 50) + 10,
      shares: (index % 30) + 5,
      comments: [],
      youtubeUrl: type === "youtube" ? "https://www.youtube.com/embed/dQw4w9WgXcQ" : undefined,
      eventDate: type === "event" ? `June ${(index % 30) + 1}, 2025 | ${(index % 12) + 1}:00 PM` : undefined,
      eventLocation: type === "event" ? "Windhoek Community Center, Main Hall" : undefined,
      groupLink: type === "group" ? "https://meet.google.com/example-link" : undefined,
      documentUrl: type === "document" ? "/sample-document.pdf" : undefined,
      documentType: type === "document" ? ["PDF", "DOCX", "PPTX"][index % 3] : undefined,
    }

    result.push(content)
  }

  return result
}

// Sample advertisements
const advertisements: Advertisement[] = [
  {
    id: "ad1",
    title: "Mental Health Awareness Month",
    description: "Join our free webinar series on managing anxiety and stress in everyday life.",
    image: "/placeholder.svg?height=200&width=400",
    link: "/webinar-series",
    sponsor: "Namibia Mental Health Association",
  },
  {
    id: "ad2",
    title: "New Self-Care App",
    description: "Track your mood, practice mindfulness, and connect with therapists - all in one app.",
    image: "/placeholder.svg?height=200&width=400",
    link: "/self-care-app",
    sponsor: "MindfulTech Solutions",
  },
  {
    id: "ad3",
    title: "Online Therapy Sessions",
    description: "Professional therapy from the comfort of your home. First session free.",
    image: "/placeholder.svg?height=200&width=400",
    link: "/online-therapy",
    sponsor: "TherapyConnect",
  },
]

export function ExpertContentFeed() {
  const [content, setContent] = useState<ExpertContent[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [newComments, setNewComments] = useState<Record<string, string>>({})
  const [likedContent, setLikedContent] = useState<Record<string, boolean>>({})
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({})
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)

  // Initial load
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      // In a real app, you would fetch from an API
      setTimeout(() => {
        setContent(generateExpertContent(0, 5))
        setLoading(false)
      }, 1000)
    }

    fetchContent()
  }, [])

  // Last element ref for infinite scrolling
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreContent()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  // Load more content
  const loadMoreContent = () => {
    setLoading(true)
    // In a real app, you would fetch from an API with pagination
    setTimeout(() => {
      const newContent = generateExpertContent(page * 5, 5)
      setContent((prev) => [...prev, ...newContent])
      setPage((prev) => prev + 1)
      setHasMore(page < 10) // Limit to 10 pages for demo
      setLoading(false)
    }, 1000)
  }

  // Content type icon mapping
  const getContentIcon = (type: ContentType, className = "") => {
    switch (type) {
      case "article":
        return <FileText className={className} />
      case "video":
        return <Video className={className} />
      case "youtube":
        return <Youtube className={className} />
      case "announcement":
        return <MessageSquare className={className} />
      case "tip":
        return <Lightbulb className={className} />
      case "event":
        return <Calendar className={className} />
      case "group":
        return <MessageSquare className={className} />
      case "document":
        return <BookOpen className={className} />
      case "image":
        return <Image width={16} height={16} src="/placeholder.svg" alt="Image" className={className} />
      default:
        return <FileText className={className} />
    }
  }

  const toggleComments = (contentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [contentId]: !prev[contentId],
    }))
  }

  const handleNewComment = (contentId: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComments((prev) => ({
      ...prev,
      [contentId]: e.target.value,
    }))
  }

  const submitComment = (contentId: string) => {
    if (!newComments[contentId]?.trim()) return

    // In a real app, you would send this to an API
    const updatedContent = content.map((item) => {
      if (item.id === contentId) {
        return {
          ...item,
          comments: [
            ...item.comments,
            {
              id: `new-${Date.now()}`,
              author: {
                id: "currentUser",
                name: "You",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              text: newComments[contentId],
              date: "Just now",
              likes: 0,
            },
          ],
        }
      }
      return item
    })

    setContent(updatedContent)
    setNewComments((prev) => ({
      ...prev,
      [contentId]: "",
    }))
  }

  const toggleLike = (contentId: string) => {
    // In a real app, you would send this to an API
    setLikedContent((prev) => {
      const newState = { ...prev, [contentId]: !prev[contentId] }

      // Update content likes count
      const updatedContent = content.map((item) => {
        if (item.id === contentId) {
          return {
            ...item,
            likes: item.likes + (newState[contentId] ? 1 : -1),
          }
        }
        return item
      })
      setContent(updatedContent)

      return newState
    })
  }

  const toggleCommentLike = (contentId: string, commentId: string) => {
    const likeKey = `${contentId}-${commentId}`

    // In a real app, you would send this to an API
    setLikedComments((prev) => {
      const newState = { ...prev, [likeKey]: !prev[likeKey] }

      // Update comment likes count
      const updatedContent = content.map((item) => {
        if (item.id === contentId) {
          return {
            ...item,
            comments: item.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: comment.likes + (newState[likeKey] ? 1 : -1),
                }
              }
              return comment
            }),
          }
        }
        return item
      })
      setContent(updatedContent)

      return newState
    })
  }

  const shareContent = (contentId: string) => {
    // In a real app, you would implement sharing functionality
    // For now, we'll just update the share count
    const updatedContent = content.map((item) => {
      if (item.id === contentId) {
        return {
          ...item,
          shares: item.shares + 1,
        }
      }
      return item
    })
    setContent(updatedContent)

    // Mock share dialog
    alert(`Content shared! In a real app, this would open a share dialog.`)
  }

  // Render advertisement
  const renderAdvertisement = (index: number) => {
    const ad = advertisements[index % advertisements.length]
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card-modern overflow-hidden border-2 border-yellow-400 dark:border-yellow-600 relative mb-6"
      >
        <div className="absolute top-0 right-0 bg-yellow-400 dark:bg-yellow-600 text-xs font-bold text-black dark:text-white px-2 py-1 rounded-bl-md">
          SPONSORED
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{ad.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{ad.description}</p>
          <div className="relative h-40 w-full mb-3">
            <Image src={ad.image || "/placeholder.svg"} alt={ad.title} fill className="object-cover rounded-md" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Sponsored by {ad.sponsor}</span>
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-full flex items-center"
            >
              <ExternalLink className="w-3 h-3 mr-1" /> Learn More
            </a>
          </div>
        </div>
      </motion.div>
    )
  }

  if (loading && content.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-modern p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {content.map((item, index) => {
        // Insert advertisement after every 3 content items
        const isLastElement = index === content.length - 1
        const shouldRenderAd = (index + 1) % 3 === 0 && index > 0

        return (
          <div key={item.id}>
            <motion.div
              ref={isLastElement ? lastElementRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="card-modern overflow-hidden"
            >
              {/* Content Header */}
              <div className="p-4 pb-0">
                {item.author && (
                  <div className="flex items-center mb-3">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
                      <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.author.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.author.role} • {item.date}
                      </p>
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.excerpt}</p>
              </div>

              {/* Media Content */}
              {(item.type === "article" ||
                item.type === "video" ||
                item.type === "event" ||
                item.type === "group" ||
                item.type === "image") &&
                item.image && (
                  <div className="relative h-48 w-full mb-3">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />

                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[rgb(244,67,54)] flex items-center justify-center">
                            <Video size={24} className="text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={`absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/50 to-transparent`}>
                      <div className="flex items-center h-full px-3">
                        <div
                          className={`px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium flex items-center`}
                        >
                          {getContentIcon(item.type, "w-3 h-3 mr-1")}
                          <span className="capitalize">{item.type}</span>
                        </div>
                      </div>
                    </div>

                    {item.type === "video" && item.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                        {item.duration}
                      </div>
                    )}
                  </div>
                )}

              {/* Document Type */}
              {item.type === "document" && (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 mb-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.documentType === "PDF"
                          ? "bg-red-100 text-red-600"
                          : item.documentType === "DOCX"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {item.title.substring(0, 20)}...{item.documentType?.toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="flex items-center">
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                </div>
              )}

              {/* YouTube Embed */}
              {item.type === "youtube" && item.youtubeUrl && (
                <div className="relative w-full h-0 pb-[56.25%] mb-3">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={item.youtubeUrl}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Event Details */}
              {item.type === "event" && item.eventDate && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 mb-3">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-[rgb(156,39,176)] mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.eventDate}</p>
                      {item.eventLocation && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" /> {item.eventLocation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Group Join Link */}
              {item.type === "group" && item.groupLink && (
                <div className="px-4 py-3 bg-[rgb(3,169,244)]/10 mb-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700 dark:text-gray-300">Join this support group</p>
                    <a
                      href={item.groupLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[rgb(3,169,244)] text-white text-xs font-medium rounded-full flex items-center"
                    >
                      <LinkIcon className="w-3 h-3 mr-1" /> Join Group
                    </a>
                  </div>
                </div>
              )}

              {/* Social Interaction Bar */}
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(item.id)}
                      className={`flex items-center text-sm ${
                        likedContent[item.id]
                          ? "text-[rgb(244,67,54)]"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 mr-1 ${likedContent[item.id] ? "fill-[rgb(244,67,54)]" : "fill-none"}`}
                      />
                      <span>{item.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(item.id)}
                      className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <MessageSquare className="w-5 h-5 mr-1" />
                      <span>{item.comments.length}</span>
                    </button>

                    <button
                      onClick={() => shareContent(item.id)}
                      className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <Share2 className="w-5 h-5 mr-1" />
                      <span>{item.shares}</span>
                    </button>
                  </div>

                  <Link href={item.link} className="text-xs font-medium text-[rgb(41,121,255)] hover:underline">
                    Read more
                  </Link>
                </div>
              </div>

              {/* Comments Section */}
              {expandedComments[item.id] && (
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Comments ({item.comments.length})
                  </h4>

                  {item.comments.length > 0 ? (
                    <div className="space-y-4 mb-4">
                      {item.comments.map((comment) => (
                        <div key={comment.id} className="flex">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                              <div className="flex justify-between items-start">
                                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                  {comment.author.name}
                                </p>
                                <span className="text-xs text-gray-500">{comment.date}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
                            </div>
                            <div className="flex items-center mt-1 ml-1">
                              <button
                                onClick={() => toggleCommentLike(item.id, comment.id)}
                                className={`flex items-center text-xs ${
                                  likedComments[`${item.id}-${comment.id}`]
                                    ? "text-[rgb(244,67,54)]"
                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                              >
                                <ThumbsUp
                                  className={`w-3 h-3 mr-1 ${
                                    likedComments[`${item.id}-${comment.id}`] ? "fill-[rgb(244,67,54)]" : "fill-none"
                                  }`}
                                />
                                <span>{comment.likes}</span>
                              </button>
                              <span className="text-xs text-gray-400 mx-2">•</span>
                              <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">No comments yet. Be the first to comment!</p>
                  )}

                  {/* Add Comment Form */}
                  <div className="flex">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="You" />
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Write a comment..."
                        className="min-h-[60px] text-sm"
                        value={newComments[item.id] || ""}
                        onChange={(e) => handleNewComment(item.id, e)}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          onClick={() => submitComment(item.id)}
                          disabled={!newComments[item.id]?.trim()}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Render advertisement after every 3rd item */}
            {shouldRenderAd && renderAdvertisement(Math.floor(index / 3))}
          </div>
        )
      })}

      {/* Loading indicator for infinite scroll */}
      {loading && content.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-[rgb(41,121,255)] rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
