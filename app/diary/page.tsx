"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  Download,
  Filter,
  Search,
  Trash2,
  Volume2,
  VolumeX,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { MoodHistoryEntry } from "@/components/mood-selector"
import type { Mood } from "@/components/mood-selector"

export default function DiaryPage() {
  const [moodHistory, setMoodHistory] = useState<MoodHistoryEntry[]>([])
  const [filteredHistory, setFilteredHistory] = useState<MoodHistoryEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<MoodHistoryEntry | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const { toast } = useToast()

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("moodHistory")
    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory)
        setMoodHistory(history)
        setFilteredHistory(history)
      } catch (e) {
        console.error("Failed to parse mood history:", e)
      }
    }

    // Check if sound is enabled in localStorage
    const soundSetting = localStorage.getItem("soundEnabled")
    if (soundSetting !== null) {
      setSoundEnabled(soundSetting === "true")
    }
  }, [])

  // Apply filters when filter conditions change
  useEffect(() => {
    let filtered = [...moodHistory]

    // Apply mood filter
    if (selectedMoodFilter.length > 0) {
      filtered = filtered.filter((entry) => selectedMoodFilter.includes(entry.mood.id))
    }

    // Apply date range filter
    if (dateRange.start) {
      filtered = filtered.filter((entry) => new Date(entry.timestamp) >= dateRange.start!)
    }
    if (dateRange.end) {
      filtered = filtered.filter((entry) => new Date(entry.timestamp) <= dateRange.end!)
    }

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.mood.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredHistory(filtered)
  }, [moodHistory, selectedMoodFilter, dateRange, searchTerm])

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Are you sure you want to delete this diary entry?")) {
      const updatedHistory = moodHistory.filter((entry) => entry.id !== id)
      setMoodHistory(updatedHistory)
      setFilteredHistory(updatedHistory.filter((entry) => filteredHistory.includes(entry)))
      localStorage.setItem("moodHistory", JSON.stringify(updatedHistory))

      // Play sound
      if (soundEnabled) {
        const deleteSound = new Audio("/sounds/delete.mp3")
        deleteSound.play().catch((e) => console.error("Error playing sound:", e))
      }

      toast({
        title: "Entry deleted",
        description: "Your diary entry has been deleted.",
        variant: "destructive",
      })
    }
  }

  const handleExportData = () => {
    // Create CSV content
    const headers = ["Date", "Time", "Mood", "Note"]
    const csvRows = [headers]

    moodHistory.forEach((entry) => {
      const date = new Date(entry.timestamp)
      const dateStr = date.toLocaleDateString()
      const timeStr = date.toLocaleTimeString()
      csvRows.push([dateStr, timeStr, entry.mood.label, entry.note])
    })

    const csvContent = csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `diary_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Play sound
    if (soundEnabled) {
      const exportSound = new Audio("/sounds/success.mp3")
      exportSound.play().catch((e) => console.error("Error playing sound:", e))
    }

    toast({
      title: "Export successful",
      description: "Your diary data has been exported to CSV.",
      variant: "default",
    })
  }

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled
    setSoundEnabled(newSoundEnabled)
    localStorage.setItem("soundEnabled", newSoundEnabled.toString())

    // Play notification sound if enabling sound
    if (newSoundEnabled) {
      const notificationSound = new Audio("/sounds/notification.mp3")
      notificationSound.play().catch((e) => console.error("Error playing sound:", e))
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Group entries by date for display
  const groupedEntries = filteredHistory.reduce<Record<string, MoodHistoryEntry[]>>((acc, entry) => {
    const dateKey = new Date(entry.timestamp).toDateString()
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(entry)
    return acc
  }, {})

  // Get unique moods from history for filter
  const uniqueMoods = Array.from(new Set(moodHistory.map((entry) => entry.mood.id)))
    .map((id) => {
      const entry = moodHistory.find((e) => e.mood.id === id)
      return entry ? entry.mood : null
    })
    .filter(Boolean) as Mood[]

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 z-30 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </Link>
          <h1 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-200">My Diary</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={toggleSound} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            {soundEnabled ? (
              <Volume2 size={18} className="text-gray-600 dark:text-gray-400" />
            ) : (
              <VolumeX size={18} className="text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`p-2 rounded-full ${
              filterOpen || selectedMoodFilter.length > 0 || dateRange.start || dateRange.end || searchTerm
                ? "bg-[#6C63FF] text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
          >
            <Filter size={18} />
          </button>
          <button
            onClick={handleExportData}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            disabled={moodHistory.length === 0}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"
          >
            <div className="mb-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search diary entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF]"
                />
              </div>
            </div>

            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by mood</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueMoods.map((mood) => (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (selectedMoodFilter.includes(mood.id)) {
                        setSelectedMoodFilter(selectedMoodFilter.filter((id) => id !== mood.id))
                      } else {
                        setSelectedMoodFilter([...selectedMoodFilter, mood.id])
                      }

                      // Play sound
                      if (soundEnabled) {
                        const clickSound = new Audio("/sounds/click.mp3")
                        clickSound.play().catch((e) => console.error("Error playing sound:", e))
                      }
                    }}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full ${
                      selectedMoodFilter.includes(mood.id)
                        ? `bg-gradient-to-r ${mood.gradient} text-white`
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span>{mood.emoji}</span>
                    <span className="text-sm">{mood.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date range</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Start date</label>
                  <input
                    type="date"
                    value={dateRange.start ? new Date(dateRange.start).toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null
                      setDateRange({ ...dateRange, start: date })

                      // Play sound
                      if (soundEnabled) {
                        const clickSound = new Audio("/sounds/click.mp3")
                        clickSound.play().catch((e) => console.error("Error playing sound:", e))
                      }
                    }}
                    className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">End date</label>
                  <input
                    type="date"
                    value={dateRange.end ? new Date(dateRange.end).toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null
                      setDateRange({ ...dateRange, end: date })

                      // Play sound
                      if (soundEnabled) {
                        const clickSound = new Audio("/sounds/click.mp3")
                        clickSound.play().catch((e) => console.error("Error playing sound:", e))
                      }
                    }}
                    className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#6C63FF]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSearchTerm("")
                  setSelectedMoodFilter([])
                  setDateRange({ start: null, end: null })

                  // Play sound
                  if (soundEnabled) {
                    const resetSound = new Audio("/sounds/click.mp3")
                    resetSound.play().catch((e) => console.error("Error playing sound:", e))
                  }
                }}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-2"
              >
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilterOpen(false)}
                className="px-4 py-2 text-sm bg-[#6C63FF] text-white rounded-lg"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="p-4">
        {filteredHistory.length > 0 ? (
          <div>
            {Object.entries(groupedEntries)
              .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
              .map(([dateStr, entries]) => (
                <div key={dateStr} className="mb-6">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(dateStr).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h2>
                  <div className="space-y-3">
                    {entries
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                          onClick={() => {
                            setSelectedEntry(entry)

                            // Play sound
                            if (soundEnabled) {
                              const clickSound = new Audio("/sounds/click.mp3")
                              clickSound.play().catch((e) => console.error("Error playing sound:", e))
                            }
                          }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mr-3 bg-gradient-to-br ${entry.mood.gradient}`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                {entry.mood.emoji}
                              </motion.div>
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">{entry.mood.label}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTime(entry.timestamp)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteEntry(entry.id)
                              }}
                              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Trash2 size={16} className="text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                          {entry.note && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 pl-12">{entry.note}</p>
                          )}
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20 rounded-full flex items-center justify-center mb-4">
              <Calendar size={24} className="text-[#6C63FF] dark:text-[#8B5CF6]" />
            </div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">No diary entries found</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              {moodHistory.length > 0
                ? "Try adjusting your filters to see more entries."
                : "Start tracking your mood to create diary entries."}
            </p>
            <Link href="/" className="px-4 py-2 bg-[#6C63FF] text-white rounded-lg flex items-center">
              <ChevronLeft size={16} className="mr-1" />
              Back to Home
            </Link>
          </div>
        )}
      </div>

      {/* Entry Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSelectedEntry(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl z-50 p-4 max-h-[80vh] overflow-y-auto"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-2 rounded-t-xl bg-gradient-to-r ${selectedEntry.mood.gradient}`}
              />
              <div className="flex justify-between items-center mb-4 pt-2">
                <div className="flex items-center">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3 bg-gradient-to-br ${selectedEntry.mood.gradient}`}
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {selectedEntry.mood.emoji}
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Feeling {selectedEntry.mood.label}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(selectedEntry.timestamp)} at {formatTime(selectedEntry.timestamp)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronDown size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
                {selectedEntry.note ? (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedEntry.note}</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No notes added to this entry.</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleDeleteEntry(selectedEntry.id)
                    setSelectedEntry(null)
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete Entry
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
