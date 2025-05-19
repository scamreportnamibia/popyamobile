import { AdminSettingsManager } from "@/components/admin-settings-manager"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>
      <AdminSettingsManager />
    </div>
  )
}
