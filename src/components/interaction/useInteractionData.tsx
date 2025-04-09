
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ConsultantData, InteractionData, MessageData } from './types';

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
  const [anonymousId, setAnonymousId] = useState<string | null>(null);

  // Initialize anonymous ID on mount
  useEffect(() => {
    const storedId = localStorage.getItem('anonymousId');
    if (storedId) {
      setAnonymousId(storedId);
    } else {
      const newId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('anonymousId', newId);
      setAnonymousId(newId);
    }
  }, []);

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
          setSessionStartTime(new Date(interactionData.updated_at));
        }
        
      } catch (error) {
        console.error('Error fetching interaction data:', error);
        toast.error('Failed to load interaction data');
      } finally {
        setLoading(false);
      }
    };

    fetchInteractionData();
    
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
          setSessionStartTime(new Date(updatedInteraction.updated_at));
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
  }, [interactionId, navigate]);

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

  // Start video call
  const startVideoCall = useCallback(async (role: 'user' | 'consultant') => {
    if (!interaction) return;
    
    try {
      // Update interaction status to active
      const { error } = await supabase
        .from('interactions')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', interaction.id);
        
      if (error) throw error;
      
      setShowVideoCall(true);
      setJoinAs(role);
      setTimerRunning(true);
      setSessionStartTime(new Date());
      
      toast.success('Video call started');
    } catch (error) {
      console.error('Error starting video call:', error);
      toast.error('Failed to start video call');
    }
  }, [interaction]);

  // End video call
  const endVideoCall = useCallback(async () => {
    setEndCallConfirmOpen(true);
  }, []);

  // Confirm end call
  const confirmEndCall = useCallback(async () => {
    if (!interaction) return;
    
    try {
      // Update interaction status to completed
      const { error } = await supabase
        .from('interactions')
        .update({ 
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', interaction.id);
        
      if (error) throw error;
      
      setShowVideoCall(false);
      setEndCallConfirmOpen(false);
      setTimerRunning(false);
      
      toast.success('Call ended successfully');
      
      // Redirect to review page
      navigate(`/review?interaction=${interaction.id}`);
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Failed to end call');
    }
  }, [interaction, navigate]);

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
      
      // Insert message
      const { error } = await supabase
        .from('messages')
        .insert(messageData);
        
      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [interaction, anonymousId]);

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
