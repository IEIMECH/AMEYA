import fs from "fs";
import path from "path";
import { events as defaultEvents, Event as StaticEvent } from "@/data/events";
import { supabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";

export interface ManagedEvent extends StaticEvent {
  is_archived?: boolean;
  archived_at?: string | null;
  max_slots?: number;
  registered_count?: number;
  checked_in_count?: number;
  created_at?: string;
  coordinator?: string;
}

export interface AttendeeRecord {
  id: string;
  ticket_id: string;
  event_id: string;
  event_name: string;
  event_day: number;
  participant_name: string;
  email: string;
  phone: string;
  college_roll_number: string;
  branch: string;
  college: string;
  year?: string;
  status: "Approved" | "Pending" | "Rejected";
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  avatar_color: string;
}

// Persistent file location for dynamic events
const DYNAMIC_EVENTS_PATH = path.join(process.cwd(), "src", "data", "dynamicEvents.json");

function loadStoredEvents(): ManagedEvent[] {
  try {
    if (fs.existsSync(DYNAMIC_EVENTS_PATH)) {
      const content = fs.readFileSync(DYNAMIC_EVENTS_PATH, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read dynamicEvents.json, using defaults:", err);
  }

  // Initialize from defaultEvents if file doesn't exist
  const initial: ManagedEvent[] = defaultEvents.map((e) => ({
    ...e,
    is_archived: false,
    archived_at: null,
    max_slots: 50,
    created_at: "2026-09-01T00:00:00Z",
    coordinator: "Dept of Mechanical Engineering",
  }));

  try {
    fs.writeFileSync(DYNAMIC_EVENTS_PATH, JSON.stringify(initial, null, 2), "utf8");
  } catch (e) {
    // Ignore in read-only environment
  }

  return initial;
}

function saveStoredEvents(eventsList: ManagedEvent[]) {
  try {
    fs.writeFileSync(DYNAMIC_EVENTS_PATH, JSON.stringify(eventsList, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist dynamicEvents.json:", err);
  }
}

// Colors for avatar circle based on participant name
const AVATAR_COLORS = [
  "#e51d25", // Red
  "#0284c7", // Blue
  "#16a34a", // Green
  "#d97706", // Amber
  "#7c3aed", // Violet
  "#0d9488", // Teal
  "#ec4899", // Pink
  "#ea580c", // Orange
  "#4f46e5", // Indigo
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const EVENT_TABLES = [
  "registrations",
  "all_registrations",
  "reg_autocad",
  "reg_assemble_disassemble",
  "reg_rc_car_challenge",
  "reg_picto",
  "reg_engineering_drawing",
  "reg_identify_tools",
  "reg_treasure_hunt",
  "reg_nuts_bolts_speed_race",
];

// Fetch 100% exact registrations directly from Supabase
export async function getLiveAttendees(): Promise<AttendeeRecord[]> {
  if (!isDatabaseConfigured() || !supabaseAdmin) {
    return [];
  }

  try {
    const attendeesMap = new Map<string, AttendeeRecord>();

    // 1. Fetch from primary registrations table
    const { data: mainRegs, error: mainErr } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (mainRegs && !mainErr) {
      mainRegs.forEach((r: any) => {
        const ticketId = (typeof r.id === "string" && r.id.startsWith("AMEYA")) ? r.id : (r.ticket_id || r.id || `AMEYA-REG-${r.id?.slice(0, 6) || "ID"}`);
        const name = r.full_name || r.participant_name || r.leader_name || r.name || "Delegate";
        
        attendeesMap.set(ticketId, {
          id: r.id || ticketId,
          ticket_id: ticketId,
          event_id: r.event_id || "general",
          event_name: r.event_name || "AMEYA '26 Event",
          event_day: Number(r.day) || 1,
          participant_name: name,
          email: r.email || r.leader_email || "",
          phone: r.phone || r.leader_phone || "",
          college_roll_number: r.college_roll_number || r.team_id || (r.is_team ? "TEAM" : "INDIVIDUAL"),
          branch: r.branch || (r.is_team ? `Team: ${r.team_name || "Cadre"}` : (r.year || "Student")),
          college: r.college || "VVIT Nambur",
          year: r.year || "",
          status: "Approved",
          verified_at: r.verified_at || null,
          verified_by: r.verified_by || null,
          created_at: r.created_at || new Date().toISOString(),
          avatar_color: getAvatarColor(name),
        });
      });
    }

    // 2. Also check any event-specific tables for additional registrations
    for (const table of EVENT_TABLES) {
      if (table === "registrations") continue;
      try {
        const { data: subData, error: subErr } = await supabaseAdmin
          .from(table)
          .select("*")
          .order("created_at", { ascending: false });

        if (subData && !subErr && subData.length > 0) {
          subData.forEach((r: any) => {
            const ticketId = r.ticket_id || `AMEYA-${table.replace("reg_", "")}-${r.id?.slice(0, 4) || "ID"}`;
            if (!attendeesMap.has(ticketId)) {
              const name = r.participant_name || r.leader_name || r.full_name || r.name || "Delegate";
              attendeesMap.set(ticketId, {
                id: r.id || ticketId,
                ticket_id: ticketId,
                event_id: r.event_id || table.replace("reg_", ""),
                event_name: r.event_name || table.replace("reg_", "").toUpperCase(),
                event_day: Number(r.day) || 1,
                participant_name: name,
                email: r.email || r.leader_email || "",
                phone: r.phone || r.leader_phone || "",
                college_roll_number: r.college_roll_number || r.team_id || "N/A",
                branch: r.branch || r.year || "Student",
                college: r.college || "VVIT Nambur",
                year: r.year || "",
                status: "Approved",
                verified_at: r.verified_at || null,
                verified_by: r.verified_by || null,
                created_at: r.created_at || new Date().toISOString(),
                avatar_color: getAvatarColor(name),
              });
            }
          });
        }
      } catch {
        // Table might not exist in schema cache, ignore gracefully
      }
    }

    return Array.from(attendeesMap.values());
  } catch (err) {
    console.error("Error fetching live attendees from Supabase:", err);
    return [];
  }
}

// Mark or unmark attendance directly in Supabase
export async function toggleAttendeeAttendance(
  ticketId: string,
  coordinatorName: string,
  forceStatus?: boolean
): Promise<{ success: boolean; attendee?: AttendeeRecord }> {
  if (!isDatabaseConfigured() || !supabaseAdmin) {
    return { success: false };
  }

  const attendees = await getLiveAttendees();
  const current = attendees.find((a) => a.ticket_id.toLowerCase() === ticketId.toLowerCase());
  if (!current) {
    return { success: false };
  }

  const shouldMark = forceStatus !== undefined ? forceStatus : !current.verified_at;
  const now = shouldMark ? new Date().toISOString() : null;
  const verifier = shouldMark ? coordinatorName : null;

  // 1. Update in primary registrations table
  await supabaseAdmin
    .from("registrations")
    .update({ verified_at: now, verified_by: verifier })
    .eq("id", current.ticket_id);

  // 2. Also try updating in event-specific tables
  for (const table of EVENT_TABLES) {
    if (table === "registrations") continue;
    try {
      await supabaseAdmin
        .from(table)
        .update({ verified_at: now, verified_by: verifier })
        .eq("ticket_id", current.ticket_id);
    } catch {
      // Ignore
    }
  }

  const updatedRecord: AttendeeRecord = {
    ...current,
    verified_at: now,
    verified_by: verifier,
  };

  return { success: true, attendee: updatedRecord };
}

// Bulk mark attendance directly in Supabase
export async function bulkMarkAttendance(
  ticketIds: string[],
  coordinatorName: string,
  markPresent: boolean
): Promise<number> {
  let count = 0;
  for (const tid of ticketIds) {
    const res = await toggleAttendeeAttendance(tid, coordinatorName, markPresent);
    if (res.success) count++;
  }
  return count;
}

// Event Management Functions
export async function getActiveEvents(): Promise<ManagedEvent[]> {
  const allEvents = loadStoredEvents();
  return allEvents.filter((e) => !e.is_archived);
}

export async function getManagedEvents(): Promise<ManagedEvent[]> {
  const allEvents = loadStoredEvents();
  const attendees = await getLiveAttendees();

  return allEvents.map((evt) => {
    const matching = attendees.filter(
      (a) =>
        a.event_id === evt.id ||
        a.event_id.replace(/^arena-/, "") === evt.id.replace(/^arena-/, "") ||
        a.event_name.toLowerCase().includes(evt.name.toLowerCase()) ||
        evt.name.toLowerCase().includes(a.event_name.toLowerCase())
    );
    const checkedIn = matching.filter((a) => a.verified_at !== null).length;
    return {
      ...evt,
      registered_count: matching.length,
      checked_in_count: checkedIn,
    };
  });
}

export function createNewEvent(eventData: Partial<ManagedEvent>): ManagedEvent {
  const currentEvents = loadStoredEvents();

  const newId = (eventData.id || eventData.name || `event-${Date.now()}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const newEvent: ManagedEvent = {
    id: newId,
    name: eventData.name || "New Event",
    tagline: eventData.tagline || "Ameya '26 Special Event",
    day: (eventData.day as 1 | 2) || 1,
    category: eventData.category || "Technical",
    type: "solo",
    venue: eventData.venue || "Central Campus",
    time: eventData.time || "10:00 AM - 01:00 PM",
    description: eventData.description || "Exciting festival competition.",
    prizes: eventData.prizes || "Trophy + Certificate + Cash Award",
    color: eventData.color || (eventData.category === "Technical" ? "#E51D25" : "#0284c7"),
    is_archived: false,
    archived_at: null,
    max_slots: eventData.max_slots || 60,
    created_at: new Date().toISOString(),
    coordinator: eventData.coordinator || "Event Operations",
  };

  currentEvents.unshift(newEvent);
  saveStoredEvents(currentEvents);
  return newEvent;
}

export function toggleEventArchive(eventId: string, archive: boolean): ManagedEvent | null {
  const currentEvents = loadStoredEvents();
  const target = currentEvents.find((e) => e.id === eventId);
  if (!target) return null;

  target.is_archived = archive;
  target.archived_at = archive ? new Date().toISOString() : null;
  saveStoredEvents(currentEvents);
  return target;
}
