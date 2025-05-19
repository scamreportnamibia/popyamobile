import { supabase } from "@/lib/supabase-client"
import type { Database } from "@/types/supabase"

export type Group = Database["public"]["Tables"]["groups"]["Row"]
export type GroupInsert = Database["public"]["Tables"]["groups"]["Insert"]
export type GroupUpdate = Database["public"]["Tables"]["groups"]["Update"]

export type GroupMember = Database["public"]["Tables"]["group_members"]["Row"]
export type GroupMessage = Database["public"]["Tables"]["group_messages"]["Row"]

// Get all groups
export async function getAllGroups(limit = 20, offset = 0): Promise<Group[]> {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error getting groups:", error)
    return []
  }
}

// Get groups that a user has joined
export async function getJoinedGroups(userId: string): Promise<Group[]> {
  try {
    const { data, error } = await supabase.from("group_members").select("group_id").eq("user_id", userId)

    if (error) throw error

    if (!data || data.length === 0) return []

    const groupIds = data.map((item) => item.group_id)

    const { data: groups, error: groupsError } = await supabase
      .from("groups")
      .select("*")
      .in("id", groupIds)
      .order("created_at", { ascending: false })

    if (groupsError) throw groupsError

    return groups || []
  } catch (error) {
    console.error("Error getting joined groups:", error)
    return []
  }
}

// Get a single group by ID
export async function getGroupById(id: string): Promise<Group | null> {
  try {
    const { data, error } = await supabase.from("groups").select("*").eq("id", id).single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error getting group:", error)
    return null
  }
}

// Create a new group
export async function createGroup(group: GroupInsert): Promise<Group | null> {
  try {
    const { data, error } = await supabase.from("groups").insert(group).select().single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error creating group:", error)
    return null
  }
}

// Join a group
export async function joinGroup(groupId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("group_members").insert({
      group_id: groupId,
      user_id: userId,
    })

    if (error) throw error

    return true
  } catch (error) {
    console.error("Error joining group:", error)
    return false
  }
}

// Leave a group
export async function leaveGroup(groupId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", userId)

    if (error) throw error

    return true
  } catch (error) {
    console.error("Error leaving group:", error)
    return false
  }
}

// Get group messages
export async function getGroupMessages(groupId: string, limit = 50): Promise<GroupMessage[]> {
  try {
    const { data, error } = await supabase
      .from("group_messages")
      .select(`
        *,
        users:user_id (
          name,
          avatar_url
        )
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error getting group messages:", error)
    return []
  }
}

// Send a message to a group
export async function sendGroupMessage(
  groupId: string,
  userId: string,
  content: string,
  mentions: string[] = [],
): Promise<GroupMessage | null> {
  try {
    const { data, error } = await supabase
      .from("group_messages")
      .insert({
        group_id: groupId,
        user_id: userId,
        content,
        mentions,
        is_ai: false,
      })
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error sending group message:", error)
    return null
  }
}

// Subscribe to new messages in a group
export function subscribeToGroupMessages(groupId: string, callback: (message: GroupMessage) => void) {
  return supabase
    .channel(`group-${groupId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "group_messages",
        filter: `group_id=eq.${groupId}`,
      },
      (payload) => {
        callback(payload.new as GroupMessage)
      },
    )
    .subscribe()
}
