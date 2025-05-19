"use client"

import { MoodEntryForm } from "@/components/mood-entry-form"
import { MoodHistory } from "@/components/mood-history"

export default function MoodTrackerPage() {
  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Mood Tracker</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <MoodEntryForm />
        </div>
        <div>
          <MoodHistory />
        </div>
      </div>
    </div>
  )
}
