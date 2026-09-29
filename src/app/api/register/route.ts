import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import QRCode from "qrcode";
import { Resend } from "resend";
import { supabaseAdmin, isDatabaseConfigured, getEventTableName } from "@/lib/supabase";
import { events } from "@/data/events";
import { sendTicketEmail } from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");
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

    // Generate unique AMEYA '26 Ticket Token
    const prefix = eventId ? eventId.replace(/[^a-zA-Z0-9]/g, "").substring(0, 4).toUpperCase() : "SOLO";
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `AMEYA-2026-${prefix}-${randomSuffix}`;
    const targetTable = getEventTableName(eventId);

    let collegeIdCardUrl = `local_ref_${crypto.randomUUID()}`;

    // 2. Storage upload for College ID Card Image
    if (collegeIdCardFile && isDatabaseConfigured() && supabaseAdmin) {
      try {
        const fileExt = collegeIdCardFile.name.split(".").pop()?.toLowerCase() || "jpg";
        // Anonymized storage path to protect participant personal identity
        const secureStoragePath = `ids/${eventId || "general"}/id_${crypto.randomUUID()}.${fileExt}`;
        const arrayBuffer = await collegeIdCardFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Ensure private bucket exists
        try {
          const { data: buckets } = await supabaseAdmin.storage.listBuckets();
          const bucketExists = buckets?.some((b) => b.name === "college_ids");
          if (!bucketExists) {
            await supabaseAdmin.storage.createBucket("college_ids", {
              public: false, // Private access: only authorized admins/service role can access
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
          // If storage upload fails due to RLS/Bucket policy, return specific error
          return NextResponse.json(
            { error: `College ID card image upload failed: ${uploadError.message}. Please check your connection and try again.` },
            { status: 500 }
          );
        }

        collegeIdCardUrl = `college_ids/${secureStoragePath}`;
      } catch (storageErr: any) {
        console.error("Storage processing error:", storageErr);
        return NextResponse.json(
          { error: "College ID card image upload failed. Please try again with a valid JPG/PNG image." },
          { status: 500 }
        );
      }
    }

    // 3. Duplicate Registration Protection: Check (email OR collegeRollNumber) for this specific event
    if (isDatabaseConfigured() && supabaseAdmin) {
      try {
        // Check dedicated table first
        const { data: existingDedicated } = await supabaseAdmin
          .from(targetTable)
          .select("id, ticket_id, email, college_roll_number")
          .or(`email.eq.${email},college_roll_number.eq.${collegeRollNumber}`)
          .limit(1)
          .maybeSingle();

        if (existingDedicated) {
          return NextResponse.json(
            {
              error: `Duplicate Registration: Participant with email "${email}" or roll number "${collegeRollNumber}" is already registered for ${eventName || "this event"}.`,
              isDuplicate: true,
              ticketId: existingDedicated.ticket_id,
            },
            { status: 409 }
          );
        }

        // Check unified registrations table
        if (targetTable !== "registrations") {
          const { data: existingUnified } = await supabaseAdmin
            .from("registrations")
            .select("id, ticket_id")
            .eq("event_id", eventId)
            .or(`email.eq.${email},college_roll_number.eq.${collegeRollNumber}`)
            .limit(1)
            .maybeSingle();

          if (existingUnified) {
            return NextResponse.json(
              {
                error: `Duplicate Registration: Participant with email "${email}" or roll number "${collegeRollNumber}" is already registered for ${eventName || "this event"}.`,
                isDuplicate: true,
                ticketId: existingUnified.ticket_id,
              },
              { status: 409 }
            );
          }
        }
      } catch (dupErr) {
        console.warn("Duplicate check non-blocking error:", dupErr);
      }

      // 4. Insert into database
      try {
        const registrationPayload = {
          ticket_id: ticketId,
          registration_id: ticketId,
          event_id: eventId,
          event_name: eventName,
          participant_name: name,
          leader_name: name, // backward compatibility
          branch: branch,
          college_roll_number: collegeRollNumber,
          email: email,
          leader_email: email, // backward compatibility
          phone: phone,
          leader_phone: phone, // backward compatibility
          college: "VVITU Nambur",
          college_id_card_url: collegeIdCardUrl,
          payment_status: "confirmed",
          created_at: new Date().toISOString(),
        };

        const { error: dbError } = await supabaseAdmin.from(targetTable).insert(registrationPayload);
        if (dbError) {
          console.error(`Supabase ${targetTable} insert error:`, dbError);
          // Fallback to registrations table
          if (targetTable !== "registrations") {
            try {
              await supabaseAdmin.from("registrations").insert(registrationPayload);
            } catch (fallbackErr) {
              console.error("Fallback insert err:", fallbackErr);
            }
          }
        }
      } catch (insertErr) {
        console.error("Database insert error:", insertErr);
      }
    }

    // 5. Generate QR Code token for ticket pass
    const ticketUrl = `${BASE_URL}/ticket/${ticketId}?event=${encodeURIComponent(eventName)}&name=${encodeURIComponent(name)}&college=${encodeURIComponent(branch)}&year=2026`;
    let qrDataUrl = "";
    try {
      qrDataUrl = await QRCode.toDataURL(ticketUrl, {
        width: 280,
        margin: 2,
        color: { dark: "#080808", light: "#ffffff" },
      });
    } catch (qrErr) {
      console.error("QR Code generation error:", qrErr);
    }

    // 6. Send confirmation email via Google SMTP (primary) or Resend (fallback)
    try {
      await sendTicketEmail({
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
    } catch (mailDispatchErr) {
      console.error("[Register Route] Email dispatch caught error:", mailDispatchErr);
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
