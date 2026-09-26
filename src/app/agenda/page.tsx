"use client";

import { useState } from "react";
import { events } from "@/data/events";
import EventCard from "@/components/EventCard";
import RegistrationDialog from "@/components/RegistrationDialog";
import type { Event } from "@/data/events";
import { ShieldAlert, Activity } from "lucide-react";
import styles from "./page.module.css";

export default function AgendaPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const day1 = events.filter((e) => e.day === 1);
  const day2 = events.filter((e) => e.day === 2);

  return (
    <div className={styles.page}>
      {/* Ghost Industrial Watermark */}
      <div className="ghost-watermark">SCHEDULE</div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className={styles.header}>
          <div className="section-label">
            <ShieldAlert size={13} />
            CONCLAVE PROTOCOL // 2026
          </div>
          <h1>Ameya <span className="gradient-text">&apos;26 Agenda</span></h1>
          <p className={styles.sub}>
            [TIMELINE // SYNCHRONIZED]: Two days of precision manufacturing, autonomous robotics, 24H prototyping sprints, and research colloquia.
          </p>
        </div>

        {/* Day 1 */}
        <section className={styles.daySection}>
          <div className={styles.dayLabel}>
            <span className={styles.dayBadge}>DAY // 01</span>
            <h2>October 04, 2026 — Friday // Sprints &amp; Conclave</h2>
          </div>
          <div className={styles.eventsGrid}>
            {day1.map((event, idx) => (
              <EventCard
                key={event.id}
                event={event}
                index={idx}
                onRegister={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        </section>

        {/* Day 2 */}
        <section className={styles.daySection}>
          <div className={styles.dayLabel}>
            <span className={styles.dayBadge} style={{ background: "rgba(230, 29, 29, 0.15)", borderColor: "#e61d1d" }}>DAY // 02</span>
            <h2>October 05, 2026 — Saturday // Combat &amp; Valedictory</h2>
          </div>
          <div className={styles.eventsGrid}>
            {day2.map((event, idx) => (
              <EventCard
                key={event.id}
                event={event}
                index={day1.length + idx}
                onRegister={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        </section>
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
