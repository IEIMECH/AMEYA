import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin, isDatabaseConfigured, getEventTableName } from "@/lib/supabase";
import { events } from "@/data/events";
import { sendTicketEmail } from "@/lib/email";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ameyafest.vercel.app";

export async function POST(req: NextRequest) {
  try {
    let eventId = "";
    let eventName = "";
    let day = 1;
    let category = "Technical";
    let name = "";
    let branch = "";
    let collegeRollNumber = "";
    let email = "";
    let phone = "";
    let collegeIdCardFile: File | null = null;

    const contentType = req.headers.get("content-type") || "";

    // Support both multipart/form-data and application/json
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      eventId = String(formData.get("eventId") || "").trim();
      eventName = String(formData.get("eventName") || "").trim();
      day = Number(formData.get("day")) || 1;
      category = String(formData.get("category") || "Technical").trim();
      name = String(formData.get("name") || "").trim();
      branch = String(formData.get("branch") || "").trim();
      collegeRollNumber = String(formData.get("collegeRollNumber") || "").trim().toUpperCase();
      email = String(formData.get("email") || "").trim().toLowerCase();
      phone = String(formData.get("phone") || "").trim();
      
      const fileEntry = formData.get("collegeIdCard");
      if (fileEntry instanceof File) {
        collegeIdCardFile = fileEntry;
      }
    } else {
      const json = await req.json();
      eventId = String(json.eventId || (json.event && json.event.id) || "").trim();
      eventName = String(json.eventName || (json.event && json.event.name) || "").trim();
      day = Number(json.day || (json.event && json.event.day)) || 1;
      category = String(json.category || (json.event && json.event.category) || "Technical").trim();
      name = String(json.name || (json.form && json.form.name) || "").trim();
      branch = String(json.branch || (json.form && json.form.branch) || "").trim();
      collegeRollNumber = String(json.collegeRollNumber || (json.form && json.form.collegeRollNumber) || "").trim().toUpperCase();
      email = String(json.email || (json.form && json.form.email) || "").trim().toLowerCase();
      phone = String(json.phone || (json.form && json.form.phone) || "").trim();
    }

    // Resolve event details from authoritative data if missing
    if (!eventName && eventId) {
      const found = events.find((e) => e.id === eventId);
      if (found) {
        eventName = found.name;
        day = found.day;
        category = found.category;
      }
    }

    // 1. Validation for all required participant fields
    if (!name) {
      return NextResponse.json({ error: "Participant Full Name is required." }, { status: 400 });
    }
    if (!branch) {
      return NextResponse.json({ error: "Engineering Branch is required." }, { status: 400 });
    }
    if (!collegeRollNumber) {
      return NextResponse.json({ error: "College Roll Number is required." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "A valid Email address is required." }, { status: 400 });
    }
    const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "A valid 10-digit Phone number is required." }, { status: 400 });
    }

    // Generate unique AMEYA '26 Ticket Token (e.g. AMEYA-2026-AUTO-9253)
    const prefix = eventId ? eventId.replace(/[^a-zA-Z0-9]/g, "").substring(0, 4).toUpperCase() : "SOLO";
    const generateTicketId = () => `AMEYA-2026-${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;
    let ticketId = generateTicketId();
    const targetTable = getEventTableName(eventId);

    let collegeIdCardUrl = `local_ref_${crypto.randomUUID()}`;

    // 2. Storage upload for College ID Card Image
    if (collegeIdCardFile && isDatabaseConfigured() && supabaseAdmin) {
      try {
        const fileExt = collegeIdCardFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const secureStoragePath = `ids/${eventId || "general"}/id_${crypto.randomUUID()}.${fileExt}`;
        const arrayBuffer = await collegeIdCardFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        try {
          const { data: buckets } = await supabaseAdmin.storage.listBuckets();
          const bucketExists = buckets?.some((b) => b.name === "college_ids");
          if (!bucketExists) {
            await supabaseAdmin.storage.createBucket("college_ids", {
              public: true,
              fileSizeLimit: 5242880,
              allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg"],
            });
          }
        } catch (bucketErr) {
          console.warn("Storage bucket check warning:", bucketErr);
        }

        const { error: uploadError } = await supabaseAdmin.storage
          .from("college_ids")
          .upload(secureStoragePath, buffer, {
            contentType: collegeIdCardFile.type || "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          console.error("Supabase Storage upload error:", uploadError);
          return NextResponse.json(
            { error: `College ID card image upload failed: ${uploadError.message}. Please check your connection and try again.` },
            { status: 500 }
          );
        }

        const { data: publicUrlData } = supabaseAdmin.storage
          .from("college_ids")
          .getPublicUrl(secureStoragePath);

        collegeIdCardUrl = publicUrlData?.publicUrl || `college_ids/${secureStoragePath}`;
      } catch (storageErr: any) {
        console.error("Storage processing error:", storageErr);
        return NextResponse.json(
          { error: "College ID card image upload failed. Please try again with a valid JPG/PNG image." },
          { status: 500 }
        );
      }
    }

    // 3. Duplicate Registration Protection
    if (isDatabaseConfigured() && supabaseAdmin) {
      try {
        const { data: existing } = await supabaseAdmin
          .from("registrations")
          .select("id, email, college_roll_number")
          .eq("event_name", eventName)
          .or(`email.eq.${email},college_roll_number.eq.${collegeRollNumber}`)
          .limit(1)
          .maybeSingle();

        if (existing) {
          return NextResponse.json(
            {
              error: `Duplicate Registration: Participant with email "${email}" or roll number "${collegeRollNumber}" is already registered for ${eventName || "this event"}.`,
              isDuplicate: true,
              ticketId: existing.id,
            },
            { status: 409 }
          );
        }
      } catch (dupErr) {
        console.warn("Duplicate check non-blocking warning:", dupErr);
      }

      // 4. Clean Insert into Supabase registrations table
      let savedToDb = false;
      let lastDbError: any = null;

      // 4a. Clean Schema Insert with automatic zero-collision retry
      try {
        for (let attempt = 0; attempt < 3; attempt++) {
          const cleanPayload = {
            id: ticketId,
            event_name: eventName,
            full_name: name,
            branch: branch,
            college_roll_number: collegeRollNumber,
            email: email,
            phone: phone,
            college_id_card_url: collegeIdCardUrl,
          };

          const { error: cleanErr } = await supabaseAdmin
            .from("registrations")
            .insert(cleanPayload);

          if (!cleanErr) {
            savedToDb = true;
            break;
          }

          // If duplicate key collision on ID, generate fresh token and retry immediately
          if (cleanErr.code === "23505" || cleanErr.message?.includes("duplicate") || cleanErr.message?.includes("unique")) {
            ticketId = generateTicketId();
            continue;
          }

          lastDbError = cleanErr;
          break;
        }

        if (!savedToDb && lastDbError) {
          console.warn("Clean registrations insert attempted:", lastDbError.message);

          // 4b. Fallback compatibility if user hasn't executed the new SQL migration yet:
          if (lastDbError.message?.includes("full_name") || lastDbError.message?.includes("column")) {
            const legacyPayload = {
              ticket_id: ticketId,
              event_id: eventId,
              event_name: eventName,
              leader_name: name,
              leader_email: email,
              leader_phone: phone,
              college: "VVIT Nambur",
              college_roll_number: collegeRollNumber,
              branch: branch,
              year: "2026",
              college_id_card_url: collegeIdCardUrl,
              payment_status: "confirmed",
              is_team: false,
              team_id: `SOLO-${ticketId}`,
              team_name: "Individual",
              members: [],
              created_at: new Date().toISOString(),
            };

            const { error: legacyErr } = await supabaseAdmin.from("registrations").insert(legacyPayload);
            if (!legacyErr) {
              savedToDb = true;
            } else {
              lastDbError = legacyErr;
            }

            // Also try event table if active
            if (targetTable !== "registrations") {
              try {
                await supabaseAdmin.from(targetTable).insert({
                  ticket_id: ticketId,
                  registration_id: ticketId,
                  event_id: eventId,
                  event_name: eventName,
                  participant_name: name,
                  email: email,
                  phone: phone,
                  college_roll_number: collegeRollNumber,
                  branch: branch,
                  college_id_card_url: collegeIdCardUrl,
                  payment_status: "confirmed",
                  created_at: new Date().toISOString(),
                });
              } catch {}
            }
          }
        }
      } catch (insertEx) {
        lastDbError = insertEx;
        console.error("Supabase insert exception:", insertEx);
      }

      if (!savedToDb && lastDbError) {
        console.error("[CRITICAL] Registration could not be saved to Supabase:", lastDbError);
        return NextResponse.json(
          { error: `Database error: ${lastDbError.message || "Failed to commit record"}. Please try again.` },
          { status: 500 }
        );
      }
    }

    // 5. Ticket URL for online view
    const ticketUrl = `${BASE_URL}/ticket/${ticketId}?event=${encodeURIComponent(eventName)}&name=${encodeURIComponent(name)}&college=${encodeURIComponent(branch)}&year=2026`;

    // 6. Send confirmation email via Google SMTP (Dual-strategy failover)
    let emailDelivery = { success: false, provider: "none", error: undefined as string | undefined };
    try {
      const emailResult = await sendTicketEmail({
        email,
        name,
        ticketId,
        eventName,
        day,
        category,
        branch,
        collegeRollNumber,
        ticketUrl,
      });
      emailDelivery = {
        success: emailResult.success,
        provider: emailResult.provider,
        error: emailResult.error,
      };
      console.log(`[Register Route] Email dispatch to ${email} (Provider: ${emailResult.provider}, Success: ${emailResult.success})`);
    } catch (mailDispatchErr: any) {
      console.error("[Register Route] Email dispatch caught error:", mailDispatchErr);
      emailDelivery.error = mailDispatchErr?.message;
    }

    return NextResponse.json({
      success: true,
      ticketId,
      eventName,
      participantName: name,
      day,
      category,
    }, { status: 200 });

  } catch (err: any) {
    console.error("Registration route error:", err);
    return NextResponse.json({ error: "Registration transmission failed. Please try again." }, { status: 500 });
  }
}
