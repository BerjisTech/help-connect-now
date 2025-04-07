
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { toast } from 'sonner';

// Import refactored components
import { FilterBar } from '@/components/browse/FilterBar';
import { ProblemCard } from '@/components/browse/ProblemCard';
import { ConsultantsSection } from '@/components/browse/ConsultantsSection';
import { HelpersSection } from '@/components/browse/HelpersSection';
import { Profile } from '@/components/browse/types';
import { ConsultantData } from '@/components/interaction/types';

const Browse = () => {
  const [searchParams] = useSearchParams();
  const anonymousId = searchParams.get('anonymous');
  const description = searchParams.get('description') || '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [industry, setIndustry] = useState<string>('');
  const [helpers, setHelpers] = useState<Profile[]>([]);
  const [consultants, setConsultants] = useState<ConsultantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    fetchHelpers();
    fetchConsultants();
  }, [industry]);

  const fetchHelpers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'helper')
        .order('rating', { ascending: false });
      
      if (industry) {
        query = query.eq('industry', industry);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setHelpers(data || []);
    } catch (error) {
      console.error('Error fetching helpers:', error);
      toast.error('Failed to load helpers');
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      // Get consultants from the database using the RPC function
      const { data, error } = await supabase.rpc('get_consultants');
      
      if (error) {
        throw error;
      }
      
      // Apply industry filter client-side if needed
      let filteredData = data;
      if (industry && data) {
        filteredData = data.filter((item: any) => item.industry === industry);
      }
      
      if (filteredData && Array.isArray(filteredData)) {
        // Map the data to our ConsultantData type
        const formattedConsultants: ConsultantData[] = filteredData.map((item: any) => ({
          id: item.id,
          name: item.display_name || 'Unnamed Consultant',
          display_name: item.display_name || 'Unnamed Consultant',
          industry: item.industry || 'Consultant',
          rating: item.rating || 0,
          avatar_url: item.avatar_url || '',
          expertise: item.expertise || [],
          availability: item.availability || 'offline',
          created_at: item.created_at,
          updated_at: item.updated_at,
          hourly_rate: item.hourly_rate || 0,
          review_count: item.review_count || 0,
          bio: item.bio || ''
        }));
        
        setConsultants(formattedConsultants);
        console.log('Fetched consultants:', formattedConsultants);
      } else {
        setConsultants([]);
        console.log('No consultants data available');
      }
    } catch (error) {
      console.error('Error fetching consultants:', error);
      toast.error('Failed to load consultants');
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHelpers = helpers.filter(helper => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      helper.display_name?.toLowerCase().includes(searchLower) ||
      helper.industry?.toLowerCase().includes(searchLower) ||
      helper.expertise?.some(exp => exp.toLowerCase().includes(searchLower)) ||
      helper.bio?.toLowerCase().includes(searchLower)
    );
  });

  const filteredConsultants = consultants.filter(consultant => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      consultant.name.toLowerCase().includes(searchLower) ||
      consultant.industry.toLowerCase().includes(searchLower) ||
      consultant.expertise.some(exp => exp.toLowerCase().includes(searchLower))
    );
  });

  const initiateInteraction = async (consultantId: string, type: 'video' | 'audio' | 'text') => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const interactionData: any = {
        interaction_type: type,
        description: description || `Interaction with consultant ${consultantId}`,
        status: 'pending',
        metadata: { consultant_id: consultantId }
      };
      
      if (user.user) {
        interactionData.seeker_id = user.user.id;
      } else if (anonymousId) {
        interactionData.anonymous_seeker_id = anonymousId;
      } else {
        const newAnonymousId = Math.random().toString(36).substring(2, 15);
        interactionData.anonymous_seeker_id = newAnonymousId;
        
        localStorage.setItem('anonymousId', newAnonymousId);
        
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('anonymous', newAnonymousId);
        const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
      
      const { data, error } = await supabase
        .from('interactions')
        .insert(interactionData)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} interaction initiated!`);
      
      window.location.href = `/interaction?id=${data.id}`;
      
    } catch (error) {
      console.error('Error initiating interaction:', error);
      toast.error('Failed to start interaction');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 dark:text-primary">Find a Consultant</h1>
        
        <ProblemCard description={description} />
        
        <FilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          industry={industry}
          setIndustry={setIndustry}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        <ConsultantsSection 
          consultants={consultants}
          filteredConsultants={filteredConsultants}
          viewMode={viewMode}
          loading={loading}
          onInteraction={initiateInteraction}
        />
      </div>
    </Layout>
  );
};

export default Browse;
