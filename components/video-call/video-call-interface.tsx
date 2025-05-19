"use client"

type VideoCallProps = {
  expertId: string
  expertName: string
  expertAvatar: string
  isOpen: boolean
  onClose: () => void
  initialMode?: "video" | "audio"
}

export const VideoCallInterface = ({
  expertId,
  expertName,
  expertAvatar,
  isOpen,
  onClose,
  initialMode = "video",
}: VideoCallProps) => {
  // Use the WebRTC implementation instead of Agora
  return (
    <WebRTCCallInterface
      expertId={expertId}
      expertName={expertName}
      expertAvatar={expertAvatar}
      isOpen={isOpen}
      onClose={onClose}
      initialMode={initialMode}
    />
  )
}

// Import the WebRTC implementation
import { WebRTCCallInterface } from "./webrtc-call-interface"
