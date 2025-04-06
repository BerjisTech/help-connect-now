
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
  id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  industry?: string;
  expertise?: string[];
}

export interface MessageData {
  id: string;
  created_at: string;
  content: string;
  interaction_id: string;
  sender_id?: string;
  anonymous_sender_id?: string;
}
