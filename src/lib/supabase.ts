import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export interface ParticipantRegistrationRecord {
  id?: string;
  registration_id: string;
  ticket_id: string;
  event_id: string;
  event_name: string;
  participant_name: string;
  branch: string;
  college_roll_number: string;
  email: string;
  phone: string;
  college_id_card_url: string;
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

// Maps each official AMEYA '26 event ID to its dedicated Supabase database table
export function getEventTableName(eventId: string): string {
  switch (eventId) {
    case "autocad":
      return "reg_autocad";
    case "assemble-disassemble":
      return "reg_assemble_disassemble";
    case "rc-car-challenge":
      return "reg_rc_car_challenge";
    case "picto":
      return "reg_picto";
    case "engineering-drawing":
      return "reg_engineering_drawing";
    case "identify-tools":
      return "reg_identify_tools";
    case "treasure-hunt":
      return "reg_treasure_hunt";
    case "nuts-and-bolts-speed-race":
      return "reg_nuts_bolts_speed_race";
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
