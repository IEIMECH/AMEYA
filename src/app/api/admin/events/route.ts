export const dynamic = "force-dynamic";
export const revalidate = 0;
import { NextRequest, NextResponse } from "next/server";
import {
  getManagedEvents,
  createNewEvent,
  toggleEventArchive,
} from "@/lib/adminStore";
import { getAuthenticatedAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator session required." },
        { status: 401 }
      );
    }

    const events = await getManagedEvents();
    const active = events.filter((e) => !e.is_archived);
    const archived = events.filter((e) => e.is_archived);

    return NextResponse.json({
      events,
      activeEvents: active,
      archivedEvents: archived,
      totalActive: active.length,
      totalArchived: archived.length,
    });
  } catch (err) {
    console.error("Admin events GET error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator session required." },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: "Event name and category are required" },
        { status: 400 }
      );
    }

    const created = createNewEvent({
      ...body,
      coordinator: body.coordinator || admin.name,
    });

    return NextResponse.json({
      success: true,
      event: created,
      message: `Event '${created.name}' created successfully.`,
    });
  } catch (err) {
    console.error("Admin events POST error:", err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { eventId, archive } = body;

    if (!eventId || typeof archive !== "boolean") {
      return NextResponse.json(
        { error: "eventId and archive boolean flag are required" },
        { status: 400 }
      );
    }

    const updated = toggleEventArchive(eventId, archive);
    if (!updated) {
      return NextResponse.json(
        { error: `Event with id '${eventId}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event: updated,
      message: archive
        ? `Event '${updated.name}' has been archived.`
        : `Event '${updated.name}' restored to active lineup.`,
    });
  } catch (err) {
    console.error("Admin events PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update event archive status" },
      { status: 500 }
    );
  }
}
