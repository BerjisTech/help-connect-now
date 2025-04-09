
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
  
  if (!callData) {
    return null;
  }
  
  const handleAccept = () => {
    onAccept();
    navigate(`/interaction?id=${callData.interactionId}&view=consultant`);
  };
  
  const handleReject = () => {
    onReject();
    onOpenChange(false);
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
          >
            <X className="mr-2 h-4 w-4" />
            Decline
          </Button>
          <Button 
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAccept}
          >
            <Video className="mr-2 h-4 w-4" />
            Join Call
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default IncomingCallDrawer;
