
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
import { Camera, Loader2 } from 'lucide-react';

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
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingAvatar: boolean;
  children: React.ReactNode;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  displayName,
  isConsultant,
  isAdmin,
  saving,
  onSave,
  onAvatarChange,
  uploadingAvatar,
  children
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-primary text-white text-xl">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <label 
              htmlFor="avatar-upload" 
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
            >
              {uploadingAvatar ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </label>
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={onAvatarChange}
              disabled={uploadingAvatar}
            />
          </div>
          
          <div>
            <CardTitle className="text-xl">
              {displayName || 'New User'}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              {isConsultant && <span className="text-green-600 font-medium dark:text-green-400">Consultant</span>}
              {isAdmin && <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-0.5 rounded-full">Admin</span>}
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
          disabled={saving || uploadingAvatar}
          className="ml-auto"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
