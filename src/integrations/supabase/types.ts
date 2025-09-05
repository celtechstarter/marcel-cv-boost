export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          actor_email: string | null
          actor_ip: string | null
          actor_role: string | null
          created_at: string
          details: Json | null
          event_type: string
          id: string
          resource_id: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_ip?: string | null
          actor_role?: string | null
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          resource_id?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_ip?: string | null
          actor_role?: string | null
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          resource_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string | null
          discord_name: string | null
          duration_minutes: number
          email: string
          id: string
          name: string
          note: string | null
          starts_at: string
          status: Database["public"]["Enums"]["booking_status"]
        }
        Insert: {
          created_at?: string | null
          discord_name?: string | null
          duration_minutes: number
          email: string
          id?: string
          name: string
          note?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Update: {
          created_at?: string | null
          discord_name?: string | null
          duration_minutes?: number
          email?: string
          id?: string
          name?: string
          note?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Relationships: []
      }
      help_requests: {
        Row: {
          created_at: string
          cv_path: string | null
          discord_name: string | null
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          cv_path?: string | null
          discord_name?: string | null
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          cv_path?: string | null
          discord_name?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      monthly_free_slots: {
        Row: {
          max_slots: number
          month: number
          used_slots: number
          year: number
        }
        Insert: {
          max_slots?: number
          month: number
          used_slots?: number
          year: number
        }
        Update: {
          max_slots?: number
          month?: number
          used_slots?: number
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      review_verifications: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          review_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at?: string
          review_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_verifications_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "public_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_verifications_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "public_reviews_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_verifications_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string
          created_at: string | null
          email: string
          id: string
          name: string
          published_at: string | null
          rating: number
          status: Database["public"]["Enums"]["review_status"]
          title: string | null
          verified_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          published_at?: string | null
          rating: number
          status?: Database["public"]["Enums"]["review_status"]
          title?: string | null
          verified_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          published_at?: string | null
          rating?: number
          status?: Database["public"]["Enums"]["review_status"]
          title?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      uploads: {
        Row: {
          created_at: string
          created_by_ip: string | null
          delete_after: string
          deleted_at: string | null
          id: string
          mime_type: string
          original_filename: string
          sha256_hash: string
          size_bytes: number
          storage_path: string
          user_email: string
        }
        Insert: {
          created_at?: string
          created_by_ip?: string | null
          delete_after?: string
          deleted_at?: string | null
          id?: string
          mime_type?: string
          original_filename: string
          sha256_hash: string
          size_bytes: number
          storage_path: string
          user_email: string
        }
        Update: {
          created_at?: string
          created_by_ip?: string | null
          delete_after?: string
          deleted_at?: string | null
          id?: string
          mime_type?: string
          original_filename?: string
          sha256_hash?: string
          size_bytes?: number
          storage_path?: string
          user_email?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_reviews: {
        Row: {
          body: string | null
          date_published: string | null
          id: string | null
          name: string | null
          rating: number | null
          title: string | null
        }
        Insert: {
          body?: string | null
          date_published?: string | null
          id?: string | null
          name?: string | null
          rating?: number | null
          title?: string | null
        }
        Update: {
          body?: string | null
          date_published?: string | null
          id?: string | null
          name?: string | null
          rating?: number | null
          title?: string | null
        }
        Relationships: []
      }
      public_reviews_safe: {
        Row: {
          body: string | null
          display_name: string | null
          id: string | null
          published_at: string | null
          rating: number | null
          title: string | null
        }
        Insert: {
          body?: string | null
          display_name?: never
          id?: string | null
          published_at?: string | null
          rating?: number | null
          title?: string | null
        }
        Update: {
          body?: string | null
          display_name?: never
          id?: string | null
          published_at?: string | null
          rating?: number | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_approve_booking: {
        Args: { p_booking_id: string }
        Returns: boolean
      }
      admin_cv_signed_url: {
        Args: { p_expires_sec?: number; p_path: string }
        Returns: string
      }
      admin_export_help_requests_csv: {
        Args: { p_from?: string; p_to?: string }
        Returns: string
      }
      admin_list_help_requests: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          created_at: string
          cv_path: string
          discord_name: string
          email: string
          id: string
          message: string
          name: string
        }[]
      }
      admin_publish_review: {
        Args: { p_review_id: string }
        Returns: undefined
      }
      admin_reject_booking: {
        Args: { p_booking_id: string }
        Returns: boolean
      }
      apply_free_slot: {
        Args: { p_month: number; p_year: number }
        Returns: undefined
      }
      cleanup_expired_uploads: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      log_audit_event: {
        Args: {
          p_actor_email?: string
          p_actor_ip?: string
          p_actor_role?: string
          p_details?: Json
          p_event_type: string
          p_resource_id?: string
        }
        Returns: string
      }
      public_bookings_next7: {
        Args: Record<PropertyKey, never>
        Returns: {
          discord_name: string
          duration_minutes: number
          email: string
          id: string
          name: string
          note: string
          starts_at: string
          status: string
        }[]
      }
      public_create_booking: {
        Args: {
          p_discord_name: string
          p_duration: number
          p_email: string
          p_name: string
          p_note: string
          p_starts_at: string
        }
        Returns: string
      }
      public_create_review: {
        Args: {
          p_body: string
          p_email: string
          p_name: string
          p_rating: number
          p_title: string
        }
        Returns: {
          code: string
          review_id: string
        }[]
      }
      public_export_bookings_csv: {
        Args: { p_from?: string; p_to?: string }
        Returns: string
      }
      public_get_published_reviews: {
        Args: { p_limit?: number; p_offset?: number; p_stars?: number }
        Returns: Database["public"]["CompositeTypes"]["review_public"][]
      }
      public_get_review_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_rating: number
          review_count: number
        }[]
      }
      public_get_slot_state: {
        Args: { p_month: number; p_year: number }
        Returns: {
          max_slots: number
          month: number
          remaining: number
          used_slots: number
          year: number
        }[]
      }
      public_verify_review: {
        Args: { p_code: string; p_review_id: string }
        Returns: boolean
      }
      reset_month_slots: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      slots_remaining: {
        Args: { p_month: number; p_year: number }
        Returns: number
      }
      slots_remaining_safe: {
        Args: { p_month: number; p_year: number }
        Returns: number
      }
    }
    Enums: {
      booking_status:
        | "neu"
        | "bestaetigt"
        | "abgelehnt"
        | "storniert"
        | "abgesagt"
      review_status:
        | "neu"
        | "verifiziert"
        | "veroeffentlicht"
        | "zurueckgewiesen"
    }
    CompositeTypes: {
      review_public: {
        id: string | null
        rating: number | null
        title: string | null
        body: string | null
        date_published: string | null
        display_name: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: [
        "neu",
        "bestaetigt",
        "abgelehnt",
        "storniert",
        "abgesagt",
      ],
      review_status: [
        "neu",
        "verifiziert",
        "veroeffentlicht",
        "zurueckgewiesen",
      ],
    },
  },
} as const
