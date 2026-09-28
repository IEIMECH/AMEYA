"use client";

import { useState } from "react";
import { events } from "@/data/events";
import EventCard from "@/components/EventCard";
import RegistrationDialog from "@/components/RegistrationDialog";
import type { Event } from "@/data/events";
import { ShieldAlert } from "lucide-react";
import styles from "./page.module.css";

type FilterType = "ALL" | "DAY 1" | "DAY 2" | "TECHNICAL" | "NON-TECHNICAL";

const FILTERS: FilterType[] = ["ALL", "DAY 1", "DAY 2", "TECHNICAL", "NON-TECHNICAL"];

export default function EventsCatalogPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  const filteredEvents = events.filter((e) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "DAY 1") return e.day === 1;
    if (activeFilter === "DAY 2") return e.day === 2;
    if (activeFilter === "TECHNICAL") return e.category.toLowerCase() === "technical";
    if (activeFilter === "NON-TECHNICAL") return e.category.toLowerCase() === "non-technical";
    return true;
  });

  return (
    <div className={styles.pageWrapper}>
      {/* Layer 1: Dark atmospheric vignette to protect text readability */}
      <div className={styles.atmosphericVignette} aria-hidden="true" />

      {/* Layer 2: Navbar legibility protection vignette */}
      <div className={styles.navProtectionGlow} aria-hidden="true" />

      {/* Ghost Industrial Watermark */}
      <div className={styles.ghostWatermark} aria-hidden="true">AMEYA 2026</div>

      <div className={`container ${styles.contentContainer}`}>
        {/* Header Area */}
        <header className={styles.headerArea}>
          <div className={styles.headerBackdrop} aria-hidden="true" />
          <div className={styles.sectionLabel}>
            <ShieldAlert size={13} className={styles.sectionIcon} />
            <span>OFFICIAL CONCLAVE EVENTS // AMEYA 2026</span>
          </div>
          <h1 className={styles.title}>
            Conclave <span className={styles.gradientText}>Arenas &amp; Lineup</span>
          </h1>
          <p className={styles.subtitle}>
            8 Championship Arenas across 2 days. All events are individual (solo) challenges. Select an arena below to register.
          </p>

          {/* Filter Pills with Technical Indicators */}
          <nav className={styles.filtersWrapper} aria-label="Event category and day filters">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  suppressHydrationWarning
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ""}`}
                  aria-pressed={isActive}
                >
                  {isActive && <span className={styles.filterDot} aria-hidden="true">•</span>}
                  <span>{filter}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* Event Cards Grid with Smooth Transition on Filter Switch */}
        <div key={activeFilter} className={styles.eventsGrid}>
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
