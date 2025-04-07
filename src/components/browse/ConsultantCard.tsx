
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter
} from '@/components/ui/card';
import { AuthModal } from './AuthModal';
import { supabase } from '@/integrations/supabase/client';
import { ConsultantData } from '../interaction/types';

interface ConsultantCardProps {
  consultant: ConsultantData
  onInteraction: (id: string, type: 'video' | 'audio' | 'text') => void;
}

export const ConsultantCard = ({ consultant, onInteraction }: ConsultantCardProps) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [interactionType, setInteractionType] = useState<'video' | 'audio' | 'text' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const checkAuth = async (type: 'video' | 'audio' | 'text') => {
    const { data } = await supabase.auth.getUser();
    const isAuthenticated = !!data.user;
    setIsLoggedIn(isAuthenticated);
    
    if (isAuthenticated) {
      onInteraction(consultant.id.toString(), type);
    } else {
      setInteractionType(type);
      setAuthModalOpen(true);
    }
  };

  const handleInteractionClick = (type: 'video' | 'audio' | 'text') => {
    checkAuth(type);
  };

  const handleProceedAnonymously = () => {
    if (interactionType) {
      onInteraction(consultant.id.toString(), interactionType);
      setAuthModalOpen(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons
    if ((e.target as Element).closest('button')) {
      return;
    }
    navigate(`/consultant/${consultant.id}`);
  };

  return (
    <>
      <Card 
        key={consultant.id.toString()} 
        className="overflow-hidden dark:bg-indigo-700/40 dark:border-indigo-700/40 h-full cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        <div className="h-48 relative">
          <img 
            src={consultant.avatar_url} 
            alt={consultant.display_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-center mb-1">
                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{consultant.rating?.toFixed(1)}</span>
                
                {consultant.availability && (
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    consultant.availability === 'available' ? 'bg-green-500/30 text-green-100' :
                    consultant.availability === 'busy' ? 'bg-amber-500/30 text-amber-100' :
                    'bg-gray-500/30 text-gray-100'
                  }`}>
                    {consultant.availability.charAt(0).toUpperCase() + consultant.availability.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg dark:text-accent">{consultant.display_name}</CardTitle>
          <CardDescription>{consultant.industry}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mb-2">
            {consultant.expertise.slice(0, 3).map((exp, i) => (
              <Badge key={i} variant="secondary" className="text-xs dark:bg-indigo-700/40 dark:text-accent">
                {exp}
              </Badge>
            ))}
            {consultant.expertise.length > 3 && (
              <Badge variant="outline" className="text-xs dark:bg-indigo-700/40 dark:text-accent">
                +{consultant.expertise.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 pt-0">
          <Button 
            size="sm" 
            variant="default"
            className="flex-1 dark:bg-indigo-950 dark:hover:bg-indigo-800"
            onClick={(e) => {
              e.stopPropagation();
              handleInteractionClick('video');
            }}
            disabled={consultant.availability === 'offline'}
          >
            Video Call
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1 dark:bg-indigo-700/40 dark:border-indigo-700/40 dark:text-white/50 dark:hover:bg-indigo-800"
            onClick={(e) => {
              e.stopPropagation();
              handleInteractionClick('text');
            }}
            disabled={consultant.availability === 'offline'}
          >
            Chat
          </Button>
        </CardFooter>
      </Card>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        consultant={consultant}
        interactionType={interactionType}
        onProceedAnonymously={handleProceedAnonymously}
      />
    </>
  );
};
