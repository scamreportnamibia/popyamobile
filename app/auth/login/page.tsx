"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, Loader2, Shield, User, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("user")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(email, password)
      // No need to redirect here as the auth context will handle it
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
        <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Popya Logo"
              width={80}
              height={80}
              className="rounded-xl"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Popya</h1>
          <p className="text-gray-600 dark:text-gray-400">Mental Health Support Platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="user" className="flex items-center justify-center">
              <User className="h-4 w-4 mr-2" />
              <span>User</span>
            </TabsTrigger>
            <TabsTrigger value="expert" className="flex items-center justify-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Expert</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center justify-center">
              <Shield className="h-4 w-4 mr-2" />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "user" && "User Login"}
                {activeTab === "expert" && "Expert Login"}
                {activeTab === "admin" && "Admin Login"}
              </CardTitle>
              <CardDescription>
                {activeTab === "user" && "Access your personal account"}
                {activeTab === "expert" && "Login to your expert dashboard"}
                {activeTab === "admin" && "Access the admin control panel"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/auth/forgot-password" className="text-xs text-[#6C63FF] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              {activeTab === "user" && (
                <div className="text-sm text-center w-full">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-[#6C63FF] hover:underline">
                    Sign up
                  </Link>
                </div>
              )}

              {activeTab === "expert" && (
                <div className="text-sm text-center w-full">
                  Want to join as an expert?{" "}
                  <Link href="/auth/expert-application" className="text-[#6C63FF] hover:underline">
                    Apply here
                  </Link>
                </div>
              )}
            </CardFooter>
          </Card>
        </Tabs>
      </div>
    </div>
  )
}
