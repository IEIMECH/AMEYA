"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Trophy, Clock, MapPin, Users, Flame, ShieldAlert, Cpu } from "lucide-react";
import styles from "./EventsPreview.module.css";

interface EventsPreviewProps {
  onRegisterClick: (eventName: string) => void;
}

interface SecondaryArena {
  id: string;
  number: string;
  name: string;
  category: string;
  desc: string;
  prizes: string;
  time: string;
  venue: string;
}

const secondaryArenas: SecondaryArena[] = [
  {
    id: "roborumble",
    number: "02",
    name: "Robo Rumble Combat",
    category: "COMBAT ROBOTICS",
    desc: "Full-contact armored robotics warfare in an enclosed polycarbonate cage.",
    prizes: "₹20,000",
    time: "Day 2 // 14:00",
    venue: "Arena 1 // Polycarbonate Pit",
  },
  {
    id: "cadclash",
    number: "03",
    name: "CAD Clash Speed Sprint",
    category: "DIGITAL PROTOTYPING",
    desc: "On-the-spot 3D parametric modeling against the clock in SolidWorks / Fusion.",
    prizes: "₹8,000",
    time: "Day 1 // 11:00",
    venue: "Simulation Lab // Tech Towers",
  },
  {
    id: "techmanuscript",
    number: "04",
    name: "Tech Manuscript Defense",
    category: "RESEARCH SYMPOSIUM",
    desc: "Defend pioneering mechanical engineering papers before an expert academic jury.",
    prizes: "₹10,000",
    time: "Day 1 // 10:00",
    venue: "Seminar Hall A // Main Block",
  },
  {
    id: "gearhunt",
    number: "05",
    name: "Gear Hunt Conundrum",
    category: "MECHANICAL HUNT",
    desc: "Campus-wide algorithmic puzzle solving deciphering complex mechanism clues.",
    prizes: "₹6,000",
    time: "Day 2 // 11:30",
    venue: "Central Campus Lawn",
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
            CHAPTER_05 // HIGH-TORQUE ARENAS
          </div>

          <div className={styles.titleRow}>
            <h2 className={styles.majorTitle}>
              ARENAS<br />
              &amp; LINEUP
            </h2>
            <p className={styles.headerSub}>
              Engineered for high torque, autonomous logic, and pure kinetic ambition.
              From 24-hour rapid hardware prototyping to 30kg combat robot warfare.
            </p>
          </div>
        </div>

        {/* Featured Arena 01: HACKSPRINT 24H (Occupies ~65% visual attention) */}
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
            <span className={styles.heroTag}>FEATURED ARENA // 24-HOUR HARDWARE MARATHON</span>
          </div>

          <div className={styles.heroGrid}>
            {/* Left Content */}
            <div className={styles.heroContentLeft}>
              <h3 className={styles.heroTitle}>HACKSPRINT 24H</h3>
              <p className={styles.heroSlogan}>&ldquo;BUILD. BREAK. REBUILD.&rdquo;</p>
              <p className={styles.heroDesc}>
                An intensive 24-hour sprint in hardware prototyping, embedded microcontrollers, and kinetic mechanisms.
                Crews receive raw materials and challenge briefs to engineer working electromechanical prototypes
                before the final clock expires.
              </p>

              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <Clock size={13} className={styles.specIcon} />
                  <span>24 Hours Non-Stop</span>
                </div>
                <div className={styles.specItem}>
                  <MapPin size={13} className={styles.specIcon} />
                  <span>Arena 3 // Simulation Lab</span>
                </div>
                <div className={styles.specItem}>
                  <Users size={13} className={styles.specIcon} />
                  <span>3?"4 Engineers / Crew</span>
                </div>
                <div className={styles.specItemHighlight}>
                  <Trophy size={13} color="#E51D25" />
                  <span>₹15,000 Cash Pool</span>
                </div>
              </div>

              <div className={styles.heroActions}>
                <button
                  type="button"
                  onClick={() => onRegisterClick("HackSprint")}
                  className={styles.primaryRegisterBtn}
                >
                  <span>REGISTER FOR HACKSPRINT</span>
                  <ArrowRight size={14} />
                </button>
                <Link href="/events" className={styles.ghostLink}>
                  <span>Full Rulebook &amp; Rubric</span>
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
                  <span>ARENA_PROTOCOL // 24H_SPRINT</span>
                  <span>CHASSIS: EMBEDDED_STM32</span>
                  <span>TOLERANCE: 0.05 MM</span>
                  <span>CADRE: HARDWARE_CHAMPIONSHIP</span>
                </div>

                <div className={styles.watermark}>HACK // 24H</div>
                <div className={styles.activeLaserRay} />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Arenas: Mechanical Accordion Grid */}
        <div className={styles.accordionSection}>
          <div className={styles.accordionHeader}>
            <span className={styles.accordionLabel}>SECONDARY ARENAS // SELECT TO EXPAND</span>
            <span className={styles.accordionCount}>04 EVENTS ACTIVE</span>
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
                      <span className={styles.accMetaLabel}>POOL:</span>
                      <span className={styles.accMetaHighlight}>{arena.prizes}</span>
                    </div>
                    <div className={styles.accMetaRow}>
                      <span className={styles.accMetaLabel}>TIMING:</span>
                      <span className={styles.accMetaVal}>{arena.time}</span>
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
            <span>View All 10 Championship Arenas &amp; Full Rulebooks</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
