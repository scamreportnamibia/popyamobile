"use client"

import { UltraModernNavigation } from "@/components/ultra-modern-navigation"

export default function ModernUIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Ultra Modern UI</h1>
        <p className="text-gray-600 mb-8">
          This page showcases our ultra-modern navigation with consistent button styling.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <h2 className="font-semibold mb-2">Content Area</h2>
          <p className="text-gray-500">
            Your app content would appear here. The navigation bar is fixed at the bottom.
          </p>
        </div>

        <div className="h-40" />
      </div>

      <UltraModernNavigation />
    </div>
  )
}
