export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          country_id: number | null
          created_at: string
          house_number: number | null
          id: number
          leisure: string | null
          neighbourhood: string | null
          postcode: string | null
          road: string | null
          state_id: number | null
          suburb: string | null
        }
        Insert: {
          country_id?: number | null
          created_at?: string
          house_number?: number | null
          id?: number
          leisure?: string | null
          neighbourhood?: string | null
          postcode?: string | null
          road?: string | null
          state_id?: number | null
          suburb?: string | null
        }
        Update: {
          country_id?: number | null
          created_at?: string
          house_number?: number | null
          id?: number
          leisure?: string | null
          neighbourhood?: string | null
          postcode?: string | null
          road?: string | null
          state_id?: number | null
          suburb?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_country_id_fkey"
            columns: ["country_id"]
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_state_id_fkey"
            columns: ["state_id"]
            referencedRelation: "states"
            referencedColumns: ["id"]
          }
        ]
      }
      arcades: {
        Row: {
          address_id: number | null
          created_at: string
          games: Json | null
          id: number
          lat: number | null
          lng: number | null
          name: string | null
          osm_id: number | null
          place_id: number | null
        }
        Insert: {
          address_id?: number | null
          created_at?: string
          games?: Json | null
          id?: number
          lat?: number | null
          lng?: number | null
          name?: string | null
          osm_id?: number | null
          place_id?: number | null
        }
        Update: {
          address_id?: number | null
          created_at?: string
          games?: Json | null
          id?: number
          lat?: number | null
          lng?: number | null
          name?: string | null
          osm_id?: number | null
          place_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "arcades_address_id_fkey"
            columns: ["address_id"]
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          }
        ]
      }
      countries: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      states: {
        Row: {
          country_id: number | null
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          country_id?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          country_id?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "states_country_id_fkey"
            columns: ["country_id"]
            referencedRelation: "countries"
            referencedColumns: ["id"]
          }
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
