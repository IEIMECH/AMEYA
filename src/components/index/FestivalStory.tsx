"use client";

import { useState, useEffect, useRef } from "react";
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
  { target: 5, suffix: "+", label: "NATIONAL EDITIONS", sub: "LEGACY OF EXCELLENCE" },
  { target: 1200, suffix: "+", label: "PARTICIPANT ENGINEERS", sub: "ACROSS 40+ INSTITUTES" },
  { target: 10, suffix: "+", label: "TECHNICAL ARENAS", sub: "HARDWARE & KINETIC LABS" },
  { target: 150, suffix: "K+", prefix: "₹", label: "TOTAL PRIZE POOL", sub: "MERIT & CHAMPIONSHIPS" },
];

export default function FestivalStory() {
  const [showFullStory, setShowFullStory] = useState(false);
  const [hasCounted, setHasCounted] = useState(false);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasCounted) {
          setHasCounted(true);

          const startTime = performance.now();
          const duration = 1600; // 1.6s smooth count

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            setCounts(statsData.map((s) => Math.floor(ease * s.target)));

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setCounts(statsData.map((s) => s.target));
            }
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasCounted]);

  return (
    <section ref={sectionRef} className={styles.section} id="intro">
      <div className={styles.innerContainer}>
        {/* Asymmetrical Editorial Header Layout */}
        <div className={styles.editorialGrid}>
          {/* Left Column: Monumental Headline */}
          <div className={styles.headlineColumn}>
            <div className={styles.kicker}>
              <span className={styles.kickerDot} />
              CHAPTER_02 // CONCLAVE MANIFESTO
            </div>

            <h2 className={styles.monumentalHeadline}>
              <span>AMEYA IS NOT</span>
              <span>JUST ANOTHER</span>
              <span className={styles.highlightText}>TECHNICAL FEST.</span>
            </h2>
          </div>

          {/* Right Column: Editorial Dossier Paragraph */}
          <div className={styles.copyColumn}>
            <p className={styles.leadParagraph}>
              It is a proving ground where theoretical mechanics meets raw kinetic torque.
              Founded under the Institution of Engineers India (SAME), the Sanskrit word <em>Ameya</em> translates
              to <strong>&ldquo;immeasurable&rdquo;</strong> &mdash; because human ingenuity and technical ambition
              cannot be constrained by standard industrial tolerances.
            </p>

            {showFullStory && (
              <div className={styles.expandedText}>
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

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowFullStory(!showFullStory)}
                aria-expanded={showFullStory}
              >
                <span>{showFullStory ? "COLLAPSE DOSSIER" : "READ COMPLETE MANIFESTO"}</span>
                {showFullStory ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              <Link href="/about" className={styles.aboutLink}>
                <span>About Council &amp; Legacy</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* 1px Technical Red Datum Divider */}
        <div className={styles.datumDivider} aria-hidden="true">
          <span className={styles.datumCrossLeft}>+</span>
          <div className={styles.datumLine} />
          <span className={styles.datumTag}>IMPACT_TELEMETRY // VERIFIED</span>
          <span className={styles.datumCrossRight}>+</span>
        </div>

        {/* Interactive Statistics Grid with Count-up & Engineering Markers */}
        <div className={styles.statsGrid}>
          {statsData.map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
              <span className={styles.cornerCrossTL}>+</span>
              <span className={styles.cornerCrossBR}>+</span>
              <div className={styles.statIndex}>0{idx + 1} // METRIC</div>

              <div className={styles.numberWrapper}>
                {stat.prefix && <span className={styles.statPrefix}>{stat.prefix}</span>}
                <span className={styles.statNumber}>
                  {counts[idx].toLocaleString()}
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
