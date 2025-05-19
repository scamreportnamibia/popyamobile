"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, MessageSquare, Search, User, UserPlus, Users, X } from "lucide-react"
import Link from "next/link"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { motion, AnimatePresence } from "framer-motion"

type Group = {
  id: string
  name: string
  description: string
  members: number
  isAIEnabled: boolean
  tags: string[]
  joined: boolean
}

// Sample data
const sampleGroups: Group[] = [
  {
    id: "yell",
    name: "I Just Want to Yell",
    description: "A safe space to express strong emotions and frustrations. Shout it out!",
    members: 356,
    isAIEnabled: true,
    tags: ["venting", "emotions", "frustration"],
    joined: true,
  },
  {
    id: "anxiety",
    name: "Anxiety Support",
    description: "For those dealing with anxiety, panic attacks, and worry.",
    members: 245,
    isAIEnabled: false,
    tags: ["anxiety", "panic", "stress"],
    joined: false,
  },
  {
    id: "grief",
    name: "Grief & Loss",
    description: "Supporting each other through the journey of grief and loss.",
    members: 189,
    isAIEnabled: false,
    tags: ["grief", "loss", "bereavement"],
    joined: true,
  },
  {
    id: "depression",
    name: "Depression Support",
    description: "A community for those experiencing depression to find support and understanding.",
    members: 278,
    isAIEnabled: false,
    tags: ["depression", "mood", "sadness"],
    joined: false,
  },
  {
    id: "lgbtq",
    name: "LGBTQ+ Mental Health",
    description: "A supportive space for LGBTQ+ individuals to discuss mental health challenges.",
    members: 163,
    isAIEnabled: false,
    tags: ["lgbtq", "identity", "support"],
    joined: false,
  },
  {
    id: "stress",
    name: "Stress Management",
    description: "Techniques and support for managing stress in daily life.",
    members: 207,
    isAIEnabled: false,
    tags: ["stress", "coping", "relief"],
    joined: false,
  },
  {
    id: "trauma",
    name: "Trauma Recovery",
    description: "For those healing from trauma and PTSD.",
    members: 152,
    isAIEnabled: false,
    tags: ["trauma", "ptsd", "recovery"],
    joined: false,
  },
]

type Message = {
  id: string
  groupId: string
  userCode: string
  content: string
  timestamp: Date
  isAI: boolean
  mentions: string[]
}

