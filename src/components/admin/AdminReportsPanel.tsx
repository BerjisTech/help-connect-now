
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Flag, ShieldAlert, CheckCircle, AlertCircle, Clock, 
  UserX, MessageSquare, View
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

// Mock report data - in a real app, this would come from your database
const mockData = {
  stats: {
    totalReports: 48,
    open: 12,
    resolved: 36,
    userViolations: 26,
    contentViolations: 22
  },
  reports: [
    {
      id: '1',
      type: 'user',
      reportedUser: {
        id: 'user1',
        name: 'John Doe',
        avatar: null,
      },
      reportedBy: {
        id: 'user2',
        name: 'Jane Smith',
        avatar: null,
      },
      reason: 'Inappropriate behavior during consultation',
      status: 'open',
      date: '2025-04-02T15:30:00Z',
      details: 'User was extremely rude and used offensive language during our video consultation.'
    },
    {
      id: '2',
      type: 'content',
      reportedUser: {
        id: 'user3',
        name: 'Robert Johnson',
        avatar: null,
      },
      reportedBy: {
        id: 'user4',
        name: 'Alice Brown',
        avatar: null,
      },
      reason: 'Misleading information in profile',
      status: 'resolved',
      date: '2025-04-01T10:15:00Z',
      details: 'Consultant claims to be a certified therapist but does not have proper credentials.'
    },
    {
      id: '3',
      type: 'user',
      reportedUser: {
        id: 'user5',
        name: 'Michael Williams',
        avatar: null,
      },
      reportedBy: {
        id: 'user6',
        name: 'Emily Davis',
        avatar: null,
      },
      reason: 'Harassment',
      status: 'open',
      date: '2025-04-03T09:45:00Z',
      details: 'User has been sending inappropriate messages after our consultation ended.'
    },
    {
      id: '4',
      type: 'content',
      reportedUser: {
        id: 'user7',
        name: 'Sarah Wilson',
        avatar: null,
      },
      reportedBy: {
        id: 'user8',
        name: 'David Miller',
        avatar: null,
      },
      reason: 'False advertising',
      status: 'resolved',
      date: '2025-03-30T14:20:00Z',
      details: 'Consultant lists expertise in areas they have no experience in.'
    },
    {
      id: '5',
      type: 'user',
      reportedUser: {
        id: 'user9',
        name: 'Thomas Anderson',
        avatar: null,
      },
      reportedBy: {
        id: 'user10',
        name: 'Lisa Taylor',
        avatar: null,
      },
      reason: 'No-show for scheduled consultation',
      status: 'resolved',
      date: '2025-04-01T16:00:00Z',
      details: 'Consultant did not show up for scheduled consultation and did not provide notice.'
    }
  ]
};

const AdminReportsPanel = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Filter reports based on active tab
  const filteredReports = mockData.reports.filter(report => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return report.status === 'open';
    if (activeTab === 'resolved') return report.status === 'resolved';
    if (activeTab === 'user') return report.type === 'user';
    if (activeTab === 'content') return report.type === 'content';
    return true;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Open</span>
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Resolved</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <UserX className="h-4 w-4 text-destructive" />;
      case 'content':
        return <MessageSquare className="h-4 w-4 text-amber-500" />;
      default:
        return null;
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
  
  const handleViewDetails = (report: any) => {
    setSelectedReport(report);
    setDetailsDialogOpen(true);
  };
  
  const handleResolveReport = (reportId: string) => {
    // In a real app, this would update the database
    console.log(`Resolving report ${reportId}`);
    setDetailsDialogOpen(false);
  };
  
  const handleBanUser = (userId: string) => {
    // In a real app, this would update the database
    console.log(`Banning user ${userId}`);
    setDetailsDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reports</h2>
        <p className="text-muted-foreground">Manage all reported users and content</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total</CardTitle>
            <CardDescription>All reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Flag className="h-5 w-5 mr-2 text-muted-foreground" />
              <p className="text-3xl font-bold">{mockData.stats.totalReports}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Open</CardTitle>
            <CardDescription>Pending review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
              <p className="text-3xl font-bold">{mockData.stats.open}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resolved</CardTitle>
            <CardDescription>Completed reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <p className="text-3xl font-bold">{mockData.stats.resolved}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>User Reports</CardTitle>
            <CardDescription>Behavior violations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserX className="h-5 w-5 mr-2 text-destructive" />
              <p className="text-3xl font-bold">{mockData.stats.userViolations}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Content Reports</CardTitle>
            <CardDescription>Information violations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-amber-500" />
              <p className="text-3xl font-bold">{mockData.stats.contentViolations}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="user">User Reports</TabsTrigger>
          <TabsTrigger value="content">Content Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reported User</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map(report => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono">{report.id}</TableCell>
                      <TableCell>
                        <Badge
                          variant={report.type === 'user' ? 'destructive' : 'secondary'}
                          className="flex items-center gap-1"
                        >
                          {getTypeIcon(report.type)}
                          <span className="capitalize">{report.type}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={report.reportedUser.avatar || ''} />
                            <AvatarFallback>
                              {report.reportedUser.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{report.reportedUser.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {report.reason}
                      </TableCell>
                      <TableCell>{formatDate(report.date)}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(report)}
                        >
                          <View className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Report Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Report #{selectedReport?.id} - {formatDate(selectedReport?.date || '')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Type</h4>
                <Badge
                  variant={selectedReport.type === 'user' ? 'destructive' : 'secondary'}
                  className="flex items-center gap-1 w-fit"
                >
                  {getTypeIcon(selectedReport.type)}
                  <span className="capitalize">{selectedReport.type}</span>
                </Badge>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Status</h4>
                {getStatusBadge(selectedReport.status)}
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Reported User</h4>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={selectedReport.reportedUser.avatar || ''} />
                    <AvatarFallback>
                      {selectedReport.reportedUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedReport.reportedUser.name}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Reported By</h4>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={selectedReport.reportedBy.avatar || ''} />
                    <AvatarFallback>
                      {selectedReport.reportedBy.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedReport.reportedBy.name}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Reason</h4>
                <p className="text-sm">{selectedReport.reason}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Details</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedReport.details}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedReport?.status === 'open' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handleResolveReport(selectedReport?.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Resolved
                </Button>
                
                <Button 
                  variant="destructive" 
                  onClick={() => handleBanUser(selectedReport?.reportedUser.id)}
                >
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  Ban User
                </Button>
              </>
            )}
            
            {selectedReport?.status === 'resolved' && (
              <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReportsPanel;
