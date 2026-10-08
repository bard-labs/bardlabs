export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          tags: string[]
          status: "active" | "archived"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          tags?: string[]
          status?: "active" | "archived"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          tags?: string[]
          status?: "active" | "archived"
          created_at?: string
          updated_at?: string
        }
      }
      outreaches: {
        Row: {
          id: string
          user_id: string
          target_name: string
          email: string
          channel: string
          message: string
          date: string
          status: "pending" | "sent" | "seen" | "responded" | "archived"
          response_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_name: string
          email: string
          channel: string
          message: string
          date?: string
          status?: "pending" | "sent" | "seen" | "responded" | "archived"
          response_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_name?: string
          email?: string
          channel?: string
          message?: string
          date?: string
          status?: "pending" | "sent" | "seen" | "responded" | "archived"
          response_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          overview: string | null
          status: "planned" | "active" | "completed" | "archived"
          goals: string[]
          tasks: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          overview?: string | null
          status?: "planned" | "active" | "completed" | "archived"
          goals?: string[]
          tasks?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          overview?: string | null
          status?: "planned" | "active" | "completed" | "archived"
          goals?: string[]
          tasks?: Json
          created_at?: string
          updated_at?: string
        }
      }
      sops: {
        Row: {
          id: string
          user_id: string
          title: string
          file_path: string
          file_size: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_path: string
          file_size?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          file_path?: string
          file_size?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
