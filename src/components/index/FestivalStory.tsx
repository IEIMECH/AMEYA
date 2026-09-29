"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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
  { target: 8, suffix: "", label: "COMPETITION EVENTS", sub: "TECHNICAL & HANDS-ON CHALLENGES" },
  { target: 50, suffix: "K+", prefix: "₹", label: "TOTAL PRIZE POOL", sub: "MERIT & AWARDS" },
];

export default function FestivalStory() {
  const [showFullStory, setShowFullStory] = useState(false);
  const [hasCounted, setHasCounted] = useState(false);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: "some" });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || hasCounted) return;
    setHasCounted(true);

    if (shouldReduceMotion) {
      setCounts(statsData.map((s) => s.target));
      return;
    }

    const startTime = performance.now();
    const duration = 1000;

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
  }, [isInView, hasCounted, shouldReduceMotion]);

  return (
    <section ref={sectionRef} className={styles.section} id="intro">
      <div className={styles.innerContainer}>
        {/* Asymmetrical Editorial Header Layout */}
        <div className={styles.editorialGrid}>
          {/* Left Column: Monumental Headline */}
          <motion.div
            className={styles.headlineColumn}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.kicker}>
              <span className={styles.kickerDot} />
              ABOUT AMEYA
            </div>

            <h2 className={styles.monumentalHeadline}>
              <span>AMEYA IS NOT</span>
              <span>JUST ANOTHER</span>
              <span className={styles.highlightText}>TECHNICAL FEST.</span>
            </h2>
          </motion.div>

          {/* Right Column: Editorial Paragraph */}
          <motion.div
            className={styles.copyColumn}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={styles.leadParagraph}>
              It is a proving ground where theoretical mechanics meets physical reality.
              Founded under the Institution of Engineers India (SAME), the Sanskrit word <em>Ameya</em> translates
              to <strong>&ldquo;immeasurable&rdquo;</strong> &mdash; honoring the limitless potential and creative ambition
              of young engineers.
            </p>

            {showFullStory && (
              <div className={styles.expandedText}>
                <p>
                  Whether you are testing your modeling speed in AutoCAD, racing kinetic RC machines,
                  troubleshooting mechanical assemblies against the clock, or identifying industrial tooling under pressure &mdash; Ameya is your stage.
                </p>
                <p>
                  Two days. Eight official solo competitions. Hundreds of aspiring engineers from across institutions
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
                <span>{showFullStory ? "SHOW LESS" : "READ FULL STORY"}</span>
                {showFullStory ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              <Link href="/about" className={styles.aboutLink}>
                <span>About Ameya &amp; Legacy</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 1px Clean Crimson Datum Divider */}
        <motion.div
          className={styles.datumDivider}
          aria-hidden="true"
          initial={{ opacity: 0, scaleX: shouldReduceMotion ? 1 : 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: shouldReduceMotion ? 1 : 0 }}
          transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left center" }}
        >
          <span className={styles.datumCrossLeft}>+</span>
          <div className={styles.datumLine} />
          <span className={styles.datumTag}>BY THE NUMBERS</span>
          <span className={styles.datumCrossRight}>+</span>
        </motion.div>

        {/* Interactive Statistics Grid with Subtle Scale & Once-only Count */}
        <div className={styles.statsGrid}>
          {statsData.map((stat, idx) => (
            <motion.div
              key={idx}
              className={styles.statCard}
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 20,
                scale: shouldReduceMotion ? 1 : 0.96,
              }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.96 }
              }
              transition={{
                duration: 0.55,
                delay: shouldReduceMotion ? 0 : 0.2 + idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className={styles.cornerCrossTL}>+</span>
              <span className={styles.cornerCrossBR}>+</span>
              <div className={styles.statIndex}>0{idx + 1}</div>

              <div className={styles.numberWrapper}>
                {stat.prefix && <span className={styles.statPrefix}>{stat.prefix}</span>}
                <span className={styles.statNumber}>
                  {counts[idx].toLocaleString()}
                </span>
                <span className={styles.statSuffix}>{stat.suffix}</span>
              </div>

              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statSub}>{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
