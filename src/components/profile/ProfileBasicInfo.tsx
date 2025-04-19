
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProfileBasicInfoProps {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  industry: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setDisplayName: (value: string) => void;
  setBio: (value: string) => void;
  setIndustry: (value: string) => void;
}

const ProfileBasicInfo: React.FC<ProfileBasicInfoProps> = ({
  firstName,
  lastName,
  displayName,
  bio,
  industry,
  setFirstName,
  setLastName,
  setDisplayName,
  setBio,
  setIndustry
}) => {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4 dark:text-gray-300">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2 dark:text-gray-300">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={displayName}
            className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2 dark:text-gray-300">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell others about yourself..."
          className="resize-none h-24 w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      
      <div className="space-y-2 dark:text-gray-300">
        <Label htmlFor="industry">Industry</Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger id="industry">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unspecified">None</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Legal">Legal</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ProfileBasicInfo;
