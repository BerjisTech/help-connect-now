export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      consultants: {
        Row: {
          availability: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string
          expertise: string[] | null
          hourly_rate: number | null
          id: string
          industry: string | null
          rating: number | null
          review_count: number | null
          updated_at: string | null
        }
        Insert: {
          availability?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name: string
          expertise?: string[] | null
          hourly_rate?: number | null
          id?: string
          industry?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
        }
        Update: {
          availability?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string
          expertise?: string[] | null
          hourly_rate?: number | null
          id?: string
          industry?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      interactions: {
        Row: {
          anonymous_seeker_id: string | null
          created_at: string
          description: string | null
          ended_at: string | null
          helper_id: string | null
          id: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          is_active: boolean | null
          metadata: Json | null
          seeker_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          anonymous_seeker_id?: string | null
          created_at?: string
          description?: string | null
          ended_at?: string | null
          helper_id?: string | null
          id?: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          is_active?: boolean | null
          metadata?: Json | null
          seeker_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          anonymous_seeker_id?: string | null
          created_at?: string
          description?: string | null
          ended_at?: string | null
          helper_id?: string | null
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          is_active?: boolean | null
          metadata?: Json | null
          seeker_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          anonymous_sender_id: string | null
          content: string
          created_at: string
          id: string
          interaction_id: string
          is_read: boolean | null
          sender_id: string | null
        }
        Insert: {
          anonymous_sender_id?: string | null
          content: string
          created_at?: string
          id?: string
          interaction_id: string
          is_read?: boolean | null
          sender_id?: string | null
        }
        Update: {
          anonymous_sender_id?: string | null
          content?: string
          created_at?: string
          id?: string
          interaction_id?: string
          is_read?: boolean | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "interactions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability: Database["public"]["Enums"]["availability_status"]
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          expertise: string[] | null
          first_name: string | null
          hourly_rate: number | null
          id: string
          industry: string | null
          is_admin: boolean | null
          last_name: string | null
          rating: number | null
          review_count: number | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          availability?: Database["public"]["Enums"]["availability_status"]
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          expertise?: string[] | null
          first_name?: string | null
          hourly_rate?: number | null
          id: string
          industry?: string | null
          is_admin?: boolean | null
          last_name?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          availability?: Database["public"]["Enums"]["availability_status"]
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          expertise?: string[] | null
          first_name?: string | null
          hourly_rate?: number | null
          id?: string
          industry?: string | null
          is_admin?: boolean | null
          last_name?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      reviews: {
        Row: {
          anonymous_reviewer_id: string | null
          comment: string | null
          created_at: string
          id: string
          interaction_id: string
          rating: number
          reviewed_user_id: string
          reviewer_id: string | null
        }
        Insert: {
          anonymous_reviewer_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          interaction_id: string
          rating: number
          reviewed_user_id: string
          reviewer_id?: string | null
        }
        Update: {
          anonymous_reviewer_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          interaction_id?: string
          rating?: number
          reviewed_user_id?: string
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "interactions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_consultants: {
        Args: Record<PropertyKey, never>
        Returns: {
          availability: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string
          expertise: string[] | null
          hourly_rate: number | null
          id: string
          industry: string | null
          rating: number | null
          review_count: number | null
          updated_at: string | null
        }[]
      }
    }
    Enums: {
      availability_status: "available" | "busy" | "offline"
      expertise_category:
        | "Leadership"
        | "Marketing"
        | "Finance"
        | "Technology"
        | "Sales"
        | "Human Resources"
        | "Operations"
        | "Strategy"
        | "Product Management"
        | "Design"
        | "Legal"
        | "Education"
        | "Healthcare"
        | "Research"
      interaction_type: "video" | "audio" | "text"
      user_type: "helper" | "seeker"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      availability_status: ["available", "busy", "offline"],
      expertise_category: [
        "Leadership",
        "Marketing",
        "Finance",
        "Technology",
        "Sales",
        "Human Resources",
        "Operations",
        "Strategy",
        "Product Management",
        "Design",
        "Legal",
        "Education",
        "Healthcare",
        "Research",
      ],
      interaction_type: ["video", "audio", "text"],
      user_type: ["helper", "seeker"],
    },
  },
} as const
