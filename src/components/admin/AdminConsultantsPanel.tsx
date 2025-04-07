import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Edit, Trash2, Check, X, Shield, UserPlus
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { ConsultantData } from '@/components/interaction/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

const AdminConsultantsPanel = () => {
  const [search, setSearch] = useState('');
  const [consultantToEdit, setConsultantToEdit] = useState<ConsultantData | null>(null);
  const [consultantToDelete, setConsultantToDelete] = useState<ConsultantData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [deleteOrphansInProgress, setDeleteOrphansInProgress] = useState(false);
  
  const { data: consultants, isLoading, refetch } = useQuery({
    queryKey: ['adminConsultants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as ConsultantData[];
    }
  });
  
  const syncProfileAvatars = async () => {
    setSyncInProgress(true);
    try {
      const { data, error } = await supabase.rpc('sync_profile_avatars_to_consultants', {});
      
      if (error) throw error;
      
      toast({
        title: 'Avatar Sync Complete',
        description: 'Profile avatars have been synchronized to consultants.'
      });
      
      refetch();
    } catch (error) {
      console.error('Error syncing avatars:', error);
      toast({
        title: 'Error',
        description: 'Failed to sync profile avatars.',
        variant: 'destructive'
      });
    } finally {
      setSyncInProgress(false);
    }
  };
  
  const deleteOrphanedConsultants = async () => {
    setDeleteOrphansInProgress(true);
    try {
      const { data, error } = await supabase.rpc('delete_orphaned_consultants', {});
      
      if (error) throw error;
      
      toast({
        title: 'Cleanup Complete',
        description: `${data} orphaned consultants have been removed.`
      });
      
      refetch();
    } catch (error) {
      console.error('Error cleaning up consultants:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove orphaned consultants.',
        variant: 'destructive'
      });
    } finally {
      setDeleteOrphansInProgress(false);
    }
  };
  
  const handleDeleteConsultant = async () => {
    if (!consultantToDelete) return;
    
    try {
      const { error } = await supabase
        .from('consultants')
        .delete()
        .eq('id', consultantToDelete.id);
        
      if (error) throw error;
      
      toast({
        title: 'Consultant Deleted',
        description: `${consultantToDelete.display_name} has been removed from consultants.`
      });
      
      refetch();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting consultant:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete consultant.',
        variant: 'destructive'
      });
    }
  };
  
  const filteredConsultants = consultants?.filter(consultant => 
    consultant.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    consultant.industry?.toLowerCase().includes(search.toLowerCase())
  );
  
  const getInitials = (displayName: string) => {
    return displayName.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Consultant Management</h2>
          <p className="text-muted-foreground">Manage consultant profiles and data</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search consultants..." 
            className="pl-8 w-full sm:w-[250px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={syncProfileAvatars}
          disabled={syncInProgress}
        >
          {syncInProgress ? (
            <>
              <Skeleton className="h-4 w-4 rounded-full mr-2" />
              Syncing...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Sync Profile Avatars
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={deleteOrphanedConsultants}
          disabled={deleteOrphansInProgress}
        >
          {deleteOrphansInProgress ? (
            <>
              <Skeleton className="h-4 w-4 rounded-full mr-2" />
              Cleaning...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Orphaned Consultants
            </>
          )}
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Consultant</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Expertise</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredConsultants?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No consultants found
                </TableCell>
              </TableRow>
            ) : (
              filteredConsultants?.map(consultant => (
                <TableRow key={consultant.id.toString()}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={consultant.avatar_url || ''} />
                        <AvatarFallback>{getInitials(consultant.display_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{consultant.display_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${consultant.hourly_rate ? consultant.hourly_rate.toFixed(2) : '0.00'}/hr
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {consultant.industry || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {consultant.expertise && consultant.expertise.length > 0 ? (
                        <>
                          {consultant.expertise.slice(0, 2).map((exp, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                          {consultant.expertise.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{consultant.expertise.length - 2} more
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground text-xs">No expertise listed</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        consultant.availability === 'available' ? 'default' : 
                        consultant.availability === 'busy' ? 'secondary' : 'outline'
                      }
                    >
                      {consultant.availability || 'Offline'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setConsultantToDelete(consultant);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Consultant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {consultantToDelete?.display_name} from the consultants list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConsultant}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminConsultantsPanel;
