
import { useState, useEffect, useRef } from 'react';
import { DailyProvider } from '@daily-co/daily-react';
import { supabase } from '@/integrations/supabase/client';
import VideoDisplay from './VideoDisplay';
import MediaControls from './MediaControls';
import ErrorDisplay from './ErrorDisplay';
import { VideoCallProps } from './types';

const VideoCall = ({ 
  interactionId, 
  participantId, 
  isInitiator = false, 
  onEndCall,
  joinAs
}: VideoCallProps) => {
  const [hasMediaError, setHasMediaError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('new');
  const [dailyUrl, setDailyUrl] = useState<string | null>(null);
  const [dailyToken, setDailyToken] = useState<string | null>(null);
  
  const callFrameRef = useRef(null);

  useEffect(() => {
    const setupCall = async () => {
      try {
        // Create or join room using our Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('daily-room', {
          body: {
            roomName: `interaction-${interactionId}`,
            isOwner: joinAs === 'consultant'
          }
        });

        if (error) throw error;

        setDailyUrl(data.url);
        setDailyToken(data.token);
        setIsConnecting(false);
      } catch (error) {
        console.error('Error setting up call:', error);
        setHasMediaError(true);
        setIsConnecting(false);
      }
    };

    if (interactionId) {
      setupCall();
    }

    return () => {
      // Cleanup if needed
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
      }
    };
  }, [interactionId, joinAs]);

  const handleJoinedMeeting = () => {
    setIsConnected(true);
    setConnectionState('connected');
  };

  const handleLeftMeeting = () => {
    setIsConnected(false);
    setConnectionState('disconnected');
    onEndCall?.();
  };

  const handleParticipantJoined = (event: any) => {
    console.log('Participant joined:', event.participant);
  };

  const handleParticipantLeft = (event: any) => {
    console.log('Participant left:', event.participant);
  };

  const toggleVideo = () => {
    if (callFrameRef.current) {
      const isCurrentlyEnabled = callFrameRef.current.localVideo();
      callFrameRef.current.setLocalVideo(!isCurrentlyEnabled);
      setIsVideoEnabled(!isCurrentlyEnabled);
    }
  };

  const toggleAudio = () => {
    if (callFrameRef.current) {
      const isCurrentlyEnabled = callFrameRef.current.localAudio();
      callFrameRef.current.setLocalAudio(!isCurrentlyEnabled);
      setIsAudioEnabled(!isCurrentlyEnabled);
    }
  };

  const tryAudioOnly = () => {
    setIsAudioOnly(true);
    if (callFrameRef.current) {
      callFrameRef.current.setLocalVideo(false);
    }
    setIsVideoEnabled(false);
  };

  const endCall = () => {
    if (callFrameRef.current) {
      callFrameRef.current.leave();
    }
    onEndCall?.();
  };

  if (!dailyUrl || !dailyToken) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {hasMediaError ? (
        <ErrorDisplay 
          onRetryConnection={() => window.location.reload()}
          onTryAudioOnly={tryAudioOnly}
          onEndCall={endCall}
        />
      ) : (
        <DailyProvider url={dailyUrl} token={dailyToken}>
          <VideoDisplay
            localVideoRef={callFrameRef}
            isConnecting={isConnecting}
            isConnected={isConnected}
            isAudioOnly={isAudioOnly}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            connectionState={connectionState}
            onJoinedMeeting={handleJoinedMeeting}
            onLeftMeeting={handleLeftMeeting}
            onParticipantJoined={handleParticipantJoined}
            onParticipantLeft={handleParticipantLeft}
          />
        </DailyProvider>
      )}
      
      <MediaControls
        isAudioOnly={isAudioOnly}
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        hasMediaError={hasMediaError}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onEndCall={endCall}
        onRetryConnection={() => window.location.reload()}
      />
    </div>
  );
};

export default VideoCall;
