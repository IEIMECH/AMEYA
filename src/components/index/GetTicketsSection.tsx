"use client";

import { Calendar, ArrowRight, Check } from "lucide-react";

interface Props {
  onRegisterClick: (ticketType?: string) => void;
}

const ticketTiers = [
  {
    id: "general",
    title: "General Delegate Pass",
    price: "FREE",
    badge: "OPEN ACCESS // GENERAL",
    isPrimary: false,
    features: [
      "Access to all Keynote Addresses & Invited Tech Talks",
      "Spectator entry to Live Robotics & Combat Arenas",
      "Official Digital Participation Certificate",
      "Campus Wi-Fi & Technical Networking Kit",
    ],
  },
  {
    id: "competitor",
    title: "Technical Competitor Pass",
    price: "₹200",
    badge: "FULL ACCESS // COMPETITOR",
    isPrimary: true,
    features: [
      "Registration for any 2 Technical Competitions",
      "Eligibility for ₹50,000 Total Prize Pool",
      "Hardware Testing Bay & Power Station Access",
      "Official Conclave Swag & Certificate of Merit",
    ],
  },
  {
    id: "vip",
    title: "All-Access Engineering Pass",
    price: "₹450",
    badge: "OMNI ACCESS // ALL-ARENAS",
    isPrimary: false,
    features: [
      "Unlimited registration across all 10 Arenas",
      "Priority Pit Lane & Prototyping Lab Access",
      "Exclusive Speakers Dinner & Networking Banquet",
      "Premium Hardware Toolkit & Printed Dossier",
    ],
  },
];

export default function GetTicketsSection({ onRegisterClick }: Props) {
  const generateICS = (title: string) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ameya 2026//EN
BEGIN:VEVENT
UID:${Date.now()}@ameya.vvitu.edu.in
DTSTAMP:20260925T000000Z
DTSTART:20261004T033000Z
DTEND:20261005T123000Z
SUMMARY:Ameya 2026 - ${title}
DESCRIPTION:Annual Mechanical Technical Fest by IEI SAME at VVITU Nambur.
LOCATION:VVITU Campus, Nambur, Guntur, Andhra Pradesh
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Ameya2026_${title.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="tickets"
      style={{
        position: "relative",
        zIndex: 2,
        padding: "8rem 1.5rem 7.5rem",
        background: "var(--machined-dark, #050505)",
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Editorial Section Header */}
        <div style={{ marginBottom: "4rem" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "var(--text-secondary, #96908B)",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            REGISTRATION // ADMISSION TIERS
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.4rem, 4.8vw, 4rem)",
                fontWeight: 800,
                color: "var(--text-primary, #F2EDE8)",
                letterSpacing: "-0.02em",
                margin: 0,
                lineHeight: 1,
              }}
            >
              Entry Passes &amp; Access
            </h2>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "var(--text-secondary, #96908B)",
                maxWidth: "460px",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Select your participation tier. All registrations include full access to the festival exhibition floor and technical keynotes.
            </p>
          </div>
        </div>

        {/* Priority 8: Editorial Pricing Spread (Zero card repetition, generous breathing room) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2.5rem",
            alignItems: "stretch",
          }}
        >
          {ticketTiers.map((tk) => {
            const isFeatured = tk.isPrimary;
            return (
              <div
                key={tk.id}
                style={{
                  position: "relative",
                  background: isFeatured ? "var(--machined-surface, #101010)" : "transparent",
                  border: isFeatured ? "1px solid rgba(229, 29, 37, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "4px",
                  padding: "2.5rem 2rem",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: isFeatured ? "0 16px 40px rgba(0, 0, 0, 0.85), 0 0 25px rgba(229, 29, 37, 0.12)" : "none",
                  transition: "border-color 0.25s ease, transform 0.25s ease",
                }}
              >
                {/* Header Tag */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      color: isFeatured ? "var(--crimson-core, #E51D25)" : "var(--text-secondary, #96908B)",
                      textTransform: "uppercase",
                    }}
                  >
                    {tk.badge}
                  </span>
                </div>

                {/* Monumental Price & Title */}
                <div style={{ marginBottom: "2rem" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2.6rem, 4vw, 3.8rem)",
                      fontWeight: 800,
                      color: "var(--text-primary, #F2EDE8)",
                      lineHeight: 1,
                      marginBottom: "0.65rem",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {tk.price}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.35rem",
                      fontWeight: 700,
                      color: "var(--text-primary, #F2EDE8)",
                      margin: 0,
                    }}
                  >
                    {tk.title}
                  </h3>
                </div>

                {/* Features List */}
                <div style={{ flex: 1, marginBottom: "2.5rem" }}>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                    {tk.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.75rem",
                          fontSize: "0.85rem",
                          lineHeight: 1.5,
                          color: "var(--text-secondary, #96908B)",
                        }}
                      >
                        <Check size={14} color={isFeatured ? "#E51D25" : "#605B56"} style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Row */}
                <div style={{ display: "flex", gap: "0.65rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => onRegisterClick(tk.title)}
                    style={{
                      flex: 1,
                      background: isFeatured ? "var(--crimson-core, #E51D25)" : "transparent",
                      border: isFeatured ? "1px solid var(--crimson-glow, #ff3b3b)" : "1px solid rgba(255, 255, 255, 0.15)",
                      color: isFeatured ? "#ffffff" : "var(--text-primary, #F2EDE8)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      padding: "0.85rem 1rem",
                      borderRadius: "3px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isFeatured) {
                        e.currentTarget.style.borderColor = "var(--crimson-core, #E51D25)";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isFeatured) {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                        e.currentTarget.style.color = "var(--text-primary, #F2EDE8)";
                      }
                    }}
                  >
                    <span>CLAIM PASS</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => generateICS(tk.title)}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "var(--text-secondary, #96908B)",
                      padding: "0.85rem",
                      borderRadius: "3px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "border-color 0.2s ease, color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--crimson-core, #E51D25)";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                      e.currentTarget.style.color = "var(--text-secondary, #96908B)";
                    }}
                    title="Add dates to calendar (.ics)"
                  >
                    <Calendar size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
