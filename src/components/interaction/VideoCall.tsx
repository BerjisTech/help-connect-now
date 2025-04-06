
import VideoCall from './video-call/VideoCall';
import { VideoCallProps } from './video-call/types';

// Re-export the component to maintain compatibility with existing imports
export default function VideoCallWrapper(props: VideoCallProps) {
  return <VideoCall {...props} />;
}
