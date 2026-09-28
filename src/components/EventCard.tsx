"use client";

import { Clock, MapPin, Users, Trophy, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import type { Event } from "@/data/events";
import styles from "./EventCard.module.css";

interface Props {
  event: Event;
  index?: number;
  onRegister: () => void;
}

export default function EventCard({ event, index = 0, onRegister }: Props) {
  const formattedIndex = String(index + 1).padStart(2, "0");

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
      aria-label={`Inspect and register for ${event.name} - ${event.category}`}
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
            <span className={styles.categoryDot} />
            <span className={styles.categoryText}>{event.category}</span>
          </div>
          <div className={styles.telemetryTag}>
            <Activity size={10} className={styles.pulseIcon} />
            <span className={styles.telemetryText}>STATUS: ARMED // SEC: {formattedIndex}</span>
          </div>
        </div>

        {/* Card Header */}
        <div className={styles.header}>
          <div className={styles.iconBox} aria-hidden="true">
            <span className={styles.iconText}>{event.icon}</span>
          </div>
          <div className={styles.titleArea}>
            <div className={styles.techFreq}>FREQ // 60Hz • TOLERANCE // ±0.005mm</div>
            <h3 className={styles.title}>{event.name}</h3>
            <p className={styles.tagline}>{event.tagline}</p>
          </div>
        </div>

        {/* Description */}
        <p className={styles.description}>
          {event.description}
        </p>

        {/* Technical Specs Grid */}
        <div className={styles.specsGrid}>
          <div className={styles.specItem}>
            <Clock size={12} className={styles.specIcon} />
            <span>{event.time}</span>
          </div>
          <div className={styles.specItem}>
            <MapPin size={12} className={styles.specIcon} />
            <span className={styles.truncate}>{event.venue}</span>
          </div>
          <div className={styles.specItem}>
            <Users size={12} className={styles.specIcon} />
            <span>{event.type === "team" ? `Team: ${event.teamSize}` : "Individual (Solo)"}</span>
          </div>
          <div className={styles.specItemHighlight}>
            <Trophy size={12} className={styles.trophyIcon} />
            <span className={styles.prizeLabel}>PRIZE POOL:</span>
            <span className={styles.prizeText}>{event.prizes}</span>
          </div>
        </div>

        {/* Action Foot */}
        <div className={styles.footer}>
          <div className={styles.specBadge}>
            <ShieldCheck size={12} className={styles.shieldIcon} />
            <span>IEI VALIDATED // MECH-26</span>
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
