
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

export interface ConsultantData {
  id: string | number;
  name: string;
  display_name: string;
  industry: string;
  expertise: string[];
  rating: number;
  avatar_url: string;
  bio?: string;
  availability?: string;
  hourly_rate?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MessageData {
  id: string;
  content: string;
  created_at: string;
  interaction_id: string;
  sender_id?: string;
  anonymous_sender_id?: string;
  is_system_message?: boolean;
  requires_attention?: boolean;
}
