
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UserCog, Search, UserPlus, Activity, ShieldAlert } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Mock staff data - in a real app, this would come from your database
const mockData = {
  staff: [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@helpconnectnow.com',
      role: 'admin',
      department: 'Management',
      status: 'active',
      avatar: null,
      lastActive: '2025-04-07T09:30:00Z'
    },
    {
      id: '2',
      name: 'Emily Johnson',
      email: 'emily@helpconnectnow.com',
      role: 'moderator',
      department: 'Support',
      status: 'active',
      avatar: null,
      lastActive: '2025-04-07T10:15:00Z'
    },
    {
      id: '3',
      name: 'Michael Davis',
      email: 'michael@helpconnectnow.com',
      role: 'support',
      department: 'Support',
      status: 'active',
      avatar: null,
      lastActive: '2025-04-06T16:45:00Z'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@helpconnectnow.com',
      role: 'admin',
      department: 'Technology',
      status: 'inactive',
      avatar: null,
      lastActive: '2025-04-01T14:20:00Z'
    },
    {
      id: '5',
      name: 'Robert Brown',
      email: 'robert@helpconnectnow.com',
      role: 'moderator',
      department: 'Support',
      status: 'active',
      avatar: null,
      lastActive: '2025-04-07T08:10:00Z'
    }
  ]
};

const AdminStaffPanel = () => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'support',
    department: 'Support'
  });
  
  const handleInviteStaff = () => {
    // In a real app, this would send an invitation and create a staff record
    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${inviteData.email}`
    });
    setInviteDialogOpen(false);
  };
  
  const filteredStaff = mockData.staff.filter(staff => 
    staff.name.toLowerCase().includes(search.toLowerCase()) ||
    staff.email.toLowerCase().includes(search.toLowerCase()) ||
    staff.department.toLowerCase().includes(search.toLowerCase())
  );
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300">
            Admin
          </Badge>
        );
      case 'moderator':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
            Moderator
          </Badge>
        );
      case 'support':
        return (
          <Badge variant="outline">
            Support
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
            Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="text-muted-foreground">Manage staff members and permissions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search staff..." 
              className="pl-8 w-full sm:w-[250px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Staff
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
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
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No staff members found
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map(staff => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={staff.avatar || ''} />
                        <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-sm text-muted-foreground">{staff.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(staff.role)}</TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{getStatusBadge(staff.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3 text-muted-foreground" />
                      <span>{formatDate(staff.lastActive)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <UserCog className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Invite Staff Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Staff Member</DialogTitle>
            <DialogDescription>
              Send an invitation to a new staff member. They will receive an email with instructions to join.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="staff@example.com"
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={inviteData.role === 'admin' ? 'default' : 'outline'}
                  onClick={() => setInviteData({ ...inviteData, role: 'admin' })}
                >
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  Admin
                </Button>
                <Button
                  type="button"
                  variant={inviteData.role === 'moderator' ? 'default' : 'outline'}
                  onClick={() => setInviteData({ ...inviteData, role: 'moderator' })}
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Moderator
                </Button>
                <Button
                  type="button"
                  variant={inviteData.role === 'support' ? 'default' : 'outline'}
                  onClick={() => setInviteData({ ...inviteData, role: 'support' })}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Support
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g. Support, Technology, Management"
                value={inviteData.department}
                onChange={(e) => setInviteData({ ...inviteData, department: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteStaff}>
              <UserPlus className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStaffPanel;
