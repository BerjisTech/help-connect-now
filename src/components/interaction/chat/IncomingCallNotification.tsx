
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
    <div className="fixed bottom-20 right-4 z-50 md:relative md:z-auto">
      <div className="bg-white/95 dark:bg-gray-800/95 p-4 rounded-lg shadow-lg border-2 border-green-500 animate-pulse max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <PhoneCall className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Incoming Video Call</h3>
            <p className="text-xs text-muted-foreground">Someone wants to connect with you</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <Button 
            size="sm" 
            onClick={() => {
              setIsVisible(false);
              onJoinCall();
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
          >
            <PhoneCall className="h-4 w-4 mr-2" />
            Join Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
