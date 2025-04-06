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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
