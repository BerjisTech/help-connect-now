
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import IncomingCallDrawer from '@/components/interaction/IncomingCallDrawer';

interface CallData {
  interactionId: string;
  callerName: string;
  description?: string;
}

interface CallNotificationContextType {
  incomingCall: CallData | null;
  setIncomingCall: (call: CallData | null) => void;
}

const CallNotificationContext = createContext<CallNotificationContextType | undefined>(undefined);

export const useCallNotification = () => {
  const context = useContext(CallNotificationContext);
  if (!context) {
    throw new Error('useCallNotification must be used within a CallNotificationProvider');
  }
  return context;
};

interface CallNotificationProviderProps {
  children: ReactNode;
}

export const CallNotificationProvider = ({ children }: CallNotificationProviderProps) => {
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [subscribedInteractions, setSubscribedInteractions] = useState<string[]>([]);

  // Set up subscription for call notifications
  useEffect(() => {
    const setupNotificationListener = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Subscribe to general call notification channel
        const generalChannel = supabase.channel('general-calls');
        generalChannel
          .on('broadcast', { event: 'incoming-call' }, ({ payload }) => {
            console.log('Received general call notification:', payload);
            if (payload.consultantId === user.id && !subscribedInteractions.includes(payload.interactionId)) {
              // Subscribe to the specific interaction channel
              subscribeToInteraction(payload.interactionId);
              
              // Set incoming call data and show drawer
              setIncomingCall({
                interactionId: payload.interactionId,
                callerName: payload.callerName || 'Anonymous user',
                description: payload.description || 'No description provided'
              });
              setDrawerOpen(true);
              
              // Also show a toast for better visibility
              toast('Incoming video call', {
                description: `${payload.callerName || 'Someone'} is requesting a consultation`,
                action: {
                  label: 'Answer',
                  onClick: () => setDrawerOpen(true)
                },
                duration: 10000,
              });
            }
          })
          .subscribe();

        return () => {
          generalChannel.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up call notification listener:', error);
      }
    };

    setupNotificationListener();
  }, [subscribedInteractions]);

  // Subscribe to a specific interaction channel
  const subscribeToInteraction = (interactionId: string) => {
    if (subscribedInteractions.includes(interactionId)) return;
    
    const channelName = `videocall:${interactionId}`;
    console.log(`Subscribing to interaction channel: ${channelName}`);
    
    const channel = supabase.channel(channelName);
    channel
      .on('broadcast', { event: 'call-notification' }, ({ payload }) => {
        console.log('Received call notification from interaction channel:', payload);
      })
      .on('broadcast', { event: 'call-rejected' }, ({ payload }) => {
        console.log('Call rejected notification:', payload);
        toast.error('Call rejected', {
          description: payload.message || 'The consultant is unavailable at the moment.'
        });
      })
      .on('broadcast', { event: 'call-ended' }, ({ payload }) => {
        console.log('Call ended notification:', payload);
        toast.info('Call ended', {
          description: payload.message || 'The call has ended.'
        });
      })
      .subscribe();
    
    setSubscribedInteractions(prev => [...prev, interactionId]);
  };

  const handleAcceptCall = async () => {
    if (!incomingCall) return;
    
    try {
      // Update interaction status to active
      await supabase
        .from('interactions')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', incomingCall.interactionId);
      
      // Clear incoming call data and close drawer
      setDrawerOpen(false);
      
      // Broadcast acceptance to the caller
      const channelName = `videocall:${incomingCall.interactionId}`;
      supabase.channel(channelName).send({
        type: 'broadcast',
        event: 'call-accepted',
        payload: { 
          message: 'Call accepted', 
          interactionId: incomingCall.interactionId
        }
      });
      
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to join call');
    }
  };

  const handleRejectCall = async () => {
    if (!incomingCall) return;
    
    try {
      // Update interaction status to cancelled
      await supabase
        .from('interactions')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString(),
          ended_at: new Date().toISOString()
        })
        .eq('id', incomingCall.interactionId);
      
      // Broadcast rejection to the caller
      const channelName = `videocall:${incomingCall.interactionId}`;
      supabase.channel(channelName).send({
        type: 'broadcast',
        event: 'call-rejected',
        payload: { 
          message: 'Consultant is unavailable', 
          interactionId: incomingCall.interactionId
        }
      });
      
      // Clear incoming call data
      setIncomingCall(null);
      
    } catch (error) {
      console.error('Error rejecting call:', error);
      toast.error('Failed to reject call');
    }
  };

  return (
    <CallNotificationContext.Provider value={{ incomingCall, setIncomingCall }}>
      {children}
      <IncomingCallDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        callData={incomingCall}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </CallNotificationContext.Provider>
  );
};
