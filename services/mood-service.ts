import { executeQuery } from "@/lib/neon-client"

export interface MoodEntry {
  id: string
  user_id: string
  mood_value: number
  mood_emoji: string
  notes: string | null
  created_at: Date
}

// Get mood entries for a user
export async function getMoodEntriesByUserId(userId: string, limit = 7): Promise<MoodEntry[]> {
  try {
    return await executeQuery<MoodEntry>(
      `SELECT * FROM mood_entries 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit],
    )
  } catch (error) {
    console.error("Error getting mood entries:", error)
    return []
  }
}

// Create a new mood entry
export async function createMoodEntry(entry: Omit<MoodEntry, "id" | "created_at">): Promise<MoodEntry | null> {
  try {
    const result = await executeQuery<MoodEntry>(
      `INSERT INTO mood_entries (user_id, mood_value, mood_emoji, notes) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [entry.user_id, entry.mood_value, entry.mood_emoji, entry.notes],
    )
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error creating mood entry:", error)
    return null
  }
}

// Get mood statistics for a user
export async function getMoodStatsByUserId(userId: string): Promise<{ average: number; count: number }> {
  try {
    const result = await executeQuery<{ average: number; count: number }>(
      `SELECT AVG(mood_value) as average, COUNT(*) as count 
       FROM mood_entries 
       WHERE user_id = $1`,
      [userId],
    )
    return result[0]
  } catch (error) {
    console.error("Error getting mood stats:", error)
    return { average: 0, count: 0 }
  }
}

// Get mood entries for the last 30 days
export async function getMoodTrendByUserId(userId: string): Promise<MoodEntry[]> {
  try {
    return await executeQuery<MoodEntry>(
      `SELECT * FROM mood_entries 
       WHERE user_id = $1 
         AND created_at >= NOW() - INTERVAL '30 days' 
       ORDER BY created_at ASC`,
      [userId],
    )
  } catch (error) {
    console.error("Error getting mood trend:", error)
    return []
  }
}
