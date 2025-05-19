"use client"

import { useState } from "react"
import { Save, RefreshCw, Shield, Bell, Users, Database, Globe, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export function AdminSettingsManager() {
  // General settings
  const [appName, setAppName] = useState("Popya Mental Health App")
  const [appDescription, setAppDescription] = useState("A mental health support application for Namibia")
  const [supportEmail, setSupportEmail] = useState("support@popyaapp.com")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Security settings
  const [passwordPolicy, setPasswordPolicy] = useState("medium")
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [ipRestriction, setIpRestriction] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [adminAlerts, setAdminAlerts] = useState(true)
  const [notificationFrequency, setNotificationFrequency] = useState("immediate")

  // User settings
  const [userRegistration, setUserRegistration] = useState(true)
  const [requireEmailVerification, setRequireEmailVerification] = useState(true)
  const [allowAnonymousAccess, setAllowAnonymousAccess] = useState(true)
  const [defaultUserRole, setDefaultUserRole] = useState("user")

  // Content settings
  const [contentModeration, setContentModeration] = useState(true)
  const [profanityFilter, setProfanityFilter] = useState(true)
  const [contentApproval, setContentApproval] = useState("expert_only")
  const [maxUploadSize, setMaxUploadSize] = useState("10")

  // API settings
  const [apiRateLimit, setApiRateLimit] = useState("100")
  const [apiTimeout, setApiTimeout] = useState("30")
  const [logApiRequests, setLogApiRequests] = useState(true)

  // Save settings
  const handleSaveSettings = (section: string) => {
    // In a real app, you would send this to an API
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
      duration: 3000,
    })
  }

  // Reset settings
  const handleResetSettings = (section: string) => {
    // In a real app, you would reset to default values
    toast({
      title: "Settings Reset",
      description: `${section} settings have been reset to defaults.`,
      duration: 3000,
    })
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
        <TabsTrigger value="general" className="flex items-center">
          <Globe className="mr-2 h-4 w-4" /> General
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center">
          <Shield className="mr-2 h-4 w-4" /> Security
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center">
          <Bell className="mr-2 h-4 w-4" /> Notifications
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center">
          <Users className="mr-2 h-4 w-4" /> Users
        </TabsTrigger>
        <TabsTrigger value="content" className="flex items-center">
          <FileText className="mr-2 h-4 w-4" /> Content
        </TabsTrigger>
        <TabsTrigger value="api" className="flex items-center">
          <Database className="mr-2 h-4 w-4" /> API
        </TabsTrigger>
      </TabsList>

      {/* General Settings */}
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure the basic settings for your mental health application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Name</Label>
              <Input id="app-name" value={appName} onChange={(e) => setAppName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-description">Application Description</Label>
              <Textarea
                id="app-description"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input
                id="support-email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <p className="text-sm text-gray-500">
                  When enabled, the application will be inaccessible to regular users.
                </p>
              </div>
              <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleResetSettings("General")}>
              <RefreshCw className="mr-2 h-4 w-4" /> Reset to Defaults
            </Button>
            <Button onClick={() => handleSaveSettings("General")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Security Settings */}
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure security settings to protect user data and prevent unauthorized access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password-policy">Password Policy</Label>
              <Select value={passwordPolicy} onValueChange={setPasswordPolicy}>
                <SelectTrigger id="password-policy">
                  <SelectValue placeholder="Select password policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (minimum 6 characters)</SelectItem>
                  <SelectItem value="medium">Medium (8+ chars, letters & numbers)</SelectItem>
                  <SelectItem value="high">High (8+ chars, mixed case, numbers, symbols)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Require two-factor authentication for admin accounts.</p>
              </div>
              <Switch id="two-factor" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ip-restriction">IP Restriction</Label>
                <p className="text-sm text-gray-500">Restrict admin access to specific IP addresses.</p>
              </div>
              <Switch id="ip-restriction" checked={ipRestriction} onCheckedChange={setIpRestriction} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleResetSettings("Security")}>
              <RefreshCw className="mr-2 h-4 w-4" /> Reset to Defaults
            </Button>
            <Button onClick={() => handleSaveSettings("Security")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how and when notifications are sent to users and administrators.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Send email notifications to users.</p>
              </div>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-500">Send push notifications to mobile devices.</p>
              </div>
              <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="admin-alerts">Admin Alerts</Label>
                <p className="text-sm text-gray-500">Send alerts to administrators for important events.</p>
              </div>
              <Switch id="admin-alerts" checked={adminAlerts} onCheckedChange={setAdminAlerts} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notification-frequency">Notification Frequency</Label>
              <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
                <SelectTrigger id="notification-frequency">
                  <SelectValue placeholder="Select notification frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleResetSettings("Notification")}>
              <RefreshCw className="mr-2 h-4 w-4" /> Reset to Defaults
            </Button>
            <Button onClick={() => handleSaveSettings("Notification")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* User Settings */}
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>User Settings</CardTitle>
            <CardDescription>Configure user registration, roles, and access settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="user-registration">User Registration</Label>
                <p className="text-sm text-gray-500">Allow new users to register for the application.</p>
              </div>
              <Switch id="user-registration" checked={userRegistration} onCheckedChange={setUserRegistration} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-verification">Email Verification</Label>
                <p className="text-sm text-gray-500">Require email verification for new accounts.</p>
              </div>
              <Switch
                id="email-verification"
                checked={requireEmailVerification}
                onCheckedChange={setRequireEmailVerification}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="anonymous-access">Anonymous Access</Label>
                <p className="text-sm text-gray-500">Allow users to access basic features without an account.</p>
              </div>
              <Switch id="anonymous-access" checked={allowAnonymousAccess} onCheckedChange={setAllowAnonymousAccess} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-role">Default User Role</Label>
              <Select value={defaultUserRole} onValueChange={setDefaultUserRole}>
                <SelectTrigger id="default-role">
                  <SelectValue placeholder="Select default role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Regular User</SelectItem>
                  <SelectItem value="verified">Verified User</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleResetSettings("User")}>
              <RefreshCw className="mr-2 h-4 w-4" /> Reset to Defaults
            </Button>
            <Button onClick={() => handleSaveSettings("User")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Content Settings */}
      <TabsContent value="content">
        <Card>
          <CardHeader>
            <CardTitle>Content Settings</CardTitle>
            <CardDescription>Configure content moderation, approval, and upload settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="content-moderation">Content Moderation</Label>
                <p className="text-sm text-gray-500">Automatically moderate user-generated content.</p>
              </div>
              <Switch id="content-moderation" checked={contentModeration} onCheckedChange={setContentModeration} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profanity-filter">Profanity Filter</Label>
                <p className="text-sm text-gray-500">Filter out profanity from user-generated content.</p>
              </div>
              <Switch id="profanity-filter" checked={profanityFilter} onCheckedChange={setProfanityFilter} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-approval">Content Approval</Label>
              <Select value={contentApproval} onValueChange={setContentApproval}>
                <SelectTrigger id="content-approval">
                  <SelectValue placeholder="Select approval process" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Approval Required</SelectItem>
                  <SelectItem value="expert_only">Expert Content Only</SelectItem>
                  <SelectItem value="all">All Content</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-upload">Maximum Upload Size (MB)</Label>
              <Input
                id="max-upload"
                type="number"
                value={maxUploadSize}
                onChange={(e) => setMaxUploadSize(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleResetSettings("Content")}>
              <RefreshCw className="mr-2 h-4 w-4" /> Reset to Defaults
            </Button>
            <Button onClick={() => handleSaveSettings("Content")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* API Settings */}
      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Configure API rate limits, timeouts, and logging.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rate-limit">API Rate Limit (requests per minute)</Label>
              <Input
                id="rate-limit"
                type="number"
                value={apiRateLimit}
                onChange={(e) => setApiRateLimit(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-timeout">API Timeout (seconds)</Label>
              <Input
                id="api-timeout"
                type="number"
                value={apiTimeout}
                onChange={(e) => setApiTimeout(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="log-api">Log API Requests</Label>
                <p className="text-sm text-gray-500">Keep detailed logs of all API requests.</p>
              </div>
              <Switch id="log-api" checked={logApiRequests} onCheckedChange={setLogApiRequests} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleResetSettings("API")}>
              <RefreshCw className="mr-2 h-4 w-4" /> Reset to Defaults
            </Button>
            <Button onClick={() => handleSaveSettings("API")} className="bg-[#6C63FF] hover:bg-[#5A52D5]">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
