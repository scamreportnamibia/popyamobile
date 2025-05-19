"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

const MOOD_OPTIONS = [
  { emoji: "😊", value: 5, label: "Happy" },
  { emoji: "😌", value: 4, label: "Content" },
  { emoji: "😐", value: 3, label: "Neutral" },
  { emoji: "😔", value: 2, label: "Sad" },
  { emoji: "😢", value: 1, label: "Depressed" },
]

export function MoodEntryForm() {
  const [selectedMood, setSelectedMood] = useState<{ emoji: string; value: number } | null>(null)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/moods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood_value: selectedMood.value,
          mood_emoji: selectedMood.emoji,
          notes: notes.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save mood entry")
      }

      toast({
        title: "Mood saved successfully",
        description: "Your mood entry has been recorded.",
      })

      // Reset form
      setSelectedMood(null)
      setNotes("")
    } catch (error) {
      console.error("Error saving mood:", error)
      toast({
        title: "Failed to save mood",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-4">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood)}
              className={`text-4xl p-2 rounded-full transition-all ${
                selectedMood?.value === mood.value ? "bg-primary/20 scale-110" : "hover:bg-muted"
              }`}
              title={mood.label}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
        <div className="pt-4">
          <Textarea
            placeholder="Add notes about how you're feeling (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!selectedMood || isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save Mood"}
        </Button>
      </CardFooter>
    </Card>
  )
}
