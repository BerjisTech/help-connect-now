
import { useState, useEffect } from 'react';
import { useWebRTC } from '../useWebRTC';
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
  const [notificationSent, setNotificationSent] = useState(false);
  const [callJoined, setCallJoined] = useState(false);
  
  // Determine channel name based on interactionId only to ensure both parties use the same channel
  const channelName = `videocall:${interactionId}`;
  
  const {
    localStream,
    remoteStream,
    isConnecting,
    isConnected,
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
    retryConnection,
    connectionState
  } = useWebRTC(interactionId, joinAs === 'user', onEndCall, channelName);

  // Log connection state for debugging
  useEffect(() => {
    console.log(`WebRTC connection state: ${connectionState}`);
  }, [connectionState]);

  useEffect(() => {
    if (!interactionId) return;
    
    // Update call joined state when connected
    if (isConnected) {
      setCallJoined(true);
    }
    
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false }
      }
    });

    channel
      .on('broadcast', { event: 'call-accepted' }, ({ payload }) => {
        console.log('Call accepted:', payload);
        toast.success('Call connected - other participant has joined');
        setCallJoined(true);
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
      .on('broadcast', { event: 'participant-ready' }, ({ payload }) => {
        console.log('Participant is ready:', payload);
        // Force retry connection when participant is ready
        setTimeout(() => {
          retryConnection();
        }, 1000);
      })
      .subscribe();

    // Send acceptance notification when joining as a consultant
    if (joinAs === 'consultant' && !notificationSent) {
      setTimeout(() => {
        channel.send({
          type: 'broadcast',
          event: 'call-accepted',
          payload: { 
            message: 'Consultant has joined the call'
          }
        });
        
        // Also send participant-ready to ensure both sides attempt connection
        channel.send({
          type: 'broadcast',
          event: 'participant-ready',
          payload: { 
            participantType: 'consultant',
            timestamp: new Date().toISOString()
          }
        });
        
        setNotificationSent(true);
      }, 1000);
    }

    return () => {
      channel.unsubscribe();
    };
  }, [interactionId, onEndCall, channelName, joinAs, notificationSent, isConnected, retryConnection]);

  useEffect(() => {
    const sendCallNotification = async () => {
      if (!notificationSent && interactionId) {
        try {
          const { data: interactionData, error: interactionError } = await supabase
            .from('interactions')
            .select('*, metadata')
            .eq('id', interactionId)
            .single();
            
          if (interactionError) {
            console.error('Error fetching interaction data:', interactionError);
            throw interactionError;
          }
          
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
          
          supabase.channel(channelName).send({
            type: 'broadcast',
            event: 'call-notification',
            payload: { 
              message: 'Incoming call', 
              interactionId: interactionId
            }
          });
          
          // Also send participant-ready to ensure both sides attempt connection
          supabase.channel(channelName).send({
            type: 'broadcast',
            event: 'participant-ready',
            payload: { 
              participantType: 'user',
              timestamp: new Date().toISOString()
            }
          });
          
          let consultantId = null;
          
          if (interactionData?.metadata) {
            if (typeof interactionData.metadata === 'object' && interactionData.metadata !== null) {
              if (Array.isArray(interactionData.metadata)) {
                console.warn('Metadata is an array, cannot extract consultant_id directly:', interactionData.metadata);
              } else {
                const metadataObj = interactionData.metadata as { [key: string]: any };
                consultantId = metadataObj.consultant_id;
              }
            } else if (typeof interactionData.metadata === 'string') {
              try {
                const parsedMetadata = JSON.parse(interactionData.metadata);
                if (typeof parsedMetadata === 'object' && parsedMetadata !== null && !Array.isArray(parsedMetadata)) {
                  consultantId = parsedMetadata.consultant_id;
                }
              } catch (e) {
                console.error('Failed to parse metadata string as JSON:', e);
              }
            }
          }
            
          if (consultantId) {
            supabase.channel('general-calls').send({
              type: 'broadcast',
              event: 'incoming-call',
              payload: {
                interactionId: interactionId,
                consultantId: String(consultantId),
                callerName: 'Anonymous user',
                description: interactionData.description || 'Video consultation'
              }
            });
          } else {
            console.warn('No consultant_id found in metadata:', interactionData.metadata);
          }
          
          console.log('Call notification sent');
          setNotificationSent(true);
        } catch (error) {
          console.error('Error sending call notification:', error);
        }
      }
    };

    if (joinAs === 'user') {
      sendCallNotification();
    }
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
        onRetryConnection={retryConnection}
      />
    </div>
  );
};

export default VideoCall;
