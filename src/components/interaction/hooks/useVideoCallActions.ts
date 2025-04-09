
import { useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InteractionData } from '../types';

interface UseVideoCallActionsProps {
  interaction: InteractionData | null;
  navigate: NavigateFunction;
  setShowVideoCall: (show: boolean) => void;
  setJoinAs: (role: 'user' | 'consultant') => void;
  setTimerRunning: (running: boolean) => void;
  setSessionStartTime: (time: Date | null) => void;
  setEndCallConfirmOpen: (open: boolean) => void;
}

export const useVideoCallActions = ({
  interaction,
  navigate,
  setShowVideoCall,
  setJoinAs,
  setTimerRunning,
  setSessionStartTime,
  setEndCallConfirmOpen,
}: UseVideoCallActionsProps) => {
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
  }, [interaction, setShowVideoCall, setJoinAs, setTimerRunning, setSessionStartTime]);

  // End video call
  const endVideoCall = useCallback(async () => {
    setEndCallConfirmOpen(true);
  }, [setEndCallConfirmOpen]);

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
  }, [interaction, navigate, setShowVideoCall, setEndCallConfirmOpen, setTimerRunning]);

  return {
    startVideoCall,
    endVideoCall,
    confirmEndCall,
  };
};