// Sample chat messages for "I Just Want to Yell" group
const sampleMessages: Message[] = [
  {
    id: "m1",
    groupId: "yell",
    userCode: "12345",
    content: "I'M SO TIRED OF BEING IGNORED AT WORK!! MY IDEAS ARE GOOD BUT NO ONE LISTENS!!!",
    timestamp: new Date("2025-05-18T09:10:00"),
    isAI: false,
    mentions: [],
  },
  {
    id: "m2",
    groupId: "yell",
    userCode: "AI",
    content:
      "I hear your frustration. It's difficult when you feel unheard. Would you like to share more about what happened?",
    timestamp: new Date("2025-05-18T09:11:00"),
    isAI: true,
    mentions: ["12345"],
  },
  {
    id: "m3",
    groupId: "yell",
    userCode: "67890",
    content: "MY NEIGHBOR'S DOG WON'T STOP BARKING AT 3AM EVERY SINGLE NIGHT! I HAVEN'T SLEPT PROPERLY IN WEEKS!",
    timestamp: new Date("2025-05-18T09:15:00"),
    isAI: false,
    mentions: [],
  },
  {
    id: "m4",
    groupId: "yell",
    userCode: "AI",
    content:
      "That sounds incredibly frustrating. Sleep disruption can really affect your wellbeing. Have you tried talking to your neighbor about it?",
    timestamp: new Date("2025-05-18T09:16:00"),
    isAI: true,
    mentions: ["67890"],
  },
  {
    id: "m5",
    groupId: "yell",
    userCode: "54321",
    content: "I JUST FAILED AN IMPORTANT EXAM THAT I STUDIED WEEKS FOR! I'M SO ANGRY AT MYSELF!",
    timestamp: new Date("2025-05-18T09:20:00"),
    isAI: false,
    mentions: [],
  },
  {
    id: "m6",
    groupId: "yell",
    userCode: "12345",
    content:
      "@54321 I know how that feels. I failed my driving test twice before passing. It sucks but you'll get through it!",
    timestamp: new Date("2025-05-18T09:22:00"),
    isAI: false,
    mentions: ["54321"],
  },
  {
    id: "m7",
    groupId: "yell",
    userCode: "AI",
    content:
      "@54321 It's natural to feel disappointed after putting in so much effort. Remember that failure is part of learning. Would you like to talk about what might have gone wrong or how you're feeling?",
    timestamp: new Date("2025-05-18T09:23:00"),
    isAI: true,
    mentions: ["54321"],
  },
]

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(sampleGroups)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "joined">("all")
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [showGroupChat, setShowGroupChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [newMessage, setNewMessage] = useState("")
  const [mentioningSomeone, setMentioningSomeone] = useState(false)
  const [userCode, setUserCode] = useState("54321") // Current user code

  const filteredGroups = groups
    .filter(
      (group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .filter((group) => activeFilter === "all" || (activeFilter === "joined" && group.joined))

  const toggleJoin = (groupId: string) => {
    setGroups(groups.map((group) => (group.id === groupId ? { ...group, joined: !group.joined } : group)))
  }

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group)
    setShowGroupChat(true)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return

    const mentions = newMessage.match(/@(\w+)/g)?.map((mention) => mention.substring(1)) || []

    const newMsg: Message = {
      id: `m${Date.now()}`,
      groupId: selectedGroup.id,
      userCode,
      content: newMessage,
      timestamp: new Date(),
      isAI: false,
      mentions,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // If this is the "I Just Want to Yell" group, add AI response after a delay
    if (selectedGroup.isAIEnabled) {
      setTimeout(() => {
        const aiResponse: Message = {
          id: `m${Date.now() + 1}`,
          groupId: selectedGroup.id,
          userCode: "AI",
          content: `@${userCode} Thank you for sharing. How are you feeling after expressing that? Would you like to discuss it further?`,
          timestamp: new Date(),
          isAI: true,
          mentions: [userCode],
        }

        setMessages((prevMessages) => [...prevMessages, aiResponse])
      }, 1500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "@" && !mentioningSomeone) {
      setMentioningSomeone(true)
    } else if (e.key === " " && mentioningSomeone) {
      setMentioningSomeone(false)
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-[56px] bg-white z-30 border-b px-4 py-2 flex items-center">
        <Link href="/" className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="ml-3 text-lg font-semibold">Support Groups</h1>
      </div>

      {!showGroupChat ? (
        <div className="p-4">
          {/* Search and Filters */}
          <AnimatedContainer className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search groups..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
              />
            </div>

            <div className="flex mt-3 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${
                  activeFilter === "all" ? "bg-white shadow-sm text-[#6C63FF]" : "text-gray-600"
                }`}
              >
                All Groups
              </button>
              <button
                onClick={() => setActiveFilter("joined")}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${
                  activeFilter === "joined" ? "bg-white shadow-sm text-[#6C63FF]" : "text-gray-600"
                }`}
              >
                My Groups
              </button>
            </div>
          </AnimatedContainer>

          {/* Featured Group */}
          <AnimatedContainer animation="slide" delay={0.1} className="mb-4">
            <div
              className="bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] p-4 rounded-xl text-white shadow-md"
              onClick={() => handleGroupClick(groups.find((g) => g.id === "yell")!)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">I Just Want to Yell</h3>
                    <div className="flex items-center text-white/80 text-sm">
                      <Users size={14} className="mr-1" />
                      <span>356 members</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 px-2 py-1 rounded-full text-xs">AI Powered</div>
              </div>
              <p className="text-white/90 text-sm mb-3">
                A safe space to express strong emotions and frustrations. Shout it out!
              </p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {["venting", "emotions", "frustration"].map((tag) => (
                    <span key={tag} className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="bg-white text-[#6C63FF] px-3 py-1 rounded-lg text-sm font-medium">Open Chat</button>
              </div>
            </div>
          </AnimatedContainer>

          {/* Groups List */}
          <AnimatedContainer animation="slide" delay={0.2}>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Available Groups</h2>

            {filteredGroups.length === 0 ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No groups found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGroups.map(
                  (group) =>
                    group.id !== "yell" && (
                      <motion.div
                        key={group.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                      >
                        <div className="flex justify-between">
                          <div className="flex-1 pr-4">
                            <h3 className="font-medium text-gray-800 mb-1">{group.name}</h3>
                            <div className="flex items-center text-gray-500 text-sm mb-2">
                              <Users size={14} className="mr-1" />
                              <span>{group.members} members</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{group.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {group.tags.map((tag) => (
                                <span key={tag} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col justify-between items-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleJoin(group.id)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                group.joined ? "bg-gray-100 text-gray-700" : "bg-[#6C63FF] text-white"
                              }`}
                            >
                              {group.joined ? (
                                <span>Joined</span>
                              ) : (
                                <span className="flex items-center">
                                  <UserPlus size={14} className="mr-1" />
                                  Join
                                </span>
                              )}
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleGroupClick(group)}
                              className="mt-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
                            >
                              Open
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ),
                )}
              </div>
            )}
          </AnimatedContainer>
        </div>
      ) : (
        <AnimatePresence>
          {selectedGroup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-[calc(100vh-120px)]"
            >
              {/* Group Chat Header */}
              <div className="bg-white border-b px-4 py-2 flex items-center justify-between sticky top-[96px] z-30">
                <div className="flex items-center">
                  <button onClick={() => setShowGroupChat(false)} className="p-1 rounded-full hover:bg-gray-100">
                    <X size={20} className="text-gray-600" />
                  </button>
                  <div className="ml-3">
                    <h2 className="font-medium">{selectedGroup.name}</h2>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Users size={12} className="mr-1" />
                      <span>{selectedGroup.members} members</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {selectedGroup.isAIEnabled && (
                    <span className="bg-[#6C63FF]/10 text-[#6C63FF] text-xs px-2 py-0.5 rounded-full">AI Support</span>
                  )}
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages
                    .filter((message) => message.groupId === selectedGroup.id)
                    .map((message) => (
                      <AnimatedContainer
                        key={message.id}
                        animation="slide"
                        className={`flex ${message.userCode === userCode ? "justify-end" : ""}`}
                      >
                        <div
                          className={`max-w-[80%] ${
                            message.isAI
                              ? "bg-[#43C6AC]/10 border border-[#43C6AC]/20"
                              : message.userCode === userCode
                                ? "bg-[#6C63FF] text-white"
                                : "bg-white border border-gray-200"
                          } rounded-lg p-3 shadow-sm`}
                        >
                          <div className="flex items-center mb-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                message.isAI
                                  ? "bg-[#43C6AC]/20"
                                  : message.userCode === userCode
                                    ? "bg-white/20"
                                    : "bg-gray-200"
                              }`}
                            >
                              {message.isAI ? (
                                <span
                                  className={`text-xs font-bold ${message.userCode === userCode ? "text-white" : "text-[#43C6AC]"}`}
                                >
                                  AI
                                </span>
                              ) : (
                                <User
                                  size={12}
                                  className={message.userCode === userCode ? "text-white" : "text-gray-600"}
                                />
                              )}
                            </div>
                            <span
                              className={`text-xs font-medium ml-1.5 ${
                                message.userCode === userCode
                                  ? "text-white/90"
                                  : message.isAI
                                    ? "text-[#43C6AC]"
                                    : "text-gray-700"
                              }`}
                            >
                              {message.isAI
                                ? "Popya AI"
                                : message.userCode === userCode
                                  ? "You"
                                  : `User #${message.userCode}`}
                            </span>
                            <span
                              className={`text-xs ml-2 ${
                                message.userCode === userCode ? "text-white/70" : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </span>
                          </div>

                          <p
                            className={`${
                              message.userCode === userCode
                                ? "text-white"
                                : message.isAI
                                  ? "text-gray-800"
                                  : "text-gray-800"
                            }`}
                          >
                            {message.content.split(" ").map((word, i) => {
                              if (word.startsWith("@")) {
                                const mention = word.substring(1)
                                return (
                                  <span
                                    key={i}
                                    className={`font-medium ${
                                      message.userCode === userCode ? "text-white underline" : "text-[#6C63FF]"
                                    }`}
                                  >
                                    @{mention}{" "}
                                  </span>
                                )
                              }
                              return word + " "
                            })}
                          </p>
                        </div>
                      </AnimatedContainer>
                    ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="bg-white border-t p-3 sticky bottom-0">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message ${selectedGroup.name}...`}
                    className="flex-1 p-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-[#6C63FF] text-white rounded-r-lg disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
                {mentioningSomeone && (
                  <div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Mention someone:</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setNewMessage((prev) => prev + "admin ")
                          setMentioningSomeone(false)
                        }}
                        className="px-2 py-1 bg-gray-100 rounded text-xs"
                      >
                        @admin
                      </button>
                      {["12345", "67890"].map((code) => (
                        <button
                          key={code}
                          onClick={() => {
                            setNewMessage((prev) => prev + code + " ")
                            setMentioningSomeone(false)
                          }}
                          className="px-2 py-1 bg-gray-100 rounded text-xs"
                        >
                          @{code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
