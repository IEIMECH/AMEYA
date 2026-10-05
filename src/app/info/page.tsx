import React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, CheckCircle, ShieldCheck, Lock, Trash2, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
  title: "Event Schedule & Guidelines - AMEYA '26 | IEI SAME",
  description: "Official event timings, registration desk schedules, institutional participation guidelines, and privacy policy for AMEYA '26.",
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
  "Participants in Arc of Genius, Mechanica: Reassembled, StarC Circuit, and Dimension X must report 20 minutes prior for technical inspection.",
  "High-speed campus Wi-Fi access credentials will be provided upon credential verification at check-in.",
  "Decisions of the faculty adjudicators and technical evaluation judges are definitive and irrevocable.",
];

const privacyGuarantees = [
  {
    icon: Lock,
    title: "Confidential Technical Body Custody",
    desc: "Your data is safeguarded strictly within the Department of Mechanical Engineering and IEI SAME technical council. Access is restricted to authorized coordinators solely for festival accreditation and gate check-in.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Leakage & Commercial Misuse Guarantee",
    desc: "We enforce an uncompromising data protection standard. Your personal records, email, phone number, and ID documents will never be sold, leased, leaked, or shared with third-party advertisers or external agencies.",
  },
  {
    icon: Trash2,
    title: "1-Year Lifespan & Permanent Purge",
    desc: "All participant records, uploaded identity proofs, and accreditation telemetry are retained strictly for certificate validation and audit, and will be completely cleared and permanently destroyed after a 1-year lifespan (365 days).",
  },
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
            Official schedule timings, registration desk operations, competition protocols, and data privacy governance for AMEYA &apos;26.
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

        {/* 3. Official Privacy & Data Protection Guarantee */}
        <section className={styles.privacySection} aria-labelledby="privacy-heading">
          <div className={styles.privacyCard}>
            <div className={styles.privacyHeader}>
              <div>
                <div className={styles.privacyBadge}>
                  <ShieldCheck size={13} />
                  <span>DATA PRIVACY &amp; SECURITY PROTOCOL</span>
                </div>
                <h2 id="privacy-heading" className={styles.sectionTitle} style={{ marginTop: "0.5rem", marginBottom: "0.25rem" }}>
                  Participant Data <span className={styles.titleAccent}>Protection Commitment</span>
                </h2>
                <p className={styles.sectionSubtitle} style={{ marginBottom: "0" }}>
                  Official privacy charter enacted by the IEI SAME Technical Body and Department of Mechanical Engineering.
                </p>
              </div>

              <Link href="/privacy" className={styles.privacyLink}>
                <span>Read Full Privacy Protocol</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className={styles.privacyGrid}>
              {privacyGuarantees.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={styles.privacyItem}>
                    <div className={styles.privacyItemHeader}>
                      <Icon size={17} className={styles.privacyItemIcon} />
                      <h3 className={styles.privacyItemTitle}>{item.title}</h3>
                    </div>
                    <p className={styles.privacyItemDesc}>{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className={styles.privacyFooter}>
              <span>ENFORCED BY: IEI STUDENT CHAPTER (SAME) &bull; VVITU CAMPUS</span>
              <span>LIFESPAN POLICY: STRICT 365-DAY AUTO-PURGE CYCLE</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
