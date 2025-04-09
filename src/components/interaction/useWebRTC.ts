
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
  const [connectionState, setConnectionState] = useState<string>('new');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const remoteDescriptionSet = useRef<boolean>(false);
  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);
  const connectionAttempts = useRef<number>(0);
  const maxConnectionAttempts = 5;

  useEffect(() => {
    const channelName = customChannelName || `videocall:${interactionId}`;
    console.log(`Subscribing to channel: ${channelName}`);
    
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: true }
      }
    });

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
      .on('broadcast', { event: 'reconnect-request' }, () => {
        console.log('Received reconnect request, retrying connection');
        retryConnection();
      })
      .subscribe((status) => {
        console.log(`WebRTC subscription status: ${status}`);
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

  const sendSignalingMessage = (event: string, payload: any) => {
    const channelName = customChannelName || `videocall:${interactionId}`;
    console.log(`Sending ${event} through channel ${channelName}`, payload);
    supabase.channel(channelName).send({
      type: 'broadcast',
      event: event,
      payload: payload
    });
  };

  const requestReconnect = () => {
    const channelName = customChannelName || `videocall:${interactionId}`;
    console.log(`Requesting reconnection through channel ${channelName}`);
    supabase.channel(channelName).send({
      type: 'broadcast',
      event: 'reconnect-request',
      payload: { timestamp: new Date().toISOString() }
    });
  };

  const handleReceivedOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      console.log("Setting remote description from offer");
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      remoteDescriptionSet.current = true;
      
      if (pendingIceCandidates.current.length > 0) {
        console.log(`Adding ${pendingIceCandidates.current.length} pending ICE candidates`);
        for (const candidate of pendingIceCandidates.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingIceCandidates.current = [];
      }
      
      console.log("Creating answer");
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      console.log("Sending answer");
      sendSignalingMessage('answer', { answer });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleReceivedAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      console.log("Setting remote description from answer");
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      remoteDescriptionSet.current = true;
      
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

  const handleReceivedICECandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      if (!remoteDescriptionSet.current) {
        console.log('Remote description not set yet, storing ICE candidate');
        pendingIceCandidates.current.push(candidate);
        return;
      }
      
      console.log('Adding ICE candidate directly');
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  const setupDataChannel = (dataChannel: RTCDataChannel) => {
    dataChannel.onopen = () => console.log('Data channel opened');
    dataChannel.onclose = () => console.log('Data channel closed');
    dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message through data channel:', message);
    };
  };

  const setupMediaAndPeerConnection = async () => {
    setIsConnecting(true);
    setHasMediaError(false);
    connectionAttempts.current += 1;
    
    try {
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

      // Use more STUN servers to improve connection reliability
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          { urls: 'stun:stun.stunprotocol.org:3478' },
          { urls: 'stun:stun.voip.blackberry.com:3478' },
          { urls: 'stun:stun.ekiga.net:3478' }
        ],
        iceCandidatePoolSize: 10
      };
      
      console.log('Creating peer connection with config:', configuration);
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;
      remoteDescriptionSet.current = false;
      pendingIceCandidates.current = [];

      // Create a remote stream to receive tracks
      const newRemoteStream = new MediaStream();
      setRemoteStream(newRemoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = newRemoteStream;
      }

      stream.getTracks().forEach(track => {
        console.log('Adding track to peer connection:', track.kind);
        peerConnection.addTrack(track, stream);
      });

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

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
          sendSignalingMessage('ice-candidate', { candidate: event.candidate });
        }
      };

      peerConnection.onicegatheringstatechange = () => {
        console.log('ICE gathering state:', peerConnection.iceGatheringState);
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
        
        if (peerConnection.iceConnectionState === 'connected' || 
            peerConnection.iceConnectionState === 'completed') {
          setIsConnected(true);
          setIsConnecting(false);
          connectionAttempts.current = 0;
        } else if (peerConnection.iceConnectionState === 'failed') {
          console.log('ICE connection failed, attempting to restart ICE');
          if (connectionAttempts.current < maxConnectionAttempts) {
            peerConnection.restartIce();
            requestReconnect();
          } else {
            toast.error('Connection failed after multiple attempts', {
              description: 'Please try ending the call and starting again'
            });
          }
        } else if (peerConnection.iceConnectionState === 'disconnected') {
          console.log('ICE connection disconnected, waiting for reconnection');
          setTimeout(() => {
            if (peerConnection.iceConnectionState === 'disconnected') {
              toast.error('Connection lost', {
                description: 'Attempting to reconnect...'
              });
              peerConnection.restartIce();
              requestReconnect();
            }
          }, 5000);
        }
      };

      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        setConnectionState(peerConnection.connectionState);
        
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
          setIsConnecting(false);
          toast.success('Call connected');
          connectionAttempts.current = 0;
        } else if (['disconnected', 'failed', 'closed'].includes(peerConnection.connectionState)) {
          setIsConnected(false);
          if (peerConnection.connectionState === 'failed' && 
              connectionAttempts.current < maxConnectionAttempts) {
            console.log(`Connection failed, retrying (attempt ${connectionAttempts.current + 1}/${maxConnectionAttempts})`);
            setTimeout(() => {
              retryConnection();
            }, 2000);
          } else if (peerConnection.connectionState === 'closed') {
            toast.info('Call ended');
            onEndCall?.();
          }
        }
      };

      peerConnection.onsignalingstatechange = () => {
        console.log('Signaling state:', peerConnection.signalingState);
      };

      peerConnection.ontrack = (event) => {
        console.log('Remote track received:', event.track.kind);
        if (event.streams && event.streams[0]) {
          console.log('Setting remote stream from track event');
          
          // Add this track to our remote stream
          newRemoteStream.addTrack(event.track);
          
          if (remoteVideoRef.current) {
            console.log('Updating remote video element');
            // The srcObject has already been set to the remote stream above
            // This ensures new tracks are automatically added
          }
        }
      };

      if (isInitiator) {
        console.log('Creating offer as initiator');
        const offer = await peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        await peerConnection.setLocalDescription(offer);
        console.log('Sending offer');
        sendSignalingMessage('offer', { offer });
      }
      
    } catch (error) {
      console.error('Error setting up media or peer connection:', error);
      
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

  const tryAudioOnly = () => {
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
    
    setupMediaAndPeerConnection();
  };

  const endCall = () => {
    cleanupCall();
    onEndCall?.();
  };

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
    retryConnection,
    connectionState
  };
};
