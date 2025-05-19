import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Environment variables are automatically available in the client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Create a single supabase client for the browser
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Create a singleton for server-side usage
let serverClient: ReturnType<typeof createClient<Database>> | null = null

export const getServerSupabase = () => {
  if (serverClient) return serverClient

  // For server-side operations, we use the service role key
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined")
  }

  serverClient = createClient<Database>(supabaseUrl, supabaseServiceKey)
  return serverClient
}

// Alias for backward compatibility
export const getServerClient = getServerSupabase
