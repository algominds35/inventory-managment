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
      profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      skus: {
        Row: {
          id: string
          user_id: string
          sku_name: string
          current_quantity: number
          low_stock_threshold: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          sku_name: string
          current_quantity: number
          low_stock_threshold: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          sku_name?: string
          current_quantity?: number
          low_stock_threshold?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          client_name: string
          order_date: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_name: string
          order_date: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_name?: string
          order_date?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          sku_id: string
          quantity: number
          price_per_unit: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          sku_id: string
          quantity: number
          price_per_unit: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          sku_id?: string
          quantity?: number
          price_per_unit?: number
          created_at?: string
        }
      }
    }
  }
}
