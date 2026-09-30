"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./FestivalStory.module.css";

interface StatItem {
  target: number;
  suffix: string;
  prefix?: string;
  label: string;
  sub: string;
}

const statsData: StatItem[] = [
  { target: 4, suffix: "+", label: "NATIONAL EDITIONS", sub: "Legacy of Technical Excellence" },
  { target: 1200, suffix: "+", label: "PARTICIPANT ENGINEERS", sub: "Across 40+ Regional Institutes" },
  { target: 8, suffix: "", label: "CHAMPIONSHIP ARENAS", sub: "Individual Engineering Challenges" },
  { target: 50, suffix: "K+", prefix: "₹", label: "TOTAL PRIZE POOL", sub: "Merit Awards & Recognition" },
];

export default function FestivalStory() {
  const [showFullStory, setShowFullStory] = useState(false);
  const [counts, setCounts] = useState<number[]>([4, 1200, 8, 50]);

  // Smooth numeric counter animation on mount
  useEffect(() => {
    const startTime = performance.now();
    const duration = 1200;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounts(statsData.map((s) => Math.floor(ease * s.target)));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCounts(statsData.map((s) => s.target));
      }
    };

    requestAnimationFrame(tick);
  }, []);

  return (
    <section className={styles.section} id="intro">
      <div className={styles.innerContainer}>
        {/* Editorial Headline & Story: Permanent, Never Disappears on Scroll */}
        <div className={styles.editorialGrid}>
          <div className={styles.headlineColumn}>
            <h2 className={styles.monumentalHeadline}>
              <span>AMEYA IS NOT</span>
              <span>JUST ANOTHER</span>
              <span className={styles.highlightText}>TECHNICAL FEST.</span>
            </h2>
          </div>

          <div className={styles.copyColumn}>
            <p className={styles.leadParagraph}>
              It is a proving ground where theoretical continuum mechanics meets the physical reality of precision machining, robotics, and design.
              Founded under the Institution of Engineers India (SAME), the Sanskrit word <em>Ameya</em> translates
              to <strong>&ldquo;immeasurable&rdquo;</strong> &mdash; honoring the boundless potential and creative discipline of young engineers.
            </p>

            <div className={styles.actionRow}>
              <button
                type="button"
                onClick={() => setShowFullStory(!showFullStory)}
                className={styles.revealStoryBtn}
                aria-expanded={showFullStory}
              >
                <span>{showFullStory ? "CONCISE VIEW" : "READ COMPLETE FESTIVAL ARCHIVE"}</span>
                {showFullStory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <Link href="/about" className={styles.inlineArchiveLink}>
                <span>ABOUT IEI SAME</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {showFullStory && (
              <div className={styles.expandedStoryBlock}>
                <p>
                  Held annually at Vasireddy Venkatadri Institute of Technology (VVITU), Ameya brings together collegiate engineers from across India.
                  Across two days of intense competition, participants test their mastery through parametric CAD challenges, high-speed kinematic teardowns, obstacle racecourses, and technical diagnostics.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Clean Datum Line */}
        <div className={styles.datumDivider} aria-hidden="true" />

        {/* Editorial Data Modules: Permanent, Visible Across All Scrolling */}
        <div className={styles.statsGrid}>
          {statsData.map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
              <div className={styles.numberWrapper}>
                {stat.prefix && <span className={styles.statPrefix}>{stat.prefix}</span>}
                <span className={styles.statNumber}>
                  {stat.target < 10 && counts[idx] < 10 ? `0${counts[idx]}` : counts[idx].toLocaleString()}
                </span>
                <span className={styles.statSuffix}>{stat.suffix}</span>
              </div>

              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statSub}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
