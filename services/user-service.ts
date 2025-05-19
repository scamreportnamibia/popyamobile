import { executeQuery } from "./database-service"

export interface User {
  id: number
  name: string
  email: string
  role: string
  avatar_url: string | null
  user_code: string
  phone: string | null
  is_verified: boolean
  created_at: Date
  updated_at: Date
}

export interface UserProfile {
  id: number
  user_id: number
  bio: string | null
  location: string | null
  date_of_birth: Date | null
  gender: string | null
  notifications_enabled: boolean
  dark_mode_enabled: boolean
  language: string
  created_at: Date
  updated_at: Date
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const users = await executeQuery<User>("SELECT * FROM users WHERE id = $1", [id])
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    throw error
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await executeQuery<User>("SELECT * FROM users WHERE email = $1", [email])
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Error getting user by email:", error)
    throw error
  }
}

export async function getUserProfile(userId: number): Promise<UserProfile | null> {
  try {
    const profiles = await executeQuery<UserProfile>("SELECT * FROM user_profiles WHERE user_id = $1", [userId])
    return profiles.length > 0 ? profiles[0] : null
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

export async function updateUserProfile(userId: number, data: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    // Create SET clause dynamically based on provided data
    const keys = Object.keys(data).filter((key) => key !== "user_id" && key !== "id")
    if (keys.length === 0) return null

    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(", ")
    const values = keys.map((key) => (data as any)[key])

    const query = `
      UPDATE user_profiles 
      SET ${setClause} 
      WHERE user_id = $1 
      RETURNING *
    `

    const result = await executeQuery<UserProfile>(query, [userId, ...values])
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

export async function getAllUsers(limit = 10, offset = 0): Promise<User[]> {
  try {
    return await executeQuery<User>("SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset])
  } catch (error) {
    console.error("Error getting all users:", error)
    throw error
  }
}
