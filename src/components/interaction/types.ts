
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
  bio?: string;
  expertise?: string[];
  industry: string;
  rating: number;
  avatar_url: string;
  availability?: string;
  allowAnonymous?: boolean;
}

export interface MessageData {
  id: string;
  created_at: string;
  content: string;
  interaction_id: string;
  sender_id?: string;
  anonymous_sender_id?: string;
}

export interface ProfileConfig {
  // Hero section configuration
  heroConfig: {
    backgroundImage?: string;
    backgroundColor?: string;
    layout: 'left-image' | 'right-image' | 'centered';
    textAlignment: 'left' | 'center' | 'right';
    taglineAlignment?: 'left' | 'center' | 'right';
    intro: string;
    tagline: string;
    showImage: boolean;
  };
  // Trust indicators configuration
  trustConfig: {
    showTrustIndicators: boolean;
    companyClients?: number;
    individualClients?: number;
  };
  // Reviews configuration
  reviewsConfig: {
    showReviews: boolean;
  };
  // Pricing configuration
  pricingConfig: {
    models: PricingModel[];
  };
  // FAQ configuration
  faqConfig: {
    questions: FAQItem[];
  };
}

export interface PricingModel {
  id: string;
  title: string;
  price: number;
  currency: string;
  period?: string;
  features: string[];
  isHighlighted?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
