
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, X, Video } from 'lucide-react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IncomingCallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callData: {
    interactionId: string;
    callerName: string;
    description?: string;
    timestamp?: string;
  } | null;
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCallDrawer = ({ 
  open, 
  onOpenChange, 
  callData,
  onAccept,
  onReject
}: IncomingCallProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!callData) {
    return null;
  }
  
  const handleAccept = () => {
    setIsProcessing(true);
    
    try {
      // Call the provided accept handler first
      onAccept();
      
      // Close the drawer immediately
      onOpenChange(false);
      
      console.log(`Navigating to interaction ${callData.interactionId}`);
      
      // Navigate to the interaction page with a slight delay
      // to ensure the drawer closes first
      setTimeout(() => {
        navigate(`/interaction?id=${callData.interactionId}&view=consultant`);
        setIsProcessing(false);
      }, 300);
    } catch (error) {
      console.error('Error accepting call:', error);
      setIsProcessing(false);
      toast.error('Failed to join call');
    }
  };
  
  const handleReject = () => {
    setIsProcessing(true);
    
    try {
      // Call the provided reject handler
      onReject();
      
      // Close the drawer
      onOpenChange(false);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error rejecting call:', error);
      setIsProcessing(false);
      toast.error('Failed to reject call');
    }
  };
  
  // Add timeago display for the timestamp
  const getTimeAgo = (timestamp?: string) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const callTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - callTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  };
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl font-bold flex items-center justify-center gap-2">
            <PhoneCall className="h-5 w-5 text-green-500 animate-pulse" />
            Incoming Call
          </DrawerTitle>
          <DrawerDescription>
            {callData.callerName || 'Someone'} is requesting a video consultation
            {callData.timestamp && (
              <span className="block text-xs text-muted-foreground mt-1">{getTimeAgo(callData.timestamp)}</span>
            )}
          </DrawerDescription>
        </DrawerHeader>
        
        {callData.description && (
          <div className="px-4 py-2 mx-4 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground">{callData.description}</p>
          </div>
        )}
        
        <DrawerFooter className="flex-row gap-2 justify-center sm:justify-end">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={handleReject}
            disabled={isProcessing}
          >
            <X className="mr-2 h-4 w-4" />
            Decline
          </Button>
          <Button 
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAccept}
            disabled={isProcessing}
          >
            <Video className="mr-2 h-4 w-4" />
            {isProcessing ? 'Connecting...' : 'Join Call'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default IncomingCallDrawer;
