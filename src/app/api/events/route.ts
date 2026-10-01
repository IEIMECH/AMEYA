import { NextResponse } from "next/server";
import { getActiveEvents } from "@/lib/adminStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const activeEvents = await getActiveEvents();
    return NextResponse.json(
      { events: activeEvents },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err) {
    console.error("Public events GET error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve active festival events" },
      { status: 500 }
    );
  }
}
