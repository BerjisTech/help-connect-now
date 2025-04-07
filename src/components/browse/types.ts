
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  is_banned?: boolean; // Add the missing property used in AdminUsersPanel
};

export interface InteractionData {
  id: string;
  created_at: string;
  status: string;
  interaction_type: 'video' | 'audio' | 'text';
  description: string;
  metadata: any;
  seeker_id?: string;
  helper_id?: string;
  anonymous_seeker_id?: string;
  ended_at?: string;
  is_active?: boolean;
  updated_at?: string;
}

// Update the Consultant type definition to match the database structure
// and include the 'name' property needed by the components
export type Consultant = Database['public']['Tables']['consultants']['Row'] & {
  name: string; // Add the name property required by ConsultantData
};

