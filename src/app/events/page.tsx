"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { events } from "@/data/events";
import EventCard from "@/components/EventCard";
import RegistrationDialog from "@/components/RegistrationDialog";
import type { Event } from "@/data/events";
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
      <div className={`container ${styles.contentContainer}`}>
        {/* Header: Functional Pattern with Strong Hierarchy & No Badges */}
        <header className={styles.headerArea}>
          <h1 className={styles.title}>
            Conclave Arenas &amp; <span className={styles.titleAccent}>Lineup</span>
          </h1>
          <p className={styles.subtitle}>
            Eight championship arenas across two days. All events are individual challenges. Select an arena below to inspect telemetry and register.
          </p>

          {/* Sliding Pill Navigation */}
          <nav className={styles.filtersWrapper} aria-label="Event category and day filters">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ""}`}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className={styles.slidingActivePill}
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.35,
                      }}
                    />
                  )}
                  <span style={{ position: "relative", zIndex: 1 }}>{filter}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* Event Cards Grid */}
        <motion.div layout className={styles.eventsGrid}>
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.25,
                  delay: idx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <EventCard
                  event={event}
                  index={idx}
                  onRegister={() => setSelectedEvent(event)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
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