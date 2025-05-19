"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Book,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Save,
  Trash2,
  X,
  Clock,
  Tag,
  ImageIcon,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type DiaryEntry = {
  id: string
  date: Date
  title: string
  content: string
  mood: string
  tags?: string[]
  images?: string[]
  aiAnalysis?: {
    sentiment: "positive" | "neutral" | "negative"
    topics: string[]
    suggestions: string[]
  }
}

// Sample data
const initialEntries: DiaryEntry[] = [
  {
    id: "1",
    date: new Date("2025-05-17"),
    title: "A Good Day",
    content:
      "Today was better than yesterday. I managed to go for a walk in the park and the fresh air really helped clear my mind. I still had some anxious thoughts in the evening, but overall it was a good day.",
    mood: "😊",
    tags: ["self-care", "outdoors", "anxiety"],
    aiAnalysis: {
      sentiment: "positive",
      topics: ["anxiety", "self-care", "outdoor activity"],
      suggestions: [
        "Continue with outdoor activities as they seem to help your mood",
        "Consider journaling about your anxious thoughts to identify patterns",
        "Try a breathing exercise when evening anxiety occurs",
      ],
    },
  },
  {
    id: "2",
    date: new Date("2025-05-15"),
    title: "Struggling",
    content:
      "Had a difficult day today. Felt overwhelmed with work and couldn't focus. The anxiety was pretty bad in the morning but got better after I talked to my friend Sarah. Need to remember that sharing helps.",
    mood: "😔",
    tags: ["work stress", "anxiety", "friends"],
    aiAnalysis: {
      sentiment: "negative",
      topics: ["work stress", "anxiety", "social support"],
      suggestions: [
        "Social connection seems to help - reach out to friends when feeling overwhelmed",
        "Consider breaking work tasks into smaller, manageable chunks",
        "Morning anxiety might benefit from a structured morning routine",
      ],
    },
  },
  {
    id: "3",
    date: new Date("2025-05-10"),
    title: "Mixed Feelings",
    content:
      "Started the day feeling down but the therapy session really helped. My therapist suggested a new breathing technique that I tried when I felt anxious later. It actually worked quite well. Going to keep practicing.",
    mood: "😐",
    tags: ["therapy", "coping skills", "breathing"],
    aiAnalysis: {
      sentiment: "neutral",
      topics: ["therapy", "coping techniques", "breathing exercises"],
      suggestions: [
        "Continue practicing the breathing technique that worked for you",
        "Consider tracking when you use the technique and its effectiveness",
        "Therapy seems beneficial - maintain regular sessions",
      ],
    },
  },
]

const moodOptions = ["😊", "😌", "😐", "😔", "😠", "😰"]

