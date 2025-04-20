
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InteractionData } from '../types';

interface UseMessageActionsProps {
  interaction: InteractionData | null;
  anonymousId: string | null;
  setInteraction: React.Dispatch<React.SetStateAction<InteractionData | null>>;
}

export const useMessageActions = ({
  interaction,
  anonymousId,
  setInteraction,
}: UseMessageActionsProps) => {
  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!interaction) return;
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare message data
      const messageData: any = {
        content,
        interaction_id: interaction.id,
        created_at: new Date().toISOString()
      };
      
      // Set sender ID based on authentication status
      if (user) {
        messageData.sender_id = user.id;
      } else if (anonymousId) {
        // Use the anonymousId from state
        messageData.anonymous_sender_id = anonymousId;
        
        // Ensure interaction has anonymous ID
        if (!interaction.anonymous_seeker_id) {
          await supabase
            .from('interactions')
            .update({ anonymous_seeker_id: anonymousId })
            .eq('id', interaction.id);
            
          // Update local state
          setInteraction(prev => prev ? { ...prev, anonymous_seeker_id: anonymousId } : null);
        }
      }
      
      console.log('Sending message with data:', messageData);

      // Insert message
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData);
        
      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      console.log('Message sent successfully:', data);
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [interaction, anonymousId, setInteraction]);

  return {
    sendMessage,
  };
};
