
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type Interaction = Database['public']['Tables']['interactions']['Row'] & {
  helper: Database['public']['Tables']['profiles']['Row'],
  seeker: Database['public']['Tables']['profiles']['Row'] | null,
  messages: Database['public']['Tables']['messages']['Row'][]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (userProfile) {
      fetchInteractions();
    }
  }, [userProfile, activeTab]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      setUserProfile(profile);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/auth');
    }
  };

  const fetchInteractions = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      const isActiveFilter = activeTab === 'active';
      const isUserHelper = userProfile.user_type === 'helper';
      
      let query = supabase
        .from('interactions')
        .select(`
          *,
          helper:helper_id(id, display_name, avatar_url),
          seeker:seeker_id(id, display_name, avatar_url),
          messages(*)
        `)
        .eq('is_active', isActiveFilter);
      
      if (isUserHelper) {
        query = query.eq('helper_id', userProfile.id);
      } else {
        query = query.eq('seeker_id', userProfile.id);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setInteractions(data as any);
    } catch (error) {
      console.error('Error fetching interactions:', error);
      toast.error('Failed to load interactions');
    } finally {
      setLoading(false);
    }
  };

  const endInteraction = async (interactionId: string) => {
    try {
      const { error } = await supabase
        .from('interactions')
        .update({
          is_active: false,
          ended_at: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', interactionId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Interaction ended');
      fetchInteractions();
    } catch (error) {
      console.error('Error ending interaction:', error);
      toast.error('Failed to end interaction');
    }
  };

  const getInteractionTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '📹';
      case 'audio':
        return '🔊';
      case 'text':
        return '💬';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  if (loading && !userProfile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="active">Active Sessions</TabsTrigger>
            <TabsTrigger value="past">Past Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0">
            <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
            {loading ? (
              <p className="text-center py-8">Loading sessions...</p>
            ) : interactions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">You have no active sessions</p>
                  <Button asChild className="mt-4">
                    <a href="/browse">Find Helpers</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {interactions.map((interaction) => (
                  <Card key={interaction.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {getInteractionTypeIcon(interaction.interaction_type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {userProfile.user_type === 'helper' 
                                ? `Session with ${interaction.seeker?.display_name || 'Anonymous User'}`
                                : `Session with ${interaction.helper?.display_name || 'Helper'}`}
                            </CardTitle>
                            <CardDescription>
                              Started {formatDate(interaction.created_at)}
                            </CardDescription>
                          </div>
                        </div>
                        
                        <Badge className="capitalize">
                          {interaction.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-2">
                      <p className="text-sm text-gray-600 mb-3">
                        {interaction.description || 'No description provided'}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>
                          {interaction.messages.length} messages
                        </span>
                        <span className="capitalize">
                          {interaction.interaction_type} session
                        </span>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end pt-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="mr-2"
                      >
                        Resume Session
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => endInteraction(interaction.id)}
                      >
                        End Session
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-0">
            <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
            {loading ? (
              <p className="text-center py-8">Loading sessions...</p>
            ) : interactions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">You have no past sessions</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {interactions.map((interaction) => (
                  <Card key={interaction.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {getInteractionTypeIcon(interaction.interaction_type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {userProfile.user_type === 'helper' 
                                ? `Session with ${interaction.seeker?.display_name || 'Anonymous User'}`
                                : `Session with ${interaction.helper?.display_name || 'Helper'}`}
                            </CardTitle>
                            <CardDescription>
                              {formatDate(interaction.created_at)}
                              {interaction.ended_at && ` - ${formatDate(interaction.ended_at)}`}
                            </CardDescription>
                          </div>
                        </div>
                        
                        <Badge className="capitalize">
                          {interaction.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-2">
                      <p className="text-sm text-gray-600 mb-3">
                        {interaction.description || 'No description provided'}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>
                          {interaction.messages.length} messages
                        </span>
                        <span className="capitalize">
                          {interaction.interaction_type} session
                        </span>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mr-2"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
