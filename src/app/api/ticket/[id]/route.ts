import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";

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
  "registrations"
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing ticket ID" }, { status: 400 });
    }

    if (!isDatabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({
        ticket_id: id,
        event_name: "AMEYA '26 Accreditation",
        leader_name: "Ameya Delegate",
        college: "VVIIT Nambur",
        year: "2026",
        is_team: false,
        team_id: `ID-${id.slice(-5)}`,
        verified_at: null,
      });
    }

    // 1. Try unified view first
    const { data: viewData, error: viewError } = await supabaseAdmin
      .from("all_registrations")
      .select("*")
      .eq("ticket_id", id)
      .maybeSingle();

    if (viewData && !viewError) {
      return NextResponse.json(viewData);
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
        return NextResponse.json({
          ...data,
          table_source: table,
          leader_name: data.leader_name || data.full_name,
          leader_email: data.leader_email || data.email,
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
    if (!isDatabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({ verified: true, verified_at: new Date().toISOString() });
    }

    const now = new Date().toISOString();
    const verifier = "GATE-01 // AMEYA SECURITY CADRE";

    // 1. Check which table holds this ticket
    for (const table of EVENT_TABLES) {
      if (table === "all_registrations") continue;
      const { data, error } = await supabaseAdmin
        .from(table)
        .update({ verified_at: now, verified_by: verifier })
        .eq("ticket_id", id)
        .select()
        .maybeSingle();

      if (data && !error) {
        return NextResponse.json({
          verified: true,
          verified_at: now,
          table_source: table,
          data
        });
      }
    }

    return NextResponse.json({ error: "Ticket not found for verification stamp" }, { status: 404 });
  } catch (err) {
    console.error("Verification update error:", err);
    return NextResponse.json({ error: "Server error verifying gate ticket" }, { status: 500 });
  }
}
