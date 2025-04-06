
import { Button } from '@/components/ui/button';
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';
import { MediaControlsProps } from './types';

const MediaControls = ({
  localStream,
  isAudioOnly,
  isVideoEnabled,
  isAudioEnabled,
  hasMediaError,
  onToggleVideo,
  onToggleAudio,
  onEndCall
}: MediaControlsProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      <Button
        variant={isAudioEnabled ? "outline" : "destructive"}
        size="icon"
        onClick={onToggleAudio}
        title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
        disabled={hasMediaError || !localStream}
      >
        {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </Button>
      
      <Button
        variant="destructive"
        size="icon"
        onClick={onEndCall}
        title="End call"
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
      
      {!isAudioOnly && (
        <Button
          variant={isVideoEnabled ? "outline" : "destructive"}
          size="icon"
          onClick={onToggleVideo}
          title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          disabled={hasMediaError || !localStream}
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
      )}
    </div>
  );
};

export default MediaControls;
