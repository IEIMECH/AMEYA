import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export interface Member {
  name: string;
  email: string;
  phone?: string;
}

export interface RegistrationRecord {
  id?: string;
  ticket_id: string;
  event_id: string;
  event_name: string;
  is_team: boolean;
  team_id: string;
  team_name?: string | null;
  leader_name: string;
  leader_email: string;
  leader_phone?: string | null;
  college: string;
  year: string;
  members?: Member[];
  payment_status?: string;
  verified_at?: string | null;
  verified_by?: string | null;
  created_at?: string;
}

export interface InquiryRecord {
  id?: string;
  sector: "general" | "registration" | "sponsorship" | "media" | "technical" | string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: "unread" | "responded" | "archived" | string;
  created_at?: string;
}

// Client for public operations (Browser & Client Components)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Admin Client with Service Role (Server-side API routes only)
export const supabaseAdmin =
  supabaseUrl && (supabaseServiceKey || supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export function isDatabaseConfigured(): boolean {
  return Boolean(supabaseUrl && (supabaseServiceKey || supabaseAnonKey));
}
