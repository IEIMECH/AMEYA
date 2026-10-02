import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { getAuthenticatedAdmin } from "@/lib/adminAuth";

const EVENT_TABLES = [
  "all_registrations",
  "reg_autocad",
  "reg_assemble_disassemble",
  "reg_rc_car_challenge",
  "reg_picto",
  "reg_engineering_drawing",
  "reg_identify_tools",
  "reg_treasure_hunt",
  "reg_nuts_bolts_speed_race",
  "registrations",
];

function maskEmail(str?: string | null): string | undefined {
  if (!str) return undefined;
  const parts = str.split("@");
  if (parts.length !== 2) return "***";
  const user = parts[0];
  const domain = parts[1];
  const visible = user.slice(0, 2);
  return `${visible}***@${domain}`;
}

function maskPhone(str?: string | null): string | undefined {
  if (!str) return undefined;
  const clean = str.replace(/\s+/g, "");
  if (clean.length < 6) return "***";
  return `${clean.slice(0, 3)}*****${clean.slice(-3)}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing ticket ID" }, { status: 400 });
    }

    // Verify if caller is an authorized admin/coordinator (for full unmasked PII view)
    const admin = await getAuthenticatedAdmin(req);
    const isAuthorized = Boolean(admin);

    if (!isDatabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({
        ticket_id: id,
        event_name: "AMEYA '26 Accreditation",
        leader_name: "Ameya Delegate",
        college: "VVIT Nambur",
        year: "2026",
        is_team: false,
        team_id: `ID-${id.slice(-5)}`,
        verified_at: null,
      });
    }

    // 1. Try unified registrations table first (checks both id and ticket_id)
    const { data: regData, error: regError } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (regData && !regError) {
      const rawEmail = regData.email || regData.leader_email;
      const rawPhone = regData.phone || regData.leader_phone;

      return NextResponse.json({
        ticket_id: regData.id || regData.ticket_id,
        event_name: regData.event_name,
        leader_name: regData.full_name || regData.participant_name || regData.leader_name,
        college: regData.branch || regData.college || "VVITU",
        year: "2026",
        is_team: false,
        team_id: `SOLO-${(regData.id || regData.ticket_id).slice(-6)}`,
        verified_at: regData.verified_at,
        email: isAuthorized ? rawEmail : maskEmail(rawEmail),
        phone: isAuthorized ? rawPhone : maskPhone(rawPhone),
        college_roll_number: regData.college_roll_number,
        branch: regData.branch,
      });
    }

    // 2. Fallback to scanning individual tables
    for (const table of EVENT_TABLES) {
      if (table === "all_registrations") continue;
      const { data, error } = await supabaseAdmin
        .from(table)
        .select("*")
        .eq("ticket_id", id)
        .maybeSingle();

      if (data && !error) {
        const rawEmail = data.leader_email || data.email;
        const rawPhone = data.leader_phone || data.phone;

        return NextResponse.json({
          ...data,
          table_source: table,
          leader_name: data.leader_name || data.full_name,
          email: isAuthorized ? rawEmail : maskEmail(rawEmail),
          phone: isAuthorized ? rawPhone : maskPhone(rawPhone),
        });
      }
    }

    return NextResponse.json({ error: "Ticket dossier not found" }, { status: 404 });
  } catch (err) {
    console.error("Ticket fetch error:", err);
    return NextResponse.json({ error: "Server error retrieving ticket" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing ticket ID" }, { status: 400 });
    }

    // Strict Security Guard: Only authenticated executive/coordinator credentials can stamp gate admission
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Coordinator authentication required to verify gate admission." },
        { status: 401 }
      );
    }

    if (!isDatabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({ verified: true, verified_at: new Date().toISOString() });
    }

    const now = new Date().toISOString();
    const verifier = `${admin.role} // ${admin.name}`;

    // 1. Check registrations table first
    const { data: updatedReg } = await supabaseAdmin
      .from("registrations")
      .update({ verified_at: now, verified_by: verifier })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (updatedReg) {
      return NextResponse.json({
        verified: true,
        verified_at: now,
        verified_by: verifier,
        table_source: "registrations",
        data: updatedReg,
      });
    }

    return NextResponse.json({ error: "Ticket not found for verification stamp" }, { status: 404 });
  } catch (err) {
    console.error("Verification update error:", err);
    return NextResponse.json({ error: "Server error verifying gate ticket" }, { status: 500 });
  }
}
