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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ambassador_commissions: {
        Row: {
          ambassador_id: string
          amount: number
          created_at: string
          id: string
          paid_at: string | null
          payment_period_end: string
          payment_period_start: string
          referral_customer_id: string
          status: string
        }
        Insert: {
          ambassador_id: string
          amount: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_period_end: string
          payment_period_start: string
          referral_customer_id: string
          status?: string
        }
        Update: {
          ambassador_id?: string
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_period_end?: string
          payment_period_start?: string
          referral_customer_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambassador_commissions_ambassador_id_fkey"
            columns: ["ambassador_id"]
            isOneToOne: false
            referencedRelation: "ambassadors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ambassador_commissions_referral_customer_id_fkey"
            columns: ["referral_customer_id"]
            isOneToOne: false
            referencedRelation: "referral_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      ambassadors: {
        Row: {
          bonus_paid_at: string | null
          commission_rate: number
          created_at: string
          id: string
          notes: string | null
          referral_code: string
          status: Database["public"]["Enums"]["ambassador_status"]
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bonus_paid_at?: string | null
          commission_rate?: number
          created_at?: string
          id?: string
          notes?: string | null
          referral_code: string
          status?: Database["public"]["Enums"]["ambassador_status"]
          terms_accepted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bonus_paid_at?: string | null
          commission_rate?: number
          created_at?: string
          id?: string
          notes?: string | null
          referral_code?: string
          status?: Database["public"]["Enums"]["ambassador_status"]
          terms_accepted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      challenge_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          current_day: number
          current_stage: string
          id: string
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_day?: number
          current_stage?: string
          id?: string
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_day?: number
          current_stage?: string
          id?: string
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_agenda: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          description: string | null
          id: string
          priority: string | null
          time_end: string | null
          time_start: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date: string
          description?: string | null
          id?: string
          priority?: string | null
          time_end?: string | null
          time_start?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          priority?: string | null
          time_end?: string | null
          time_start?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_habits: {
        Row: {
          category: string
          completed_dates: Json
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          category: string
          completed_dates?: Json
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          category?: string
          completed_dates?: Json
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_missions: {
        Row: {
          checklist: Json
          completed: boolean
          completed_at: string | null
          created_at: string
          day_number: number
          description: string
          id: string
          image_url: string | null
          reflection: string | null
          stage: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          day_number: number
          description: string
          id?: string
          image_url?: string | null
          reflection?: string | null
          stage: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          checklist?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          day_number?: number
          description?: string
          id?: string
          image_url?: string | null
          reflection?: string | null
          stage?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      energy_logs: {
        Row: {
          activity: string | null
          created_at: string
          date: string
          energy_level: number
          id: string
          time_slot: string
          user_id: string
        }
        Insert: {
          activity?: string | null
          created_at?: string
          date?: string
          energy_level: number
          id?: string
          time_slot: string
          user_id: string
        }
        Update: {
          activity?: string | null
          created_at?: string
          date?: string
          energy_level?: number
          id?: string
          time_slot?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_entries: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          completed: boolean
          created_at: string
          description: string | null
          id: string
          is_primary: boolean
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_primary?: boolean
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_primary?: boolean
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          onboarding_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_clicks: {
        Row: {
          ambassador_id: string
          created_at: string
          id: string
          ip_hash: string | null
          referrer_url: string | null
          user_agent: string | null
        }
        Insert: {
          ambassador_id: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          referrer_url?: string | null
          user_agent?: string | null
        }
        Update: {
          ambassador_id?: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          referrer_url?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_clicks_ambassador_id_fkey"
            columns: ["ambassador_id"]
            isOneToOne: false
            referencedRelation: "ambassadors"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_customers: {
        Row: {
          ambassador_id: string
          created_at: string
          customer_user_id: string
          first_payment_at: string | null
          id: string
          last_payment_at: string | null
          stripe_customer_id: string | null
          subscription_status: string
          total_paid: number
          updated_at: string
        }
        Insert: {
          ambassador_id: string
          created_at?: string
          customer_user_id: string
          first_payment_at?: string | null
          id?: string
          last_payment_at?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string
          total_paid?: number
          updated_at?: string
        }
        Update: {
          ambassador_id?: string
          created_at?: string
          customer_user_id?: string
          first_payment_at?: string | null
          id?: string
          last_payment_at?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string
          total_paid?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_customers_ambassador_id_fkey"
            columns: ["ambassador_id"]
            isOneToOne: false
            referencedRelation: "ambassadors"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_settings: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          push_subscription: Json | null
          reminder_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          push_subscription?: Json | null
          reminder_time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          push_subscription?: Json | null
          reminder_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: { Args: never; Returns: string }
      get_ambassador_active_customers: {
        Args: { ambassador_uuid: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      ambassador_status: "active" | "suspended" | "blocked"
      app_role: "admin" | "ambassador"
    }
    CompositeTypes: {
      [_ in never]: never
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
      ambassador_status: ["active", "suspended", "blocked"],
      app_role: ["admin", "ambassador"],
    },
  },
} as const
