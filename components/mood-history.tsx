"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MoodEntry {
  id: string
  mood_value: number
  mood_emoji: string
  notes: string | null
  created_at: string
}

export function MoodHistory() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMoodEntries = async () => {
      try {
        const response = await fetch("/api/moods")

        if (!response.ok) {
          throw new Error("Failed to fetch mood entries")
        }

        const data = await response.json()
        setMoodEntries(data.moodEntries || [])
      } catch (err) {
        console.error("Error fetching mood entries:", err)
        setError("Failed to load mood history. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMoodEntries()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Moods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Moods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Moods</CardTitle>
      </CardHeader>
      <CardContent>
        {moodEntries.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No mood entries yet. Start tracking your mood today!
          </div>
        ) : (
          <div className="space-y-4">
            {moodEntries.map((entry) => (
              <div key={entry.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                <div className="text-4xl">{entry.mood_emoji}</div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">{formatDate(entry.created_at)}</div>
                  {entry.notes && <p className="mt-1">{entry.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
