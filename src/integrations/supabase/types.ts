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
      balances: {
        Row: {
          amount: number | null
          id: string
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          id?: string
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          id?: string
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blocks: {
        Row: {
          block_number: number
          difficulty: number
          finder_user_id: number
          found_at: string
          hash: string
          nonce: string
          reward: number
          time_to_find_ms: number | null
        }
        Insert: {
          block_number: number
          difficulty: number
          finder_user_id: number
          found_at?: string
          hash: string
          nonce: string
          reward?: number
          time_to_find_ms?: number | null
        }
        Update: {
          block_number?: number
          difficulty?: number
          finder_user_id?: number
          found_at?: string
          hash?: string
          nonce?: string
          reward?: number
          time_to_find_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blocks_finder_user_id_fkey"
            columns: ["finder_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      hex_history: {
        Row: {
          action: string
          created_at: string
          hex_id: string
          id: string
          level: number | null
          user_id: number
        }
        Insert: {
          action: string
          created_at?: string
          hex_id: string
          id?: string
          level?: number | null
          user_id: number
        }
        Update: {
          action?: string
          created_at?: string
          hex_id?: string
          id?: string
          level?: number | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "hex_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["id"]
          },
        ]
      }
      hexagons: {
        Row: {
          captured_at: string
          expiration_time: string
          id: string
          level: number
          name: string
          notified: boolean | null
          surrounded: boolean | null
          type: string
          user_id: number
        }
        Insert: {
          captured_at?: string
          expiration_time: string
          id: string
          level?: number
          name: string
          notified?: boolean | null
          surrounded?: boolean | null
          type: string
          user_id: number
        }
        Update: {
          captured_at?: string
          expiration_time?: string
          id?: string
          level?: number
          name?: string
          notified?: boolean | null
          surrounded?: boolean | null
          type?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "hexagons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["id"]
          },
        ]
      }
      miner_stats: {
        Row: {
          id: string
          last_share_at: string | null
          shares_count: number | null
          user_id: string
        }
        Insert: {
          id?: string
          last_share_at?: string | null
          shares_count?: number | null
          user_id: string
        }
        Update: {
          id?: string
          last_share_at?: string | null
          shares_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      mining_shares: {
        Row: {
          block_number: number
          created_at: string | null
          hash: string
          id: string
          is_valid: boolean | null
          nonce: number
          user_id: string
        }
        Insert: {
          block_number: number
          created_at?: string | null
          hash: string
          id?: string
          is_valid?: boolean | null
          nonce: number
          user_id: string
        }
        Update: {
          block_number?: number
          created_at?: string | null
          hash?: string
          id?: string
          is_valid?: boolean | null
          nonce?: number
          user_id?: string
        }
        Relationships: []
      }
      mining_tasks: {
        Row: {
          block_data: string
          block_number: number
          created_at: string | null
          difficulty: number
          id: string
          target_prefix: string
        }
        Insert: {
          block_data: string
          block_number: number
          created_at?: string | null
          difficulty: number
          id?: string
          target_prefix: string
        }
        Update: {
          block_data?: string
          block_number?: number
          created_at?: string | null
          difficulty?: number
          id?: string
          target_prefix?: string
        }
        Relationships: []
      }
      pool_state: {
        Row: {
          current_block_number: number
          current_difficulty: number
          current_target_prefix: string
          id: number
          last_block_timestamp: string
          updated_at: string
        }
        Insert: {
          current_block_number?: number
          current_difficulty?: number
          current_target_prefix?: string
          id: number
          last_block_timestamp?: string
          updated_at?: string
        }
        Update: {
          current_block_number?: number
          current_difficulty?: number
          current_target_prefix?: string
          id?: number
          last_block_timestamp?: string
          updated_at?: string
        }
        Relationships: []
      }
      telegram_users: {
        Row: {
          balance: number
          created_at: string
          first_name: string
          id: number
          last_name: string | null
          last_seen: string
          total_hexagons: number
          username: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          first_name: string
          id: number
          last_name?: string | null
          last_seen?: string
          total_hexagons?: number
          username?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          first_name?: string
          id?: number
          last_name?: string | null
          last_seen?: string
          total_hexagons?: number
          username?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          last_active_at: string
          total_captures: number
          total_surrounds: number
          total_upgrades: number
          user_id: number
        }
        Insert: {
          last_active_at?: string
          total_captures?: number
          total_surrounds?: number
          total_upgrades?: number
          user_id: number
        }
        Update: {
          last_active_at?: string
          total_captures?: number
          total_surrounds?: number
          total_upgrades?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "telegram_users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          balance: number
          created_at: string
          first_name: string
          id: number
          last_name: string | null
          last_seen: string
          total_shares: number
          username: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          first_name: string
          id: number
          last_name?: string | null
          last_seen?: string
          total_shares?: number
          username?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          first_name?: string
          id?: number
          last_name?: string | null
          last_seen?: string
          total_shares?: number
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_to_balance: {
        Args: { user_telegram_id: number; amount: number }
        Returns: number
      }
      capture_hexagon: {
        Args: {
          p_user_id: number
          p_hex_id: string
          p_hex_type: string
          p_hex_name: string
          p_protection_hours: number
        }
        Returns: {
          captured_at: string
          expiration_time: string
          id: string
          level: number
          name: string
          notified: boolean | null
          surrounded: boolean | null
          type: string
          user_id: number
        }[]
      }
      get_token_supply_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_total_mined_tokens: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      handle_telegram_auth: {
        Args: { telegram_id: number; first_name: string; last_name?: string }
        Returns: string
      }
      is_same_user_id: {
        Args: { user_id: number }
        Returns: boolean
      }
      register_telegram_user: {
        Args: {
          p_telegram_id: number
          p_first_name: string
          p_last_name?: string
          p_username?: string
        }
        Returns: {
          balance: number
          created_at: string
          first_name: string
          id: number
          last_name: string | null
          last_seen: string
          total_hexagons: number
          username: string | null
        }[]
      }
      upgrade_hexagon: {
        Args: { p_user_id: number; p_hex_id: string }
        Returns: {
          captured_at: string
          expiration_time: string
          id: string
          level: number
          name: string
          notified: boolean | null
          surrounded: boolean | null
          type: string
          user_id: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
