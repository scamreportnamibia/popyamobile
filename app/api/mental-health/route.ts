import { NextResponse } from "next/server"

// Mock mental health resources
const mentalHealthResources = [
  {
    id: "1",
    title: "Mindfulness Meditation",
    description: "A simple 5-minute mindfulness practice to reduce anxiety and stress.",
    category: "anxiety",
    type: "exercise",
    content:
      "Find a quiet place to sit comfortably. Close your eyes and focus on your breath. Notice the sensation of breathing in and out. When your mind wanders, gently bring your attention back to your breath. Continue for 5 minutes.",
  },
  {
    id: "2",
    title: "Grounding Technique",
    description: "A 5-4-3-2-1 grounding exercise for managing panic and anxiety.",
    category: "anxiety",
    type: "exercise",
    content:
      "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This helps bring you back to the present moment.",
  },
  {
    id: "3",
    title: "Mood Tracking",
    description: "How to effectively track your mood to identify patterns and triggers.",
    category: "depression",
    type: "article",
    content:
      "Tracking your mood daily can help you identify patterns and triggers. Note your mood, activities, sleep, and any significant events each day. Look for connections between these factors over time.",
  },
  {
    id: "4",
    title: "Progressive Muscle Relaxation",
    description: "A relaxation technique to reduce physical tension and stress.",
    category: "stress",
    type: "exercise",
    content:
      "Tense each muscle group for 5 seconds, then relax for 30 seconds. Start with your feet and work up to your face. Notice the difference between tension and relaxation.",
  },
  {
    id: "5",
    title: "Sleep Hygiene Tips",
    description: "Practical tips for improving sleep quality and mental health.",
    category: "sleep",
    type: "article",
    content:
      "Maintain a regular sleep schedule. Avoid screens before bed. Create a comfortable sleep environment. Limit caffeine and alcohol. Practice relaxation techniques before bedtime.",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const type = searchParams.get("type")

  let filteredResources = [...mentalHealthResources]

  if (category) {
    filteredResources = filteredResources.filter((resource) => resource.category === category)
  }

  if (type) {
    filteredResources = filteredResources.filter((resource) => resource.type === type)
  }

  return NextResponse.json(filteredResources)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 })
    }

    // Simple keyword matching for resources
    const lowerQuery = query.toLowerCase()
    let matchedResources = mentalHealthResources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        resource.category.toLowerCase().includes(lowerQuery) ||
        resource.content.toLowerCase().includes(lowerQuery),
    )

    // If no matches, return all resources
    if (matchedResources.length === 0) {
      matchedResources = mentalHealthResources
    }

    return NextResponse.json(matchedResources)
  } catch (error) {
    console.error("Error in mental health route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
