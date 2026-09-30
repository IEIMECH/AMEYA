"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle, Bus, Train, Car } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";

const railItems = [
  {
    title: "Dates",
    main: "October 04–05, 2026",
    sub: "Friday & Saturday",
    icon: Calendar,
  },
  {
    title: "Timings",
    main: "09:00 AM – 06:30 PM",
    sub: "Badge Verification: 08:00 AM",
    icon: Clock,
  },
  {
    title: "Venue",
    main: "VVITU Main Campus",
    sub: "NH-16, Nambur, Guntur",
    icon: MapPin,
  },
  {
    title: "Eligibility",
    main: "Engineering Undergrads",
    sub: "All Colleges · All Branches",
    icon: CheckCircle,
  },
];

const transitOptions = [
  {
    id: "railway",
    label: "BY RAILWAY",
    icon: Train,
    stops: ["Guntur Junction (14 km)", "Vijayawada Junction (24 km)", "VVITU Campus"],
    distance: "14 km from Guntur / 24 km from Vijayawada",
    recommendation:
      "Direct auto-rickshaws, cabs, and college express shuttle buses operate round-the-clock from both terminals. Regular APSRTC local buses stop directly at Nambur Stage.",
  },
  {
    id: "bus",
    label: "BY BUS",
    icon: Bus,
    stops: ["Pandit Nehru Bus Station (PNBS)", "Nambur Toll Plaza", "VVITU Campus Stage Stop"],
    distance: "Direct Highway Stop on NH-16",
    recommendation:
      "Board any express or deluxe bus operating on the Vijayawada-Guntur arterial route. Request ticket to VVITU Nambur Stage. Busses depart every 5 minutes.",
  },
  {
    id: "car",
    label: "BY CAR / CAB",
    icon: Car,
    stops: ["NH-16 Arterial Corridor", "Nambur Service Road", "VVITU Main Gate Parking"],
    distance: "Accessible directly via national expressway NH-16",
    recommendation:
      "Dedicated multi-acre security-monitored vehicle parking available adjacent to the Administrative Block for all registered delegate vehicles.",
  },
];

const rules = [
  "Valid institutional college identity card is mandatory for security clearance at the main gate.",
  "Present your digital ticket QR code or registration ID at the Mechanical Department registration desk upon entry.",
  "Badging desk opens at 08:00 AM. Opening inaugural ceremony commences promptly at 09:15 AM in the Main Auditorium.",
  "Participants in AutoCAD, RC Car Challenge, and Assemble & Disassemble must report 20 minutes prior for technical inspection.",
  "High-speed campus Wi-Fi access credentials will be provided upon credential verification at check-in.",
  "Complimentary delegate luncheon and refreshment passes are included for all registered participants.",
  "Decisions of the faculty adjudicators and technical evaluation judges are definitive and irrevocable.",
];

export default function InfoPage() {
  const [activeTransit, setActiveTransit] = useState(transitOptions[0].id);

  const selectedTransit = transitOptions.find((t) => t.id === activeTransit) || transitOptions[0];

  return (
    <div className={styles.page}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header: Functional Pattern without Red Badges */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            Event <span className={styles.titleAccent}>Information &amp; Guidelines</span>
          </h1>
          <p className={styles.sub}>
            Essential schedule details, campus transit directions, and institutional competition protocols for AMEYA &apos;26.
          </p>
        </header>

        {/* 1. Single Compact Information Rail */}
        <section className={styles.infoRail} aria-label="Key Event Information">
          {railItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={styles.railItem}>
                <div className={styles.railHead}>
                  <Icon size={14} color="var(--accent)" />
                  <span className={styles.railLabel}>{item.title}</span>
                </div>
                <div className={styles.railMain}>{item.main}</div>
                <p className={styles.railSub}>{item.sub}</p>
              </div>
            );
          })}
        </section>

        {/* 2. Interactive How to Reach Selector */}
        <section className={styles.transitSection} aria-labelledby="transit-heading">
          <h2 id="transit-heading" className={styles.sectionTitle}>
            How to Reach <span className={styles.titleAccent}>VVITU Campus</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Select your mode of transportation below to view routes and transfer telemetry.
          </p>

          {/* Transportation Pill Selector */}
          <div className={styles.transitPillsRail} role="tablist">
            {transitOptions.map((opt) => {
              const isActive = activeTransit === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTransit(opt.id)}
                  className={`${styles.transitPill} ${isActive ? styles.transitPillActive : ""}`}
                >
                  <Icon size={14} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Expanded Transit Route Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTransit.id}
              className={styles.transitExpandedSurface}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className={styles.routeSequence}>
                {selectedTransit.stops.map((stop, idx) => (
                  <div key={stop} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      className={`${styles.routeStop} ${
                        idx === selectedTransit.stops.length - 1 ? styles.routeStopHighlight : ""
                      }`}
                    >
                      <span>{stop}</span>
                    </div>
                    {idx < selectedTransit.stops.length - 1 && (
                      <span className={styles.routeArrow} aria-hidden="true">
                        &rarr;
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.transitDetailsGrid}>
                <div>
                  <div className={styles.detailLabel}>ESTIMATED DISTANCE</div>
                  <div className={styles.detailValue}>{selectedTransit.distance}</div>
                </div>

                <div>
                  <div className={styles.detailLabel}>RECOMMENDED ROUTE &amp; LOGISTICS</div>
                  <div className={styles.detailValue}>{selectedTransit.recommendation}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* 3. Clean Numbered Rules List */}
        <section className={styles.rulesSection} aria-labelledby="rules-heading">
          <h2 id="rules-heading" className={styles.sectionTitle}>
            Participation <span className={styles.titleAccent}>Rules &amp; Protocols</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Standard institutional code of conduct for all attending delegates.
          </p>

          <ol className={styles.rulesList}>
            {rules.map((rule, idx) => (
              <li key={idx} className={styles.ruleItem}>
                <span className={styles.ruleNumber}>{String(idx + 1).padStart(2, "0")}</span>
                <span className={styles.ruleText}>{rule}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}