
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useWebRTC = (
  interactionId: string, 
  isInitiator: boolean, 
  onEndCall?: () => void, 
  customChannelName?: string
) => {
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
  // Track whether remote description is set to prevent ICE candidate errors
  const remoteDescriptionSet = useRef<boolean>(false);
  // Store received ICE candidates that arrive before remote description is set
  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);

  // Set up signaling channel using Supabase Realtime
  useEffect(() => {
    // Use custom channel name if provided, otherwise use default
    const channelName = customChannelName || `videocall:${interactionId}`;
    console.log(`Subscribing to channel: ${channelName}`);
    
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: true }
      }
    });

    // Listen for signaling messages
    channel
      .on('broadcast', { event: 'offer' }, ({ payload }) => {
        if (!isInitiator && peerConnectionRef.current) {
          console.log('Received offer', payload.offer);
          handleReceivedOffer(payload.offer);
        }
      })
      .on('broadcast', { event: 'answer' }, ({ payload }) => {
        if (isInitiator && peerConnectionRef.current) {
          console.log('Received answer', payload.answer);
          handleReceivedAnswer(payload.answer);
        }
      })
      .on('broadcast', { event: 'ice-candidate' }, ({ payload }) => {
        if (peerConnectionRef.current) {
          console.log('Received ICE candidate', payload.candidate);
          handleReceivedICECandidate(payload.candidate);
        }
      })
      .subscribe((status) => {
        console.log(`Subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          setupMediaAndPeerConnection();
        }
      });

    return () => {
      console.log(`Unsubscribing from channel: ${channelName}`);
      channel.unsubscribe();
      cleanupCall();
    };
  }, [interactionId, isInitiator, customChannelName]);

  // Send signaling message through Supabase Realtime
  const sendSignalingMessage = (event: string, payload: any) => {
    const channelName = customChannelName || `videocall:${interactionId}`;
    console.log(`Sending ${event} through channel ${channelName}`, payload);
    supabase.channel(channelName).send({
      type: 'broadcast',
      event: event,
      payload: payload
    });
  };

  // Handle received offer (for non-initiator)
  const handleReceivedOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      remoteDescriptionSet.current = true;
      
      // Add any pending ICE candidates
      if (pendingIceCandidates.current.length > 0) {
        console.log(`Adding ${pendingIceCandidates.current.length} pending ICE candidates`);
        for (const candidate of pendingIceCandidates.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingIceCandidates.current = [];
      }
      
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
      remoteDescriptionSet.current = true;
      
      // Add any pending ICE candidates
      if (pendingIceCandidates.current.length > 0) {
        console.log(`Adding ${pendingIceCandidates.current.length} pending ICE candidates`);
        for (const candidate of pendingIceCandidates.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingIceCandidates.current = [];
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  // Handle received ICE candidate
  const handleReceivedICECandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      // If remote description is not set, store the ICE candidate for later
      if (!remoteDescriptionSet.current) {
        console.log('Remote description not set yet, storing ICE candidate');
        pendingIceCandidates.current.push(candidate);
        return;
      }
      
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

  // Set up media streams and peer connection
  const setupMediaAndPeerConnection = async () => {
    setIsConnecting(true);
    setHasMediaError(false);
    
    try {
      // First try to get both video and audio
      const constraints = isAudioOnly 
        ? { video: false, audio: true }
        : { video: true, audio: true };
      
      console.log('Getting user media with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got local stream:', stream);
      
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
      
      console.log('Creating peer connection with config:', configuration);
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;
      remoteDescriptionSet.current = false;
      pendingIceCandidates.current = [];

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        console.log('Adding track to peer connection:', track.kind);
        peerConnection.addTrack(track, stream);
      });

      // Set up data channel for messaging
      if (isInitiator) {
        console.log('Creating data channel as initiator');
        const dataChannel = peerConnection.createDataChannel('chat');
        channelRef.current = dataChannel;
        setupDataChannel(dataChannel);
      } else {
        console.log('Setting up ondatachannel as receiver');
        peerConnection.ondatachannel = (event) => {
          console.log('Data channel received from remote peer');
          channelRef.current = event.channel;
          setupDataChannel(event.channel);
        };
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
          sendSignalingMessage('ice-candidate', { candidate: event.candidate });
        }
      };

      // Handle ICE connection state changes
      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === 'failed' || 
            peerConnection.iceConnectionState === 'disconnected') {
          console.log('ICE connection failed or disconnected, attempting to restart ICE');
          peerConnection.restartIce();
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
        console.log('Remote track received:', event.track.kind);
        if (event.streams && event.streams[0]) {
          console.log('Setting remote stream');
          setRemoteStream(event.streams[0]);
          
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        }
      };

      // Create and send offer if initiator
      if (isInitiator) {
        console.log('Creating offer as initiator');
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        sendSignalingMessage('offer', { offer });
      }
      
    } catch (error) {
      console.error('Error setting up media or peer connection:', error);
      
      // If we failed with video, try audio-only as fallback
      if (!isAudioOnly && error instanceof Error) {
        if (error.name === 'NotReadableError' || error.name === 'NotAllowedError') {
          setHasMediaError(true);
          
          if (error.name === 'NotReadableError') {
            toast.error('Could not access camera. Try using audio-only mode or check your camera settings.');
          } else {
            toast.error('Permission denied for camera or microphone. Please grant access permissions.');
          }
        } else {
          toast.error('Could not access microphone or camera. Please check your device settings.');
          setHasMediaError(true);
          setIsConnecting(false);
        }
      } else {
        toast.error('Could not establish connection. Please try again later.');
        setHasMediaError(true);
        setIsConnecting(false);
      }
    }
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

  return {
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
    retryConnection
  };
};
