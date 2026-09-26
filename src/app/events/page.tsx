"use client";

import { useState } from "react";
import { events } from "@/data/events";
import EventCard from "@/components/EventCard";
import RegistrationDialog from "@/components/RegistrationDialog";
import type { Event } from "@/data/events";
import { ShieldAlert, Activity } from "lucide-react";

export default function EventsCatalogPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Prototyping", "Robotics", "Design", "Research", "Mechatronics", "Challenge"];

  const filteredEvents = activeCategory === "All"
    ? events
    : events.filter((e) => e.category === activeCategory);

  return (
    <div
      style={{
        paddingTop: "calc(var(--nav-height) + 3.5rem)",
        paddingBottom: "6rem",
        minHeight: "100vh",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ghost Industrial Watermark */}
      <div className="ghost-watermark">COMPETITIONS</div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="section-label">
            <ShieldAlert size={13} />
            TECHNICAL ARENAS // AMEYA 2026
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#ffffff", marginBottom: "1rem", fontWeight: 800 }}>
            Event <span className="gradient-text">Arenas &amp; Lineup</span>
          </h1>
          <p style={{ color: "#888888", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto", fontFamily: "var(--font-mono)" }}>
            [SYS // INDEX]: Explore high-precision CAD modeling, autonomous robot battles, 24H prototyping, and research symposia.
          </p>

          {/* Filter Pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap", marginTop: "2rem" }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  suppressHydrationWarning
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "0.45rem 1.15rem",
                    borderRadius: "3px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: isActive ? "linear-gradient(135deg, #e61d1d, #b51212)" : "rgba(17, 17, 17, 0.9)",
                    color: isActive ? "#ffffff" : "#888888",
                    border: `1px solid ${isActive ? "#ff3b3b" : "rgba(255, 255, 255, 0.1)"}`,
                    boxShadow: isActive ? "0 0 16px rgba(230, 29, 29, 0.5)" : "none",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
            gap: "2.5rem",
            alignItems: "stretch",
          }}
        >
          {filteredEvents.map((event, idx) => (
            <EventCard
              key={event.id}
              event={event}
              index={idx}
              onRegister={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      </div>

      {/* Registration Dialog */}
      {selectedEvent && (
        <RegistrationDialog
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
