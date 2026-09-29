"use client";

import { ArrowRight, User, Calendar, ShieldCheck } from "lucide-react";
import type { Event } from "@/data/events";
import styles from "./EventCard.module.css";

interface Props {
  event: Event;
  index?: number;
  onRegister: () => void;
}

export default function EventCard({ event, index = 0, onRegister }: Props) {
  const isTechnical = event.category.toLowerCase() === "technical";

  return (
    <article
      id={event.id}
      className={styles.cardContainer}
      onClick={onRegister}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRegister();
        }
      }}
      aria-label={`Register for ${event.name} - ${event.category} - Day ${event.day}`}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Outer Technical Chamfered Frame */}
      <div className={styles.cardFrame}>
        {/* Technical Corner Crosshairs (+) that illuminate on hover */}
        <span className={styles.crosshairTL} aria-hidden="true">+</span>
        <span className={styles.crosshairTR} aria-hidden="true">+</span>
        <span className={styles.crosshairBR} aria-hidden="true">+</span>

        {/* Top Technical Metadata Bar */}
        <div className={styles.topHud}>
          <div className={styles.categoryPill}>
            <span className={styles.categoryDot} style={{ background: isTechnical ? "var(--crimson-core, #E51D25)" : "#F2EDE8" }} />
            <span className={styles.categoryText}>{event.category}</span>
          </div>
          <div className={styles.dayTag}>
            <Calendar size={11} className={styles.dayIcon} />
            <span className={styles.dayText}>DAY 0{event.day}</span>
          </div>
        </div>

        {/* Card Header */}
        <div className={styles.header}>
          <div className={styles.iconBox} aria-hidden="true">
            <span className={styles.iconText}>{event.icon || "⚙️"}</span>
          </div>
          <div className={styles.titleArea}>
            <span className={styles.kickerText}>EVENT 0{index + 1}</span>
            <h3 className={styles.title}>{event.name}</h3>
            {event.tagline && <p className={styles.tagline}>{event.tagline}</p>}
          </div>
        </div>

        {/* Event Brief / Details */}
        <p className={styles.description}>
          {event.description || "Details to be announced."}
        </p>

        {/* Precision Telemetry Specs */}
        <div className={styles.specsGrid}>
          <div className={styles.specItem}>
            <User size={12} className={styles.specIcon} />
            <span>PARTICIPATION: <strong>SOLO (INDIVIDUAL)</strong></span>
          </div>
          <div className={styles.specItemHighlight}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>SCHEDULE &amp; VENUE: DETAILS TO BE ANNOUNCED</span>
          </div>
        </div>

        {/* Action Foot */}
        <div className={styles.footer}>
          <div className={styles.specBadge}>
            <ShieldCheck size={12} className={styles.shieldIcon} />
            <span>IEI SAME // VVITU</span>
          </div>

          <button
            suppressHydrationWarning
            type="button"
            className={styles.registerBtn}
            onClick={(e) => {
              e.stopPropagation();
              onRegister();
            }}
            aria-label={`Register for ${event.name}`}
          >
            <span className={styles.registerBtnText}>REGISTER</span>
            <ArrowRight size={13} className={styles.btnArrow} />
          </button>
        </div>

        {/* CAD Technical Border-Tail Accent in Glowing Crimson */}
        <div className={styles.borderTailWrapper} aria-hidden="true">
          <div className={styles.borderTailLine} />
          <div className={styles.borderTailDot} />
        </div>
      </div>
    </article>
  );
}
