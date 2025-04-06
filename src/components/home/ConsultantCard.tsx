
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface Consultant {
  id: number | string;
  name: string;
  industry: string;
  rating: number;
  image: string;
  expertise: string[];
  availability?: string;
}

interface ConsultantCardProps {
  consultant: Consultant;
  staggerIndex: number;
}

const ConsultantCard = ({ consultant, staggerIndex }: ConsultantCardProps) => {
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();

  // Apply different top margins based on index to create staggered heights
  const staggerClass = 
    staggerIndex === 0 ? '-mt-16' : 
    staggerIndex === 1 ? '-mt-8' : 
    staggerIndex === 2 ? 'mt-0' : 
    'mt-8';

  // Function to determine card overlay color based on availability
  const getAvailabilityClass = () => {
    if (!consultant.availability || consultant.availability === 'available') {
      return 'bg-gradient-to-t from-indigo-900/90 via-indigo-800/50 to-transparent';
    } else if (consultant.availability === 'busy') {
      return 'bg-gradient-to-t from-amber-900/90 via-amber-800/50 to-transparent';
    } else {
      return 'bg-gradient-to-t from-gray-900/90 via-gray-800/50 to-transparent';
    }
  };

  const handleConnectNow = async () => {
    setConnecting(true);
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      // Create a unique anonymous ID if not logged in
      const anonymousId = localStorage.getItem('anonymousId') || uuidv4();
      if (!session?.user) {
        localStorage.setItem('anonymousId', anonymousId);
      }
      
      // Create interaction record without linking directly to consultant
      // This avoids foreign key constraints since consultants aren't in auth.users
      const { data, error } = await supabase
        .from('interactions')
        .insert({
          // Don't set helper_id directly as it has a foreign key constraint
          interaction_type: 'text',
          description: `Consultation with ${consultant.name} on ${consultant.industry}`,
          seeker_id: session?.user?.id || null,
          anonymous_seeker_id: session?.user ? null : anonymousId,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Redirect based on authentication status
      if (session?.user) {
        navigate(`/dashboard?interaction=${data.id}`);
      } else {
        navigate(`/browse?anonymous=${anonymousId}&interaction=${data.id}`);
      }
      
      toast.success(`Connecting you with ${consultant.name}`);
    } catch (error) {
      console.error('Error connecting with consultant:', error);
      toast.error('Could not connect with consultant. Please try again later.');
    } finally {
      setConnecting(false);
    }
  };

  const isOffline = consultant.availability === 'offline';

  return (
    <div 
      className={`relative h-96 rounded-xl overflow-hidden shadow-lg group transition-all duration-300 hover:-translate-y-2 ${staggerClass}`}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url(${consultant.image})` }}
      />
      <div className={`absolute inset-0 z-10 ${getAvailabilityClass()}`} />
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
        <div className="flex items-center mb-1">
          <span className="flex items-center text-yellow-300 mr-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1">{consultant.rating}</span>
          </span>
          
          {consultant.availability && (
            <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
              consultant.availability === 'available' ? 'bg-green-500/30 text-green-100' :
              consultant.availability === 'busy' ? 'bg-amber-500/30 text-amber-100' :
              'bg-gray-500/30 text-gray-100'
            }`}>
              {consultant.availability.charAt(0).toUpperCase() + consultant.availability.slice(1)}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold mb-1">{consultant.name}</h3>
        <p className="text-white/80 mb-3">{consultant.industry}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {consultant.expertise.map((skill, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-white/20 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
        <Button 
          size="sm" 
          onClick={handleConnectNow}
          disabled={connecting || isOffline}
          className={`w-full ${
            isOffline 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-indigo-500 hover:bg-indigo-600 group-hover:bg-indigo-500'
          }`}
        >
          {connecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Connecting...
            </>
          ) : isOffline ? (
            'Currently Offline'
          ) : (
            <>
              Connect Now <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConsultantCard;
