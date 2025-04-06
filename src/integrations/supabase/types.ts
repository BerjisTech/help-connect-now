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
      book_pages: {
        Row: {
          book_id: string
          content: string
          created_at: string
          id: string
          page_number: number
          updated_at: string
        }
        Insert: {
          book_id: string
          content: string
          created_at?: string
          id?: string
          page_number: number
          updated_at?: string
        }
        Update: {
          book_id?: string
          content?: string
          created_at?: string
          id?: string
          page_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_pages_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          customer_id: string
          end_date: string
          id: string
          payment_status: string
          property_id: string | null
          start_date: string
          status: string
          total_price: number
          transportation_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          end_date: string
          id?: string
          payment_status?: string
          property_id?: string | null
          start_date: string
          status?: string
          total_price: number
          transportation_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          end_date?: string
          id?: string
          payment_status?: string
          property_id?: string | null
          start_date?: string
          status?: string
          total_price?: number
          transportation_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_transportation_id_fkey"
            columns: ["transportation_id"]
            isOneToOne: false
            referencedRelation: "transportation_services"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          published_date: string | null
          publisher: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          author: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          published_date?: string | null
          publisher?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          author?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          published_date?: string | null
          publisher?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          area: Database["public"]["Enums"]["community_area"]
          area_specific_id: string | null
          category_id: string | null
          created_at: string
          created_by: string
          custom_fields: Json | null
          description: string | null
          id: string
          image_url: string | null
          is_private: boolean
          location: string | null
          name: string
          rules: string | null
          type: string | null
        }
        Insert: {
          area?: Database["public"]["Enums"]["community_area"]
          area_specific_id?: string | null
          category_id?: string | null
          created_at?: string
          created_by: string
          custom_fields?: Json | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_private?: boolean
          location?: string | null
          name: string
          rules?: string | null
          type?: string | null
        }
        Update: {
          area?: Database["public"]["Enums"]["community_area"]
          area_specific_id?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string
          custom_fields?: Json | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_private?: boolean
          location?: string | null
          name?: string
          rules?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_communities_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "community_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      community_categories: {
        Row: {
          area: Database["public"]["Enums"]["community_area"]
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          area: Database["public"]["Enums"]["community_area"]
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          area?: Database["public"]["Enums"]["community_area"]
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_notification_preferences: {
        Row: {
          community_id: string
          receive_all: boolean | null
          receive_events: boolean | null
          receive_mentions: boolean | null
          user_id: string
        }
        Insert: {
          community_id: string
          receive_all?: boolean | null
          receive_events?: boolean | null
          receive_mentions?: boolean | null
          user_id: string
        }
        Update: {
          community_id?: string
          receive_all?: boolean | null
          receive_events?: boolean | null
          receive_mentions?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_notification_preferences_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profiles: {
        Row: {
          address: string | null
          company_name: string
          created_at: string
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          owner_id: string
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          owner_id: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          owner_id?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          area: Database["public"]["Enums"]["community_area"]
          community_id: string
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          start_time: string
          title: string
        }
        Insert: {
          area?: Database["public"]["Enums"]["community_area"]
          community_id: string
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          start_time: string
          title: string
        }
        Update: {
          area?: Database["public"]["Enums"]["community_area"]
          community_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          start_time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_options: {
        Row: {
          created_at: string
          id: string
          poll_id: string
          position: number
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          poll_id: string
          position?: number
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          poll_id?: string
          position?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          option_id: string
          poll_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          poll_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          poll_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          allow_vote_removal: boolean
          created_at: string
          ends_at: string | null
          id: string
          poll_type: Database["public"]["Enums"]["poll_type"]
          post_id: string
          question: string
          updated_at: string
        }
        Insert: {
          allow_vote_removal?: boolean
          created_at?: string
          ends_at?: string | null
          id?: string
          poll_type?: Database["public"]["Enums"]["poll_type"]
          post_id: string
          question: string
          updated_at?: string
        }
        Update: {
          allow_vote_removal?: boolean
          created_at?: string
          ends_at?: string | null
          id?: string
          poll_type?: Database["public"]["Enums"]["poll_type"]
          post_id?: string
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          book_id: string | null
          community_id: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_ai_generated: boolean | null
          parent_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          book_id?: string | null
          community_id: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_ai_generated?: boolean | null
          parent_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          book_id?: string | null
          community_id?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_ai_generated?: boolean | null
          parent_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          area_sqft: number | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          country: string
          created_at: string
          description: string | null
          id: string
          is_available: boolean | null
          is_featured: boolean | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          owner_id: string
          price: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          state: string
          title: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address: string
          area_sqft?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean | null
          is_featured?: boolean | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          owner_id: string
          price?: number | null
          property_type: Database["public"]["Enums"]["property_type"]
          state: string
          title: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string
          area_sqft?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean | null
          is_featured?: boolean | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          owner_id?: string
          price?: number | null
          property_type?: Database["public"]["Enums"]["property_type"]
          state?: string
          title?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      property_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          property_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          property_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_posts: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          owner_id: string
          phone: string | null
          role: Database["public"]["Enums"]["staff_role"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          owner_id: string
          phone?: string | null
          role: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          owner_id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      stream_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      stream_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          stream_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          stream_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          stream_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_comments_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_gifts: {
        Row: {
          coins: number
          created_at: string | null
          gift_type: string
          id: string
          receiver_id: string
          sender_id: string
          stream_id: string
        }
        Insert: {
          coins: number
          created_at?: string | null
          gift_type: string
          id?: string
          receiver_id: string
          sender_id: string
          stream_id: string
        }
        Update: {
          coins?: number
          created_at?: string | null
          gift_type?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          stream_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_gifts_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          streamer_id: string
          subscriber_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          streamer_id: string
          subscriber_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          streamer_id?: string
          subscriber_id?: string
        }
        Relationships: []
      }
      streams: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_live: boolean | null
          stream_key: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          viewer_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_live?: boolean | null
          stream_key?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          viewer_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_live?: boolean | null
          stream_key?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          viewer_count?: number | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      transportation_services: {
        Row: {
          base_price: number | null
          capacity: number | null
          created_at: string
          description: string | null
          id: string
          is_available: boolean | null
          owner_id: string
          price_per_km: number | null
          service_name: string
          service_type: string
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean | null
          owner_id: string
          price_per_km?: number | null
          service_name: string
          service_type: string
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean | null
          owner_id?: string
          price_per_km?: number | null
          service_name?: string
          service_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          coins: number | null
          created_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coins?: number | null
          created_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coins?: number | null
          created_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_poll_options_with_votes: {
        Args: {
          poll_id_param: string
        }
        Returns: {
          id: string
          poll_id: string
          text: string
          position: number
          created_at: string
          votes_count: number
        }[]
      }
      get_profiles_by_ids: {
        Args: {
          user_ids: string[]
        }
        Returns: unknown[]
      }
      set_current_area: {
        Args: {
          p_area: string
        }
        Returns: undefined
      }
    }
    Enums: {
      community_area:
        | "general"
        | "realestate"
        | "travel"
        | "library"
        | "marketplace"
        | "logistics"
        | "jobs"
      listing_type: "sale" | "short_term_rental" | "long_term_rental"
      poll_type: "single_vote" | "changeable_vote"
      property_type:
        | "house"
        | "apartment"
        | "condo"
        | "villa"
        | "townhouse"
        | "land"
        | "commercial"
      staff_role:
        | "driver"
        | "agent"
        | "manager"
        | "finance"
        | "maintenance"
        | "cleaner"
        | "admin"
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
