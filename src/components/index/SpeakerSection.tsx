"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

const speakers = [
  {
    id: 1,
    name: "Dr. A. K. Sharma",
    role: "Chief Scientist & Robotics Fellow",
    topic: "Autonomous Kinematics & High-Speed Rover Swarms",
    desc: "Pioneering research in autonomous navigation, human-robot interaction, and multi-agent cyber-physical systems across aerospace defense.",
    image: "/img/guest/speaker-1.webp",
    credentials: "IIT Madras • Ph.D. Kinematics",
    quote: "True autonomy is not merely algorithmic perfection—it is the mechanical resilience to withstand the friction of the real world.",
  },
  {
    id: 2,
    name: "Er. Priya Venkatesh",
    role: "Principal Automotive Architect",
    topic: "EV Powertrain Dynamics & Lightweight Composites",
    desc: "EV powertrain optimization, battery thermal management systems, and computational aerodynamic drag reduction for endurance racing.",
    image: "/img/guest/speaker-2.webp",
    credentials: "Tata Technologies • Lead Powertrain Specialist",
    quote: "Every gram shaved from a chassis is horsepower handed back to the driver.",
  },
  {
    id: 3,
    name: "Prof. M. R. K. Prasad",
    role: "Chair of Aerospace Aerodynamics",
    topic: "Supersonic Propulsion & Computational Fluid Dynamics",
    desc: "Computational Fluid Dynamics (CFD), shock wave boundary layer interaction, and turbomachinery thermal stress modeling.",
    image: "/img/guest/speaker-3.webp",
    credentials: "IISc Bangalore • Propulsion Lab",
    quote: "When you break Mach 1, physics demands absolute honesty from your materials.",
  },
  {
    id: 4,
    name: "Vikram Singhania",
    role: "Founder & CTO, AeroDynamics AI",
    topic: "Generative CAD Synthesis & Digital Twins",
    desc: "Bridging generative neural architectures with precision CNC machining, digital twin simulations, and smart factories.",
    image: "/img/guest/speaker-4.webp",
    credentials: "Stanford AI Lab • Tech Innovator",
    quote: "The CAD software of the next decade will not wait for commands; it will anticipate physical stress.",
  },
  {
    id: 5,
    name: "Dr. Shalini Mukhopadhyay",
    role: "Head of Additive Manufacturing Research",
    topic: "Metal 3D Printing & Topology Optimization",
    desc: "Direct metal laser sintering, advanced lattice metamaterials, and mass reduction for satellite structural frames.",
    image: "/img/guest/speaker-5.webp",
    credentials: "DRDO Fellow • Materials Science",
    quote: "Additive manufacturing allows us to print the geometry nature evolved over millions of years.",
  },
  {
    id: 6,
    name: "Siddharth Verma",
    role: "Open Source Hardware Advocate",
    topic: "RISC-V Embedded Control in Mechatronics",
    desc: "Microcontrollers, real-time operating systems, and sensor fusion pipelines for industrial robotic arms.",
    image: "/img/guest/speaker-6.webp",
    credentials: "Open Robotics Foundation",
    quote: "Open hardware ensures the next breakthrough belongs to the engineering community, not closed silos.",
  },
];

