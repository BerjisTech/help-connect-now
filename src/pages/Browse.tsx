import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StarIcon, Grid3X3Icon, LayoutGridIcon } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Consultant = {
  id: number | string;
  name: string;
  industry: string;
  rating: number;
  image: string;
  expertise: string[];
  availability?: string;
};

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
          availability: item.availability
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

  const initiateInteraction = async (helperId: string, type: 'video' | 'audio' | 'text') => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const interactionData: any = {
        helper_id: helperId,
        interaction_type: type,
        description: description || 'No description provided',
        status: 'pending'
      };
      
      if (user.user) {
        interactionData.seeker_id = user.user.id;
      } else if (anonymousId) {
        interactionData.anonymous_seeker_id = anonymousId;
      } else {
        toast.error('You need to be logged in or have an anonymous session to start an interaction');
        return;
      }
      
      const { data, error } = await supabase
        .from('interactions')
        .insert(interactionData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} interaction initiated!`);
      
    } catch (error) {
      console.error('Error initiating interaction:', error);
      toast.error('Failed to start interaction');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Find a Helper</h1>
        
        {description && (
          <Card className="mb-6 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Your Problem Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{description}</p>
            </CardContent>
          </Card>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by name, industry, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGridIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('table')}
            >
              <Grid3X3Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading helpers...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Consultants</h2>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredConsultants.map((consultant) => (
                    <Card key={consultant.id.toString()} className="overflow-hidden h-full">
                      <div className="h-48 relative">
                        <img 
                          src={consultant.image} 
                          alt={consultant.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <div className="flex items-center mb-1">
                              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm font-medium">{consultant.rating.toFixed(1)}</span>
                              
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
                        <CardTitle className="text-lg">{consultant.name}</CardTitle>
                        <CardDescription>{consultant.industry}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {consultant.expertise.slice(0, 3).map((exp, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                          {consultant.expertise.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{consultant.expertise.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-0">
                        <Button 
                          size="sm" 
                          variant="default"
                          className="flex-1"
                          onClick={() => initiateInteraction(consultant.id.toString(), 'video')}
                          disabled={consultant.availability === 'offline'}
                        >
                          Video Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => initiateInteraction(consultant.id.toString(), 'text')}
                          disabled={consultant.availability === 'offline'}
                        >
                          Chat
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Expertise</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConsultants.map((consultant) => (
                        <TableRow key={consultant.id.toString()}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={consultant.image} />
                                <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {consultant.name}
                            </div>
                          </TableCell>
                          <TableCell>{consultant.industry}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {consultant.expertise.slice(0, 2).map((exp, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {exp}
                                </Badge>
                              ))}
                              {consultant.expertise.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{consultant.expertise.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                              {consultant.rating.toFixed(1)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              consultant.availability === 'available' ? 'bg-green-100 text-green-800' :
                              consultant.availability === 'busy' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full mr-1 ${
                                consultant.availability === 'available' ? 'bg-green-500' :
                                consultant.availability === 'busy' ? 'bg-amber-500' :
                                'bg-gray-500'
                              }`} />
                              {consultant.availability?.charAt(0).toUpperCase() + consultant.availability?.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => initiateInteraction(consultant.id.toString(), 'video')}
                                disabled={consultant.availability === 'offline'}
                              >
                                Video
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => initiateInteraction(consultant.id.toString(), 'text')}
                                disabled={consultant.availability === 'offline'}
                              >
                                Chat
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Helpers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHelpers.map((helper) => (
                <Card key={helper.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={helper.avatar_url || ''} />
                          <AvatarFallback className="bg-primary text-white">
                            {helper.display_name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{helper.display_name}</CardTitle>
                          <CardDescription>{helper.industry || 'General'}</CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">
                          {helper.rating?.toFixed(1) || 'New'}{' '}
                          {helper.review_count ? `(${helper.review_count})` : ''}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {helper.bio || 'No bio provided'}
                    </p>
                    
                    {helper.expertise && helper.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {helper.expertise.slice(0, 3).map((exp, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {exp}
                          </Badge>
                        ))}
                        {helper.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{helper.expertise.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center mt-1">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        helper.availability === 'available' ? 'bg-green-500' : 
                        helper.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-xs text-gray-600 capitalize">{helper.availability}</span>
                      
                      {helper.hourly_rate && (
                        <div className="ml-auto">
                          <span className="text-sm font-medium">${helper.hourly_rate}/hr</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      className="flex-1"
                      onClick={() => initiateInteraction(helper.id, 'video')}
                      disabled={helper.availability === 'offline'}
                    >
                      Video Call
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => initiateInteraction(helper.id, 'text')}
                      disabled={helper.availability === 'offline'}
                    >
                      Chat
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Browse;
