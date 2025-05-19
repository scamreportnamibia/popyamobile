"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { loginUser, registerUser, logoutUser, getCurrentUser, type AuthUser } from "@/services/auth-service"

export type UserRole = "super_admin" | "expert" | "user"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  checkRole: (roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    checkAuth()

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await loginUser({ email, password })

      if (result.error) {
        throw result.error
      }

      setUser(result.user)

      // Redirect based on role
      if (result.user?.role === "super_admin") {
        router.push("/admin/dashboard")
      } else if (result.user?.role === "expert") {
        router.push("/expert-dashboard")
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    setIsLoading(true)
    try {
      const result = await registerUser({ name, email, password, phone })

      if (result.error) {
        throw result.error
      }

      setUser(result.user)

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      setUser(null)
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const checkRole = (roles: UserRole[]) => {
    if (!user) return false
    return roles.includes(user.role as UserRole)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
