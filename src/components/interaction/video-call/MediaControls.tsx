
import { Mic, MicOff, Video, VideoOff, PhoneOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaControlsProps } from './types';

const MediaControls = ({
  localStream,
  isAudioOnly,
  isVideoEnabled,
  isAudioEnabled,
  hasMediaError,
  onToggleVideo,
  onToggleAudio,
  onEndCall,
  onRetryConnection
}: MediaControlsProps) => {
  return (
    <div className="flex justify-center gap-4 py-4">
      {/* Audio Toggle */}
      <Button
        size="icon"
        variant={isAudioEnabled ? "outline" : "secondary"}
        onClick={onToggleAudio}
        disabled={!localStream || hasMediaError}
        title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
      >
        {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </Button>
      
      {/* Video Toggle */}
      <Button
        size="icon"
        variant={isVideoEnabled ? "outline" : "secondary"}
        onClick={onToggleVideo}
        disabled={!localStream || hasMediaError || isAudioOnly}
        title={isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
      >
        {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      </Button>
      
      {/* Retry Connection Button */}
      <Button
        size="icon"
        variant="outline"
        onClick={onRetryConnection}
        title="Retry Connection"
      >
        <RefreshCw className="h-5 w-5" />
      </Button>
      
      {/* End Call */}
      <Button
        size="icon"
        variant="destructive"
        onClick={onEndCall}
        title="End Call"
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MediaControls;
