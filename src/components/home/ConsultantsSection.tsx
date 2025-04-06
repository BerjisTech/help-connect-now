
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ConsultantCard, { Consultant } from './ConsultantCard';
import { supabase } from '@/integrations/supabase/client';

// Fallback consultant data (in case no consultants are found in the database)
const fallbackConsultants: Consultant[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    industry: 'Marketing',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expertise: ['Digital Marketing', 'Brand Strategy']
  },
  {
    id: 2,
    name: 'Michael Chen',
    industry: 'Finance',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expertise: ['Investment', 'Financial Planning']
  },
  {
    id: 3,
    name: 'Priya Patel',
    industry: 'Technology',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expertise: ['Software Development', 'UX Design']
  },
  {
    id: 4,
    name: 'James Wilson',
    industry: 'Business',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    expertise: ['Strategy', 'Operations']
  }
];

const ConsultantsSection = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const { data, error } = await supabase
          .from('consultants')
          .select('id, display_name, industry, rating, avatar_url, expertise, availability')
          .limit(8);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Transform the data from Supabase format to our Consultant format
          const formattedConsultants = data.map((item) => ({
            id: item.id,
            name: item.display_name,
            industry: item.industry || 'Consultant',
            rating: item.rating || 4.5,
            image: item.avatar_url || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
            expertise: item.expertise || ['Consulting'],
            availability: item.availability
          }));
          
          setConsultants(formattedConsultants);
        } else {
          // If no consultants found in DB, use fallback data
          setConsultants(fallbackConsultants);
        }
      } catch (error) {
        console.error('Error fetching consultants:', error);
        toast.error('Failed to load consultants. Using sample data instead.');
        setConsultants(fallbackConsultants);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-right mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-4">Top Consultants Ready to Help</h2>
          <p className="text-xl text-indigo-900/70 max-w-3xl ml-auto">
            Our platform connects you with verified experts across industries
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-indigo-600">Loading consultants...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {consultants.map((consultant, index) => (
              <ConsultantCard 
                key={typeof consultant.id === 'string' ? consultant.id : consultant.id.toString()} 
                consultant={consultant} 
                staggerIndex={index % 4}
              />
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
            <a href="/browse">View All Consultants</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ConsultantsSection;
