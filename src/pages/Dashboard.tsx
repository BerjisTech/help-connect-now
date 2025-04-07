
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const interactionId = searchParams.get('interaction');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // If an interaction ID is passed in URL params, redirect to the interaction page
  useEffect(() => {
    if (interactionId) {
      navigate(`/interaction?id=${interactionId}`);
    }
  }, [interactionId, navigate]);

  // Get user profile and load interactions
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user session
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData?.session?.user?.id;
        setUserId(currentUserId);
        
        if (currentUserId) {
          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUserId)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
          } else if (profileData) {
            setUserProfile(profileData);
          }
          
          // Fetch interactions
          await fetchInteractions(currentUserId, activeTab);
        } else {
          // Check for anonymous user
          const anonymousId = localStorage.getItem('anonymousId');
          if (anonymousId) {
            await fetchAnonymousInteractions(anonymousId, activeTab);
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [activeTab]);

  const fetchInteractions = async (userId: string, status: string) => {
    try {
      // First fetch interactions
      let query = supabase
        .from('interactions')
        .select('*')
        .eq('seeker_id', userId)
        .order('created_at', { ascending: false });
        
      if (status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // For each interaction, fetch the consultant data if available
      if (data && data.length > 0) {
        const interactionsWithConsultants = await Promise.all(
          data.map(async (interaction) => {
            // Safely access consultant_id from metadata which could be null, undefined or an object
            let consultantId = undefined;
            
            if (interaction.metadata && 
                typeof interaction.metadata === 'object' && 
                !Array.isArray(interaction.metadata)) {
              // Now we know metadata is an object, we can safely access consultant_id
              consultantId = (interaction.metadata as { [key: string]: any }).consultant_id;
            }
            
            if (consultantId) {
              const { data: consultantData, error: consultantError } = await supabase
                .from('consultants')
                .select('*')
                .eq('id', consultantId)
                .single();
                
              if (consultantError) {
                console.error('Error fetching consultant:', consultantError);
                return { ...interaction, consultants: null };
              }
              
              return { ...interaction, consultants: consultantData };
            }
            
            return { ...interaction, consultants: null };
          })
        );
        
        setInteractions(interactionsWithConsultants);
      } else {
        setInteractions(data || []);
      }
    } catch (error) {
      console.error('Error fetching interactions:', error);
      toast.error('Failed to load your interactions');
    }
  };

  const fetchAnonymousInteractions = async (anonymousId: string, status: string) => {
    try {
      // First fetch interactions
      let query = supabase
        .from('interactions')
        .select('*')
        .eq('anonymous_seeker_id', anonymousId)
        .order('created_at', { ascending: false });
        
      if (status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // For each interaction, fetch the consultant data if available
      if (data && data.length > 0) {
        const interactionsWithConsultants = await Promise.all(
          data.map(async (interaction) => {
            // Safely access consultant_id from metadata which could be null, undefined or an object
            let consultantId = undefined;
            
            if (interaction.metadata && 
                typeof interaction.metadata === 'object' && 
                !Array.isArray(interaction.metadata)) {
              // Now we know metadata is an object, we can safely access consultant_id
              consultantId = (interaction.metadata as { [key: string]: any }).consultant_id;
            }
            
            if (consultantId) {
              const { data: consultantData, error: consultantError } = await supabase
                .from('consultants')
                .select('*')
                .eq('id', consultantId)
                .single();
                
              if (consultantError) {
                console.error('Error fetching consultant:', consultantError);
                return { ...interaction, consultants: null };
              }
              
              return { ...interaction, consultants: consultantData };
            }
            
            return { ...interaction, consultants: null };
          })
        );
        
        setInteractions(interactionsWithConsultants);
      } else {
        setInteractions(data || []);
      }
    } catch (error) {
      console.error('Error fetching anonymous interactions:', error);
      toast.error('Failed to load your interactions');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Summary */}
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
                <CardDescription>Your account details at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : userProfile ? (
                  <>
                    <p>Display Name: {userProfile.display_name}</p>
                    <p>User Type: {userProfile.user_type}</p>
                    {userProfile.industry && (
                      <p>Industry: {userProfile.industry}</p>
                    )}
                  </>
                ) : userId ? (
                  <p>Profile not found. Please complete your profile setup.</p>
                ) : (
                  <p>You're browsing anonymously. <a href="/auth" className="text-primary underline">Sign in</a> to access your full profile.</p>
                )}
              </CardContent>
              <CardFooter>
                {userId && (
                  <Button asChild variant="outline">
                    <a href="/profile">Edit Profile</a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          {/* Interactions List */}
          <div className="lg:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Interactions</CardTitle>
                  <Select 
                    value={activeTab} 
                    onValueChange={handleTabChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="all">All Interactions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : interactions.length > 0 ? (
                  <div className="space-y-4">
                    {interactions.map((interaction) => (
                      <Card key={interaction.id} className="hover:bg-secondary/10 transition-colors">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-base">
                              {interaction.description || `${interaction.interaction_type} consultation`}
                            </CardTitle>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              interaction.status === 'active' ? 'bg-green-100 text-green-800' :
                              interaction.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {interaction.status}
                            </span>
                          </div>
                          <CardDescription>
                            Started: {formatDate(interaction.created_at)}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Button asChild size="sm">
                            <a href={`/interaction?id=${interaction.id}`}>View Details</a>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No interactions found</p>
                    <Button asChild variant="outline" className="mt-4">
                      <a href="/browse">Find a Consultant</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
