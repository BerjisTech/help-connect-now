
import { useState, useEffect } from 'react';
import { useWebRTC } from './useWebRTC';
import VideoDisplay from './VideoDisplay';
import MediaControls from './MediaControls';
import ErrorDisplay from './ErrorDisplay';
import { VideoCallProps } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const VideoCall = ({ 
  interactionId, 
  participantId, 
  isInitiator = false, 
  onEndCall,
  joinAs
}: VideoCallProps) => {
  const [endCallConfirmOpen, setEndCallConfirmOpen] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  
  // Determine channel name based on interactionId only to ensure both parties use the same channel
  const channelName = `videocall:${interactionId}`;
  
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
  } = useWebRTC(interactionId, isInitiator, onEndCall, channelName);

  // Send notification to the other participant when initiating a call
  useEffect(() => {
    const sendCallNotification = async () => {
      if (isInitiator && !notificationSent && interactionId && participantId) {
        try {
          // Add a notification to the database
          await supabase
            .from('messages')
            .insert({
              interaction_id: interactionId,
              content: `A video call has been initiated. Please join the call.`,
              sender_id: joinAs === 'user' ? null : participantId,
              anonymous_sender_id: joinAs === 'user' ? 'system' : null,
              is_system_message: true,
              requires_attention: true
            });
          
          // Send a real-time message through the signaling channel
          supabase.channel(channelName).send({
            type: 'broadcast',
            event: 'call-notification',
            payload: { 
              message: 'Incoming call', 
              interactionId: interactionId,
              initiator: joinAs 
            }
          });
          
          console.log('Call notification sent');
          setNotificationSent(true);
        } catch (error) {
          console.error('Error sending call notification:', error);
        }
      }
    };

    sendCallNotification();
  }, [isInitiator, interactionId, participantId, joinAs, notificationSent, channelName]);

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
