
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';

interface IncomingCallNotificationProps {
  hasIncomingCall: boolean;
  onJoinCall: () => void;
}

const IncomingCallNotification = ({ hasIncomingCall, onJoinCall }: IncomingCallNotificationProps) => {
  if (!hasIncomingCall) return null;
  
  return (
    <div className="fixed bottom-20 right-4 z-50 md:static md:z-auto">
      <Button 
        size="sm" 
        onClick={onJoinCall}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 animate-pulse shadow-lg md:shadow-none"
      >
        <PhoneCall className="h-4 w-4" />
        Join Incoming Call
      </Button>
    </div>
  );
};

export default IncomingCallNotification;
