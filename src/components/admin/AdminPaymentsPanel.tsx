
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Clock, CircleCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock payment data - in a real app, this would come from your database
const mockData = {
  stats: {
    totalRevenue: 12450.75,
    pendingPayouts: 3245.50,
    completedPayouts: 9205.25,
    transactionCount: 156
  },
  transactions: [
    {
      id: '1',
      type: 'payment',
      amount: 125.00,
      status: 'completed',
      user: 'John Doe',
      date: '2025-04-01T14:30:00Z',
      description: 'Video consultation (60 min)'
    },
    {
      id: '2',
      type: 'payout',
      amount: 112.50,
      status: 'pending',
      user: 'Jane Smith',
      date: '2025-04-02T10:15:00Z',
      description: 'Text consultation services'
    },
    {
      id: '3',
      type: 'payment',
      amount: 75.00,
      status: 'completed',
      user: 'Robert Johnson',
      date: '2025-04-03T16:45:00Z',
      description: 'Audio consultation (30 min)'
    },
    {
      id: '4',
      type: 'payout',
      amount: 67.50,
      status: 'completed',
      user: 'Jane Smith',
      date: '2025-04-01T09:20:00Z',
      description: 'Audio consultation services'
    },
    {
      id: '5',
      type: 'payment',
      amount: 150.00,
      status: 'completed',
      user: 'Alice Brown',
      date: '2025-04-04T11:10:00Z',
      description: 'Video consultation (90 min)'
    }
  ]
};

const AdminPaymentsPanel = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter transactions based on active tab
  const filteredTransactions = mockData.transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    if (activeTab === 'payments') return transaction.type === 'payment';
    if (activeTab === 'payouts') return transaction.type === 'payout';
    return true;
  });
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowUpCircle className="h-4 w-4 text-green-500" />;
      case 'payout':
        return <ArrowDownCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
      <div>
        <h2 className="text-2xl font-bold">Payments</h2>
        <p className="text-muted-foreground">Manage all payments and payouts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              <p className="text-3xl font-bold">{formatCurrency(mockData.stats.totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Payouts</CardTitle>
            <CardDescription>To be processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-500" />
              <p className="text-3xl font-bold">{formatCurrency(mockData.stats.pendingPayouts)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed Payouts</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CircleCheck className="h-5 w-5 mr-2 text-green-500" />
              <p className="text-3xl font-bold">{formatCurrency(mockData.stats.completedPayouts)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Total count</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockData.stats.transactionCount}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>
          
          <Button variant="outline">Process Payouts</Button>
        </div>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono">{transaction.id}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {getTypeIcon(transaction.type)}
                          <span className="capitalize">{transaction.type}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.status === 'completed' ? 'secondary' : 'secondary'}
                          className={`flex items-center gap-1 ${transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400' : ''}`}
                        >
                          {getStatusIcon(transaction.status)}
                          <span className="capitalize">{transaction.status}</span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPaymentsPanel;
