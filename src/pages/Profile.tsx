
import React from 'react';
import Layout from '@/components/Layout';
import { ThemeToggle } from '@/components/ThemeToggle';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileBasicInfo from '@/components/profile/ProfileBasicInfo';
import ExpertiseSection from '@/components/profile/ExpertiseSection';
import ConsultantSection from '@/components/profile/ConsultantSection';
import AdminSection from '@/components/profile/AdminSection';
import ThemeSettings from '@/components/profile/ThemeSettings';
import { useProfile } from '@/hooks/useProfile';

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
    handleSaveProfile
  } = useProfile();

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
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          
          <ProfileCard
            profile={profile}
            displayName={displayName}
            isConsultant={isConsultant}
            isAdmin={isAdmin}
            saving={saving}
            onSave={handleSaveProfile}
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
