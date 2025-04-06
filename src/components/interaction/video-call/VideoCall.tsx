
import { useState } from 'react';
import { useWebRTC } from './useWebRTC';
import VideoDisplay from './VideoDisplay';
import MediaControls from './MediaControls';
import ErrorDisplay from './ErrorDisplay';
import { VideoCallProps } from './types';

const VideoCall = ({ interactionId, participantId, isInitiator = false, onEndCall }: VideoCallProps) => {
  const [endCallConfirmOpen, setEndCallConfirmOpen] = useState(false);
  
  const {
    localStream,
    remoteStream,
    isConnecting,
    isVideoEnabled,
    isAudioEnabled,
    hasMediaError,
    isAudioOnly,
    localVideoRef,
    remoteVideoRef,
    toggleVideo,
    toggleAudio,
    tryAudioOnly,
    endCall,
    retryConnection
  } = useWebRTC(interactionId, isInitiator, onEndCall);

  return (
    <div className="flex flex-col h-full">
      {hasMediaError ? (
        <ErrorDisplay 
          onRetryConnection={retryConnection}
          onTryAudioOnly={tryAudioOnly}
          onEndCall={endCall}
        />
      ) : (
        <VideoDisplay
          localStream={localStream}
          remoteStream={remoteStream}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          isConnecting={isConnecting}
          isAudioOnly={isAudioOnly}
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
        />
      )}
      
      {/* Controls */}
      <MediaControls
        localStream={localStream}
        isAudioOnly={isAudioOnly}
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        hasMediaError={hasMediaError}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onEndCall={endCall}
      />
    </div>
  );
};

export default VideoCall;
