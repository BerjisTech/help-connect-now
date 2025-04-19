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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [pageSize, setPageSize] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['consultationStats'],
    queryFn: async () => {
      const { count: totalCount, error: totalError } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) throw totalError;
      
      const { count: activeCount, error: activeError } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      if (activeError) throw activeError;
      
      const { count: completedCount, error: completedError } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      
      if (completedError) throw completedError;
      
      const { data: videoData, error: videoError } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true })
        .eq('interaction_type', 'video');
        
      if (videoError) throw videoError;
        
      const { data: audioData, error: audioError } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true })
        .eq('interaction_type', 'audio');
        
      if (audioError) throw audioError;
        
      const { data: textData, error: textError } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true })
        .eq('interaction_type', 'text');
        
      if (textError) throw textError;
      
      const typeCounts = {
        video: videoData?.length || 0,
        audio: audioData?.length || 0,
        text: textData?.length || 0
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
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const interactionsWithProfiles = await Promise.all((data || []).map(async (interaction) => {
        let helperProfile = { display_name: 'N/A', avatar_url: null };
        let seekerProfile = { display_name: 'N/A', avatar_url: null };
        
        if (interaction.helper_id) {
          const { data: helperData } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', interaction.helper_id)
            .single();
            
          if (helperData) {
            helperProfile = helperData;
          }
        }
        
        if (interaction.seeker_id) {
          const { data: seekerData } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', interaction.seeker_id)
            .single();
            
          if (seekerData) {
            seekerProfile = seekerData;
          }
        }
        
        return {
          ...interaction,
          helper: helperProfile,
          seeker: seekerProfile
        };
      }));
      
      return interactionsWithProfiles as (InteractionData & {
        helper: { display_name: string; avatar_url: string | null };
        seeker: { display_name: string; avatar_url: string | null };
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

  const totalItems = filteredInteractions?.length || 0;
  const totalPages = Math.ceil(totalItems / Number(pageSize));
  const paginatedInteractions = filteredInteractions?.slice(
    (currentPage - 1) * Number(pageSize),
    currentPage * Number(pageSize)
  );

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Phone className="h-4 w-4" />;
      case 'text':
        return <MessageSquare className="h-4 w-4" />;
      default:
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
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search consultations..." 
              className="pl-8 w-full sm:w-[250px]"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select value={pageSize} onValueChange={(value) => {
            setPageSize(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="10 rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 rows</SelectItem>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
              <SelectItem value="100">100 rows</SelectItem>
            </SelectContent>
          </Select>
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
            ) : paginatedInteractions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No consultations found
                </TableCell>
              </TableRow>
            ) : (
              paginatedInteractions?.map(interaction => (
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
        
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedInteractions?.length || 0} of {totalItems} results
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {pageNumbers.map((pageNum) => {
                const shouldShow = 
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  Math.abs(pageNum - currentPage) <= 1;
                
                if (!shouldShow) {
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return <PaginationEllipsis key={`ellipsis-${pageNum}`} />;
                  }
                  return null;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default AdminConsultationsPanel;
