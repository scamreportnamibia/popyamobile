"\"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"
import webRTCCallService, { CallEvent, type CallStateInterface } from "@/services/webrtc-call-service"

interface WebRTCCallInterfaceProps {
  userId: string
  userName: string
  remoteUserId: string
  remoteUserName: string
  remoteUserAvatar: string
  isOpen: boolean
  onClose: () => void
  initialMode?: "video" | "audio"
}

export const WebRTCCallInterface: React.FC<WebRTCCallInterfaceProps> = ({
  userId,
  userName,
  remoteUserId,
  remoteUserName,
  remoteUserAvatar,
  isOpen,
  onClose,
  initialMode = "video",
}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(initialMode === "video")
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "connected" | "error" | "ended">("idle")
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Initialize WebRTC call service
      webRTCCallService.initialize(null, userId, {
        enableVideo: isVideoEnabled,
        enableAudio: isAudioEnabled,
      })

      // Subscribe to call events
      webRTCCallService.on(CallEvent.STATE_CHANGED, handleCallStateChanged)
      webRTCCallService.on(CallEvent.REMOTE_STREAM_ADDED, handleRemoteStreamAdded)

      // Start the call
      webRTCCallService.startCall(remoteUserId, { enableVideo: isVideoEnabled, enableAudio: isAudioEnabled })
    } else {
      // End the call and clean up
      webRTCCallService.endCall()
    }

    // Cleanup on unmount
    return () => {
      webRTCCallService.removeAllListeners()
      webRTCCallService.endCall()
    }
  }, [isOpen, remoteUserId, userId, isVideoEnabled, isAudioEnabled])

  const handleCallStateChanged = (state: CallStateInterface) => {
    setCallStatus(state.status)
  }

  const handleRemoteStreamAdded = (stream: MediaStream) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream
    }
  }

  useEffect(() => {
    if (localVideoRef.current && webRTCCallService.getCallState() === "connected") {
      webRTCCallService.playLocalVideo(localVideoRef.current)
    }
  }, [localVideoRef, webRTCCallService.getCallState()])

  const toggleAudio = async () => {
    await webRTCCallService.toggleAudio(!isAudioEnabled)
    setIsAudioEnabled(!isAudioEnabled)
  }

  const toggleVideo = async () => {
    await webRTCCallService.toggleVideo(!isVideoEnabled)
    setIsVideoEnabled(!isVideoEnabled)
  }

  const endCall = async () => {
    await webRTCCallService.endCall()
    setCallStatus("ended")
    onClose()
  }

  return (
    <div className={cn("fixed inset-0 bg-black/80 z-50 flex items-center justify-center", isOpen ? "" : "hidden")}>
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {callStatus === "connecting" ? "Connecting to " : "Call with "}
            {remoteUserName}
          </h2>
          <div className="text-sm text-gray-500">
            {callStatus === "connecting"
              ? "Establishing connection..."
              : callStatus === "connected"
                ? "Call in progress"
                : "Call ended"}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 bg-gray-900 relative">
            {/* Remote video (main view) */}
            {callStatus === "connected" ? (
              <div className="h-full w-full flex items-center justify-center">
                {isVideoEnabled ? (
                  <video
                    ref={remoteVideoRef}
                    className="h-full w-full object-cover"
                    poster={remoteUserAvatar}
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={remoteUserAvatar || "/placeholder.svg"}
                      alt={remoteUserName}
                      className="w-32 h-32 rounded-full mb-4"
                    />
                    <h3 className="text-white text-xl">{remoteUserName}</h3>
                    <p className="text-gray-300">Audio call in progress</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-white text-center">
                  {callStatus === "connecting" ? (
                    <>
                      <div className="animate-pulse mb-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-600 flex items-center justify-center">
                          <PhoneOff className="text-white" />
                        </div>
                      </div>
                      <p>Connecting to {remoteUserName}...</p>
                    </>
                  ) : (
                    <p>Call ended</p>
                  )}
                </div>
              </div>
            )}

            {/* Local video (picture-in-picture) */}
            {isVideoEnabled && (
              <div className="absolute bottom-4 right-4 w-1/4 max-w-[180px] aspect-video rounded-lg overflow-hidden border-2 border-white shadow-lg">
                <video ref={localVideoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full ${isAudioEnabled ? "bg-gray-200 hover:bg-gray-300" : "bg-red-500 text-white"}`}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${isVideoEnabled ? "bg-gray-200 hover:bg-gray-300" : "bg-red-500 text-white"}`}
            >
              {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
          </div>
          <button onClick={endCall} className="p-3 rounded-full bg-red-500 text-white">
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default WebRTCCallInterface
