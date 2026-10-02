"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Calendar } from "lucide-react";
import { events as defaultEvents } from "@/data/events";
import EventCard from "@/components/EventCard";
import RegistrationDialog from "@/components/RegistrationDialog";
import type { Event } from "@/data/events";
import styles from "./page.module.css";

type FilterType = "ALL" | "DAY 1" | "DAY 2" | "TECHNICAL" | "NON-TECHNICAL";

const FILTERS: FilterType[] = ["ALL", "DAY 1", "DAY 2", "TECHNICAL", "NON-TECHNICAL"];

export default function EventsCatalogPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [eventsList, setEventsList] = useState<Event[]>(defaultEvents);

  useEffect(() => {
    async function loadActiveEvents() {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.events && Array.isArray(data.events)) {
            setEventsList(data.events);
          }
        }
      } catch (err) {
        console.warn("Using default static events lineup:", err);
      }
    }
    loadActiveEvents();

    // Check URL parameters for event selection (e.g. redirected from homepage)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const targetEventName = params.get('event');
      if (targetEventName) {
        const found = defaultEvents.find(
          (e) =>
            e.name.toLowerCase().includes(targetEventName.toLowerCase()) ||
            e.id.toLowerCase() === targetEventName.toLowerCase()
        );
        if (found) {
          setSelectedEvent(found);
        }
      }
    }

    // Re-check when window regains focus (e.g., returning from admin portal)
    window.addEventListener("focus", loadActiveEvents);
    // Periodically poll every 10 seconds to catch live created or archived events
    const interval = setInterval(loadActiveEvents, 10000);

    return () => {
      window.removeEventListener("focus", loadActiveEvents);
      clearInterval(interval);
    };
  }, []);

  // Filter out any archived events explicitly, and apply active tab filter
  const filteredEvents = eventsList.filter((e: any) => {
    if (e.is_archived) return false;
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
            Championship arenas across festival days. Select an arena below to inspect telemetry and register.
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

        {filteredEvents.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#9ca3af" }}>
            <Calendar size={36} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
            <h3 style={{ fontSize: "1.15rem", color: "#F2EDE8", marginBottom: "0.5rem" }}>
              No active arenas in this category
            </h3>
            <p style={{ fontSize: "0.85rem" }}>
              All events under this filter may currently be concluded or archived.
            </p>
          </div>
        )}

        {/* Events Coordinator POC Banner */}
        <div className={styles.pocCallout}>
          <div className={styles.pocCalloutInfo}>
            <span className={styles.pocCalloutTag}>EVENTS COORDINATION POINT OF CONTACT</span>
            <h4 className={styles.pocCalloutName}>T. Jaya Kumar</h4>
            <p className={styles.pocCalloutDesc}>
              Have queries regarding arena slots, competition rules, submission requirements, or problem statements? Reach out directly.
            </p>
          </div>
          <a href="tel:+917416532304" className={styles.pocCalloutLink}>
            <Phone size={14} />
            <span>+91 74165 32304</span>
          </a>
        </div>
      </div>

      {/* Registration Dialog */}
      {selectedEvent && (
        <RegistrationDialog
          event={selectedEvent}
          availableEvents={eventsList.filter((e: any) => !e.is_archived)}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
