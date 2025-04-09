
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

  // Listen for call acceptance/rejection
  useEffect(() => {
    if (!interactionId) return;
    
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false }
      }
    });

    channel
      .on('broadcast', { event: 'call-accepted' }, ({ payload }) => {
        console.log('Call accepted:', payload);
        toast.success('Consultant has joined the call');
      })
      .on('broadcast', { event: 'call-rejected' }, ({ payload }) => {
        console.log('Call rejected:', payload);
        toast.error('Call rejected', {
          description: 'The consultant is unavailable at the moment.'
        });
        if (onEndCall) {
          setTimeout(() => {
            onEndCall();
          }, 3000); // Give time for toast to be seen
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [interactionId, onEndCall, channelName]);

  // Send notification to the other participant when initiating a call
  useEffect(() => {
    const sendCallNotification = async () => {
      if (!notificationSent && interactionId) {
        try {
          // Get interaction details to send to consultant
          const { data: interactionData, error: interactionError } = await supabase
            .from('interactions')
            .select('*, metadata')
            .eq('id', interactionId)
            .single();
            
          if (interactionError) {
            console.error('Error fetching interaction data:', interactionError);
            throw interactionError;
          }
          
          // Add a notification to the database
          await supabase
            .from('messages')
            .insert({
              interaction_id: interactionId,
              content: `A video call has been initiated.`,
              sender_id: joinAs === 'consultant' ? participantId : null,
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
              interactionId: interactionId
            }
          });
          
          // Also notify the general consultant call channel
          if (joinAs === 'user' && interactionData?.metadata?.consultant_id) {
            supabase.channel('general-calls').send({
              type: 'broadcast',
              event: 'incoming-call',
              payload: {
                interactionId: interactionId,
                consultantId: interactionData.metadata.consultant_id,
                callerName: 'Anonymous user',
                description: interactionData.description || 'Video consultation'
              }
            });
          }
          
          console.log('Call notification sent');
          setNotificationSent(true);
        } catch (error) {
          console.error('Error sending call notification:', error);
        }
      }
    };

    sendCallNotification();
  }, [interactionId, participantId, joinAs, notificationSent, channelName]);

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
