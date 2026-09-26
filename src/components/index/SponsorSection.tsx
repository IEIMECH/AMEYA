"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, X, ShieldAlert } from "lucide-react";

interface Sponsor {
  name: string;
  tier: "Title" | "Associate" | "Technology" | "Community";
  logo: string;
  tagline: string;
  description: string;
  website: string;
}

const sponsors: Sponsor[] = [
  {
    name: "Tata Advanced Systems",
    tier: "Title",
    logo: "/img/sponsors/tsmc.svg",
    tagline: "Aerospace & Defense Engineering",
    description: "Leading manufacturing solutions across aerospace structures, airborne payloads, and defense electronics. Title sponsor of Ameya 2026.",
    website: "https://www.tataadvancedsystems.com",
  },
  {
    name: "L&T Heavy Engineering",
    tier: "Associate",
    logo: "/img/sponsors/amd.svg",
    tagline: "Precision Nuclear & Process Equipment",
    description: "Global benchmark in heavy engineering manufacturing and high-pressure vessel design. Official sponsor of the Robo Rumble Combat Arena.",
    website: "https://www.larsentoubro.com",
  },
  {
    name: "Autodesk India",
    tier: "Technology",
    logo: "/img/sponsors/HIT.svg",
    tagline: "CAD & Generative Design Software",
    description: "Providing free educational licenses, CAD competition judging, and digital design certifications for Ameya participants.",
    website: "https://www.autodesk.in",
  },
  {
    name: "Institution of Engineers (India)",
    tier: "Community",
    logo: "/img/sponsors/SITCON.svg",
    tagline: "Apex Body of Engineers in India",
    description: "Empowering student chapters across technical campuses with technical journals, national conventions, and research grants.",
    website: "https://www.ieindia.org",
  },
];

export default function SponsorSection() {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Title": return "#e61d1d";
      case "Associate": return "#ff3b3b";
      case "Technology": return "#ffffff";
      default: return "#888888";
    }
  };

  return (
    <section
      id="sponsors"
      style={{
        position: "relative",
        zIndex: 2,
        padding: "6.5rem 1.5rem",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Ghost Industrial Watermark */}
      <div className="ghost-watermark">PARTNERS</div>

      <div style={{ maxWidth: "1320px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="section-label">
          <ShieldAlert size={13} />
          PARTNERS &amp; BENEFACTORS // 2026
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: "3.5rem",
          }}
        >
          Sponsors &amp; Technical Supporters
        </h2>

        {/* Sponsor Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {sponsors.map((sp) => {
            const color = getTierColor(sp.tier);
            return (
              <div
                key={sp.name}
                onClick={() => setSelectedSponsor(sp)}
                style={{
                  position: "relative",
                  background: "#111111",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "4px",
                  padding: "2rem 1.5rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0 12px 35px rgba(0, 0, 0, 0.85)",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "rgba(230, 29, 29, 0.5)";
                  e.currentTarget.style.boxShadow = "0 18px 45px rgba(0,0,0,0.95), 0 0 25px rgba(230, 29, 29, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.85)";
                }}
              >
                <span style={{ position: "absolute", top: 2, left: 4, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", fontSize: 9 }}>+</span>
                <span style={{ position: "absolute", top: 2, right: 4, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", fontSize: 9 }}>+</span>

                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: color,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: "3px",
                    background: `${color}18`,
                    border: `1px solid ${color}44`,
                    marginBottom: "1.5rem",
                  }}
                >
                  {sp.tier} Partner
                </span>

                <div
                  style={{
                    position: "relative",
                    width: "140px",
                    height: "70px",
                    marginBottom: "1.2rem",
                    filter: "brightness(0.9) contrast(1.1)",
                  }}
                >
                  <Image
                    src={sp.logo}
                    alt={`Official partner emblem: ${sp.name}`}
                    fill
                    sizes="140px"
                    style={{ objectFit: "contain" }}
                  />
                </div>

                <h4 style={{ margin: "0 0 4px 0", fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, color: "#ffffff" }}>
                  {sp.name}
                </h4>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#888888" }}>
                  {sp.tagline}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSponsor && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(8, 8, 8, 0.92)",
            backdropFilter: "blur(14px)",
          }}
          onClick={() => setSelectedSponsor(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "520px",
              width: "100%",
              background: "#111111",
              border: "1px solid rgba(230, 29, 29, 0.5)",
              borderRadius: "4px",
              padding: "2.5rem",
              boxShadow: "0 0 50px rgba(230, 29, 29, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span style={{ position: "absolute", top: 4, left: 6, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)", fontSize: 10 }}>+</span>
            <span style={{ position: "absolute", top: 4, right: 6, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)", fontSize: 10 }}>+</span>

            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setSelectedSponsor(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "3px",
                width: "34px",
                height: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 700,
                color: getTierColor(selectedSponsor.tier),
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "2px 8px",
                borderRadius: "3px",
                background: `${getTierColor(selectedSponsor.tier)}18`,
                border: `1px solid ${getTierColor(selectedSponsor.tier)}44`,
                display: "inline-block",
                marginBottom: "1rem",
              }}
            >
              {selectedSponsor.tier} Partner
            </span>

            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0" }}>
              {selectedSponsor.name}
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#ff3b3b", fontFamily: "var(--font-mono)", fontWeight: 700, margin: "0 0 1.25rem 0" }}>
              {selectedSponsor.tagline}
            </p>

            <p style={{ fontSize: "0.92rem", color: "#888888", lineHeight: 1.7, margin: "0 0 2rem 0" }}>
              {selectedSponsor.description}
            </p>

            <a
              href={selectedSponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", width: "100%", justifyContent: "center" }}
            >
              <span>Visit Official Website</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
