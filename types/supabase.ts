export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string | null;
          event_credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email?: string | null;
          event_credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string | null;
          event_credits?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: 'credit' | 'debit';
          description: string | null;
          event_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: 'credit' | 'debit';
          description?: string | null;
          event_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: 'credit' | 'debit';
          description?: string | null;
          event_id?: string | null;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          ingress?: string;
          body?: string;
          from_date?: string;
          to_date?: string;
          time_slot_start?: string;
          time_slot_end?: string;
          has_time_slot: boolean;
          location?: string;
          user_id: string;
          template_id: string;
          cover_image_url?: string;
          images?: string[];
          ticket_types?: Json[];
          entrance?: string[];
          parking?: string[];
          camping?: string[];
          custom_styles?: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string;
          ingress?: string;
          body?: string;
          from_date?: string;
          to_date?: string;
          time_slot_start?: string;
          time_slot_end?: string;
          has_time_slot?: boolean;
          location?: string;
          user_id: string;
          template_id: string;
          cover_image_url?: string;
          images?: string[];
          ticket_types?: Json[];
          entrance?: string[];
          parking?: string[];
          camping?: string[];
          custom_styles?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          ingress?: string;
          body?: string;
          from_date?: string;
          to_date?: string;
          time_slot_start?: string;
          time_slot_end?: string;
          has_time_slot?: boolean;
          location?: string;
          user_id?: string;
          template_id?: string;
          cover_image_url?: string;
          images?: string[];
          ticket_types?: Json[];
          entrance?: string[];
          parking?: string[];
          camping?: string[];
          custom_styles?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_transactions: {
        Args: { p_user_id: string };
        Returns: {
          id: string;
          amount: number;
          type: string;
          description: string | null;
          event_id: string | null;
          created_at: string;
        }[];
      };
      update_event: {
        Args: {
          p_event_id: string;
          p_user_id: string;
          p_title?: string;
          p_ingress?: string | null;
          p_body?: string | null;
          p_from_date?: string;
          p_to_date?: string;
          p_has_time_slot?: boolean;
          p_time_slot_start?: string | null;
          p_time_slot_end?: string | null;
          p_location?: string | null;
          p_cover_image_url?: string | null;
          p_images?: string[];
          p_ticket_types?: any[];
          p_entrance?: string[];
          p_parking?: string[];
          p_camping?: string[];
          p_template_id?: string;
        };
        Returns: Database['public']['Tables']['events']['Row'];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
