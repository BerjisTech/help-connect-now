
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';

interface IncomingCallNotificationProps {
  hasIncomingCall: boolean;
  onJoinCall: () => void;
}

const IncomingCallNotification = ({ hasIncomingCall, onJoinCall }: IncomingCallNotificationProps) => {
  if (!hasIncomingCall) return null;
  
  return (
    <Button 
      size="sm" 
      onClick={onJoinCall}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 animate-pulse"
    >
      <PhoneCall className="h-4 w-4" />
      Join Incoming Call
    </Button>
  );
};

export default IncomingCallNotification;
