export const dynamic = "force-dynamic";
export const revalidate = 0;
import { NextRequest, NextResponse } from "next/server";
import {
  getLiveAttendees,
  toggleAttendeeAttendance,
  bulkMarkAttendance,
} from "@/lib/adminStore";
import { getAuthenticatedAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    // Cryptographic Session Check
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Valid coordinator credentials required." },
        { status: 401 }
      );
    }

    const attendees = await getLiveAttendees();
    const { searchParams } = new URL(req.url);

    const eventId = searchParams.get("event") || "all";
    const attendanceFilter = searchParams.get("attendance") || "all";
    const statusFilter = searchParams.get("status") || "all";
    const search = (searchParams.get("q") || "").toLowerCase().trim();

    let filtered = attendees;

    // Filter by Event
    if (eventId !== "all") {
      filtered = filtered.filter((a) => a.event_id === eventId);
    }

    // Filter by Attendance
    if (attendanceFilter === "attended") {
      filtered = filtered.filter((a) => a.verified_at !== null);
    } else if (attendanceFilter === "pending") {
      filtered = filtered.filter((a) => a.verified_at === null);
    }

    // Filter by Status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (a) => a.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by Search Query
    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.participant_name.toLowerCase().includes(search) ||
          a.college_roll_number.toLowerCase().includes(search) ||
          a.ticket_id.toLowerCase().includes(search) ||
          a.email.toLowerCase().includes(search) ||
          a.phone.includes(search) ||
          a.branch.toLowerCase().includes(search)
      );
    }

    const total = attendees.length;
    const totalCheckedIn = attendees.filter((a) => a.verified_at !== null).length;
    const totalPending = total - totalCheckedIn;

    return NextResponse.json({
      attendees: filtered,
      metrics: {
        total,
        totalCheckedIn,
        totalPending,
        rate: total > 0 ? Math.round((totalCheckedIn / total) * 100) : 0,
      },
    });
  } catch (err) {
    console.error("Admin attendees GET error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve attendees" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Cryptographic Session Check
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Valid coordinator credentials required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { ticketId, rollNumber, coordinator, forceStatus } = body;

    const coordinatorName = coordinator || admin.name;

    let targetTicket = ticketId;

    // If searching by roll number instead of ticket ID
    if (!targetTicket && rollNumber) {
      const attendees = await getLiveAttendees();
      const match = attendees.find(
        (a) => a.college_roll_number.toLowerCase() === rollNumber.toLowerCase().trim()
      );
      if (match) {
        targetTicket = match.ticket_id;
      }
    }

    if (!targetTicket) {
      return NextResponse.json(
        { error: "Ticket ID or valid roll number is required" },
        { status: 400 }
      );
    }

    const result = await toggleAttendeeAttendance(
      targetTicket,
      coordinatorName,
      forceStatus
    );

    if (!result.success) {
      return NextResponse.json(
        { error: `Attendee with ticket '${targetTicket}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      attendee: result.attendee,
      message: result.attendee?.verified_at
        ? `Attendance marked for ${result.attendee.participant_name}`
        : `Attendance unmarked for ${result.attendee?.participant_name}`,
    });
  } catch (err) {
    console.error("Admin attendance PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update attendance record" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Cryptographic Session Check
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Valid coordinator credentials required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, ticketIds, coordinator } = body;

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return NextResponse.json(
        { error: "No tickets provided for bulk action" },
        { status: 400 }
      );
    }

    const coordinatorName = coordinator || admin.name;

    if (action === "mark_present") {
      const count = await bulkMarkAttendance(ticketIds, coordinatorName, true);
      return NextResponse.json({
        success: true,
        count,
        message: `Successfully marked attendance for ${count} delegates.`,
      });
    }

    if (action === "mark_absent") {
      const count = await bulkMarkAttendance(ticketIds, coordinatorName, false);
      return NextResponse.json({
        success: true,
        count,
        message: `Reset attendance for ${count} delegates.`,
      });
    }

    return NextResponse.json(
      { error: `Unsupported bulk action '${action}'` },
      { status: 400 }
    );
  } catch (err) {
    console.error("Admin attendees POST error:", err);
    return NextResponse.json(
      { error: "Failed to perform bulk operation" },
      { status: 500 }
    );
  }
}
