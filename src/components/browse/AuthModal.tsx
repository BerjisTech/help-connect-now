
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, MessageCircle, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConsultantData } from '../interaction/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: ConsultantData | null;
  interactionType: 'video' | 'audio' | 'text' | null;
  onProceedAnonymously: () => void;
}

export const AuthModal = ({
  isOpen,
  onClose,
  consultant,
  interactionType,
  onProceedAnonymously,
}: AuthModalProps) => {
  const navigate = useNavigate();
  
  if (!consultant || !interactionType) return null;
  
  const handleLogin = () => {
    navigate('/auth');
  };

  const handleSignUp = () => {
    navigate('/auth?tab=signup');
  };

  const getIcon = () => {
    switch (interactionType) {
      case 'video':
        return <PhoneCall className="h-5 w-5 text-primary" />;
      case 'text':
        return <MessageCircle className="h-5 w-5 text-primary" />;
      case 'audio':
        return <PhoneCall className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dark:bg-indigo-950 dark:text-accent">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {interactionType.charAt(0).toUpperCase() + interactionType.slice(1)} with {consultant.name}
          </DialogTitle>
          <DialogDescription>
            {consultant.allowAnonymous 
              ? "You're not logged in. How would you like to proceed?" 
              : `${consultant.name} doesn't allow anonymous calls. Please log in or create an account to connect.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {consultant.allowAnonymous && (
            <Button onClick={onProceedAnonymously} variant="outline" className="w-full justify-start dark:bg-indigo-950 dark:text-accent">
              <span className="mr-2">👤</span>
              Continue anonymously
            </Button>
          )}
          <Button onClick={handleLogin} variant="outline" className="w-full justify-start dark:bg-indigo-950 dark:text-accent">
            <span className="mr-2">🔑</span>
            Log in to your account
          </Button>
          <Button onClick={handleSignUp} variant="default" className="w-full justify-start">
            <UserPlus className="mr-2 h-4 w-4" />
            Create a new account
          </Button>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
