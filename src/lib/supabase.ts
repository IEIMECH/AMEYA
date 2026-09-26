import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export interface Member {
  name: string;
  email: string;
  phone?: string;
}

export interface BaseRegistrationRecord {
  id?: string;
  ticket_id: string;
  team_id: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  college: string;
  year: string;
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

// Maps each event ID to its dedicated Supabase database table
export function getEventTableName(eventId: string): string {
  switch (eventId) {
    case "hackathon":
      return "reg_hacksprint";
    case "paper-presentation":
      return "reg_tech_manuscript";
    case "cad-design":
      return "reg_cad_clash";
    case "robo-race":
      return "reg_robo_rumble";
    case "circuit-debug":
      return "reg_circuit_breaker";
    case "quiz":
      return "reg_mech_brainiac";
    case "treasure-hunt":
      return "reg_gear_hunt";
    case "photography":
      return "reg_industrial_lens";
    case "debate":
      return "reg_iron_tongue";
    case "visitor-pass":
    case "visitor":
      return "fest_visitors";
    default:
      return "registrations";
  }
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
