import React from "react";
import { Calendar, Clock, MapPin, CheckCircle } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
  title: "Event Schedule & Guidelines - AMEYA '26 | IEI SAME",
  description: "Official event timings, registration desk schedules, and participation guidelines for AMEYA '26.",
};

const railItems = [
  {
    title: "Dates",
    main: "October 08-09, 2026",
    sub: "Friday & Saturday",
    icon: Calendar,
  },
  {
    title: "Event Schedule",
    main: "9:00 AM – 4:00 PM",
    sub: "Registration & Verification: 8:00 AM onwards",
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
    sub: "All Colleges • All Branches",
    icon: CheckCircle,
  },
];

const rules = [
  "Valid institutional college identity card is mandatory for security clearance at the main gate.",
  "Present your registration ID or student ID card at the Mechanical Department registration desk upon entry.",
  "Registration and verification counters open at 8:00 AM. Opening inaugural ceremony commences promptly at 9:00 AM in the Main Auditorium.",
  "Participants in AutoCAD, RC Car Challenge, and Assemble & Disassemble must report 20 minutes prior for technical inspection.",
  "High-speed campus Wi-Fi access credentials will be provided upon credential verification at check-in.",
  "Decisions of the faculty adjudicators and technical evaluation judges are definitive and irrevocable.",
];

export default function InfoPage() {
  return (
    <div className={styles.page}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            Event <span className={styles.titleAccent}>Information &amp; Guidelines</span>
          </h1>
          <p className={styles.sub}>
            Official schedule timings, registration desk operations, and institutional competition protocols for AMEYA &apos;26.
          </p>
        </header>

        {/* 1. Single Compact Information Rail */}
        <section className={styles.infoRail} aria-label="Key Event Information">
          {railItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={styles.railItem}>
                <div className={styles.railHead}>
                  <Icon size={14} className={styles.railIcon} />
                  <span className={styles.railLabel}>{item.title}</span>
                </div>
                <div className={styles.railMain}>{item.main}</div>
                <p className={styles.railSub}>{item.sub}</p>
              </div>
            );
          })}
        </section>

        {/* 2. Clean Numbered Rules List */}
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
