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
      address: {
        Row: {
          arcade_id: number | null
          city: number | null
          created_at: string
          house_number: string | null
          id: number
          iso_code: string | null
          postcode: string | null
          road: string | null
        }
        Insert: {
          arcade_id?: number | null
          city?: number | null
          created_at?: string
          house_number?: string | null
          id?: number
          iso_code?: string | null
          postcode?: string | null
          road?: string | null
        }
        Update: {
          arcade_id?: number | null
          city?: number | null
          created_at?: string
          house_number?: string | null
          id?: number
          iso_code?: string | null
          postcode?: string | null
          road?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "address_arcade_id_fkey"
            columns: ["arcade_id"]
            isOneToOne: false
            referencedRelation: "arcade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "address_city_fkey"
            columns: ["city"]
            isOneToOne: false
            referencedRelation: "city"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "address_iso_code_fkey"
            columns: ["iso_code"]
            isOneToOne: false
            referencedRelation: "region"
            referencedColumns: ["code"]
          },
        ]
      }
      arcade: {
        Row: {
          created_at: string
          id: number
          lat: number | null
          lng: number | null
          name: string | null
          osm_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          lat?: number | null
          lng?: number | null
          name?: string | null
          osm_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          lat?: number | null
          lng?: number | null
          name?: string | null
          osm_id?: number | null
        }
        Relationships: []
      }
      city: {
        Row: {
          created_at: string
          id: number
          name: string | null
          region_code: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          region_code?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          region_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "city_region_code_fkey"
            columns: ["region_code"]
            isOneToOne: false
            referencedRelation: "region"
            referencedColumns: ["code"]
          },
        ]
      }
      country: {
        Row: {
          code: string
          name: string | null
        }
        Insert: {
          code: string
          name?: string | null
        }
        Update: {
          code?: string
          name?: string | null
        }
        Relationships: []
      }
      games_to_arcades: {
        Row: {
          arcade_id: number | null
          created_at: string
          game_id: number | null
          id: number
        }
        Insert: {
          arcade_id?: number | null
          created_at?: string
          game_id?: number | null
          id?: number
        }
        Update: {
          arcade_id?: number | null
          created_at?: string
          game_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "games_to_arcades_arcade_id_fkey"
            columns: ["arcade_id"]
            isOneToOne: false
            referencedRelation: "arcade"
            referencedColumns: ["id"]
          },
        ]
      }
      region: {
        Row: {
          code: string
          country_code: string | null
          name: string | null
        }
        Insert: {
          code: string
          country_code?: string | null
          name?: string | null
        }
        Update: {
          code?: string
          country_code?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "region_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "country"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
