
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InteractionData, MessageData } from '../types';

interface UseInteractionSubscriptionsProps {
  interactionId: string | null;
  setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>;
  setInteraction: React.Dispatch<React.SetStateAction<InteractionData | null>>;
  setShowVideoCall: (show: boolean) => void;
  setTimerRunning: (running: boolean) => void;
  setSessionStartTime: (time: Date | null) => void;
}

export const useInteractionSubscriptions = ({
  interactionId,
  setMessages,
  setInteraction,
  setShowVideoCall,
  setTimerRunning,
  setSessionStartTime,
}: UseInteractionSubscriptionsProps) => {
  useEffect(() => {
    if (!interactionId) return;
    
    // Set up real-time subscription for messages
    const messagesSubscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `interaction_id=eq.${interactionId}`
      }, (payload) => {
        const newMessage = payload.new as MessageData;
        setMessages(prevMessages => [...prevMessages, newMessage]);
      })
      .subscribe();
      
    // Set up real-time subscription for interaction status changes
    const interactionSubscription = supabase
      .channel('interaction-channel')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'interactions',
        filter: `id=eq.${interactionId}`
      }, (payload) => {
        const updatedInteraction = payload.new as InteractionData;
        setInteraction(updatedInteraction);
        
        // Handle video call status changes
        if (updatedInteraction.status === 'active' && 
            (updatedInteraction.interaction_type === 'video' || 
             updatedInteraction.interaction_type === 'audio')) {
          setShowVideoCall(true);
          setTimerRunning(true);
          setSessionStartTime(new Date(updatedInteraction.updated_at || ''));
        } else if (updatedInteraction.status === 'completed' || 
                  updatedInteraction.status === 'cancelled') {
          setShowVideoCall(false);
          setTimerRunning(false);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(messagesSubscription);
      supabase.removeChannel(interactionSubscription);
    };
  }, [interactionId, setMessages, setInteraction, setShowVideoCall, setTimerRunning, setSessionStartTime]);
};
