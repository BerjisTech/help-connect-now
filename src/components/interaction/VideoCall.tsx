
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Video, VideoOff, Mic, MicOff, PhoneOff, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VideoCallProps {
  interactionId: string;
  participantId?: string;
  isInitiator?: boolean;
  onEndCall?: () => void;
}

const VideoCall = ({ interactionId, participantId, isInitiator = false, onEndCall }: VideoCallProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [hasMediaError, setHasMediaError] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  
  // Set up signaling channel using Supabase Realtime
  useEffect(() => {
    const channel = supabase.channel(`videocall:${interactionId}`, {
      config: {
        broadcast: { self: true }
      }
    });

    // Listen for signaling messages
    channel
      .on('broadcast', { event: 'offer' }, ({ payload }) => {
        if (!isInitiator && peerConnectionRef.current) {
          handleReceivedOffer(payload.offer);
        }
      })
      .on('broadcast', { event: 'answer' }, ({ payload }) => {
        if (isInitiator && peerConnectionRef.current) {
          handleReceivedAnswer(payload.answer);
        }
      })
      .on('broadcast', { event: 'ice-candidate' }, ({ payload }) => {
        if (peerConnectionRef.current) {
          handleReceivedICECandidate(payload.candidate);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setupMediaAndPeerConnection();
        }
      });

    return () => {
      channel.unsubscribe();
      cleanupCall();
    };
  }, [interactionId, isInitiator]);

  // Set up media streams and peer connection
  const setupMediaAndPeerConnection = async () => {
    setIsConnecting(true);
    setHasMediaError(false);
    
    try {
      // First try to get both video and audio
      const constraints = isAudioOnly 
        ? { video: false, audio: true }
        : { video: true, audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };
      
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Set up data channel for messaging
      if (isInitiator) {
        const dataChannel = peerConnection.createDataChannel('chat');
        channelRef.current = dataChannel;
        setupDataChannel(dataChannel);
      } else {
        peerConnection.ondatachannel = (event) => {
          channelRef.current = event.channel;
          setupDataChannel(event.channel);
        };
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignalingMessage('ice-candidate', { candidate: event.candidate });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
          setIsConnecting(false);
          toast.success('Call connected');
        } else if (['disconnected', 'failed', 'closed'].includes(peerConnection.connectionState)) {
          setIsConnected(false);
          toast.error('Call disconnected');
          onEndCall?.();
        }
      };

      // Handle incoming remote streams
      peerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        }
      };

      // Create and send offer if initiator
      if (isInitiator) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        sendSignalingMessage('offer', { offer });
      }
      
    } catch (error) {
      console.error('Error setting up media or peer connection:', error);
      
      // If we failed with video, try audio-only as fallback
      if (!isAudioOnly && error instanceof Error && error.name === 'NotReadableError') {
        setHasMediaError(true);
        toast.error('Could not access camera. Try using audio-only mode or check your camera settings.');
      } else {
        toast.error('Could not access microphone or camera. Please check your device settings.');
        setHasMediaError(true);
        setIsConnecting(false);
      }
    }
  };

  // Try with audio only
  const tryAudioOnly = () => {
    // Clean up existing resources first
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    setLocalStream(null);
    setRemoteStream(null);
    setIsAudioOnly(true);
    
    // Retry connection
    setupMediaAndPeerConnection();
  };

  // Handle received offer (for non-initiator)
  const handleReceivedOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      sendSignalingMessage('answer', { answer });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  // Handle received answer (for initiator)
  const handleReceivedAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  // Handle received ICE candidate
  const handleReceivedICECandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  // Setup data channel for messaging
  const setupDataChannel = (dataChannel: RTCDataChannel) => {
    dataChannel.onopen = () => console.log('Data channel opened');
    dataChannel.onclose = () => console.log('Data channel closed');
    dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message through data channel:', message);
    };
  };

  // Send signaling message through Supabase Realtime
  const sendSignalingMessage = (event: string, payload: any) => {
    supabase.channel(`videocall:${interactionId}`).send({
      type: 'broadcast',
      event: event,
      payload: payload
    });
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const isCurrentlyEnabled = videoTracks[0].enabled;
        videoTracks[0].enabled = !isCurrentlyEnabled;
        setIsVideoEnabled(!isCurrentlyEnabled);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const isCurrentlyEnabled = audioTracks[0].enabled;
        audioTracks[0].enabled = !isCurrentlyEnabled;
        setIsAudioEnabled(!isCurrentlyEnabled);
      }
    }
  };

  // End call and clean up
  const endCall = () => {
    cleanupCall();
    onEndCall?.();
  };

  // Clean up resources
  const cleanupCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);
  };

  // Retry connection
  const retryConnection = () => {
    cleanupCall();
    setIsAudioOnly(false);
    setupMediaAndPeerConnection();
  };

  return (
    <div className="flex flex-col h-full">
      {hasMediaError ? (
        <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 text-white space-y-6">
          <div className="bg-red-500/20 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Camera or Microphone Error</h3>
            <p className="text-sm mb-4">
              We couldn't access your camera or microphone. This could be due to:
            </p>
            <ul className="text-sm list-disc text-left pl-4 mb-4">
              <li>Another application is using your camera</li>
              <li>Your camera is disconnected or disabled</li>
              <li>You need to allow browser access in your system settings</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={retryConnection} 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Video Call
            </Button>
            
            <Button 
              onClick={tryAudioOnly} 
              variant="outline"
            >
              Try Audio Only
            </Button>
            
            <Button 
              onClick={endCall} 
              variant="destructive"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 bg-black rounded-lg overflow-hidden">
          {/* Remote video (large) */}
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <p className="text-white text-center">
                {isConnecting ? 'Connecting...' : 'Waiting for participant to join...'}
              </p>
            </div>
          )}
          
          {/* Local video (small overlay) */}
          <div className="absolute bottom-4 right-4 w-1/4 max-w-[160px] h-auto aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
            {isAudioOnly ? (
              <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                <Mic className="w-8 h-8 text-white opacity-50" />
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Muted indicators for local video */}
            {!isVideoEnabled && !isAudioOnly && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
                <VideoOff className="w-6 h-6 text-white" />
              </div>
            )}
            {!isAudioEnabled && (
              <div className="absolute bottom-1 left-1">
                <MicOff className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          variant={isAudioEnabled ? "outline" : "destructive"}
          size="icon"
          onClick={toggleAudio}
          title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
          disabled={hasMediaError}
        >
          {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="destructive"
          size="icon"
          onClick={endCall}
          title="End call"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
        
        {!isAudioOnly && (
          <Button
            variant={isVideoEnabled ? "outline" : "destructive"}
            size="icon"
            onClick={toggleVideo}
            title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            disabled={hasMediaError}
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
