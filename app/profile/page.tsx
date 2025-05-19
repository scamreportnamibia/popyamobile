"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  HelpCircle,
  LogOut,
  Moon,
  Shield,
  User,
  Lock,
  Mail,
  Phone,
  Save,
} from "lucide-react"
import Link from "next/link"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { websocketService } from "@/services/websocket-service"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"

type UserProfile = {
  userCode: string
  name: string
  avatar: string | null
  email: string
  phone: string
  joinDate: Date
  notificationsEnabled: boolean
  darkModeEnabled: boolean
}

export default function ProfilePage() {
  const { toast } = useToast()
  const { user, isAuthenticated, loading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // In a real app, you would fetch the profile from the API
      setProfile({
        userCode: user.userCode || "54321",
        name: user.name || "User",
        avatar: user.avatar || null,
        email: user.email || "user@example.com",
        phone: user.phone || "+1 (555) 123-4567",
        joinDate: new Date(user.createdAt || "2025-01-15"),
        notificationsEnabled: true,
        darkModeEnabled: false,
      })
      setIsLoading(false)
    } else if (!loading && !isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = "/auth/login"
    }
  }, [loading, isAuthenticated, user])

  const toggleNotifications = () => {
    if (!profile) return

    const updatedProfile = {
      ...profile,
      notificationsEnabled: !profile.notificationsEnabled,
    }
    setProfile(updatedProfile)

    // Send real-time update
    websocketService.sendProfileUpdate({
      action: "toggle_notifications",
      enabled: updatedProfile.notificationsEnabled,
    })

    toast({
      title: updatedProfile.notificationsEnabled ? "Notifications enabled" : "Notifications disabled",
      description: updatedProfile.notificationsEnabled
        ? "You will now receive notifications"
        : "You will no longer receive notifications",
    })
  }

  const toggleDarkMode = () => {
    if (!profile) return

    const updatedProfile = {
      ...profile,
      darkModeEnabled: !profile.darkModeEnabled,
    }
    setProfile(updatedProfile)

    // Send real-time update
    websocketService.sendProfileUpdate({
      action: "toggle_dark_mode",
      enabled: updatedProfile.darkModeEnabled,
    })

    toast({
      title: updatedProfile.darkModeEnabled ? "Dark mode enabled" : "Dark mode disabled",
      description: updatedProfile.darkModeEnabled ? "Dark mode is now active" : "Light mode is now active",
    })
  }

  const handleProfilePictureUpdate = (imageUrl: string) => {
    if (!profile) return

    setProfile({
      ...profile,
      avatar: imageUrl,
    })

    // Send real-time update
    websocketService.sendProfileUpdate({
      action: "update_avatar",
      avatar: imageUrl,
    })

    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been updated successfully",
    })
  }

  const handleEditProfile = () => {
    if (!profile) return
    setEditedProfile({ ...profile })
    setIsEditingProfile(true)
  }

  const handleSaveProfile = async () => {
    if (!editedProfile) return

    try {
      // Validate inputs
      if (!editedProfile.name.trim()) {
        toast({
          title: "Invalid name",
          description: "Name cannot be empty",
          variant: "destructive",
        })
        return
      }

      if (!editedProfile.email.includes("@")) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProfile(editedProfile)
      setIsEditingProfile(false)

      // Send real-time update
      websocketService.sendProfileUpdate({
        action: "update_profile",
        profile: {
          name: editedProfile.name,
          email: editedProfile.email,
          phone: editedProfile.phone,
        },
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleChangePassword = () => {
    setIsChangingPassword(true)
  }

  const handleSavePassword = async () => {
    try {
      // Validate password
      if (passwordData.newPassword.length < 8) {
        toast({
          title: "Password too short",
          description: "Password must be at least 8 characters long",
          variant: "destructive",
        })
        return
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "New password and confirmation must match",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Send real-time update
      websocketService.sendProfileUpdate({
        action: "password_changed",
        timestamp: new Date().toISOString(),
      })

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-[56px] bg-white z-30 border-b px-4 py-2 flex items-center">
        <Link href="/" className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="ml-3 text-lg font-semibold">Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] pt-6 pb-10 px-4 relative">
        <div className="flex items-center">
          <div className="relative">
            <ProfilePictureUpload
              currentImageUrl={profile.avatar}
              userId={user?.id || ""}
              onUploadSuccess={handleProfilePictureUpdate}
            />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            <p className="text-white/80 text-sm">User #{profile.userCode}</p>
            <p className="text-white/60 text-xs mt-1">
              Member since {profile.joinDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b sticky top-[96px] z-20">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "profile" ? "text-[#6C63FF] border-b-2 border-[#6C63FF]" : "text-gray-600"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "settings" ? "text-[#6C63FF] border-b-2 border-[#6C63FF]" : "text-gray-600"
          }`}
        >
          Settings
        </button>
      </div>

      <div className="p-4">
        {activeTab === "profile" ? (
          <>
            {/* Personal Information */}
            <AnimatedContainer className="mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-gray-800">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-800">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-gray-800">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleEditProfile}
                    className="flex-1 py-2 border border-[#6C63FF] text-[#6C63FF] rounded-lg text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center"
                  >
                    <Lock size={16} className="mr-1" />
                    Change Password
                  </button>
                </div>
              </div>
            </AnimatedContainer>

            {/* Activity Summary */}
            <AnimatedContainer animation="slide" delay={0.1} className="mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3">Activity Summary</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-[#6C63FF]/10 rounded-lg">
                    <p className="text-lg font-semibold text-[#6C63FF]">12</p>
                    <p className="text-xs text-gray-600">Diary Entries</p>
                  </div>
                  <div className="p-3 bg-[#FF6584]/10 rounded-lg">
                    <p className="text-lg font-semibold text-[#FF6584]">5</p>
                    <p className="text-xs text-gray-600">Group Chats</p>
                  </div>
                  <div className="p-3 bg-[#43C6AC]/10 rounded-lg">
                    <p className="text-lg font-semibold text-[#43C6AC]">3</p>
                    <p className="text-xs text-gray-600">Expert Chats</p>
                  </div>
                </div>
              </div>
            </AnimatedContainer>

            {/* Mood Tracker */}
            <AnimatedContainer animation="slide" delay={0.2} className="mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-800">Mood Tracker</h3>
                  <Link href="/diaries" className="text-xs text-[#6C63FF]">
                    View All
                  </Link>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {["😊", "😊", "😐", "😔", "😊", "😌", "😊"].map((emoji, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-lg"
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">Last 7 days</div>
              </div>
            </AnimatedContainer>

            {/* Saved Content */}
            <AnimatedContainer animation="slide" delay={0.3}>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3">Saved Content</h3>
                <div className="space-y-3">
                  <Link href="/dailies">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
                          <span className="text-[#6C63FF]">📹</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">Saved Dailies</p>
                          <p className="text-xs text-gray-500">2 videos saved</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </Link>
                  <Link href="/experts">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-[#FF6584]/10 flex items-center justify-center">
                          <span className="text-[#FF6584]">👨‍⚕️</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">Favorite Experts</p>
                          <p className="text-xs text-gray-500">3 experts saved</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </Link>
                </div>
              </div>
            </AnimatedContainer>
          </>
        ) : (
          <>
            {/* Settings */}
            <AnimatedContainer className="mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3">App Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#6C63FF]/10 flex items-center justify-center">
                        <Bell size={16} className="text-[#6C63FF]" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">Notifications</p>
                        <p className="text-xs text-gray-500">Receive alerts and reminders</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.notificationsEnabled}
                        onChange={toggleNotifications}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C63FF]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#6C63FF]/10 flex items-center justify-center">
                        <Moon size={16} className="text-[#6C63FF]" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">Dark Mode</p>
                        <p className="text-xs text-gray-500">Switch to dark theme</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.darkModeEnabled}
                        onChange={toggleDarkMode}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C63FF]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </AnimatedContainer>

            {/* Security */}
            <AnimatedContainer animation="slide" delay={0.1} className="mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3">Security</h3>
                <div className="space-y-3">
                  <button
                    className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg"
                    onClick={handleChangePassword}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#FF6584]/10 flex items-center justify-center">
                        <Shield size={16} className="text-[#FF6584]" />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-800">Change Password</p>
                        <p className="text-xs text-gray-500">Update your security credentials</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>

                  <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#FF6584]/10 flex items-center justify-center">
                        <Shield size={16} className="text-[#FF6584]" />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-800">Privacy Settings</p>
                        <p className="text-xs text-gray-500">Manage your data and privacy</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </AnimatedContainer>

            {/* Support */}
            <AnimatedContainer animation="slide" delay={0.2} className="mb-4">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3">Support</h3>
                <div className="space-y-3">
                  <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#43C6AC]/10 flex items-center justify-center">
                        <HelpCircle size={16} className="text-[#43C6AC]" />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-800">Help Center</p>
                        <p className="text-xs text-gray-500">FAQs and support resources</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>

                  <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#43C6AC]/10 flex items-center justify-center">
                        <HelpCircle size={16} className="text-[#43C6AC]" />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-800">Contact Support</p>
                        <p className="text-xs text-gray-500">Get help from our team</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>

                  <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#43C6AC]/10 flex items-center justify-center">
                        <HelpCircle size={16} className="text-[#43C6AC]" />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-800">Terms & Conditions</p>
                        <p className="text-xs text-gray-500">Legal information</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </AnimatedContainer>

            {/* Logout */}
            <AnimatedContainer animation="slide" delay={0.3}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center py-3 rounded-lg bg-red-50 text-red-500 font-medium"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </motion.button>
            </AnimatedContainer>
          </>
        )}
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <Input
                  id="name"
                  value={editedProfile?.name || ""}
                  onChange={(e) => setEditedProfile((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  className="pl-10"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <Input
                  id="email"
                  type="email"
                  value={editedProfile?.email || ""}
                  onChange={(e) => setEditedProfile((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                  className="pl-10"
                  placeholder="Your email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <Input
                  id="phone"
                  value={editedProfile?.phone || ""}
                  onChange={(e) => setEditedProfile((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                  className="pl-10"
                  placeholder="Your phone number"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update your account password</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="pl-10"
                  placeholder="Your current password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="pl-10"
                  placeholder="Your new password"
                />
              </div>
              <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="pl-10"
                  placeholder="Confirm your new password"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePassword}>
              <Save size={16} className="mr-2" />
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