export default function SpeakerSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSpeaker = speakers[activeIdx];

  return (
    <section
      id="speakers"
      style={{
        position: "relative",
        zIndex: 2,
        padding: "8rem 1.5rem 7.5rem",
        background: "var(--machined-elevated, #0B0B0B)",
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Editorial Section Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem", marginBottom: "4rem" }}>
          <div>
            <div 
              style={{ 
                fontFamily: "var(--font-mono)", 
                fontSize: "0.7rem", 
                letterSpacing: "0.2em", 
                color: "var(--text-secondary, #96908B)", 
                textTransform: "uppercase", 
                marginBottom: "0.75rem" 
              }}
            >
              KEYNOTE MINDS // 2026
            </div>
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
              Keynote &amp; Invited Speakers
            </h2>
          </div>
          <p 
            style={{ 
              color: "var(--text-secondary, #96908B)", 
              fontSize: "0.88rem", 
              maxWidth: "460px", 
              margin: 0, 
              lineHeight: 1.6, 
              fontFamily: "var(--font-mono)" 
            }}
          >
            Pioneering minds in supersonic aerodynamics, robotic swarms, generative CAD, and advanced additive manufacturing.
          </p>
        </div>

        {/* Priority 7: Editorial Spread Structure (List + Human Profile) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1.6fr",
            gap: "3.5rem",
            alignItems: "start",
          }}
        >
          {/* Left Column: Quiet Typographic Speaker List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {speakers.map((sp, idx) => {
              const isActive = idx === activeIdx;
              return (
                <div
                  key={sp.id}
                  onClick={() => setActiveIdx(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveIdx(idx); }}
                  style={{
                    position: "relative",
                    padding: "1.1rem 1.4rem",
                    borderRadius: "3px",
                    background: isActive ? "var(--machined-surface, #101010)" : "transparent",
                    borderLeft: `2px solid ${isActive ? "var(--crimson-core, #E51D25)" : "transparent"}`,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: isActive ? "var(--crimson-core, #E51D25)" : "var(--text-muted, #605B56)",
                    }}
                  >
                    0{idx + 1}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: "0 0 0.2rem 0",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-display)",
                        color: isActive ? "var(--text-primary, #F2EDE8)" : "var(--text-secondary, #96908B)",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {sp.name}
                    </h3>
                    <p 
                      style={{ 
                        margin: 0, 
                        fontSize: "0.78rem", 
                        color: isActive ? "var(--text-secondary, #96908B)" : "var(--text-muted, #605B56)", 
                        fontFamily: "var(--font-mono)" 
                      }}
                    >
                      {sp.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Editorial Human Portrait & Feature Spread */}
          <div
            style={{
              position: "relative",
              background: "var(--machined-surface, #101010)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "4px",
              padding: "2.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "2rem", alignItems: "center" }}>
              {/* Human Portrait */}
              <div
                style={{
                  position: "relative",
                  width: "180px",
                  height: "220px",
                  borderRadius: "3px",
                  overflow: "hidden",
                  background: "#080808",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Image
                  src={activeSpeaker.image}
                  alt={`Speaker portrait of ${activeSpeaker.name}, guest dignitary at AMEYA '26`}
                  fill
                  sizes="180px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>

              {/* Speaker Identity & Credentials */}
              <div>
                <div 
                  style={{ 
                    fontFamily: "var(--font-mono)", 
                    fontSize: "0.68rem", 
                    fontWeight: 700, 
                    letterSpacing: "0.15em", 
                    color: "var(--crimson-core, #E51D25)", 
                    textTransform: "uppercase", 
                    marginBottom: "0.5rem" 
                  }}
                >
                  {activeSpeaker.credentials}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.85rem",
                    fontWeight: 800,
                    color: "var(--text-primary, #F2EDE8)",
                    margin: "0 0 0.35rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {activeSpeaker.name}
                </h3>
                <p 
                  style={{ 
                    fontFamily: "var(--font-mono)", 
                    fontSize: "0.85rem", 
                    color: "var(--text-secondary, #96908B)", 
                    margin: 0 
                  }}
                >
                  {activeSpeaker.role}
                </p>
              </div>
            </div>

            {/* Keynote Topic & Human Quote */}
            <div>
              <div 
                style={{ 
                  fontFamily: "var(--font-mono)", 
                  fontSize: "0.68rem", 
                  letterSpacing: "0.15em", 
                  color: "var(--text-muted, #605B56)", 
                  textTransform: "uppercase", 
                  marginBottom: "0.5rem" 
                }}
              >
                KEYNOTE ADDRESS
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "var(--text-primary, #F2EDE8)",
                  margin: "0 0 1.25rem",
                  lineHeight: 1.35,
                }}
              >
                {activeSpeaker.topic}
              </h4>

              {/* Editorial Quote */}
              <div
                style={{
                  borderLeft: "2px solid var(--crimson-core, #E51D25)",
                  paddingLeft: "1.25rem",
                  margin: "1.5rem 0",
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                  lineHeight: 1.65,
                  color: "var(--text-primary, #F2EDE8)",
                }}
              >
                &ldquo;{activeSpeaker.quote}&rdquo;
              </div>

              <p 
                style={{ 
                  color: "var(--text-secondary, #96908B)", 
                  fontSize: "0.9rem", 
                  lineHeight: 1.7, 
                  margin: 0 
                }}
              >
                {activeSpeaker.desc}
              </p>
            </div>

            {/* Action Row */}
            <div style={{ paddingTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted, #605B56)" }}>
                KEYNOTE SESSION // AUDITORIUM MAIN
              </span>
              <Link
                href="/agenda"
                className="btn-outline"
                style={{ padding: "8px 18px", fontSize: "0.75rem", gap: "6px" }}
              >
                <span>View Full Schedule</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
