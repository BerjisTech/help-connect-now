
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InteractionData, ConsultantData, MessageData } from './types';

export const useInteractionData = (interactionId: string | null) => {
  const navigate = useNavigate();
  const [interaction, setInteraction] = useState<InteractionData | null>(null);
  const [consultant, setConsultant] = useState<ConsultantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [joinAs, setJoinAs] = useState<'consultant' | 'user'>('user');
  const [endCallConfirmOpen, setEndCallConfirmOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);

  useEffect(() => {
    if (interactionId) {
      fetchInteractionData();
    }
  }, [interactionId]);

  // Set up timer when interaction is active
  useEffect(() => {
    if (interaction && interaction.status === 'active') {
      if (!timerRunning) {
        setTimerRunning(true);
        
        if (!sessionStartTime) {
          const now = new Date().toISOString();
          console.log('Creating new session start time:', now);
          setSessionStartTime(now);
          
          updateInteractionStartTime(now);
        }
      }
    }
  }, [interaction, timerRunning, sessionStartTime]);

  const fetchInteractionData = async () => {
    try {
      setLoading(true);
      const { data: interactionData, error: interactionError } = await supabase
        .from('interactions')
        .select('*')
        .eq('id', interactionId)
        .single();

      if (interactionError) throw interactionError;
      
      const safeInteractionData: InteractionData = {
        ...interactionData,
        metadata: interactionData.metadata || {}
      };
      
      setInteraction(safeInteractionData);
      
      if (safeInteractionData.status === 'active') {
        const storedStartTime = safeInteractionData.metadata?.session_start_time;
        
        if (storedStartTime) {
          console.log('Found existing session start time:', storedStartTime);
          setSessionStartTime(storedStartTime);
          setTimerRunning(true);
        } else {
          console.log('No session start time found, will create one when timer runs');
        }
      }

      if (safeInteractionData?.metadata?.consultant_id) {
        const { data: consultantData, error: consultantError } = await supabase
          .from('consultants')
          .select('*')
          .eq('id', safeInteractionData.metadata.consultant_id)
          .single();

        if (consultantError) {
          console.error('Error fetching consultant:', consultantError);
          toast.error('Could not load consultant information');
        } else {
          // Create a ConsultantData object with the required name property
          setConsultant({
            ...consultantData,
            name: consultantData.display_name // Add the name property based on display_name
          });
        }
      }

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('interaction_id', interactionId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        toast.error('Could not load messages');
      } else {
        setMessages(messagesData || []);
      }
    } catch (error) {
      console.error('Error loading interaction data:', error);
      toast.error('Failed to load interaction data');
    } finally {
      setLoading(false);
    }
  };

  const updateInteractionStartTime = async (startTime: string) => {
    if (!interactionId || !interaction) return;
    
    try {
      console.log('Updating interaction start time:', startTime);
      
      await supabase
        .from('interactions')
        .update({
          metadata: {
            ...interaction.metadata,
            session_start_time: startTime
          }
        })
        .eq('id', interactionId);
        
      console.log('Interaction start time updated successfully');
    } catch (error) {
      console.error('Error updating interaction start time:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !interactionId) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      const messageData: any = {
        interaction_id: interactionId,
        content: content.trim(),
      };

      if (userId) {
        messageData.sender_id = userId;
      } else if (interaction?.anonymous_seeker_id) {
        messageData.anonymous_sender_id = interaction.anonymous_seeker_id;
      }

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      
      setMessages([...messages, data]);
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  };

  const startVideoCall = (role: 'consultant' | 'user' = 'user') => {
    if (interaction?.interaction_type !== 'video') {
      toast.error('This interaction is not set up for video calls');
      return;
    }
    setJoinAs(role);
    setShowVideoCall(true);
  };

  const endVideoCall = () => {
    setEndCallConfirmOpen(true);
  };

  const confirmEndCall = async () => {
    setShowVideoCall(false);
    setEndCallConfirmOpen(false);
    setTimerRunning(false);
    toast.success('Video call ended');
    
    if (interaction?.id) {
      try {
        await supabase
          .from('interactions')
          .update({ 
            status: 'completed',
            ended_at: new Date().toISOString(),
            metadata: {
              ...interaction.metadata,
              session_end_time: new Date().toISOString()
            }
          })
          .eq('id', interaction.id);
          
        navigate('/browse');
      } catch (error) {
        console.error('Error updating interaction status:', error);
      }
    }
  };

  return {
    interaction,
    consultant,
    loading,
    messages,
    showVideoCall,
    joinAs,
    endCallConfirmOpen,
    timerRunning,
    sessionStartTime,
    setEndCallConfirmOpen,
    startVideoCall,
    endVideoCall,
    confirmEndCall,
    sendMessage,
  };
};
