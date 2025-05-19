import { supabase } from "@/lib/supabase-client"
import type { Database } from "@/types/supabase"

export type DiaryEntry = Database["public"]["Tables"]["diary_entries"]["Row"]
export type DiaryEntryInsert = Database["public"]["Tables"]["diary_entries"]["Insert"]
export type DiaryEntryUpdate = Database["public"]["Tables"]["diary_entries"]["Update"]

// Get diary entries for a user
export async function getDiaryEntriesByUserId(userId: string, limit = 10, offset = 0): Promise<DiaryEntry[]> {
  try {
    const { data, error } = await supabase
      .from("diary_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error getting diary entries:", error)
    return []
  }
}

// Get a single diary entry
export async function getDiaryEntryById(id: string): Promise<DiaryEntry | null> {
  try {
    const { data, error } = await supabase.from("diary_entries").select("*").eq("id", id).single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error getting diary entry:", error)
    return null
  }
}

// Create a new diary entry
export async function createDiaryEntry(entry: DiaryEntryInsert): Promise<DiaryEntry | null> {
  try {
    const { data, error } = await supabase.from("diary_entries").insert(entry).select().single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error creating diary entry:", error)
    return null
  }
}

// Update a diary entry
export async function updateDiaryEntry(id: string, updates: DiaryEntryUpdate): Promise<DiaryEntry | null> {
  try {
    const { data, error } = await supabase.from("diary_entries").update(updates).eq("id", id).select().single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error updating diary entry:", error)
    return null
  }
}

// Delete a diary entry
export async function deleteDiaryEntry(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("diary_entries").delete().eq("id", id)

    if (error) throw error

    return true
  } catch (error) {
    console.error("Error deleting diary entry:", error)
    return false
  }
}
