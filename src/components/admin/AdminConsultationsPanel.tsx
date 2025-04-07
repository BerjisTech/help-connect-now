
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { InteractionData } from '@/components/interaction/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Video, MessageSquare, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const AdminConsultationsPanel = () => {
  const [search, setSearch] = useState('');
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['consultationStats'],
    queryFn: async () => {
      // Get the total number of consultations
      const { count: totalCount, error: totalError } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) throw totalError;
      
      // Get the number of active consultations
      const { count: activeCount, error: activeError } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      if (activeError) throw activeError;
      
      // Get the number of completed consultations
      const { count: completedCount, error: completedError } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      
      if (completedError) throw completedError;
      
      // Get count by interaction type
      const { data: typeData, error: typeError } = await supabase
        .from('interactions')
        .select('interaction_type, count')
        .select('interaction_type')
        .group('interaction_type');
      
      if (typeError) throw typeError;
      
      // Calculate type counts
      const typeCounts = {
        video: typeData?.filter(i => i.interaction_type === 'video').length || 0,
        audio: typeData?.filter(i => i.interaction_type === 'audio').length || 0,
        text: typeData?.filter(i => i.interaction_type === 'text').length || 0
      };
      
      return {
        total: totalCount || 0,
        active: activeCount || 0,
        completed: completedCount || 0,
        types: typeCounts
      };
    }
  });
  
  const { data: interactions, isLoading } = useQuery({
    queryKey: ['adminInteractions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interactions')
        .select(`
          *,
          helper:helper_id(display_name, avatar_url),
          seeker:seeker_id(display_name, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (InteractionData & {
        helper: { display_name: string; avatar_url: string | null } | null;
        seeker: { display_name: string; avatar_url: string | null } | null;
      })[];
    }
  });
  
  const filteredInteractions = interactions?.filter(interaction => {
    const searchLower = search.toLowerCase();
    const helperName = interaction.helper?.display_name?.toLowerCase() || '';
    const seekerName = interaction.seeker?.display_name?.toLowerCase() || 
                       interaction.anonymous_seeker_id?.toLowerCase() || '';
    const description = interaction.description?.toLowerCase() || '';
    
    return (
      helperName.includes(searchLower) ||
      seekerName.includes(searchLower) ||
      description.includes(searchLower)
    );
  });
  
  const getInteractionIcon = (type: 'video' | 'audio' | 'text') => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Phone className="h-4 w-4" />;
      case 'text':
        return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status: string, isActive?: boolean) => {
    if (status === 'completed') {
      return <Badge variant="outline">Completed</Badge>;
    }
    
    if (isActive) {
      return <Badge variant="default">Active</Badge>;
    }
    
    if (status === 'pending') {
      return <Badge variant="secondary">Pending</Badge>;
    }
    
    return <Badge variant="outline">{status}</Badge>;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Consultations</h2>
          <p className="text-muted-foreground">Manage all consultations on the platform</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search consultations..." 
            className="pl-8 w-full sm:w-[250px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total</CardTitle>
                <CardDescription>All consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.total}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active</CardTitle>
                <CardDescription>Currently in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.active}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Completed</CardTitle>
                <CardDescription>Finished consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.completed}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Types</CardTitle>
                <CardDescription>By medium</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Video className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-sm">{stats?.types.video}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-sm">{stats?.types.audio}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1 text-purple-500" />
                    <span className="text-sm">{stats?.types.text}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead>Seeker</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                </TableRow>
              ))
            ) : filteredInteractions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No consultations found
                </TableCell>
              </TableRow>
            ) : (
              filteredInteractions?.map(interaction => (
                <TableRow key={interaction.id}>
                  <TableCell className="font-mono text-xs">
                    {interaction.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {getInteractionIcon(interaction.interaction_type)}
                      <span className="capitalize">{interaction.interaction_type}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{interaction.helper?.display_name || 'N/A'}</TableCell>
                  <TableCell>
                    {interaction.seeker?.display_name || 
                     (interaction.anonymous_seeker_id ? 'Anonymous' : 'N/A')}
                  </TableCell>
                  <TableCell>{formatDate(interaction.created_at)}</TableCell>
                  <TableCell>{getStatusBadge(interaction.status, interaction.is_active)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminConsultationsPanel;
