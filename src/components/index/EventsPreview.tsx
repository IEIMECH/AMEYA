"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, User, Calendar, ShieldCheck } from "lucide-react";
import styles from "./EventsPreview.module.css";

interface EventsPreviewProps {
  onRegisterClick: (eventName: string) => void;
}

interface SecondaryArena {
  id: string;
  number: string;
  name: string;
  category: string;
  day: string;
  desc: string;
}

const secondaryArenas: SecondaryArena[] = [
  {
    id: "mechanica-reassembled",
    number: "02",
    name: "Mechanica: Reassembled",
    category: "TECHNICAL // DAY 1",
    day: "Day 1",
    desc: "Hands-on mechanical challenge testing component identification, mechanical dexterity, and rapid kinematic assembly sequencing against the clock.",
  },
  {
    id: "starc-circuit",
    number: "03",
    name: "StarC Circuit",
    category: "NON-TECHNICAL // DAY 1",
    day: "Day 1",
    desc: "High-octane radio-controlled obstacle track navigation testing maneuvering skill, acceleration, and precision steering.",
  },
  {
    id: "the-infinity-quest",
    number: "04",
    name: "The Infinity Quest",
    category: "NON-TECHNICAL // DAY 1",
    day: "Day 1",
    desc: "Campus-wide scavenger pursuit deciphering cryptic mechanical clues, logical riddles, and physical landmarks across VVITU.",
  },
  {
    id: "dimension-x",
    number: "05",
    name: "Dimension X",
    category: "TECHNICAL // DAY 2",
    day: "Day 2",
    desc: "Technical CAD modeling and parametric drawing competition testing speed, dimensional accuracy, and software mastery.",
  },
];

export default function EventsPreview({ onRegisterClick }: EventsPreviewProps) {
  const [hoveredArenaId, setHoveredArenaId] = useState<string | null>(null);
  const [heroCardHovered, setHeroCardHovered] = useState(false);

  return (
    <section className={styles.section} id="arenas">
      <div className={styles.innerContainer}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.kicker}>
            <span className={styles.kickerDot} />
            CHAPTER_05 // OFFICIAL COMPETITION ARENAS
          </div>

          <div className={styles.titleRow}>
            <h2 className={styles.majorTitle}>
              ARENAS<br />
              &amp; LINEUP
            </h2>
            <p className={styles.headerSub}>
              Engineered for high precision, manual dexterity, and analytical acumen.
              8 official championship competitions across 2 days. All events are solo challenges.
            </p>
          </div>
        </div>

        {/* Featured Arena 01: AUTOCAD */}
        <div
          className={`${styles.featuredCard} ${heroCardHovered ? styles.featuredActive : ""}`}
          onMouseEnter={() => setHeroCardHovered(true)}
          onMouseLeave={() => setHeroCardHovered(false)}
        >
          <span className={styles.cornerTL}>+</span>
          <span className={styles.cornerTR}>+</span>
          <span className={styles.cornerBL}>+</span>
          <span className={styles.cornerBR}>+</span>

          <div className={styles.badgeRow}>
            <span className={styles.heroNumber}>01</span>
            <span className={styles.heroTag}>FEATURED ARENA // TECHNICAL COMPETITION</span>
          </div>

          <div className={styles.heroGrid}>
            {/* Left Content */}
            <div className={styles.heroContentLeft}>
              <h3 className={styles.heroTitle}>ARC OF GENIUS</h3>
              <p className={styles.heroSlogan}>&ldquo;ENGINEERING DRAWINGS &amp; GRAPHICS PRECISION.&rdquo;</p>
              <p className={styles.heroDesc}>
                A rigorous engineering graphics and drafting showdown testing orthographic projection, isometric views, drafting standards, and dimensional tolerances under strict time constraints.
              </p>

              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <Calendar size={13} className={styles.specIcon} />
                  <span>Day 1 // Technical</span>
                </div>
                <div className={styles.specItem}>
                  <User size={13} className={styles.specIcon} />
                  <span>Individual (Solo Entry)</span>
                </div>
                <div className={styles.specItemHighlight}>
                  <ShieldCheck size={13} color="#E51D25" />
                  <span>Official Conclave Arena</span>
                </div>
              </div>

              <div className={styles.heroActions}>
                <button
                  type="button"
                  onClick={() => onRegisterClick("Arc of Genius")}
                  className={styles.primaryRegisterBtn}
                >
                  <span>REGISTER FOR ARC OF GENIUS</span>
                  <ArrowRight size={14} />
                </button>
                <Link href="/events" className={styles.ghostLink}>
                  <span>Explore All Arenas</span>
                </Link>
              </div>
            </div>

            {/* Right Blueprint Wireframe Box */}
            <div className={styles.heroVisualRight}>
              <div className={styles.wireframeBox}>
                <div className={styles.wireframeReticle} aria-hidden="true">
                  <div className={styles.reticleRing} />
                  <div className={styles.reticleCrossH} />
                  <div className={styles.reticleCrossV} />
                </div>

                <div className={styles.schematicText}>
                  <span>ARENA_PROTOCOL // ARC_OF_GENIUS_2026</span>
                  <span>FORMAT: SOLO_OPERATIVE</span>
                  <span>CATEGORY: TECHNICAL_DRAFTING</span>
                  <span>STATUS: REGISTRATION_ARMED</span>
                </div>

                <div className={styles.watermark}>DRAFT // D1</div>
                <div className={styles.activeLaserRay} />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Arenas: Mechanical Accordion Grid */}
        <div className={styles.accordionSection}>
          <div className={styles.accordionHeader}>
            <span className={styles.accordionLabel}>ADDITIONAL ARENAS // SELECT TO EXPAND</span>
            <span className={styles.accordionCount}>04 EVENTS HIGHLIGHTED</span>
          </div>

          <div className={styles.accordionContainer}>
            {secondaryArenas.map((arena) => {
              const isHovered = hoveredArenaId === arena.id;
              const hasHover = hoveredArenaId !== null;
              const isCompressed = hasHover && !isHovered;

              return (
                <div
                  key={arena.id}
                  className={`${styles.accordionCard} ${isHovered ? styles.cardExpanded : ""} ${
                    isCompressed ? styles.cardCompressed : ""
                  }`}
                  onMouseEnter={() => setHoveredArenaId(arena.id)}
                  onMouseLeave={() => setHoveredArenaId(null)}
                >
                  <div className={styles.accTopBar}>
                    <span className={styles.accIndex}>{arena.number}</span>
                    <span className={styles.accCategory}>{arena.category}</span>
                  </div>

                  <div className={styles.accBody}>
                    <h4 className={styles.accTitle}>{arena.name}</h4>
                    <p className={styles.accDesc}>{arena.desc}</p>
                  </div>

                  <div className={styles.accMeta}>
                    <div className={styles.accMetaRow}>
                      <span className={styles.accMetaLabel}>SCHEDULE:</span>
                      <span className={styles.accMetaHighlight}>{arena.day}</span>
                    </div>
                    <div className={styles.accMetaRow}>
                      <span className={styles.accMetaLabel}>MODE:</span>
                      <span className={styles.accMetaVal}>Solo Entry</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRegisterClick(arena.name)}
                    className={styles.accRegisterBtn}
                  >
                    <span>ENTER ARENA</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom All Arenas Link */}
        <div className={styles.bottomLinkRow}>
          <Link href="/events" className={styles.exploreAllLink}>
            <span>View All 8 Official Conclave Events</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
