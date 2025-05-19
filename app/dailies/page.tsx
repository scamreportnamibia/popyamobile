"use client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import DailiesFeed from "@/components/dailies-feed"

export default function DailiesPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-[56px] bg-white z-30 border-b px-4 py-2 flex items-center">
        <Link href="/" className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="ml-3 text-lg font-semibold">Dailies</h1>
      </div>

      <div className="p-4">
        <DailiesFeed />
      </div>
    </div>
  )
}
