
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ConsultantCard from './ConsultantCard';
import { supabase } from '@/integrations/supabase/client';
import { ConsultantData } from '../interaction/types';

const ConsultantsSection = () => {
  const [consultants, setConsultants] = useState<ConsultantData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        // Use the RPC function to fetch consultants
        const { data, error } = await supabase.rpc('get_consultants');

        if (error) {
          throw error;
        }

        console.log(data)

        if (data && Array.isArray(data) && data.length > 0) {          
          setConsultants(data);
        } else {
          toast.error('No consultants found.');
        }
      } catch (error) {
        console.error('Error fetching consultants:', error);
        toast.error('Failed to load consultants. Using sample data instead.');
        
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-indigo-950">
      <div className="container mx-auto px-4">
        <div className="text-right mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-100 mb-4">Top Consultants Ready to Help</h2>
          <p className="text-xl text-indigo-900/70 dark:text-indigo-300 max-w-3xl ml-auto">
            Our platform connects you with verified experts across industries
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-accent" />
            <span className="ml-2 text-indigo-600">Loading consultants...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {consultants.map((consultant, index) => (
              <ConsultantCard 
                key={typeof consultant.id === 'string' ? consultant.id : consultant.id} 
                consultant={consultant} 
                staggerIndex={index % 4}
              />
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="border-indigo-300 dark:bg-indigo-700 dark:border-indigo-700 text-indigo-700 dark:text-indigo-950 hover:bg-indigo-50">
            <a href="/browse">View All Consultants</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ConsultantsSection;
