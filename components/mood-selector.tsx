"use client"
import { cn } from "@/lib/utils"

export type Mood = {
  id: string
  emoji: string
  label: string
  color: string
  gradient: string
}

export type MoodHistoryEntry = {
  timestamp: number
  mood: Mood
  note: string
}

interface MoodSelectorProps {
  onSelect: (mood: Mood) => void
}

const moods: Mood[] = [
  {
    id: "happy",
    emoji: "😊",
    label: "Happy",
    color: "bg-yellow-400",
    gradient: "from-yellow-400 to-yellow-500",
  },
  {
    id: "relaxed",
    emoji: "😌",
    label: "Relaxed",
    color: "bg-green-400",
    gradient: "from-green-400 to-green-500",
  },
  {
    id: "neutral",
    emoji: "😐",
    label: "Neutral",
    color: "bg-blue-400",
    gradient: "from-blue-400 to-blue-500",
  },
  {
    id: "sad",
    emoji: "😔",
    label: "Sad",
    color: "bg-indigo-400",
    gradient: "from-indigo-400 to-indigo-500",
  },
  {
    id: "angry",
    emoji: "😠",
    label: "Angry",
    color: "bg-red-400",
    gradient: "from-red-400 to-red-500",
  },
]

export function MoodSelector({ onSelect }: MoodSelectorProps) {
  return (
    <div className="flex justify-between">
      {moods.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onSelect(mood)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-colors",
            mood.color,
          )}
        >
          <span className="text-2xl">{mood.emoji}</span>
        </button>
      ))}
    </div>
  )
}
