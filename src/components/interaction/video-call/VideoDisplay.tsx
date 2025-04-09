
import { Video, PhoneOff, Loader2 } from 'lucide-react';
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
  isAudioEnabled,
  connectionState
}: VideoDisplayProps) => {
  return (
    <div className="relative aspect-video bg-black flex-1 rounded-lg overflow-hidden flex items-center justify-center">
      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className={`absolute inset-0 w-full h-full object-cover ${
          !remoteStream || !isConnected ? 'hidden' : ''
        }`}
      />
      
      {/* Local Video (in picture-in-picture) */}
      <div className={`absolute bottom-4 right-4 w-1/4 aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg ${
        (!localStream || !isVideoEnabled || isAudioOnly) ? 'flex items-center justify-center' : ''
      }`}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${
            !localStream || !isVideoEnabled || isAudioOnly ? 'hidden' : ''
          }`}
        />
        {localStream && (!isVideoEnabled || isAudioOnly) && (
          <div className="text-gray-400 flex items-center justify-center h-full">
            <Video className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {/* Connecting State */}
      {isConnecting && !isConnected && (
        <div className="flex flex-col items-center justify-center text-white space-y-4">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="text-lg font-medium">Connecting to call...</p>
          <p className="text-sm text-gray-400">This may take a moment</p>
          {connectionState && (
            <p className="text-xs text-gray-500">Connection state: {connectionState}</p>
          )}
        </div>
      )}
      
      {/* Waiting for Remote Stream */}
      {!isConnecting && !remoteStream && !isConnected && (
        <div className="flex flex-col items-center justify-center text-white space-y-4">
          <PhoneOff className="w-12 h-12" />
          <p className="text-lg font-medium">Waiting for participant to join...</p>
          <p className="text-sm text-gray-400">They'll appear here when connected</p>
          {connectionState && (
            <p className="text-xs text-gray-500">Connection state: {connectionState}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoDisplay;
