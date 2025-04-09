
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ConsultantData, InteractionData, MessageData } from '../types';
import { useAnonymousId } from './useAnonymousId';
import { useInteractionSubscriptions } from './useInteractionSubscriptions';
import { useVideoCallActions } from './useVideoCallActions';
import { useMessageActions } from './useMessageActions';

export const useInteractionData = (interactionId: string | null) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interaction, setInteraction] = useState<InteractionData | null>(null);
  const [consultant, setConsultant] = useState<ConsultantData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [joinAs, setJoinAs] = useState<'user' | 'consultant'>('user');
  const [endCallConfirmOpen, setEndCallConfirmOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  const { anonymousId } = useAnonymousId();

  // Set up subscriptions
  useInteractionSubscriptions({
    interactionId,
    setMessages,
    setInteraction,
    setShowVideoCall,
    setTimerRunning,
    setSessionStartTime,
  });

  // Initialize or update anonymous ID in interaction
  useEffect(() => {
    const updateAnonymousId = async () => {
      if (!interaction || !anonymousId || interaction.anonymous_seeker_id === anonymousId) {
        return;
      }
      
      // Only update if there's no anonymous ID already set
      if (!interaction.anonymous_seeker_id) {
        try {
          await supabase
            .from('interactions')
            .update({ anonymous_seeker_id: anonymousId })
            .eq('id', interaction.id);
            
          // Update local state
          setInteraction(prev => prev ? { ...prev, anonymous_seeker_id: anonymousId } : null);
        } catch (error) {
          console.error('Error updating anonymous ID:', error);
        }
      }
    };
    
    if (joinAs === 'user') {
      updateAnonymousId();
    }
  }, [interaction, anonymousId, joinAs]);

  // Import video call actions
  const { startVideoCall, endVideoCall, confirmEndCall } = useVideoCallActions({
    interaction,
    navigate,
    setShowVideoCall,
    setJoinAs,
    setTimerRunning,
    setSessionStartTime,
    setEndCallConfirmOpen,
  });

  // Import message actions
  const { sendMessage } = useMessageActions({
    interaction,
    anonymousId,
    setInteraction,
  });

  // Fetch interaction data
  useEffect(() => {
    const fetchInteractionData = async () => {
      if (!interactionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get interaction details
        const { data: interactionData, error: interactionError } = await supabase
          .from('interactions')
          .select('*')
          .eq('id', interactionId)
          .single();
          
        if (interactionError) throw interactionError;
        
        if (!interactionData) {
          setLoading(false);
          return;
        }
        
        setInteraction(interactionData as InteractionData);
        
        // Get consultant details if available
        if (interactionData.metadata && typeof interactionData.metadata === 'object' && 'consultant_id' in interactionData.metadata) {
          // Fix: Converting consultant_id to string if it's a number
          const consultantId = String(interactionData.metadata.consultant_id);
          
          const { data: consultantData, error: consultantError } = await supabase
            .from('consultants')
            .select('*')
            .eq('id', consultantId)
            .single();
            
          if (!consultantError && consultantData) {
            setConsultant(consultantData as ConsultantData);
          }
        }
        
        // Get messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('interaction_id', interactionId)
          .order('created_at', { ascending: true });
          
        if (messagesError) throw messagesError;
        
        if (messagesData) {
          setMessages(messagesData as MessageData[]);
        }
        
        // Check if user is the consultant or the seeker
        const { data: { user } } = await supabase.auth.getUser();
        if (user && interactionData.helper_id === user.id) {
          setJoinAs('consultant');
        } else {
          setJoinAs('user');
        }
        
        // Check if video call is active
        if (interactionData.status === 'active' && 
            (interactionData.interaction_type === 'video' || 
             interactionData.interaction_type === 'audio')) {
          setShowVideoCall(true);
          setTimerRunning(true);
          setSessionStartTime(new Date(interactionData.updated_at || ''));
        }
        
      } catch (error) {
        console.error('Error fetching interaction data:', error);
        toast.error('Failed to load interaction data');
      } finally {
        setLoading(false);
      }
    };

    fetchInteractionData();
  }, [interactionId, navigate]);

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
