
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import IncomingCallDrawer from '@/components/interaction/IncomingCallDrawer';

interface CallData {
  interactionId: string;
  callerName: string;
  description?: string;
  timestamp?: string;
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
  const [isCallListenerActive, setIsCallListenerActive] = useState(false);

  // Set up subscription for call notifications
  useEffect(() => {
    const setupNotificationListener = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        console.log('Setting up call notification listener, authenticated user:', user?.id || 'none');
        setIsCallListenerActive(true);

        // Subscribe to general call notification channel - regardless of auth status
        // Since guests can still receive calls
        const channelName = 'general-calls';
        console.log(`Subscribing to notification channel: ${channelName}`);
        
        const generalChannel = supabase.channel(channelName, {
          config: {
            broadcast: { self: false }, // Don't receive your own broadcasts
          }
        });
        
        generalChannel
          .on('broadcast', { event: 'incoming-call' }, (payload) => {
            console.log('Received general call notification:', payload);
            
            if (payload && payload.payload && payload.payload.interactionId) {
              const callData = payload.payload;
              
              // Record this notification in case it's for this user
              if (!subscribedInteractions.includes(callData.interactionId)) {
                console.log('New incoming call detected:', callData);
                
                // Subscribe to the specific interaction channel
                subscribeToInteraction(callData.interactionId);
                
                // Set incoming call data and show drawer
                setIncomingCall({
                  interactionId: callData.interactionId,
                  callerName: callData.callerName || 'Anonymous user',
                  description: callData.description || 'No description provided',
                  timestamp: callData.timestamp
                });
                setDrawerOpen(true);
                
                // Also show a toast for better visibility
                toast('Incoming video call', {
                  description: `${callData.callerName || 'Someone'} is requesting a consultation`,
                  action: {
                    label: 'Answer',
                    onClick: () => setDrawerOpen(true)
                  },
                  duration: 10000,
                });
              } else {
                console.log('Already subscribed to this interaction:', callData.interactionId);
              }
            } else {
              console.error('Received invalid call payload:', payload);
            }
          })
          .subscribe((status) => {
            console.log(`Call notification subscription status for ${channelName}:`, status);
          });

        return () => {
          console.log('Unsubscribing from general call channel');
          generalChannel.unsubscribe();
          setIsCallListenerActive(false);
        };
      } catch (error) {
        console.error('Error setting up call notification listener:', error);
        setIsCallListenerActive(false);
      }
    };

    setupNotificationListener();
    
    // Add a periodic check to ensure the listener is active
    const intervalId = setInterval(() => {
      if (!isCallListenerActive) {
        console.log('Call listener not active, reactivating...');
        setupNotificationListener();
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [subscribedInteractions, isCallListenerActive]);

  // Subscribe to a specific interaction channel
  const subscribeToInteraction = (interactionId: string) => {
    if (subscribedInteractions.includes(interactionId)) {
      console.log(`Already subscribed to interaction: ${interactionId}`);
      return;
    }
    
    const channelName = `videocall:${interactionId}`;
    console.log(`Subscribing to interaction channel: ${channelName}`);
    
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false } // Don't receive your own broadcasts
      }
    });
    
    channel
      .on('broadcast', { event: 'call-notification' }, (payload) => {
        console.log('Received call notification from interaction channel:', payload);
        
        if (payload?.payload) {
          toast.info(payload.payload.message || 'Call notification received');
        }
      })
      .on('broadcast', { event: 'call-rejected' }, (payload) => {
        console.log('Call rejected notification:', payload);
        
        if (payload?.payload) {
          toast.error('Call rejected', {
            description: payload.payload.message || 'The consultant is unavailable at the moment.'
          });
        }
      })
      .on('broadcast', { event: 'call-ended' }, (payload) => {
        console.log('Call ended notification:', payload);
        
        if (payload?.payload) {
          toast.info('Call ended', {
            description: payload.payload.message || 'The call has ended.'
          });
        }
      })
      .subscribe((status) => {
        console.log(`Interaction channel ${channelName} subscription status:`, status);
      });
    
    setSubscribedInteractions(prev => [...prev, interactionId]);
  };

  const handleAcceptCall = async () => {
    if (!incomingCall) {
      console.error('No incoming call to accept');
      return;
    }
    
    console.log('Accepting call:', incomingCall.interactionId);
    
    try {
      // Update interaction status to active
      await supabase
        .from('interactions')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', incomingCall.interactionId);
      
      // Broadcast acceptance to the caller
      const channelName = `videocall:${incomingCall.interactionId}`;
      console.log(`Broadcasting call acceptance through channel ${channelName}`);
      
      await supabase.channel(channelName).send({
        type: 'broadcast',
        event: 'call-accepted',
        payload: { 
          message: 'Call accepted', 
          interactionId: incomingCall.interactionId,
          timestamp: new Date().toISOString()
        }
      });
      
      // Clear incoming call data but drawer closing is handled by the drawer component
      console.log('Call accepted successfully');
      
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to join call');
    }
  };

  const handleRejectCall = async () => {
    if (!incomingCall) {
      console.error('No incoming call to reject');
      return;
    }
    
    console.log('Rejecting call:', incomingCall.interactionId);
    
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
      console.log(`Broadcasting call rejection through channel ${channelName}`);
      
      await supabase.channel(channelName).send({
        type: 'broadcast',
        event: 'call-rejected',
        payload: { 
          message: 'Consultant is unavailable', 
          interactionId: incomingCall.interactionId,
          timestamp: new Date().toISOString()
        }
      });
      
      // Clear incoming call data
      setIncomingCall(null);
      console.log('Call rejected successfully');
      
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
