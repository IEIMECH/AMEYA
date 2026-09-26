"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./FestivalStory.module.css";

export default function FestivalStory() {
  const [showFullStory, setShowFullStory] = useState(false);

  return (
    <section className={styles.section} id="story">
      <div className="container">
        {/* Treatment A — Editorial Statement (Section 13, 21, 28) */}
        <div className={styles.statementWrapper}>
          <div className={styles.metaLabel}>
            <span className={styles.metaDot} />
            CONCLAVE PHILOSOPHY // 2026
          </div>

          <h2 className={styles.editorialHeadline}>
            AMEYA IS NOT<br />
            JUST ANOTHER<br />
            <span className={styles.headlineHighlight}>TECHNICAL FEST.</span>
          </h2>

          <div className={styles.storyTextWrapper}>
            <p className={styles.storyLead}>
              It is a proving ground where theoretical mechanics meets raw kinetic torque.
              Founded under the Institution of Engineers India (SAME), the Sanskrit word <em>Ameya</em> translates
              to <strong>&ldquo;immeasurable&rdquo;</strong> &mdash; because human ingenuity and technical ambition
              cannot be constrained by standard tolerances.
            </p>

            {showFullStory && (
              <div className={styles.expandedStory}>
                <p>
                  Whether you are calculating the gear ratios of an 8,000 RPM spinning-disc combat robot,
                  programming real-time telemetry on an embedded microcontroller under 24-hour hackathon pressure,
                  or defending pioneering thermodynamics research before an academic jury &mdash; Ameya is your arena.
                </p>
                <p>
                  Two days. Ten high-stakes technical arenas. Over 1,200 visiting engineers from across 40+ institutions
                  converging at the Department of Mechanical Engineering, VVITU.
                </p>
              </div>
            )}

            <div className={styles.storyActions}>
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowFullStory(!showFullStory)}
                aria-expanded={showFullStory}
              >
                <span>{showFullStory ? "COLLAPSE DOSSIER" : "READ COMPLETE MANIFESTO"}</span>
                {showFullStory ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              <Link href="/about" className={styles.learnMoreLink}>
                <span>About Council &amp; Legacy</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Priority 3: Small, Subtle Mechanical Transition Divider (Section 09-10) */}
        <div className={styles.mechanicalDivider} aria-hidden="true">
          <div className={styles.gearDiagram}>
            <svg viewBox="0 0 100 100" className={styles.rotatingGearSvg}>
              <circle cx="50" cy="50" r="44" stroke="rgba(242, 237, 232, 0.08)" strokeWidth="1" fill="none" strokeDasharray="3 4" />
              <circle cx="50" cy="50" r="30" stroke="rgba(229, 29, 37, 0.35)" strokeWidth="1" fill="none" />
              <circle cx="50" cy="50" r="14" stroke="rgba(242, 237, 232, 0.15)" strokeWidth="1" fill="none" />
              <line x1="50" y1="6" x2="50" y2="94" stroke="rgba(242, 237, 232, 0.08)" strokeWidth="1" />
              <line x1="6" y1="50" x2="94" y2="50" stroke="rgba(242, 237, 232, 0.08)" strokeWidth="1" />
              {[...Array(8)].map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="10"
                  x2="50"
                  y2="16"
                  stroke="rgba(242, 237, 232, 0.25)"
                  strokeWidth="1.2"
                  transform={`rotate(${i * 45} 50 50)`}
                />
              ))}
            </svg>
            <div className={styles.gearCenterDot} />
          </div>
          <div className={styles.dividerLine} />
        </div>

        {/* Priority 6: Editorial Raw-Data Statistics (Large numbers + small labels + generous whitespace) */}
        <div className={styles.rawStatsGrid}>
          <div className={styles.statBlock}>
            <div className={styles.statNumber}>05<span className={styles.statPlus}>+</span></div>
            <div className={styles.statLabel}>NATIONAL EDITIONS</div>
          </div>

          <div className={styles.statBlock}>
            <div className={styles.statNumber}>1,200<span className={styles.statPlus}>+</span></div>
            <div className={styles.statLabel}>STUDENT ENGINEERS</div>
          </div>

          <div className={styles.statBlock}>
            <div className={styles.statNumber}>10<span className={styles.statPlus}>+</span></div>
            <div className={styles.statLabel}>TECHNICAL ARENAS</div>
          </div>

          <div className={styles.statBlock}>
            <div className={styles.statNumber}>₹50K<span className={styles.statPlus}>+</span></div>
            <div className={styles.statLabel}>TOTAL PRIZE POOL</div>
          </div>
        </div>
      </div>
    </section>
  );
}
