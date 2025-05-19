"use client"

import { useState } from "react"
import Image from "next/image"
import { Phone, Video, Calendar, MessageSquare, Shield, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface Expert {
  id: string
  name: string
  title: string
  specialization: string
  imageUrl: string
  isOnline: boolean
  isFree: boolean
  organization?: string
  rating: number
  reviewCount: number
}

interface ExpertCardProps {
  expert: Expert
  onCallClick: (expertId: string, type: "audio" | "video") => void
  onChatClick: (expertId: string) => void
  onScheduleClick: (expertId: string) => void
}

export function ExpertCard({ expert, onCallClick, onChatClick, onScheduleClick }: ExpertCardProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  const handleCallClick = (type: "audio" | "video") => {
    if (expert.isOnline) {
      onCallClick(expert.id, type)
    } else {
      setShowScheduleDialog(true)
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative">
          {/* Expert Image */}
          <div className="relative h-48 w-full bg-gray-100">
            <Image
              src={expert.imageUrl || "/placeholder.svg?height=192&width=384"}
              alt={expert.name}
              fill
              className="object-cover"
            />

            {/* Organization Badge for Free Services */}
            {expert.isFree && expert.organization && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-white text-black font-semibold border border-gray-200 shadow-sm">
                  {expert.organization}
                </Badge>
              </div>
            )}

            {/* Online/Offline Status */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-sm">
              <span className={`h-2.5 w-2.5 rounded-full ${expert.isOnline ? "bg-green-500" : "bg-red-500"}`}></span>
              <span className="text-xs font-medium">{expert.isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>

          {/* Expert Info */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{expert.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{expert.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{expert.specialization}</p>

                {/* Free Service Indicator */}
                {expert.isFree && (
                  <div className="mt-2 flex items-center">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                      Free Service
                    </Badge>
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3.5 h-3.5 ${i < Math.floor(expert.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">({expert.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Official Badge for Government/NGO */}
              {expert.isFree && expert.organization && (
                <div className="flex flex-col items-center">
                  {expert.organization === "GRN" && <Shield className="h-5 w-5 text-blue-600" />}
                  {expert.organization === "NAMPOL" && <Shield className="h-5 w-5 text-blue-800" />}
                  {expert.organization === "Lifeline/Childline" && <AlertCircle className="h-5 w-5 text-red-600" />}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center h-14 p-1"
                onClick={() => handleCallClick("audio")}
              >
                <Phone className="h-4 w-4 mb-1" />
                <span className="text-xs">Call</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center h-14 p-1"
                onClick={() => handleCallClick("video")}
              >
                <Video className="h-4 w-4 mb-1" />
                <span className="text-xs">Video</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center h-14 p-1"
                onClick={() => onChatClick(expert.id)}
              >
                <MessageSquare className="h-4 w-4 mb-1" />
                <span className="text-xs">Chat</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center h-14 p-1"
                onClick={() => setShowScheduleDialog(true)}
              >
                <Calendar className="h-4 w-4 mb-1" />
                <span className="text-xs">Schedule</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Scheduling Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a session with {expert.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <h4 className="font-medium">Select Date & Time</h4>
              <div className="grid grid-cols-3 gap-2">
                {["Today", "Tomorrow", "In 2 days"].map((day, i) => (
                  <Button key={i} variant="outline" className="w-full">
                    {day}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"].map((time, i) => (
                  <Button key={i} variant="outline" className="w-full">
                    {time}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onScheduleClick(expert.id)
                    setShowScheduleDialog(false)
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
