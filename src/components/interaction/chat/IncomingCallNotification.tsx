
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';
import { useState, useEffect } from 'react';

interface IncomingCallNotificationProps {
  hasIncomingCall: boolean;
  onJoinCall: () => void;
}

const IncomingCallNotification = ({ hasIncomingCall, onJoinCall }: IncomingCallNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (hasIncomingCall) {
      setIsVisible(true);
      // Add sound effect for incoming call
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(err => console.log('Could not play notification sound:', err));
    } else {
      setIsVisible(false);
    }
  }, [hasIncomingCall]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-20 right-4 z-50 md:static md:z-auto">
      <div className="bg-white/95 dark:bg-gray-800/95 p-3 rounded-lg shadow-lg border border-green-500 animate-pulse">
        <Button 
          size="sm" 
          onClick={() => {
            setIsVisible(false);
            onJoinCall();
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 shadow-lg md:shadow-none"
        >
          <PhoneCall className="h-4 w-4" />
          Join Incoming Call
        </Button>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
