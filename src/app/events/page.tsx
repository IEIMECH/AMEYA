"use client";

import { useState } from "react";
import { events } from "@/data/events";
import EventCard from "@/components/EventCard";
import RegistrationDialog from "@/components/RegistrationDialog";
import type { Event } from "@/data/events";
import { ShieldAlert } from "lucide-react";
import styles from "./page.module.css";

export default function EventsCatalogPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Prototyping", "Robotics", "Design", "Research", "Mechatronics", "Challenge"];

  const filteredEvents = activeCategory === "All"
    ? events
    : events.filter((e) => e.category === activeCategory);

  return (
    <div className={styles.pageWrapper}>
      {/* Layer 1: Dark atmospheric vignette to protect text readability */}
      <div className={styles.atmosphericVignette} aria-hidden="true" />

      {/* Layer 2: Navbar legibility protection vignette */}
      <div className={styles.navProtectionGlow} aria-hidden="true" />

      {/* Ghost Industrial Watermark */}
      <div className={styles.ghostWatermark} aria-hidden="true">COMPETITIONS</div>

      <div className={`container ${styles.contentContainer}`}>
        {/* Header */}
        <div className={styles.headerArea}>
          <div className={styles.headerBackdrop} aria-hidden="true" />
          <div className={styles.sectionLabel}>
            <ShieldAlert size={13} />
            TECHNICAL ARENAS // AMEYA 2026
          </div>
          <h1 className={styles.title}>
            Event <span className={styles.gradientText}>Arenas &amp; Lineup</span>
          </h1>
          <p className={styles.subtitle}>
            [SYS // INDEX]: Explore high-precision CAD modeling, autonomous robot battles, 24H prototyping, and research symposia.
          </p>

          {/* Filter Pills */}
          <div className={styles.filtersWrapper}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  suppressHydrationWarning
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ""}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className={styles.eventsGrid}>
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
