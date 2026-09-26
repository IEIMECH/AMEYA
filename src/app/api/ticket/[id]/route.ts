import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing ticket ID" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({
        ticket_id: id,
        event_name: "Ameya 2026 Event",
        leader_name: "Ameya Attendee",
        college: "VVITU",
        year: "2026",
        is_team: false,
        team_id: `ID${id.slice(-6)}`,
        verified_at: null,
      });
    }

    const { data, error } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .eq("ticket_id", id)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }


    return NextResponse.json(data);
  } catch (err) {
    console.error("Ticket fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!supabaseAdmin) {
      return NextResponse.json({ verified: true, verified_at: new Date().toISOString() });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("registrations")
      .update({ verified_at: now })
      .eq("ticket_id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ verified: true, verified_at: now, data });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}