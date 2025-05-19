"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, X } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface ProfilePictureUploadProps {
  currentImageUrl: string | null
  userId: string
  onUploadSuccess: (url: string) => void
}

export function ProfilePictureUpload({ currentImageUrl, userId, onUploadSuccess }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Create a preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setShowPreview(true)
  }

  const handleUpload = async () => {
    if (!previewUrl || !fileInputRef.current?.files?.[0]) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const file = fileInputRef.current.files[0]
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", userId)

      const response = await fetch("/api/profile/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      })

      onUploadSuccess(data.imageUrl)
      setShowPreview(false)
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const cancelUpload = () => {
    setShowPreview(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* Current profile picture or placeholder */}
      <div
        className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer relative"
        onClick={handleFileSelect}
      >
        {isUploading ? (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : previewUrl ? (
          <Image src={previewUrl || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
        ) : (
          <Camera size={32} className="text-gray-400" />
        )}
      </div>

      {/* Camera button */}
      <button
        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md"
        onClick={handleFileSelect}
      >
        <Camera size={16} className="text-[#6C63FF]" />
      </button>

      {/* Preview and upload controls */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Preview Profile Picture</h3>
              <button onClick={cancelUpload} className="p-1">
                <X size={20} />
              </button>
            </div>

            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
              {previewUrl && (
                <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={cancelUpload}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
