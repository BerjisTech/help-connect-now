
import { VideoOff, Mic, MicOff } from 'lucide-react';
import { VideoDisplayProps } from './types';

const VideoDisplay = ({
  localStream,
  remoteStream,
  localVideoRef,
  remoteVideoRef,
  isConnecting,
  isConnected,
  isAudioOnly,
  isVideoEnabled,
  isAudioEnabled
}: VideoDisplayProps) => {
  return (
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
            {isConnecting ? 'Connecting...' : isConnected ? 'Connected, waiting for video...' : 'Waiting for participant to join...'}
          </p>
        </div>
      )}
      
      {/* Local video (small overlay) */}
      <div className="absolute bottom-4 right-4 w-1/4 max-w-[160px] h-auto aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
        {isAudioOnly ? (
          <div className="h-full w-full bg-gray-800 dark:bg-indigo-950 flex items-center justify-center">
            <Mic className="w-8 h-8 dark:bg-indigo-950 text-white opacity-50" />
          </div>
        ) : (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover dark:bg-indigo-950"
          />
        )}
        
        {/* Muted indicators for local video */}
        {!isVideoEnabled && !isAudioOnly && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <VideoOff className="w-6 h-6 dark:bg-indigo-950 text-white" />
          </div>
        )}
        {!isAudioEnabled && (
          <div className="absolute bottom-1 left-1">
            <MicOff className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDisplay;
