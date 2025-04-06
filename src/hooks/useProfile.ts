
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  is_admin?: boolean;
};
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type Availability = Database['public']['Enums']['availability_status'];

export const useProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [industry, setIndustry] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [isConsultant, setIsConsultant] = useState(false);
  const [hourlyRate, setHourlyRate] = useState('');
  const [availability, setAvailability] = useState<Availability>('offline');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      fetchProfile(user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/auth');
    }
  };

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setProfile(data);
        
        // Initialize form with profile data
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setDisplayName(data.display_name || '');
        setBio(data.bio || '');
        setIndustry(data.industry || '');
        setExpertise(data.expertise || []);
        setIsAdmin(data.is_admin || false);
        
        // Check if user exists in consultants table
        const { data: consultantData } = await supabase
          .from('consultants')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        setIsConsultant(!!consultantData);
        setHourlyRate(consultantData?.hourly_rate?.toString() || '');
        setAvailability(data.availability || 'offline');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpertise = () => {
    if (!expertiseInput.trim()) return;
    
    if (!expertise.includes(expertiseInput.trim())) {
      setExpertise([...expertise, expertiseInput.trim()]);
    }
    
    setExpertiseInput('');
  };

  const handleRemoveExpertise = (index: number) => {
    setExpertise(expertise.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      // Update profile in profiles table
      const updates: ProfileUpdate = {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        display_name: displayName || 'User',
        bio,
        industry,
        expertise,
        availability,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }

      // Handle consultant status
      if (isConsultant) {
        // Upsert to consultants table
        const { error: consultantError } = await supabase
          .from('consultants')
          .upsert({
            id: user.id,
            display_name: displayName || 'User',
            avatar_url: profile?.avatar_url,
            bio,
            industry,
            expertise,
            hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
            availability
          });
          
        if (consultantError) {
          throw consultantError;
        }
      } else {
        // Check if entry exists in consultants table and remove if needed
        const { data: existingConsultant } = await supabase
          .from('consultants')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
          
        if (existingConsultant) {
          const { error: deleteError } = await supabase
            .from('consultants')
            .delete()
            .eq('id', user.id);
            
          if (deleteError) {
            throw deleteError;
          }
        }
      }
      
      toast.success('Profile updated successfully');
      fetchProfile(user.id); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return {
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
    setExpertise,
    setIsConsultant,
    setHourlyRate,
    setAvailability,
    handleAddExpertise,
    handleRemoveExpertise,
    handleSaveProfile
  };
};
