
import { useState, useEffect, useRef } from 'react';
import { DailyProvider, useDaily, useVideoTrack, useAudioTrack, useDailyEvent } from '@daily-co/daily-react';
import { supabase } from '@/integrations/supabase/client';
import VideoDisplay from './VideoDisplay';
import MediaControls from './MediaControls';
import ErrorDisplay from './ErrorDisplay';
import { VideoCallProps } from './types';
import { toast } from 'sonner';

// Daily Call component that uses Daily hooks to manage the call
const DailyCall = ({ 
  onEndCall, 
  interactionId,
  joinAs
}: {
  onEndCall?: () => void;
  interactionId: string;
  joinAs: 'consultant' | 'user';
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [hasMediaError, setHasMediaError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionState, setConnectionState] = useState<string>('connecting');

  const callObject = useDaily();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // We need to handle the participant differently as the hook API has changed
  // Access local participant directly from callObject when it's available
  const localParticipant = callObject ? callObject.participants().local : null;
  
  // Get the first remote participant
  const remoteParticipants = callObject ? 
    Object.values(callObject.participants()).filter(p => p.session_id !== localParticipant?.session_id) :
    [];
  const remoteParticipant = remoteParticipants.length > 0 ? remoteParticipants[0] : null;

  // Get video and audio tracks with proper type checking
  const localVideo = localParticipant ? useVideoTrack(localParticipant.session_id) : null;
  const localAudio = localParticipant ? useAudioTrack(localParticipant.session_id) : null;
  const remoteVideo = remoteParticipant ? useVideoTrack(remoteParticipant.session_id) : null;
  const remoteAudio = remoteParticipant ? useAudioTrack(remoteParticipant.session_id) : null;

  // Set up event handlers
  useDailyEvent('joined-meeting', () => {
    setIsConnecting(false);
    setConnectionState('connected');
    console.log('Successfully joined the Daily call');
    toast.success('Connected to call');
  });

  useDailyEvent('left-meeting', () => {
    setConnectionState('disconnected');
    console.log('Left the Daily call');
    onEndCall?.();
  });

  useDailyEvent('participant-joined', (event) => {
    console.log('Remote participant joined:', event.participant);
    toast.info('Participant joined call');
  });

  useDailyEvent('participant-left', (event) => {
    console.log('Remote participant left:', event.participant);
    toast.info('Participant left call');
  });

  useDailyEvent('error', (event) => {
    console.error('Daily error:', event);
    setHasMediaError(true);
    toast.error('Video call error', {
      description: event.errorMsg || 'There was a problem with the video call'
    });
  });

  // Set up local video element
  useEffect(() => {
    if (localVideo && localVideo.persistentTrack && localVideoRef.current) {
      localVideoRef.current.srcObject = new MediaStream([localVideo.persistentTrack]);
    }
  }, [localVideo]);

  // Set up remote video element
  useEffect(() => {
    if (remoteVideo && remoteVideo.persistentTrack && remoteVideoRef.current) {
      const stream = new MediaStream();
      stream.addTrack(remoteVideo.persistentTrack);
      if (remoteAudio && remoteAudio.persistentTrack) {
        stream.addTrack(remoteAudio.persistentTrack);
      }
      remoteVideoRef.current.srcObject = stream;
    }
  }, [remoteVideo, remoteAudio]);

  // Handle video toggle
  const toggleVideo = () => {
    if (callObject) {
      callObject.setLocalVideo(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  // Handle audio toggle
  const toggleAudio = () => {
    if (callObject) {
      callObject.setLocalAudio(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Try audio only mode
  const tryAudioOnly = () => {
    setIsAudioOnly(true);
    if (callObject) {
      callObject.setLocalVideo(false);
      setIsVideoEnabled(false);
    }
  };

  // End call
  const endCall = () => {
    if (callObject) {
      callObject.leave();
    }
    onEndCall?.();
  };

  // Determine local and remote media streams from tracks
  const localStream = localParticipant && (localVideo || localAudio) 
    ? new MediaStream([
        ...(localVideo?.persistentTrack ? [localVideo.persistentTrack] : []),
        ...(localAudio?.persistentTrack ? [localAudio.persistentTrack] : [])
      ])
    : null;

  const remoteStream = remoteParticipant && (remoteVideo || remoteAudio)
    ? new MediaStream([
        ...(remoteVideo?.persistentTrack ? [remoteVideo.persistentTrack] : []),
        ...(remoteAudio?.persistentTrack ? [remoteAudio.persistentTrack] : [])
      ])
    : null;

  const isConnected = localParticipant && connectionState === 'connected';

  return (
    <div className="flex flex-col h-full">
      {hasMediaError ? (
        <ErrorDisplay 
          onRetryConnection={() => window.location.reload()}
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
          isConnected={isConnected}
          isAudioOnly={isAudioOnly}
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          connectionState={connectionState}
        />
      )}
      
      <MediaControls
        localStream={localStream}
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

// Main VideoCall component that creates the Daily context
const VideoCall = ({ 
  interactionId, 
  participantId, 
  onEndCall,
  joinAs
}: VideoCallProps) => {
  const [dailyUrl, setDailyUrl] = useState<string | null>(null);
  const [dailyToken, setDailyToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const setupCall = async () => {
      try {
        console.log('Setting up Daily call for interaction:', interactionId);
        setIsLoading(true);
        
        // Create or join room using our Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('daily-room', {
          body: {
            roomName: `interaction-${interactionId}`,
            isOwner: joinAs === 'consultant'
          }
        });

        if (error) {
          console.error('Error from daily-room function:', error);
          throw error;
        }

        console.log('Received Daily room data:', data);
        setDailyUrl(data.url);
        setDailyToken(data.token);
        setIsLoading(false);
      } catch (error) {
        console.error('Error setting up call:', error);
        setHasError(true);
        setIsLoading(false);
        toast.error('Failed to set up video call');
      }
    };

    if (interactionId) {
      setupCall();
    }
  }, [interactionId, joinAs]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasError || !dailyUrl || !dailyToken) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="mb-4 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Failed to connect to video call</h3>
        <p className="text-sm mb-4">There was a problem connecting to the video service.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <DailyProvider url={dailyUrl} token={dailyToken}>
      <DailyCall
        onEndCall={onEndCall}
        interactionId={interactionId}
        joinAs={joinAs}
      />
    </DailyProvider>
  );
};

export default VideoCall;
