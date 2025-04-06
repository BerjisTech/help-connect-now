
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import ConsultantHero from '@/components/consultant/ConsultantHero';
import ConsultantTrust from '@/components/consultant/ConsultantTrust';
import ConsultantReviews from '@/components/consultant/ConsultantReviews';
import ConsultantPricing from '@/components/consultant/ConsultantPricing';
import ConsultantFAQ from '@/components/consultant/ConsultantFAQ';
import ConsultantProfileEditor from '@/components/consultant/ConsultantProfileEditor';
import { ConsultantData, ProfileConfig } from '@/components/interaction/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const defaultProfileConfig: ProfileConfig = {
  heroConfig: {
    backgroundImage: '',
    backgroundColor: '#f1f5f9',
    layout: 'left-image',
    textAlignment: 'left',
    taglineAlignment: 'left',
    intro: 'I help people solve problems',
    tagline: 'Expert advice when you need it most',
    showImage: true
  },
  trustConfig: {
    showTrustIndicators: true,
    companyClients: 5,
    individualClients: 27
  },
  reviewsConfig: {
    showReviews: true
  },
  pricingConfig: {
    models: [
      {
        id: '1',
        title: 'Basic Consultation',
        price: 99,
        currency: 'USD',
        period: 'per hour',
        features: ['1 hour consultation', 'Email follow-up', 'Resource materials'],
        isHighlighted: false
      },
      {
        id: '2',
        title: 'Premium Package',
        price: 249,
        currency: 'USD',
        period: 'per session',
        features: ['2 hour deep dive', 'Implementation plan', '2 weeks email support', 'Resource materials'],
        isHighlighted: true
      }
    ]
  },
  faqConfig: {
    questions: [
      {
        id: '1',
        question: 'What services do you offer?',
        answer: 'I provide expert consultation in my field, including one-on-one sessions, group workshops, and written advice.'
      },
      {
        id: '2',
        question: 'How can I book a session?',
        answer: 'You can schedule a session by clicking the "Book Now" button or contacting me directly through the platform.'
      },
      {
        id: '3',
        question: 'What is your cancellation policy?',
        answer: 'Cancellations made 24 hours before the scheduled session will receive a full refund. Late cancellations may be subject to a fee.'
      }
    ]
  }
};

// Helper function to get profile config from storage
const getStoredProfileConfig = (consultantId: string): ProfileConfig | null => {
  try {
    const storedConfig = sessionStorage.getItem(`profileConfig_${consultantId}`);
    return storedConfig ? JSON.parse(storedConfig) : null;
  } catch (error) {
    console.error('Error retrieving stored profile config:', error);
    return null;
  }
};

// Helper function to store profile config
const storeProfileConfig = (consultantId: string, config: ProfileConfig): void => {
  try {
    sessionStorage.setItem(`profileConfig_${consultantId}`, JSON.stringify(config));
  } catch (error) {
    console.error('Error storing profile config:', error);
  }
};

const ConsultantProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [consultant, setConsultant] = useState<ConsultantData | null>(null);
  const [profileConfig, setProfileConfig] = useState<ProfileConfig>(defaultProfileConfig);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchConsultantData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Check if we're on a development environment
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        // Fetch consultant data
        const { data: consultantData, error: consultantError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (consultantError) {
          console.error('Error fetching consultant:', consultantError);
          throw consultantError;
        }
        
        // Check if current user
        const { data: { user } } = await supabase.auth.getUser();
        const isOwner = user?.id === id;
        setIsCurrentUser(isOwner);
        
        // Set consultant data
        if (consultantData) {
          setConsultant({
            id: consultantData.id || id,
            display_name: consultantData.display_name || 'Consultant',
            name: consultantData.display_name || 'Consultant',
            avatar_url: consultantData.avatar_url,
            bio: consultantData.bio || '',
            industry: consultantData.industry || '',
            expertise: consultantData.expertise || [],
            rating: consultantData.rating || 4.5,
            availability: consultantData.availability || 'available',
          });
          
          // Try to get stored profile config
          const storedConfig = getStoredProfileConfig(id);
          if (storedConfig) {
            setProfileConfig(storedConfig);
          }
        }
      } catch (error) {
        console.error('Error fetching consultant data:', error);
        toast.error('Failed to load consultant profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsultantData();
  }, [id]);

  const saveProfileConfig = async (updatedConfig: ProfileConfig) => {
    if (!consultant || !id) return;
    
    try {
      // Store the config in sessionStorage instead of database
      storeProfileConfig(id, updatedConfig);
      setProfileConfig(updatedConfig);
      setIsEditing(false);
      toast.success('Profile configuration saved successfully');
    } catch (error) {
      console.error('Error saving profile configuration:', error);
      toast.error('Failed to save profile configuration');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">Loading consultant profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!consultant) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Consultant Not Found</h1>
          <p className="text-gray-600">The consultant profile you're looking for doesn't exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {isCurrentUser && !isEditing && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
      
      {isEditing ? (
        <ConsultantProfileEditor 
          consultant={consultant}
          profileConfig={profileConfig}
          onSave={saveProfileConfig}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <ConsultantHero consultant={consultant} config={profileConfig.heroConfig} />
          
          {profileConfig.trustConfig.showTrustIndicators && (
            <ConsultantTrust config={profileConfig.trustConfig} />
          )}
          
          {profileConfig.reviewsConfig.showReviews && (
            <ConsultantReviews consultantId={consultant.id} />
          )}
          
          <ConsultantPricing models={profileConfig.pricingConfig.models} />
          
          <ConsultantFAQ questions={profileConfig.faqConfig.questions} />
        </>
      )}
    </Layout>
  );
};

export default ConsultantProfile;
