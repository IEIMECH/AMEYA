"use client";

import { useState } from "react";
import { Check, Calendar, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import styles from "./GetTicketsSection.module.css";

interface Props {
  onRegisterClick: (ticketType?: string) => void;
}

interface TicketTier {
  id: string;
  code: string;
  price: string;
  currency?: string;
  title: string;
  sub: string;
  description: string;
  isFeatured: boolean;
  tag?: string;
  features: string[];
}

const ticketTiers: TicketTier[] = [
  {
    id: "general",
    code: "TIER_01 // GENERAL",
    price: "FREE",
    title: "DELEGATE PASS",
    sub: "SPECTATOR ACCESS",
    description: "Open access for visiting engineering students, project observers, and technology enthusiasts.",
    isFeatured: false,
    features: [
      "Access to all Keynotes & Tech Lectures",
      "Spectator entry to RC Car Challenge arena",
      "Hardware Prototype Exhibition access",
      "Official Digital Participation Credential",
      "Campus Wi-Fi & Technical Networking Kit",
    ],
  },
  {
    id: "competitor",
    code: "TIER_02 // CORE",
    price: "200",
    currency: "₹",
    title: "COMPETITOR PASS",
    sub: "TECHNICAL PARTICIPANT",
    description: "Full competition registration across two technical arenas with hardware testing bay privilege.",
    isFeatured: true,
    tag: "MOST POPULAR // RECOMMENDED",
    features: [
      "Registration for any 2 Technical Competitions",
      "Eligible for ₹150,000 Total Prize Pool",
      "Hardware Testing Bay & Power Station access",
      "Official Conclave Kit, Lanyard & Swag",
      "Certificate of Merit with Verification ID",
    ],
  },
  {
    id: "omni",
    code: "TIER_03 // OMNI",
    price: "450",
    currency: "₹",
    title: "ALL-ACCESS PASS",
    sub: "FULL IMMERSION",
    description: "Unrestricted registration access across all 8 official competition arenas.",
    isFeatured: false,
    features: [
      "Registration access across all 8 Official Arenas",
      "AutoCAD and Drafting Studio Workspace access",
      "Speakers & Jury Networking Banquet",
      "Printed Hardcover Engineering Journal",
      "Priority Pit Lane & Workshop Calibrations",
    ],
  },
];

export default function GetTicketsSection({ onRegisterClick }: Props) {
  const [downloaded, setDownloaded] = useState(false);

  const generateICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ameya 2026//EN
BEGIN:VEVENT
UID:${Date.now()}@ameya.vvitu.edu.in
DTSTAMP:20260928T000000Z
DTSTART:20261004T033000Z
DTEND:20261005T123000Z
SUMMARY:AMEYA '26 — National Mechanical Conclave
DESCRIPTION:Where Engineers Dare to Dream. Annual technical conclave at VVITU Campus, Nambur, Guntur.
LOCATION:VVITU Campus, Nambur, Guntur, Andhra Pradesh 522508
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "AMEYA_2026_Schedule.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section id="register" className={styles.section} aria-labelledby="pricing-heading">
      {/* Editorial Watermark & Datum */}
      <div className={styles.backgroundGrid} aria-hidden="true" />
      <div className={styles.datumWatermark} aria-hidden="true">CHAPTER 06 // ACCESS</div>

      <div className={styles.container}>
        {/* Section Header */}
        <header className={styles.header}>
          <div className={styles.metaRow}>
            <span className={styles.codeMarker}>[SECTION_06]</span>
            <span className={styles.metaDivider}>/</span>
            <span className={styles.metaCategory}>ADMISSION & ACCESS TIERS</span>
            <span className={styles.metaDivider}>/</span>
            <span className={styles.metaSpec}>OCTOBER 04–05, 2026</span>
          </div>

          <div className={styles.titleRow}>
            <div className={styles.titleCol}>
              <h2 id="pricing-heading" className={styles.sectionTitle}>
                ENTRY PASSES &amp; ACCESS
              </h2>
              <p className={styles.sectionSub}>
                Simple, transparent participation tiers. Select your level of immersion in the machine.
              </p>
            </div>

            <button
              onClick={generateICS}
              className={styles.calendarBtn}
              type="button"
              aria-label="Add AMEYA 26 schedule to calendar"
            >
              <Calendar size={14} className={styles.calIcon} />
              <span>{downloaded ? "CALENDAR ADDED (.ICS)" : "ADD CONCLAVE TO CALENDAR"}</span>
            </button>
          </div>
        </header>

        {/* 3 Differentiated Cards Grid */}
        <div className={styles.cardsGrid}>
          {ticketTiers.map((tier) => (
            <article
              key={tier.id}
              className={`${styles.ticketCard} ${tier.isFeatured ? styles.cardFeatured : ""}`}
              id={`pass-${tier.id}`}
            >
              {/* Featured Badge */}
              {tier.tag && (
                <div className={styles.featuredBadge}>
                  <Sparkles size={11} className={styles.badgeIcon} />
                  <span>{tier.tag}</span>
                </div>
              )}

              {/* Top Code Strip */}
              <div className={styles.cardHeader}>
                <span className={styles.tierCode}>{tier.code}</span>
                <span className={styles.tierSub}>{tier.sub}</span>
              </div>

              {/* Price Dominant Visual Anchor */}
              <div className={styles.priceContainer}>
                <div className={styles.priceRow}>
                  {tier.currency && <span className={styles.currency}>{tier.currency}</span>}
                  <span className={styles.priceValue}>{tier.price}</span>
                  {tier.price !== "FREE" && <span className={styles.perStudent}>/ DELEGATE</span>}
                </div>
                <h3 className={styles.cardTitle}>{tier.title}</h3>
                <p className={styles.cardDesc}>{tier.description}</p>
              </div>

              {/* Engineering Rule Divider */}
              <div className={styles.divider}>
                <span className={styles.dividerText}>INCLUDED IN PASS</span>
                <span className={styles.dividerLine} />
              </div>

              {/* Features Checklist */}
              <ul className={styles.featureList}>
                {tier.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={styles.checkIconWrapper}>
                      <Check size={12} className={styles.checkIcon} />
                    </span>
                    <span className={styles.featureText}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Clear Action Button */}
              <div className={styles.actionRow}>
                <button
                  type="button"
                  onClick={() => onRegisterClick(tier.title)}
                  className={`${styles.ctaBtn} ${tier.isFeatured ? styles.ctaFeatured : ""}`}
                  id={`btn-pass-${tier.id}`}
                >
                  <span>GET PASS</span>
                  <ArrowRight size={14} className={styles.btnArrow} />
                </button>
              </div>

              {/* Subtle Bottom Technical Coordinate */}
              <div className={styles.cardFooter}>
                <ShieldCheck size={11} className={styles.verifyIcon} />
                <span>VERIFIED REGISTRATION // SECURE INSTANT CONFIRMATION</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
