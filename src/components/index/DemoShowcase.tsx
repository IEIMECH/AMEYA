"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Layers, Play, ShieldAlert } from "lucide-react";

export default function DemoShowcase() {
  return (
    <section
      id="events"
      style={{
        position: "relative",
        zIndex: 2,
        padding: "7rem 1.5rem",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      {/* Ghost Industrial Watermark */}
      <div className="ghost-watermark">ROBOTICS</div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
        <div className="section-label">
          <ShieldAlert size={13} />
          KINEMATIC PROTOTYPING // 2026
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            marginBottom: "1.75rem",
          }}
        >
          Live Machine Prototyping
          <br />
          <span className="gradient-text">
            &amp; Robotics Demo Arena
          </span>
        </h2>

        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.8,
            color: "#888888",
            marginBottom: "2.5rem",
          }}
        >
          Ameya &apos;26 introduces hands-on live project arenas. Step into the arena to test-drive
          student-built autonomous rovers, inspect 5-axis CNC machining, test real-time sensor telemetry,
          and witness precision mechatronics demonstrations.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/events" className="btn-primary" style={{ padding: "12px 28px" }}>
            <span>Explore All 10 Competitions</span>
            <ArrowRight size={16} />
          </Link>
          <Link href="/about" className="btn-outline" style={{ padding: "12px 28px" }}>
            <span>Guidelines &amp; Submission</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