export default function DiariesPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>(initialEntries)
  const [showNewEntryForm, setShowNewEntryForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAiAnalysis, setShowAiAnalysis] = useState<string | null>(null)

  const [newEntryTitle, setNewEntryTitle] = useState("")
  const [newEntryContent, setNewEntryContent] = useState("")
  const [newEntryMood, setNewEntryMood] = useState("😊")
  const [newEntryTags, setNewEntryTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
  }

  const handleNewEntry = () => {
    setNewEntryTitle("")
    setNewEntryContent("")
    setNewEntryMood("😊")
    setNewEntryTags([])
    setEditingEntry(null)
    setShowNewEntryForm(true)
  }

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry)
    setNewEntryTitle(entry.title)
    setNewEntryContent(entry.content)
    setNewEntryMood(entry.mood)
    setNewEntryTags(entry.tags || [])
    setShowNewEntryForm(true)
  }

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(entries.filter((entry) => entry.id !== id))
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !newEntryTags.includes(newTag.trim())) {
      setNewEntryTags([...newEntryTags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewEntryTags(newEntryTags.filter((t) => t !== tag))
  }

  const handleSaveEntry = () => {
    if (!newEntryTitle.trim() || !newEntryContent.trim()) return

    // Mock AI analysis based on content
    const mockAiAnalysis = {
      sentiment:
        newEntryContent.includes("good") || newEntryContent.includes("happy")
          ? ("positive" as const)
          : newEntryContent.includes("bad") || newEntryContent.includes("sad") || newEntryContent.includes("anxious")
            ? ("negative" as const)
            : ("neutral" as const),
      topics: newEntryTags.length > 0 ? newEntryTags : ["general"],
      suggestions: [
        "Consider practicing mindfulness to stay present",
        "Regular exercise can help improve your mood",
        "Connecting with friends might provide emotional support",
      ],
    }

    if (editingEntry) {
      setEntries(
        entries.map((entry) =>
          entry.id === editingEntry.id
            ? {
                ...entry,
                title: newEntryTitle,
                content: newEntryContent,
                mood: newEntryMood,
                tags: newEntryTags,
                aiAnalysis: mockAiAnalysis,
              }
            : entry,
        ),
      )
    } else {
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: selectedDate,
        title: newEntryTitle,
        content: newEntryContent,
        mood: newEntryMood,
        tags: newEntryTags,
        aiAnalysis: mockAiAnalysis,
      }
      setEntries([newEntry, ...entries])
    }

    setShowNewEntryForm(false)
    setEditingEntry(null)
  }

  const entriesForSelectedDate = entries.filter((entry) => entry.date.toDateString() === selectedDate.toDateString())

  const hasEntryOnDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return entries.some((entry) => entry.date.toDateString() === date.toDateString())
  }

  const getMoodForDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const entry = entries.find((entry) => entry.date.toDateString() === date.toDateString())
    return entry?.mood
  }

  // Calendar rendering
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const monthName = currentMonth.toLocaleString("default", { month: "long" })
    const year = currentMonth.getFullYear()

    const days = []
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    // Add day names
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={`day-name-${i}`}
          className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 h-8 flex items-center justify-center"
        >
          {dayNames[i]}
        </div>,
      )
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />)
    }

    // Add cells for days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = date.toDateString() === selectedDate.toDateString()
      const hasEntry = hasEntryOnDate(day)
      const mood = getMoodForDate(day)

      days.push(
        <motion.div
          key={`day-${day}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDateClick(day)}
          className={`h-10 flex items-center justify-center rounded-full cursor-pointer relative ${
            isSelected
              ? "bg-[#6C63FF] text-white"
              : isToday
                ? "border border-[#6C63FF] text-[#6C63FF] dark:text-[#8B5CF6]"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {day}
          {hasEntry && !isSelected && <div className="absolute -bottom-1">{mood}</div>}
        </motion.div>,
      )
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {monthName} {year}
          </h2>
          <div className="flex space-x-2">
            <button onClick={handlePreviousMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    )
  }

  // Render AI analysis
  const renderAiAnalysis = (analysis: DiaryEntry["aiAnalysis"], entryId: string) => {
    if (!analysis) return null

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center">
            <Book size={14} className="text-white" />
          </div>
          <h4 className="ml-2 text-sm font-medium text-gray-800 dark:text-gray-200">AI Insights</h4>
        </div>

        <div className="pl-8">
          <div className="flex items-center mb-2">
            {analysis.sentiment === "positive" && <Smile size={16} className="text-green-500 mr-2" />}
            {analysis.sentiment === "neutral" && <Meh size={16} className="text-gray-500 mr-2" />}
            {analysis.sentiment === "negative" && <Frown size={16} className="text-red-500 mr-2" />}
            <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">
              <span className="font-medium">Mood:</span> {analysis.sentiment}
            </p>
          </div>

          <div className="mb-2">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              <span className="font-medium">Topics:</span>
            </p>
            <div className="flex flex-wrap gap-1">
              {analysis.topics.map((topic, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              <span className="font-medium">Suggestions:</span>
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
              {analysis.suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-[56px] bg-white dark:bg-gray-800 z-30 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </Link>
          <h1 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-200">My Journal</h1>
        </div>
        <button
          onClick={handleNewEntry}
          className="flex items-center justify-center p-2 rounded-full bg-[#6C63FF] text-white"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="p-4">
        {/* Calendar */}
        <div className="mb-4">{renderCalendar()}</div>

        {/* Selected Date Display */}
        <div className="mb-4">
          <div className="flex items-center">
            <Calendar size={20} className="text-[#6C63FF] dark:text-[#8B5CF6]" />
            <h2 className="ml-2 text-lg font-medium text-gray-800 dark:text-gray-200">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
          </div>
        </div>

        {/* Diary Entries */}
        <div>
          {entriesForSelectedDate.length > 0 ? (
            <div className="space-y-4">
              {entriesForSelectedDate.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{entry.mood}</span>
                      <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200">{entry.title}</h3>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit size={16} className="text-gray-500 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Trash2 size={16} className="text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <Clock size={12} className="mr-1" />
                    {entry.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}

                    {entry.tags && entry.tags.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <Tag size={12} className="mr-1" />
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag, i) => (
                            <span key={i} className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-2">{entry.content}</p>

                  {entry.images && entry.images.length > 0 && (
                    <div className="flex space-x-2 mt-2 mb-3">
                      {entry.images.map((img, i) => (
                        <div key={i} className="w-16 h-16 rounded-lg overflow-hidden relative">
                          <Image src={img || "/placeholder.svg"} alt="Journal image" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {entry.aiAnalysis && (
                    <div className="mt-3">
                      <button
                        onClick={() => setShowAiAnalysis(showAiAnalysis === entry.id ? null : entry.id)}
                        className="text-xs flex items-center text-[#6C63FF] dark:text-[#8B5CF6] font-medium"
                      >
                        {showAiAnalysis === entry.id ? "Hide AI Analysis" : "Show AI Analysis"}
                        <ChevronRight
                          size={16}
                          className={`ml-1 transition-transform ${showAiAnalysis === entry.id ? "rotate-90" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {showAiAnalysis === entry.id && renderAiAnalysis(entry.aiAnalysis, entry.id)}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Book size={24} className="text-[#6C63FF] dark:text-[#8B5CF6]" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No entries for this date</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Write about your day, feelings, or thoughts</p>
              <button
                onClick={handleNewEntry}
                className="px-4 py-2 bg-[#6C63FF] hover:bg-[#5A52D5] text-white rounded-lg font-medium flex items-center justify-center mx-auto transition-colors"
              >
                <Plus size={18} className="mr-1" />
                New Entry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New/Edit Entry Modal */}
      <AnimatePresence>
        {showNewEntryForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setShowNewEntryForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl z-50 p-4 max-h-[90vh] overflow-y-auto max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {editingEntry ? "Edit Journal Entry" : "New Journal Entry"}
                </h2>
                <button
                  onClick={() => setShowNewEntryForm(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    How are you feeling?
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {moodOptions.map((mood) => (
                      <motion.button
                        key={mood}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setNewEntryMood(mood)}
                        className={`text-2xl p-2 rounded-lg ${
                          newEntryMood === mood
                            ? "bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20 ring-2 ring-[#6C63FF] dark:ring-[#8B5CF6] ring-offset-2 dark:ring-offset-gray-800"
                            : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {mood}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newEntryTitle}
                    onChange={(e) => setNewEntryTitle(e.target.value)}
                    placeholder="Give your entry a title..."
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your thoughts
                  </label>
                  <textarea
                    value={newEntryContent}
                    onChange={(e) => setNewEntryContent(e.target.value)}
                    placeholder="Write about your day, feelings, or thoughts..."
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6] min-h-[150px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newEntryTags.map((tag) => (
                      <div key={tag} className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        <span className="text-xs text-gray-700 dark:text-gray-300">{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-l-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF] dark:focus:ring-[#8B5CF6] focus:border-[#6C63FF] dark:focus:border-[#8B5CF6] text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-[#6C63FF] text-white text-sm rounded-r-lg disabled:opacity-50"
                      disabled={!newTag.trim()}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Add Images (Optional)
                  </label>
                  <button className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-sm">Click to upload images</span>
                    <span className="text-xs mt-1">JPG, PNG or GIF (max. 5MB)</span>
                  </button>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-start">
                  <AlertTriangle size={18} className="text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="ml-2 text-xs text-yellow-700 dark:text-yellow-400">
                    Your journal entries are analyzed by AI to provide personalized insights and suggestions. This helps
                    track your mood patterns and offers relevant support.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveEntry}
                  disabled={!newEntryTitle.trim() || !newEntryContent.trim()}
                  className="w-full flex items-center justify-center py-3 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white font-medium disabled:opacity-50 transition-all"
                >
                  <Save size={18} className="mr-2" />
                  Save Entry
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
