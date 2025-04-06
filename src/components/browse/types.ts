
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface Consultant {
  id: number | string;
  name: string;
  industry: string;
  rating: number;
  image: string;
  expertise: string[];
  availability?: string;
  allowAnonymous?: boolean;
}
