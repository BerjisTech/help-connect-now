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
import { Profile, Consultant } from '@/components/browse/types';

const Browse = () => {
  const [searchParams] = useSearchParams();
  const anonymousId = searchParams.get('anonymous');
  const description = searchParams.get('description') || '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [industry, setIndustry] = useState<string>('');
  const [helpers, setHelpers] = useState<Profile[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
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
    try {
      const { data, error } = await supabase.rpc('get_consultants');

      if (error) {
        throw error;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const formattedConsultants = data.map((item: any) => ({
          id: item.id,
          name: item.display_name,
          industry: item.industry || 'Consultant',
          rating: item.rating || 4.5,
          image: item.avatar_url || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
          expertise: item.expertise || ['Consulting'],
          availability: item.availability,
          allowAnonymous: item.allow_anonymous !== undefined ? item.allow_anonymous : Math.random() > 0.3 // For demo purposes, randomly allow anonymous for some consultants
        }));
        
        setConsultants(formattedConsultants);
      }
    } catch (error) {
      console.error('Error fetching consultants:', error);
      toast.error('Failed to load consultants');
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
