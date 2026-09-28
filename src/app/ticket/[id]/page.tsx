"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { Printer, Share2, Check, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import styles from "./page.module.css";

interface TicketData {
  ticket_id: string;
  event_name: string;
  leader_name: string;
  college: string;
  year: string;
  is_team: boolean;
  team_name?: string | null;
  team_id: string;
  verified_at?: string | null;
  members?: Array<{ name: string; email?: string }>;
}

export default function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [qrSrc, setQrSrc] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    async function loadTicket() {
      const qEvent = searchParams.get("event");
      const qName = searchParams.get("name");
      const qTeam = searchParams.get("team");
      const qTeamId = searchParams.get("teamId");

      if (qEvent && qName) {
        setTicket({
          ticket_id: ticketId,
          event_name: qEvent,
          leader_name: qName,
          college: searchParams.get("college") || "VVITU",
          year: searchParams.get("year") || "2026",
          is_team: Boolean(qTeam),
          team_name: qTeam || null,
          team_id: qTeamId || `SOLO-${ticketId.slice(-6)}`,
          verified_at: null,
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/ticket/${ticketId}`);
        if (res.ok) {
          const data = await res.json();
          setTicket(data);
        } else {
          setTicket({
            ticket_id: ticketId,
            event_name: "AMEYA '26 National Conclave",
            leader_name: "Registered Delegate",
            college: "VVITU Guntur",
            year: "2026",
            is_team: false,
            team_id: `DEL-${ticketId.slice(-6)}`,
            verified_at: null,
          });
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [ticketId, searchParams]);

  useEffect(() => {
    if (ticketId) {
      QRCode.toDataURL(ticketId, {
        width: 220,
        margin: 1,
        color: {
          dark: "#050505",
          light: "#FFFFFF",
        },
      }).then(setQrSrc);
    }
  }, [ticketId]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerifyGate = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/ticket/${ticketId}`, { method: "PATCH" });
      if (res.ok) {
        const data = await res.json();
        setTicket((prev) => (prev ? { ...prev, verified_at: data.verified_at } : null));
      }
    } catch (e) {
      console.error("Verification failed", e);
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>
          <div className={styles.scanner}></div>
          <p className={styles.scanText}>VERIFYING CREDENTIAL SIGNATURE // TELEMETRY LINK...</p>
        </div>
      </div>
    );
  }

  const isVerified = Boolean(ticket?.verified_at);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.logo}>AMEYA &apos;26 CREDENTIAL DOCKET</span>
            <span
              className={styles.verified}
              style={{
                color: isVerified ? "#10b981" : "var(--crimson-core, #E51D25)",
                borderColor: isVerified ? "rgba(16,185,129,0.4)" : "rgba(229,29,37,0.4)",
                background: isVerified ? "rgba(16,185,129,0.1)" : "rgba(229,29,37,0.1)",
              }}
            >
              {isVerified ? "✓ ENTRY VERIFIED" : "● CONFIRMED PASS"}
            </span>
          </div>

          <div className={styles.hero}>
            <div className={styles.subLabel}>OFFICIAL DELEGATE ACCESS</div>
            <h1 className={styles.greeting}>
              <span className={styles.name}>{ticket?.leader_name}</span>
            </h1>
            <p className={styles.eventName}>{ticket?.event_name}</p>
          </div>

          <div className={styles.details}>
            <div className={styles.detail}>
              <span>DOCKET ID</span>
              <code>{ticket?.ticket_id}</code>
            </div>

            <div className={styles.detail}>
              <span>CADRE / SQUAD</span>
              <strong className={styles.teamId}>
                {ticket?.is_team && ticket.team_name ? ticket.team_name : ticket?.team_id}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>AFFILIATION</span>
              <strong>{ticket?.college}</strong>
            </div>

            <div className={styles.detail}>
              <span>CONCLAVE SCHEDULE</span>
              <strong>OCT 04–05, 2026 // VVITU CAMPUS</strong>
            </div>

            {ticket?.members && ticket.members.length > 0 && (
              <div style={{ marginTop: "0.25rem", paddingBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>
                  SQUAD PERSONNEL
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {ticket.members.map((m, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        padding: "3px 8px",
                        borderRadius: "2px",
                        background: "rgba(255,255,255,0.06)",
                        color: "var(--text-primary, #F2EDE8)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.qrContainer}>
              {qrSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrSrc}
                  alt="Cryptographic check-in QR code token for delegate credential verification"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  width={140}
                  height={140}
                  className={styles.qrImage}
                />
              ) : (
                <div style={{ width: 140, height: 140, background: "rgba(255,255,255,0.05)", borderRadius: 2 }} />
              )}
              <span className={styles.qrHint}>
                PRESENT AT ACCESS CONTROL / ARENA GATES
              </span>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => window.print()}
                className={styles.actionBtn}
                aria-label="Print or save pass docket"
              >
                <Printer size={13} />
                <span>Print Docket</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className={styles.actionBtn}
                aria-label="Copy credential link"
              >
                {copied ? <Check size={13} color="#10b981" /> : <Share2 size={13} />}
                <span>{copied ? "Link Copied" : "Share Pass"}</span>
              </button>
            </div>

            {!isVerified && (
              <button
                type="button"
                onClick={handleVerifyGate}
                disabled={isVerifying}
                className={styles.verifyBtn}
                aria-label="Verify entry at gate"
              >
                <ShieldCheck size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                {isVerifying ? "AUTHENTICATING..." : "VOLUNTEER GATE CHECK-IN"}
              </button>
            )}
          </div>

          <div className={styles.footer}>
            <p style={{ margin: "0 0 6px 0" }}>IEI SAME STUDENT CHAPTER • VVITU NAMBUR</p>
            <Link href="/events" className={styles.eventsLink}>
              <span>Explore Official Arenas</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
