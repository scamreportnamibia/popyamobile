"use client"

import { ModernBottomNavigation } from "@/components/modern-bottom-navigation"
import { ModernFab } from "@/components/ui/modern-fab"

export function ModernUIShowcase() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content would go here */}
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">Modern UI Elements</h1>
        <p className="text-gray-600 mb-8">Showcasing modern menu buttons and floating action button.</p>
      </div>

      {/* Modern Floating Action Button */}
      <ModernFab onClick={() => alert("FAB clicked!")} />

      {/* Modern Bottom Navigation */}
      <ModernBottomNavigation />
    </div>
  )
}
