import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sector, name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "INPUT ERROR // Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (isDatabaseConfigured() && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from("inquiries").insert({
        sector: sector || "general",
        name,
        email,
        subject: subject || "AMEYA '26 Communications Inquiry",
        message,
        status: "unread",
      }).select().single();

      if (error) {
        console.error("Supabase inquiries error:", error);
        return NextResponse.json({ error: "Failed to persist inquiry" }, { status: 500 });
      }

      return NextResponse.json({ success: true, inquiryId: data.id }, { status: 200 });
    }

    // Local development fallback
    console.log("Mock Contact Inquiry Stored:", { sector, name, email, subject, message });
    return NextResponse.json(
      { success: true, mock: true, message: "Inquiry received in local sandbox mode." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error processing inquiry" }, { status: 500 });
  }
}
