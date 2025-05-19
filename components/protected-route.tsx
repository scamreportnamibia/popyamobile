"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, checkRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    } else if (!isLoading && isAuthenticated && !checkRole(allowedRoles)) {
      // Redirect based on role if they don't have access
      if (user?.role === "super_admin") {
        router.push("/admin/dashboard")
      } else if (user?.role === "expert") {
        router.push("/expert-dashboard")
      } else {
        router.push("/")
      }
    }
  }, [isLoading, isAuthenticated, checkRole, allowedRoles, router, user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-[#6C63FF] animate-spin" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (!checkRole(allowedRoles)) {
    return null
  }

  return <>{children}</>
}
