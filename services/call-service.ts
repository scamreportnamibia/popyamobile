import AgoraRTC, { type IAgoraRTCClient, type ICameraVideoTrack, type IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"

// Agora app configuration - these would come from environment variables in production
const appId = "YOUR_AGORA_APP_ID"
const appCertificate = "YOUR_AGORA_APP_CERTIFICATE"

export type CallType = "video" | "audio"
export type CallStatus = "idle" | "connecting" | "connected" | "error" | "ended"

export interface CallParticipant {
  uid: string | number
  name: string
  avatar?: string
  audioEnabled: boolean
  videoEnabled: boolean
}

export interface CallState {
  status: CallStatus
  callId?: string
  localParticipant?: CallParticipant
  remoteParticipants: CallParticipant[]
  error?: Error
}

class CallService {
  private client: IAgoraRTCClient | null = null
  private localAudioTrack: IMicrophoneAudioTrack | null = null
  private localVideoTrack: ICameraVideoTrack | null = null
  private channelParameters = {
    localAudioTrack: null as IMicrophoneAudioTrack | null,
    localVideoTrack: null as ICameraVideoTrack | null,
    remoteAudioTrack: null as any,
    remoteVideoTrack: null as any,
  }
  private onStateChange: ((state: CallState) => void) | null = null
  private state: CallState = {
    status: "idle",
    remoteParticipants: [],
  }

  constructor() {
    this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
    this.setupEventListeners()
  }

  private setupEventListeners() {
    if (!this.client) return

    // Handle user published event (when remote user publishes tracks)
    this.client.on("user-published", async (user, mediaType) => {
      await this.client?.subscribe(user, mediaType)
      if (mediaType === "video") {
        this.channelParameters.remoteVideoTrack = user.videoTrack
        this.updateRemoteParticipant(user.uid, { videoEnabled: true })
        this.notifyStateChange()
      }
      if (mediaType === "audio") {
        this.channelParameters.remoteAudioTrack = user.audioTrack
        user.audioTrack?.play()
        this.updateRemoteParticipant(user.uid, { audioEnabled: true })
        this.notifyStateChange()
      }
    })

    // Handle user unpublished event (when remote user unpublishes tracks)
    this.client.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        this.updateRemoteParticipant(user.uid, { videoEnabled: false })
      }
      if (mediaType === "audio") {
        this.updateRemoteParticipant(user.uid, { audioEnabled: false })
      }
      this.notifyStateChange()
    })

    // Handle user left event
    this.client.on("user-left", (user) => {
      this.removeParticipant(user.uid)
      this.notifyStateChange()
    })
  }

  private updateRemoteParticipant(uid: string | number, updates: Partial<CallParticipant>) {
    const participant = this.state.remoteParticipants.find((p) => p.uid === uid)

    if (participant) {
      const index = this.state.remoteParticipants.indexOf(participant)
      this.state.remoteParticipants[index] = { ...participant, ...updates }
    } else {
      this.state.remoteParticipants.push({
        uid,
        name: `User ${uid}`, // Default name
        audioEnabled: updates.audioEnabled || false,
        videoEnabled: updates.videoEnabled || false,
      })
    }
  }

  private removeParticipant(uid: string | number) {
    this.state.remoteParticipants = this.state.remoteParticipants.filter((p) => p.uid !== uid)
  }

  private notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state })
    }
  }

  // Generate a token for joining a channel (in production, this would come from your server)
  private async generateToken(channelName: string, uid: string): Promise<string> {
    // In a real implementation, this would make an API call to your secure token server
    // For demo purposes, returning a placeholder
    return `demo-token-${channelName}-${uid}`
  }

  // Initialize call and join the channel
  public async startCall(
    channelName: string,
    uid: string,
    participantName: string,
    callType: CallType,
    onStateChange: (state: CallState) => void,
  ): Promise<void> {
    try {
      this.onStateChange = onStateChange
      this.state = {
        ...this.state,
        status: "connecting",
        callId: channelName,
        localParticipant: {
          uid,
          name: participantName,
          audioEnabled: true,
          videoEnabled: callType === "video",
        },
      }

      this.notifyStateChange()

      const token = await this.generateToken(channelName, uid)
      await this.client?.join(appId, channelName, token, uid)

      // Create and publish audio track
      this.channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()

      // If it's a video call, create and publish video track
      if (callType === "video") {
        this.channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
        await this.client?.publish([this.channelParameters.localAudioTrack, this.channelParameters.localVideoTrack])
      } else {
        await this.client?.publish([this.channelParameters.localAudioTrack])
      }

      this.state.status = "connected"
      this.notifyStateChange()
    } catch (error) {
      this.state.status = "error"
      this.state.error = error as Error
      this.notifyStateChange()
      console.error("Error joining call:", error)
    }
  }

  // Toggle mute/unmute audio
  public async toggleAudio(): Promise<void> {
    if (!this.channelParameters.localAudioTrack) return

    if (this.state.localParticipant?.audioEnabled) {
      await this.channelParameters.localAudioTrack.setEnabled(false)
      if (this.state.localParticipant) {
        this.state.localParticipant.audioEnabled = false
      }
    } else {
      await this.channelParameters.localAudioTrack.setEnabled(true)
      if (this.state.localParticipant) {
        this.state.localParticipant.audioEnabled = true
      }
    }

    this.notifyStateChange()
  }

  // Toggle video on/off
  public async toggleVideo(): Promise<void> {
    if (!this.channelParameters.localVideoTrack) return

    if (this.state.localParticipant?.videoEnabled) {
      await this.channelParameters.localVideoTrack.setEnabled(false)
      if (this.state.localParticipant) {
        this.state.localParticipant.videoEnabled = false
      }
    } else {
      await this.channelParameters.localVideoTrack.setEnabled(true)
      if (this.state.localParticipant) {
        this.state.localParticipant.videoEnabled = true
      }
    }

    this.notifyStateChange()
  }

  // End the call and clean up resources
  public async endCall(): Promise<void> {
    if (this.channelParameters.localAudioTrack) {
      this.channelParameters.localAudioTrack.close()
      this.channelParameters.localAudioTrack = null
    }

    if (this.channelParameters.localVideoTrack) {
      this.channelParameters.localVideoTrack.close()
      this.channelParameters.localVideoTrack = null
    }

    await this.client?.leave()

    this.state = {
      status: "ended",
      remoteParticipants: [],
    }

    this.notifyStateChange()
  }

  // Play local video on element
  public playLocalVideo(element: string | HTMLElement): void {
    if (this.channelParameters.localVideoTrack) {
      this.channelParameters.localVideoTrack.play(element)
    }
  }

  // Play remote video on element
  public playRemoteVideo(uid: string | number, element: string | HTMLElement): void {
    const user = this.client?.remoteUsers.find((u) => u.uid === uid)
    if (user && user.videoTrack) {
      user.videoTrack.play(element)
    }
  }
}

// Export a singleton instance
export const callService = new CallService()
