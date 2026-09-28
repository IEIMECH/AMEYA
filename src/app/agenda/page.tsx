"use client";

import { useState } from "react";
import { events } from "@/data/events";
import EventCard from "@/components/EventCard";
import RegistrationDialog from "@/components/RegistrationDialog";
import type { Event } from "@/data/events";
import { ShieldAlert, Calendar, Clock, MapPin } from "lucide-react";
import styles from "./page.module.css";

type DayFilter = "all" | "day1" | "day2";

export default function AgendaPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeDay, setActiveDay] = useState<DayFilter>("day1");

  const day1Events = events.filter((e) => e.day === 1);
  const day2Events = events.filter((e) => e.day === 2);

  const dayFilters = [
    { id: "day1" as DayFilter, label: "DAY 01", date: "OCTOBER 04, 2026", theme: "SPRINTS & PROTOTYPING" },
    { id: "day2" as DayFilter, label: "DAY 02", date: "OCTOBER 05, 2026", theme: "COMBAT & CHAMPIONSHIPS" },
    { id: "all" as DayFilter, label: "ALL EVENTS", date: "COMPLETE CONCLAVE", theme: "10 ARENAS" },
  ];

  return (
    <div className={styles.page}>
      {/* Ghost Industrial Watermark */}
      <div className="ghost-watermark">SCHEDULE</div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header className={styles.header}>
          <div className="section-label">
            <ShieldAlert size={13} />
            <span>CONCLAVE PROTOCOL // 2026</span>
          </div>
          <h1 className={styles.title}>
            Ameya <span className="gradient-text">&apos;26 Agenda</span>
          </h1>
          <p className={styles.sub}>
            [TIMELINE // SYNCHRONIZED]: Two days of precision manufacturing, autonomous robotics warfare, 24H prototyping sprints, and research colloquia.
          </p>

          {/* Day Selector Mode Switch */}
          <nav className={styles.daySelectorWrapper} aria-label="Agenda day selector">
            {dayFilters.map((tab) => {
              const isActive = activeDay === tab.id;
              return (
                <button
                  suppressHydrationWarning
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDay(tab.id)}
                  className={`${styles.dayBtn} ${isActive ? styles.dayBtnActive : ""}`}
                  aria-pressed={isActive}
                >
                  <div className={styles.dayBtnHeader}>
                    {isActive && <span className={styles.activePip} aria-hidden="true">•</span>}
                    <span className={styles.dayBtnLabel}>{tab.label}</span>
                  </div>
                  <span className={styles.dayBtnDate}>{tab.date}</span>
                  <span className={styles.dayBtnTheme}>{tab.theme}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* Dynamic Day Display Container with Connecting Axis */}
        <div key={activeDay} className={styles.timelineContainer}>
          {/* Day 01 Events Section */}
          {(activeDay === "day1" || activeDay === "all") && (
            <section className={styles.daySection} aria-label="Day 1 Schedule">
              <div className={styles.dayLabel}>
                <div className={styles.dayBadge}>
                  <Calendar size={13} className={styles.badgeIcon} />
                  <span>DAY // 01</span>
                </div>
                <div className={styles.dayMetaGroup}>
                  <h2>Friday, October 04, 2026 // Hardware Prototyping &amp; Keynotes</h2>
                  <div className={styles.dayAxisDatum}>
                    <span>CHECK-IN: 08:00 AM</span>
                    <span className={styles.sep}>//</span>
                    <span>KEYNOTE: 09:15 AM</span>
                    <span className={styles.sep}>//</span>
                    <span>HACKSPRINT COMMENCES: 10:00 AM</span>
                  </div>
                </div>
              </div>

              {/* Connecting Technical Axis */}
              <div className={styles.timelineAxisBar} aria-hidden="true">
                <div className={styles.axisTrack} />
              </div>

              <div className={styles.eventsGrid}>
                {day1Events.map((event, idx) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={idx}
                    onRegister={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Day 02 Events Section */}
          {(activeDay === "day2" || activeDay === "all") && (
            <section className={styles.daySection} aria-label="Day 2 Schedule">
              <div className={styles.dayLabel}>
                <div className={styles.dayBadge}>
                  <Calendar size={13} className={styles.badgeIcon} />
                  <span>DAY // 02</span>
                </div>
                <div className={styles.dayMetaGroup}>
                  <h2>Saturday, October 05, 2026 // Combat Warfare &amp; Valedictory</h2>
                  <div className={styles.dayAxisDatum}>
                    <span>PITS OPEN: 08:30 AM</span>
                    <span className={styles.sep}>//</span>
                    <span>ROBO RUMBLE FINALS: 02:00 PM</span>
                    <span className={styles.sep}>//</span>
                    <span>AWARDS: 05:30 PM</span>
                  </div>
                </div>
              </div>

              {/* Connecting Technical Axis */}
              <div className={styles.timelineAxisBar} aria-hidden="true">
                <div className={styles.axisTrack} />
              </div>

              <div className={styles.eventsGrid}>
                {day2Events.map((event, idx) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={idx + day1Events.length}
                    onRegister={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </section>
          )}
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
