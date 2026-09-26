"use client";

import Link from "next/link";
import { ArrowRight, Trophy, Clock, MapPin, Users, Flame, ShieldAlert, Cpu } from "lucide-react";
import styles from "./EventsPreview.module.css";

interface EventsPreviewProps {
  onRegisterClick: (eventName: string) => void;
}

export default function EventsPreview({ onRegisterClick }: EventsPreviewProps) {
  return (
    <section className={styles.section} id="arenas">
      <div className="container">
        {/* Section Header with Major Typographic Moment 3 (Section 16 & 84) */}
        <div className={styles.header}>
          <div className={styles.metaLabel}>
            <span className={styles.metaDot} />
            COMPETITION CADRE // 10 ARENAS
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

        {/* Event Hierarchy: Hero Event 01 Dominant (Section 33-35) */}
        <div className={styles.heroEventCard}>
          <div className={styles.heroCardBadge}>
            <span className={styles.heroNumber}>01</span>
            <span className={styles.heroTag}>FEATURED ARENA // 24-HOUR MARATHON</span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroContentLeft}>
              <h3 className={styles.heroTitle}>HACKSPRINT 24H</h3>
              <p className={styles.heroSlogan}>&ldquo;BUILD. BREAK. REBUILD.&rdquo;</p>
              <p className={styles.heroDesc}>
                An intensive 24-hour sprint in hardware prototyping, embedded microcontrollers, and kinetic mechanisms.
                Crews receive raw materials and challenge briefs to engineer working electromechanical prototypes
                before the final clock expires.
              </p>

              <div className={styles.heroSpecGrid}>
                <div className={styles.specItem}>
                  <Clock size={14} className={styles.specIcon} />
                  <span>24 Hours Non-Stop</span>
                </div>
                <div className={styles.specItem}>
                  <MapPin size={14} className={styles.specIcon} />
                  <span>Arena 3 // Simulation Lab</span>
                </div>
                <div className={styles.specItem}>
                  <Users size={14} className={styles.specIcon} />
                  <span>3–4 Engineers / Crew</span>
                </div>
                <div className={styles.specItemHighlight}>
                  <Trophy size={14} color="#E51D25" />
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
                  <ArrowRight size={15} />
                </button>
                <Link href="/events" className={styles.ghostLink}>
                  <span>Full Rulebook &amp; Rubric</span>
                </Link>
              </div>
            </div>

            <div className={styles.heroVisualRight}>
              <div className={styles.cadWireframeBox}>
                <div className={styles.wireframeReticle} aria-hidden="true">
                  <div className={styles.reticleRing} />
                  <div className={styles.reticleLineH} />
                  <div className={styles.reticleLineV} />
                </div>
                <div className={styles.schematicText}>
                  <span>ARENA PROTOCOL // 24H</span>
                  <span>CHASSIS: HARDWARE EMBEDDED</span>
                  <span>TOLERANCE: 0.05 MM</span>
                  <span>STATUS: WEAPONS ARMED</span>
                </div>
                <div className={styles.wireframeWatermark}>HACK // 24</div>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Events Grid (Section 35) */}
        <div className={styles.supportingGrid}>
          {/* 02 Robo Rumble */}
          <div 
            className={styles.supportingCard}
            onClick={() => onRegisterClick("Robo Rumble")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onRegisterClick("Robo Rumble"); }}
          >
            <div className={styles.cardHeaderRow}>
              <span className={styles.cardNumber}>02</span>
              <span className={styles.cardCategory}>COMBAT ROBOTICS</span>
            </div>
            <h4 className={styles.cardTitle}>Robo Rumble</h4>
            <p className={styles.cardDesc}>
              High-kinetic combat robot warfare in a reinforced poly-carbonate arena. Remote and autonomous bots clash until knockout.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardPrize}>₹12,000 PRIZE</span>
              <span className={styles.cardAction}>REGISTER &rarr;</span>
            </div>
          </div>

          {/* 03 CAD Clash */}
          <div 
            className={styles.supportingCard}
            onClick={() => onRegisterClick("CAD Clash")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onRegisterClick("CAD Clash"); }}
          >
            <div className={styles.cardHeaderRow}>
              <span className={styles.cardNumber}>03</span>
              <span className={styles.cardCategory}>PARAMETRIC DESIGN</span>
            </div>
            <h4 className={styles.cardTitle}>CAD Clash</h4>
            <p className={styles.cardDesc}>
              Speed 3D parametric part modeling, assembly constraints, and generative stress-testing under strict time limits.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardPrize}>₹8,000 PRIZE</span>
              <span className={styles.cardAction}>REGISTER &rarr;</span>
            </div>
          </div>

          {/* 04 Tech Manuscript */}
          <div 
            className={styles.supportingCard}
            onClick={() => onRegisterClick("Tech Manuscript")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onRegisterClick("Tech Manuscript"); }}
          >
            <div className={styles.cardHeaderRow}>
              <span className={styles.cardNumber}>04</span>
              <span className={styles.cardCategory}>RESEARCH DEFENSE</span>
            </div>
            <h4 className={styles.cardTitle}>Tech Manuscript</h4>
            <p className={styles.cardDesc}>
              Present and defend peer-reviewed mechanical engineering research papers before an academic and industrial jury.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardPrize}>₹8,000 PRIZE</span>
              <span className={styles.cardAction}>REGISTER &rarr;</span>
            </div>
          </div>

          {/* 05 Gear Hunt */}
          <div 
            className={styles.supportingCard}
            onClick={() => onRegisterClick("Gear Hunt")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onRegisterClick("Gear Hunt"); }}
          >
            <div className={styles.cardHeaderRow}>
              <span className={styles.cardNumber}>05</span>
              <span className={styles.cardCategory}>CRYPTOGRAPHY</span>
            </div>
            <h4 className={styles.cardTitle}>Gear Hunt</h4>
            <p className={styles.cardDesc}>
              Campus-wide mechanical cryptography quest. Solve engineering puzzles, dismantle gearboxes, and crack kinetic ciphers.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardPrize}>₹7,000 PRIZE</span>
              <span className={styles.cardAction}>REGISTER &rarr;</span>
            </div>
          </div>
        </div>

        {/* View All Arenas Action */}
        <div className={styles.viewAllRow}>
          <Link href="/events" className={styles.viewAllBtn}>
            <span>EXPLORE ALL 10 ARENAS &amp; SCHEDULES</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
