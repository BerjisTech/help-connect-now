
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

interface AdminSectionProps {
  isAdmin: boolean;
}

const AdminSection: React.FC<AdminSectionProps> = ({ isAdmin }) => {
  const navigate = useNavigate();

  if (!isAdmin) return null;

  return (
    <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100 dark:bg-purple-900/20 dark:border-purple-800/30">
      <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">Admin Controls</h3>
      <p className="text-sm text-purple-700 dark:text-purple-400 mb-3">You have admin privileges.</p>
      <Button 
        variant="outline" 
        className="bg-white dark:bg-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-800/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700"
        onClick={() => navigate('/admin')}
      >
        <ShieldAlert className="mr-2 h-4 w-4" />
        Go to Admin Dashboard
      </Button>
    </div>
  );
};

export default AdminSection;
