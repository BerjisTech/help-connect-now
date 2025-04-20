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

  const localParticipant = callObject ? callObject.participants().local : null;
  
  const remoteParticipants = callObject ? 
    Object.values(callObject.participants()).filter(p => p.session_id !== localParticipant?.session_id) :
    [];
  const remoteParticipant = remoteParticipants.length > 0 ? remoteParticipants[0] : null;

  const localVideo = localParticipant ? useVideoTrack(localParticipant.session_id) : null;
  const localAudio = localParticipant ? useAudioTrack(localParticipant.session_id) : null;
  const remoteVideo = remoteParticipant ? useVideoTrack(remoteParticipant.session_id) : null;
  const remoteAudio = remoteParticipant ? useAudioTrack(remoteParticipant.session_id) : null;

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

  useEffect(() => {
    if (localVideo && localVideo.persistentTrack && localVideoRef.current) {
      localVideoRef.current.srcObject = new MediaStream([localVideo.persistentTrack]);
    }
  }, [localVideo]);

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

  const toggleVideo = () => {
    if (callObject) {
      callObject.setLocalVideo(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (callObject) {
      callObject.setLocalAudio(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const tryAudioOnly = () => {
    setIsAudioOnly(true);
    if (callObject) {
      callObject.setLocalVideo(false);
      setIsVideoEnabled(false);
    }
  };

  const endCall = () => {
    if (callObject) {
      callObject.leave();
    }
    onEndCall?.();
  };

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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [connectionAttempt, setConnectionAttempt] = useState(0);

  useEffect(() => {
    const setupCall = async () => {
      try {
        console.log('Setting up Daily call for interaction:', interactionId);
        setIsLoading(true);
        
        const { data, error } = await supabase.functions.invoke('daily-room', {
          body: {
            roomName: `interaction-${interactionId}`,
            isOwner: joinAs === 'consultant'
          }
        });

        if (error) {
          console.error('Error from daily-room function:', error);
          setErrorMessage(`Error from API: ${error.message || 'Unknown error'}`);
          throw error;
        }

        console.log('Received Daily room data:', data);
        
        if (!data) {
          console.error('Empty response from daily-room function');
          setErrorMessage('Empty response from video service');
          throw new Error('Empty response from video service');
        }
        
        if (!data.url) {
          console.error('Missing URL in response from daily-room function:', data);
          setErrorMessage('Missing URL in response from video service');
          throw new Error('Missing URL in response from video service');
        }
        
        if (!data.token) {
          console.error('Missing token in response from daily-room function:', data);
          setErrorMessage('Missing token in response from video service');
          throw new Error('Missing token in response from video service');
        }
        
        setDailyUrl(data.url);
        setDailyToken(data.token);
        setIsLoading(false);
        
        if (joinAs === 'user') {
          const channelName = `general-calls`;
          console.log(`Sending call notification through channel ${channelName}`);
          
          await supabase.channel(channelName).send({
            type: 'broadcast',
            event: 'incoming-call',
            payload: {
              interactionId: interactionId,
              callerName: 'User requesting help',
              description: 'Video consultation request',
              timestamp: new Date().toISOString()
            }
          });
        }
      } catch (error) {
        console.error('Error setting up call:', error);
        setHasError(true);
        setIsLoading(false);
        
        toast.error('Failed to set up video call', {
          description: errorMessage || 'There was a problem connecting to the video service'
        });
        
        if (connectionAttempt < 3) {
          setTimeout(() => {
            setConnectionAttempt(prev => prev + 1);
          }, 3000);
        }
      }
    };

    if (interactionId) {
      setupCall();
    }
  }, [interactionId, joinAs, connectionAttempt, errorMessage]);

  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (isLoading) {
      timeoutId = window.setTimeout(() => {
        setHasError(true);
        setIsLoading(false);
        toast.error('Connection timeout', {
          description: 'Video call is taking too long to connect'
        });
      }, 20000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-2 text-sm text-gray-500">Connecting to video service...</p>
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
        <p className="text-sm mb-2">There was a problem connecting to the video service.</p>
        {errorMessage && (
          <p className="text-xs text-red-500 mb-4 max-w-xs text-center">{errorMessage}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Try Again
          </button>
          <button
            onClick={onEndCall}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
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
