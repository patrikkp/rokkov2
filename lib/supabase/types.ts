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
      warranty_transfer_tokens: {
        Row: {
          id: string
          warranty_id: string
          token: string
          created_by: string
          claimed_by: string | null
          expires_at: string
          claimed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          warranty_id: string
          token: string
          created_by: string
          claimed_by?: string | null
          expires_at: string
          claimed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          warranty_id?: string
          token?: string
          created_by?: string
          claimed_by?: string | null
          expires_at?: string
          claimed_at?: string | null
          created_at?: string
        }
      }
      warranties: {
        Row: {
          id: string
          user_id: string
          product_name: string
          brand: string | null
          purchase_date: string
          warranty_expires: string
          category: string | null
          store: string | null
          price: number | null
          serial_number: string | null
          notes: string | null
          receipt_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_name: string
          brand?: string | null
          purchase_date: string
          warranty_expires: string
          category?: string | null
          store?: string | null
          price?: number | null
          serial_number?: string | null
          notes?: string | null
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_name?: string
          brand?: string | null
          purchase_date?: string
          warranty_expires?: string
          category?: string | null
          store?: string | null
          price?: number | null
          serial_number?: string | null
          notes?: string | null
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
