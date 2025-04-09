
export interface VideoCallProps {
  interactionId: string;
  participantId?: string;
  isInitiator?: boolean;
  onEndCall?: () => void;
  joinAs: 'consultant' | 'user';
}

export interface ErrorDisplayProps {
  onRetryConnection: () => void;
  onTryAudioOnly: () => void;
  onEndCall: () => void;
}

export interface MediaControlsProps {
  localStream: MediaStream | null;
  isAudioOnly: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  hasMediaError: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onEndCall: () => void;
  onRetryConnection: () => void;
}

export interface VideoDisplayProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  isConnecting: boolean;
  isConnected: boolean;
  isAudioOnly: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  connectionState?: string;
}
