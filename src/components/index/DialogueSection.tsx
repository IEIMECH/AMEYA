"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert, X } from "lucide-react";

export default function DialogueSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      id="about"
      style={{
        position: "relative",
        zIndex: 2,
        padding: "6.5rem 1.5rem",
        background: "linear-gradient(180deg, transparent 0%, rgba(8, 8, 8, 0.85) 20%, #080808 100%)",
        overflow: "hidden",
      }}
    >
      {/* Ghost Industrial Watermark */}
      <div className="ghost-watermark">MANIFESTO</div>

      <div style={{ maxWidth: "880px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="section-label">
          <ShieldAlert size={13} />
          THEME &amp; MANIFESTO // AMEYA 2026
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.85rem, 3.8vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.25,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: "2rem",
          }}
        >
          The blueprints of tradition are dissolving into code.
          <br />
          <span className="gradient-text">
            In an era of machine intelligence, where will engineers dare to venture?
          </span>
        </h2>

        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.85,
            color: "#888888",
            marginBottom: "1.5rem",
          }}
        >
          As we stand in 2026, technology is dissolving the boundaries between mechanical engineering,
          computing, artificial intelligence, and robotics. When generative models can design structures in seconds,
          our challenge transforms: from solitary mastery to harmonious mechanical synergy.
        </p>

        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.85,
            color: "#888888",
            marginBottom: "2.5rem",
          }}
        >
          At Ameya 2026, we convene not just to compete, but to invent. To turn friction into acceleration,
          to test our autonomous machines in combat, and to construct the physical systems of tomorrow.
        </p>

        <button
          suppressHydrationWarning
          type="button"
          onClick={() => setIsOpen(true)}
          className="btn-outline"
          style={{
            padding: "12px 28px",
            fontSize: "0.9rem",
          }}
        >
          <span>Read Full Theme Manifesto</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {isOpen && (
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
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              background: "#111111",
              border: "1px solid rgba(230, 29, 29, 0.4)",
              borderRadius: "4px",
              padding: "2.75rem",
              boxShadow: "0 0 50px rgba(230, 29, 29, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span style={{ position: "absolute", top: 4, left: 6, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)", fontSize: 10 }}>+</span>
            <span style={{ position: "absolute", top: 4, right: 6, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)", fontSize: 10 }}>+</span>
            <span style={{ position: "absolute", bottom: 4, right: 6, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)", fontSize: 10 }}>+</span>

            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setIsOpen(false)}
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

            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#ff3b3b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              DOC // MANIFESTO // REV.2026
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.65rem",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "1.25rem",
                paddingRight: "2rem",
                lineHeight: 1.25,
              }}
            >
              Ameya &apos;26 Manifesto: Where Engineers Dare to Dream
            </h3>

            <div style={{ color: "#888888", lineHeight: 1.8, fontSize: "0.95rem" }}>
              <p style={{ marginBottom: "1rem" }}>
                Founded under the aegis of the Institution of Engineers India (Student Activity for
                Mechanical Engineers), <strong>Ameya</strong> is a crucible of raw intellect, creative grit,
                and mechanical brilliance.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                The word <em>Ameya</em> translates to <em>immeasurable</em> — because human ingenuity
                cannot be quantified by conventional constraints.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Whether you are optimizing a 6-axis robotic arm, compiling embedded firmware under 24-hour
                hackathon pressure, or defending pioneering technical research before an academic jury — Ameya
                is your arena.
              </p>
            </div>

            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#666666" }}>
                OCTOBER 08–09, 2026 // VVITU NAMBUR
              </span>
              <Link
                href="/events"
                onClick={() => setIsOpen(false)}
                className="btn-primary"
                style={{ padding: "8px 18px", fontSize: "0.82rem" }}
              >
                <span>Explore Events</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
