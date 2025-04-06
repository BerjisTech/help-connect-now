
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  is_admin?: boolean;
};

interface ProfileCardProps {
  profile: Profile | null;
  displayName: string;
  isConsultant: boolean;
  isAdmin: boolean;
  saving: boolean;
  onSave: () => void;
  children: React.ReactNode;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  displayName,
  isConsultant,
  isAdmin,
  saving,
  onSave,
  children
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback className="bg-primary text-white text-xl">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">
              {displayName || 'New User'}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              {isConsultant && <span className="text-green-600 font-medium">Consultant</span>}
              {isAdmin && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">Admin</span>}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {children}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onSave} 
          disabled={saving}
          className="ml-auto"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
