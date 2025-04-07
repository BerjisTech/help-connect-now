
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
  Ban, CheckCircle, Search, Shield, ShieldAlert, User, UserCog 
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Profile } from '@/components/browse/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const AdminUsersPanel = () => {
  const [search, setSearch] = useState('');
  const [userToModify, setUserToModify] = useState<Profile | null>(null);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Profile[];
    }
  });
  
  const handleToggleBan = async (banned: boolean) => {
    if (!userToModify) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: banned })
        .eq('id', userToModify.id);
        
      if (error) throw error;
      
      toast({
        title: banned ? 'User banned' : 'User unbanned',
        description: `${userToModify.display_name} has been ${banned ? 'banned' : 'unbanned'} from the platform.`
      });
      
      refetch();
      setBanDialogOpen(false);
    } catch (error) {
      console.error('Error toggling ban status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user ban status.',
        variant: 'destructive'
      });
    }
  };
  
  const handleToggleAdmin = async (isAdmin: boolean) => {
    if (!userToModify) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: isAdmin })
        .eq('id', userToModify.id);
        
      if (error) throw error;
      
      toast({
        title: isAdmin ? 'Admin rights granted' : 'Admin rights revoked',
        description: `${userToModify.display_name} is ${isAdmin ? 'now' : 'no longer'} an admin.`
      });
      
      refetch();
      setAdminDialogOpen(false);
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update admin status.',
        variant: 'destructive'
      });
    }
  };
  
  const filteredUsers = users?.filter(user => 
    user.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(search.toLowerCase())
  );
  
  const getInitials = (profile: Profile) => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return profile.display_name.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-8 w-full sm:w-[250px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
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
            ) : filteredUsers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback>{getInitials(user)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.display_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.first_name} {user.last_name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.user_type === 'helper' ? 'default' : 'outline'}>
                      {user.user_type === 'helper' ? 'Consultant' : 'Seeker'}
                    </Badge>
                    {user.is_admin && (
                      <Badge variant="secondary" className="ml-2">
                        Admin
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.is_banned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge variant="success">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Dialog open={modifyDialogOpen} onOpenChange={setModifyDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setUserToModify(user)}
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modify User</DialogTitle>
                          <DialogDescription>
                            Manage user {userToModify?.display_name}'s account settings.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={userToModify?.avatar_url || ''} />
                              <AvatarFallback>{userToModify ? getInitials(userToModify) : 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-lg">{userToModify?.display_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {userToModify?.user_type === 'helper' ? 'Consultant' : 'Seeker'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">Ban Status</h4>
                                <p className="text-sm text-muted-foreground">
                                  {userToModify?.is_banned 
                                    ? 'User is currently banned' 
                                    : 'User is currently active'}
                                </p>
                              </div>
                              <Button 
                                variant={userToModify?.is_banned ? "outline" : "destructive"} 
                                onClick={() => {
                                  setModifyDialogOpen(false);
                                  setBanDialogOpen(true);
                                }}
                              >
                                {userToModify?.is_banned ? (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Unban User
                                  </>
                                ) : (
                                  <>
                                    <Ban className="mr-2 h-4 w-4" />
                                    Ban User
                                  </>
                                )}
                              </Button>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">Admin Status</h4>
                                <p className="text-sm text-muted-foreground">
                                  {userToModify?.is_admin 
                                    ? 'User has admin privileges' 
                                    : 'User has standard privileges'}
                                </p>
                              </div>
                              <Button 
                                variant={userToModify?.is_admin ? "destructive" : "outline"} 
                                onClick={() => {
                                  setModifyDialogOpen(false);
                                  setAdminDialogOpen(true);
                                }}
                              >
                                {userToModify?.is_admin ? (
                                  <>
                                    <ShieldAlert className="mr-2 h-4 w-4" />
                                    Remove Admin
                                  </>
                                ) : (
                                  <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Make Admin
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setModifyDialogOpen(false)}>
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {userToModify?.is_banned ? 'Unban User' : 'Ban User'}
                          </DialogTitle>
                          <DialogDescription>
                            {userToModify?.is_banned 
                              ? 'Are you sure you want to unban this user?' 
                              : 'Are you sure you want to ban this user?'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            variant={userToModify?.is_banned ? "default" : "destructive"} 
                            onClick={() => handleToggleBan(!userToModify?.is_banned)}
                          >
                            {userToModify?.is_banned ? 'Unban User' : 'Ban User'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {userToModify?.is_admin ? 'Remove Admin Rights' : 'Grant Admin Rights'}
                          </DialogTitle>
                          <DialogDescription>
                            {userToModify?.is_admin 
                              ? 'Are you sure you want to remove admin privileges from this user?' 
                              : 'Are you sure you want to grant admin privileges to this user?'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setAdminDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            variant={userToModify?.is_admin ? "destructive" : "default"} 
                            onClick={() => handleToggleAdmin(!userToModify?.is_admin)}
                          >
                            {userToModify?.is_admin ? 'Remove Admin' : 'Make Admin'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsersPanel;
