"use client";

import Image from "next/image";

const photos = [
  { src: "/img/Hero/photo-wall-1.webp", caption: "Keynote Plenary Session", angle: "-2.5deg" },
  { src: "/img/Hero/photo-wall-2.webp", caption: "Hackathon Prototyping", angle: "2deg" },
  { src: "/img/Hero/photo-wall-3.webp", caption: "Auditorium Address", angle: "-1.5deg" },
  { src: "/img/Hero/photo-wall-4.webp", caption: "Kinetic Machine Demos", angle: "2.5deg" },
  { src: "/img/Hero/photo-wall-5.webp", caption: "Student Collaboration", angle: "-2deg" },
];

export default function PhotoWall() {
  return (
    <section
      id="highlights"
      style={{
        position: "relative",
        zIndex: 2,
        padding: "8rem 1.5rem 8.5rem",
        background: "var(--machined-dark, #050505)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center", marginBottom: "4rem" }}>
        <div 
          style={{ 
            fontFamily: "var(--font-mono)", 
            fontSize: "0.7rem", 
            letterSpacing: "0.22em", 
            color: "var(--text-secondary, #96908B)", 
            textTransform: "uppercase", 
            marginBottom: "1rem" 
          }}
        >
          DOCUMENTARY ARCHIVE // MOMENTS
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 3.8vw, 3rem)",
            fontWeight: 800,
            color: "var(--text-primary, #F2EDE8)",
            letterSpacing: "-0.02em",
            margin: "0 0 0.75rem",
          }}
        >
          The People, The Tension, The Breakthroughs
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: "var(--text-muted, #605B56)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Unscripted glimpses from past conclaves &mdash; student engineers building, testing, and daring to dream.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
          maxWidth: "1320px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {photos.map((item, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              background: "var(--machined-surface, #101010)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "3px",
              padding: "10px 10px 16px 10px",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.75)",
              transform: `rotate(${item.angle})`,
              transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.3s ease",
              cursor: "pointer",
              width: "220px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.06) rotate(0deg) translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 22px 50px rgba(0, 0, 0, 0.9), 0 0 20px rgba(229, 29, 37, 0.25)";
              e.currentTarget.style.borderColor = "rgba(229, 29, 37, 0.5)";
              e.currentTarget.style.zIndex = "10";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = `rotate(${item.angle})`;
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.75)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.zIndex = "1";
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "220px",
                borderRadius: "2px",
                overflow: "hidden",
                background: "#080808",
              }}
            >
              <Image
                src={item.src}
                alt={`Delegates and participants during ${item.caption.toLowerCase()}`}
                fill
                sizes="220px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <p
              style={{
                margin: "12px 0 0 0",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--text-primary, #F2EDE8)",
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                letterSpacing: "0.04em",
              }}
            >
              {item.caption}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
