
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminUsersPanel from '@/components/admin/AdminUsersPanel';
import AdminConsultationsPanel from '@/components/admin/AdminConsultationsPanel';
import AdminPaymentsPanel from '@/components/admin/AdminPaymentsPanel';
import AdminReportsPanel from '@/components/admin/AdminReportsPanel';
import AdminSiteNoticesPanel from '@/components/admin/AdminSiteNoticesPanel';
import AdminStaffPanel from '@/components/admin/AdminStaffPanel';
import AdminConsultantsPanel from '@/components/admin/AdminConsultantsPanel';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });
  
  // Redirect if not admin
  if (!isLoading && !error && profile && !profile.is_admin) {
    navigate('/dashboard');
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <ShieldAlert className="w-16 h-16 text-destructive" />
        <h1 className="text-2xl font-bold">Admin Access Required</h1>
        <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, consultations, and site settings</p>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="consultants">Consultants</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notices">Site Notices</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <AdminUsersPanel />
        </TabsContent>
        
        <TabsContent value="consultants" className="space-y-4">
          <AdminConsultantsPanel />
        </TabsContent>
        
        <TabsContent value="consultations" className="space-y-4">
          <AdminConsultationsPanel />
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <AdminPaymentsPanel />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <AdminReportsPanel />
        </TabsContent>
        
        <TabsContent value="notices" className="space-y-4">
          <AdminSiteNoticesPanel />
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-4">
          <AdminStaffPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
