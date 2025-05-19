import { supabase, getServerSupabase } from "@/lib/supabase-client"
import { sign, verify } from "jsonwebtoken"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  avatar_url: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

export interface AuthResult {
  user: AuthUser | null
  session: any | null
  error: Error | null
}

// JWT Secret for token verification
const JWT_SECRET = process.env.JWT_SECRET || "popya-secret-key-change-in-production"
const TOKEN_EXPIRY = "7d" // 7 days
const SALT_ROUNDS = 10

// Sign up a new user
export async function registerUser(data: RegisterData): Promise<AuthResult> {
  try {
    const { name, email, password, phone } = data

    // Generate a unique user code (6 digits)
    const userCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          user_code: userCode,
          phone: phone || null,
          role: "user",
        },
      },
    })

    if (authError) throw authError

    // If sign up was successful, create a user profile
    if (authData.user) {
      // Insert into users table
      const { error: userError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        name,
        user_code: userCode,
        phone: phone || null,
        role: "user",
        is_verified: false,
      })

      if (userError) throw userError

      // Create user profile
      const { error: profileError } = await supabase.from("user_profiles").insert({
        user_id: authData.user.id,
        notifications_enabled: true,
        dark_mode_enabled: false,
        language: "en",
      })

      if (profileError) throw profileError

      // Generate JWT token for backward compatibility
      const token = generateToken(authData.user.id)

      // Return user data
      return {
        user: {
          id: authData.user.id,
          name,
          email,
          role: "user",
          avatar_url: null,
        },
        session: { ...authData.session, token },
        error: null,
      }
    }

    return {
      user: null,
      session: null,
      error: new Error("Failed to create user"),
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      user: null,
      session: null,
      error: error as Error,
    }
  }
}

// Sign in an existing user
export async function loginUser(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const { email, password } = credentials

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      // Get user data from our users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (userError) throw userError

      // Update last login
      await supabase.from("users").update({ updated_at: new Date().toISOString() }).eq("id", data.user.id)

      // Generate JWT token for backward compatibility
      const token = generateToken(data.user.id)

      return {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar_url: userData.avatar_url,
        },
        session: { ...data.session, token },
        error: null,
      }
    }

    return {
      user: null,
      session: null,
      error: new Error("Failed to login"),
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      user: null,
      session: null,
      error: error as Error,
    }
  }
}

// Sign out the current user
export async function logoutUser(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error("Logout error:", error)
    return { error: error as Error }
  }
}

// Get the current user
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await supabase.auth.getUser()

    if (!data.user) return null

    // Get user data from our users table
    const { data: userData, error } = await supabase.from("users").select("*").eq("id", data.user.id).single()

    if (error) throw error

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar_url: userData.avatar_url,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

// Server-side function to get user by ID
export async function getUserById(id: string): Promise<AuthUser | null> {
  try {
    const supabaseServer = getServerSupabase()

    const { data, error } = await supabaseServer.from("users").select("*").eq("id", id).single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar_url: data.avatar_url,
    }
  } catch (error) {
    console.error("Get user by ID error:", error)
    return null
  }
}

// Verify JWT token (for backward compatibility)
export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    // Verify the JWT token
    const decoded = verify(token, JWT_SECRET) as { id: string }

    // Get user from Supabase
    const supabaseServer = getServerSupabase()
    const { data, error } = await supabaseServer.from("users").select("*").eq("id", decoded.id).single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar_url: data.avatar_url,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

// Change user password
export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    // First, verify the current password
    const supabaseServer = getServerSupabase()
    const { data: userData, error: userError } = await supabaseServer
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (userError) throw userError

    // Get the user's auth data to verify password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: currentPassword,
    })

    if (error) return false // Current password is incorrect

    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) throw updateError

    return true
  } catch (error) {
    console.error("Change password error:", error)
    return false
  }
}

// Helper function to generate JWT token
function generateToken(userId: string): string {
  return sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}
