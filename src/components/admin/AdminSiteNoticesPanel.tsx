
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar, Info, AlertTriangle, BellRing, Plus, Pencil, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Mock notice data - in a real app, this would come from your database
const mockData = {
  notices: [
    {
      id: '1',
      type: 'announcement',
      title: 'Platform Maintenance',
      message: 'The platform will be under maintenance on April 15, 2025, from 2:00 AM to 4:00 AM UTC. Services may be unavailable during this time.',
      active: true,
      expiresAt: '2025-04-16T04:00:00Z',
      createdAt: '2025-04-07T10:00:00Z'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Security Update Required',
      message: 'All users must update their passwords by April 30, 2025, as part of our security enhancement initiative.',
      active: true,
      expiresAt: '2025-04-30T23:59:59Z',
      createdAt: '2025-04-05T15:30:00Z'
    },
    {
      id: '3',
      type: 'info',
      title: 'New Feature: Video Consultations',
      message: 'We are excited to announce that video consultations are now available for all users. Check out the new feature in your dashboard.',
      active: true,
      expiresAt: '2025-05-15T23:59:59Z',
      createdAt: '2025-04-01T12:45:00Z'
    },
    {
      id: '4',
      type: 'announcement',
      title: 'Holiday Operating Hours',
      message: 'Our support team will have limited availability during the upcoming holiday weekend (April 19-21, 2025).',
      active: false,
      expiresAt: '2025-04-22T00:00:00Z',
      createdAt: '2025-04-02T09:15:00Z'
    },
    {
      id: '5',
      type: 'warning',
      title: 'Payment System Update',
      message: 'The payment system will be unavailable for 2 hours on April 12, 2025, from 10:00 PM to 12:00 AM UTC.',
      active: false,
      expiresAt: '2025-04-13T00:00:00Z',
      createdAt: '2025-04-06T14:20:00Z'
    }
  ]
};

const AdminSiteNoticesPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    active: true,
    expiresAt: ''
  });
  
  const handleCreateNotice = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      active: true,
      expiresAt: ''
    });
    setCreateDialogOpen(true);
  };
  
  const handleEditNotice = (notice: any) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      message: notice.message,
      type: notice.type,
      active: notice.active,
      expiresAt: new Date(notice.expiresAt).toISOString().split('T')[0]
    });
    setEditDialogOpen(true);
  };
  
  const handleDeleteNotice = (notice: any) => {
    setSelectedNotice(notice);
    setDeleteDialogOpen(true);
  };
  
  const handleSubmitCreate = () => {
    // In a real app, this would add the notice to the database
    toast({
      title: "Notice Created",
      description: "The site notice has been created successfully."
    });
    setCreateDialogOpen(false);
  };
  
  const handleSubmitEdit = () => {
    // In a real app, this would update the notice in the database
    toast({
      title: "Notice Updated",
      description: "The site notice has been updated successfully."
    });
    setEditDialogOpen(false);
  };
  
  const handleConfirmDelete = () => {
    // In a real app, this would delete the notice from the database
    toast({
      title: "Notice Deleted",
      description: "The site notice has been deleted successfully."
    });
    setDeleteDialogOpen(false);
  };
  
  const handleToggleActive = (id: string, currentActive: boolean) => {
    // In a real app, this would update the notice in the database
    toast({
      title: currentActive ? "Notice Deactivated" : "Notice Activated",
      description: `The site notice has been ${currentActive ? 'deactivated' : 'activated'} successfully.`
    });
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'announcement':
        return <BellRing className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };
  
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'info':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Info className="h-3 w-3" />
            <span>Info</span>
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle className="h-3 w-3" />
            <span>Warning</span>
          </Badge>
        );
      case 'announcement':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
            <BellRing className="h-3 w-3" />
            <span>Announcement</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Site Notices</h2>
          <p className="text-muted-foreground">Manage announcements and notifications for users</p>
        </div>
        <Button onClick={handleCreateNotice}>
          <Plus className="h-4 w-4 mr-2" />
          Create Notice
        </Button>
      </div>
      
      {/* Preview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/50 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Info Notice
              </CardTitle>
              <Badge variant="outline" className="border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400">Preview</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="font-medium mb-2">Example Information Notice</p>
            <p className="text-sm text-muted-foreground">This is how information notices appear to users on the platform.</p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="bg-amber-50 dark:bg-amber-950/50 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Warning Notice
              </CardTitle>
              <Badge variant="outline" className="border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400">Preview</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="font-medium mb-2">Example Warning Notice</p>
            <p className="text-sm text-muted-foreground">This is how warning notices appear to users on the platform.</p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-purple-50 dark:bg-purple-950/50 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-purple-700 dark:text-purple-300 flex items-center gap-2">
                <BellRing className="h-5 w-5" />
                Announcement
              </CardTitle>
              <Badge variant="outline" className="border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400">Preview</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="font-medium mb-2">Example Announcement</p>
            <p className="text-sm text-muted-foreground">This is how announcements appear to users on the platform.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-52" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : mockData.notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No notices found
                </TableCell>
              </TableRow>
            ) : (
              mockData.notices.map(notice => (
                <TableRow key={notice.id}>
                  <TableCell>{getTypeBadge(notice.type)}</TableCell>
                  <TableCell className="font-medium">{notice.title}</TableCell>
                  <TableCell>{formatDate(notice.expiresAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={notice.active}
                        onCheckedChange={() => handleToggleActive(notice.id, notice.active)}
                      />
                      <span className="text-sm">
                        {notice.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(notice.createdAt)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditNotice(notice)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteNotice(notice)}
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
      
      {/* Create Notice Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Site Notice</DialogTitle>
            <DialogDescription>
              Create a new notice to be displayed to users across the platform.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter notice title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter notice message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={formData.type === 'info' ? 'default' : 'outline'}
                  className={formData.type === 'info' ? '' : 'border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/50'}
                  onClick={() => setFormData({ ...formData, type: 'info' })}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Info
                </Button>
                <Button
                  type="button"
                  variant={formData.type === 'warning' ? 'default' : 'outline'}
                  className={formData.type === 'warning' ? '' : 'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/50'}
                  onClick={() => setFormData({ ...formData, type: 'warning' })}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Warning
                </Button>
                <Button
                  type="button"
                  variant={formData.type === 'announcement' ? 'default' : 'outline'}
                  className={formData.type === 'announcement' ? '' : 'border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950/50'}
                  onClick={() => setFormData({ ...formData, type: 'announcement' })}
                >
                  <BellRing className="h-4 w-4 mr-2" />
                  Announcement
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expires">Expiration Date</Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  id="expires"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCreate}>
              Create Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Notice Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Site Notice</DialogTitle>
            <DialogDescription>
              Update the selected notice.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter notice title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter notice message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={formData.type === 'info' ? 'default' : 'outline'}
                  className={formData.type === 'info' ? '' : 'border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/50'}
                  onClick={() => setFormData({ ...formData, type: 'info' })}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Info
                </Button>
                <Button
                  type="button"
                  variant={formData.type === 'warning' ? 'default' : 'outline'}
                  className={formData.type === 'warning' ? '' : 'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/50'}
                  onClick={() => setFormData({ ...formData, type: 'warning' })}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Warning
                </Button>
                <Button
                  type="button"
                  variant={formData.type === 'announcement' ? 'default' : 'outline'}
                  className={formData.type === 'announcement' ? '' : 'border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950/50'}
                  onClick={() => setFormData({ ...formData, type: 'announcement' })}
                >
                  <BellRing className="h-4 w-4 mr-2" />
                  Announcement
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expires">Expiration Date</Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  id="expires"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit}>
              Update Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Notice Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Notice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this notice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotice && (
            <div className="py-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {selectedNotice.title}
                    </CardTitle>
                    {getTypeBadge(selectedNotice.type)}
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground">{selectedNotice.message}</p>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-muted-foreground">
                  {`Expires: ${formatDate(selectedNotice.expiresAt)}`}
                </CardFooter>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSiteNoticesPanel;
