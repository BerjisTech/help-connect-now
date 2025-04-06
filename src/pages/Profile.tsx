
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileBasicInfo from '@/components/profile/ProfileBasicInfo';
import ExpertiseSection from '@/components/profile/ExpertiseSection';
import ConsultantSection from '@/components/profile/ConsultantSection';
import AdminSection from '@/components/profile/AdminSection';
import ThemeSettings from '@/components/profile/ThemeSettings';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const {
    profile,
    loading,
    saving,
    firstName,
    lastName,
    displayName,
    bio,
    industry,
    expertiseInput,
    expertise,
    isConsultant,
    hourlyRate,
    availability,
    isAdmin,
    setFirstName,
    setLastName,
    setDisplayName,
    setBio,
    setIndustry,
    setExpertiseInput,
    setIsConsultant,
    setHourlyRate,
    setAvailability,
    handleAddExpertise,
    handleRemoveExpertise,
    handleSaveProfile,
    updateAvatarUrl
  } = useProfile();

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload a profile picture');
        return;
      }
      
      // Create a path that includes the user ID as a folder
      const filePath = `${user.id}/${user.id}.${fileExt}`;
      
      setUploadingAvatar(true);
      
      // Upload the image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update the avatar_url in the profile
      if (publicUrl) {
        updateAvatarUrl(publicUrl);
        toast.success('Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">Your Profile</h1>
          
          <ProfileCard
            profile={profile}
            displayName={displayName}
            isConsultant={isConsultant}
            isAdmin={isAdmin}
            saving={saving}
            onSave={handleSaveProfile}
            onAvatarChange={handleAvatarChange}
            uploadingAvatar={uploadingAvatar}
          >
            <ProfileBasicInfo
              firstName={firstName}
              lastName={lastName}
              displayName={displayName}
              bio={bio}
              industry={industry}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setDisplayName={setDisplayName}
              setBio={setBio}
              setIndustry={setIndustry}
            />
            
            <ExpertiseSection
              expertise={expertise}
              expertiseInput={expertiseInput}
              setExpertiseInput={setExpertiseInput}
              onAddExpertise={handleAddExpertise}
              onRemoveExpertise={handleRemoveExpertise}
            />
            
            <ConsultantSection
              isConsultant={isConsultant}
              hourlyRate={hourlyRate}
              availability={availability}
              setIsConsultant={setIsConsultant}
              setHourlyRate={setHourlyRate}
              setAvailability={setAvailability}
            />
            
            <AdminSection isAdmin={isAdmin} />
            
            <ThemeSettings />
          </ProfileCard>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
