"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
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
            event_name: "Ameya 2026 Technical Fest",
            leader_name: "Participant",
            college: "VVITU",
            year: "2026",
            is_team: false,
            team_id: `PASS-${ticketId.slice(-6)}`,
            verified_at: null,
          });
        }
      } catch (e) {
        console.error("Failed to load ticket", e);
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [ticketId, searchParams]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      QRCode.toDataURL(url, {
        width: 200,
        margin: 1,
        color: { dark: "#0a0f1e", light: "#ffffff" },
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
          <p className={styles.scanText}>VERIFYING TICKET QUANTUM SIGNATURE...</p>
        </div>
      </div>
    );
  }

  const isVerified = Boolean(ticket?.verified_at);

  return (
    <div className={styles.page}>
      <div className={styles.particles}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={
              {
                "--x": `${(i * 37) % 100}%`,
                "--y": `${(i * 53) % 100}%`,
                "--delay": `${(i * 0.15).toFixed(2)}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.cardGlow}></div>

          <div className={styles.cardTop}>
            <span className={styles.logo}>AMEYA &apos;26 PASS</span>
            <span
              className={styles.verified}
              style={{
                color: isVerified ? "#10b981" : "#00e5ff",
                borderColor: isVerified ? "rgba(16,185,129,0.3)" : "rgba(0,229,255,0.3)",
                background: isVerified ? "rgba(16,185,129,0.1)" : "rgba(0,229,255,0.1)",
              }}
            >
              {isVerified ? "? ENTRY VERIFIED" : "? CONFIRMED PASS"}
            </span>
          </div>

          <div className={styles.hero}>
            <div className={styles.confetti}>???</div>
            <h1 className={styles.greeting}>
              Welcome, <span className={styles.name}>{ticket?.leader_name}</span>
            </h1>
            <p className={styles.eventName}>{ticket?.event_name}</p>
          </div>

          <div className={styles.details}>
            <div className={styles.detail}>
              <span>Ticket ID</span>
              <code>{ticket?.ticket_id}</code>
            </div>

            <div className={styles.detail}>
              <span>Role / Team</span>
              <strong className={styles.teamId}>
                {ticket?.is_team && ticket.team_name ? ticket.team_name : ticket?.team_id}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>Institution</span>
              <strong>{ticket?.college}</strong>
            </div>

            <div className={styles.detail}>
              <span>Date & Venue</span>
              <strong>Oct 4, 2026 ? VVITU Campus</strong>
            </div>

            {ticket?.members && ticket.members.length > 0 && (
              <div style={{ marginTop: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Squad Members
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                  {ticket.members.map((m, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: "0.75rem",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: "rgba(255,255,255,0.06)",
                        color: "#e2e8f0",
                      }}
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem 0" }}>
              {qrSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrSrc}
                  alt="Cryptographic check-in QR code token for delegate credential verification"
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                  width={140}
                  height={140}
                  style={{
                    borderRadius: "12px",
                    border: "2px solid rgba(0, 229, 255, 0.4)",
                    boxShadow: "0 0 20px rgba(0, 229, 255, 0.2)",
                  }}
                />
              ) : (
                <div style={{ width: 140, height: 140, background: "rgba(255,255,255,0.05)", borderRadius: 12 }} />
              )}
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "8px" }}>
                Scan at entrance gate for validation
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
              <button suppressHydrationWarning
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ??? Print / Save
              </button>

              <button suppressHydrationWarning
                onClick={handleShare}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(0,229,255,0.3)",
                  background: "rgba(0,229,255,0.1)",
                  color: "#00e5ff",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {copied ? "? Link Copied!" : "?? Share Pass"}
              </button>
            </div>

            {!isVerified && (
              <button suppressHydrationWarning
                onClick={handleVerifyGate}
                disabled={isVerifying}
                style={{
                  marginTop: "8px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px dashed rgba(16,185,129,0.4)",
                  background: "rgba(16,185,129,0.05)",
                  color: "#10b981",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {isVerifying ? "Verifying..." : "? Volunteer Check-in (Tap to verify at gate)"}
              </button>
            )}
          </div>

          <div className={styles.footer}>
            <p style={{ margin: "0 0 8px 0" }}>IEI SAME Student Chapter ? VVITU Nambur</p>
            <Link
              href="/agenda"
              style={{
                color: "#a78bfa",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.8rem",
              }}
            >
              ? Explore Schedule & Agenda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
