export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          user_code: string
          role: string
          is_verified: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          phone?: string | null
          user_code: string
          role?: string
          is_verified?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          user_code?: string
          role?: string
          is_verified?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          location: string | null
          date_of_birth: string | null
          gender: string | null
          notifications_enabled: boolean
          dark_mode_enabled: boolean
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          location?: string | null
          date_of_birth?: string | null
          gender?: string | null
          notifications_enabled?: boolean
          dark_mode_enabled?: boolean
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string | null
          location?: string | null
          date_of_birth?: string | null
          gender?: string | null
          notifications_enabled?: boolean
          dark_mode_enabled?: boolean
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      mood_entries: {
        Row: {
          id: string
          user_id: string
          mood_value: number
          mood_emoji: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood_value: number
          mood_emoji: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood_value?: number
          mood_emoji?: string
          notes?: string | null
          created_at?: string
        }
      }
      diary_entries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          mood: string | null
          tags: string[] | null
          ai_analysis: Json | null
          images: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          mood?: string | null
          tags?: string[] | null
          ai_analysis?: Json | null
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          mood?: string | null
          tags?: string[] | null
          ai_analysis?: Json | null
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string
          is_ai_enabled: boolean
          tags: string[] | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          is_ai_enabled?: boolean
          tags?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          is_ai_enabled?: boolean
          tags?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      group_messages: {
        Row: {
          id: string
          group_id: string
          user_id: string
          content: string
          mentions: string[] | null
          is_ai: boolean
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          content: string
          mentions?: string[] | null
          is_ai?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          content?: string
          mentions?: string[] | null
          is_ai?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_sql: {
        Args: {
          query_text: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
