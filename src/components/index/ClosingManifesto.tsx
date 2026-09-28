"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import styles from "./ClosingManifesto.module.css";

export default function ClosingManifesto() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.28,
        delayChildren: 0.15,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const dreamVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 36, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section ref={containerRef} className={styles.section} id="manifesto" aria-label="Closing Manifesto">
      {/* Background Architectural Atmosphere */}
      <div className={styles.ambientGradients} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />

      <div className={styles.container}>
        {/* Terminal Title Sequence */}
        <motion.div
          className={styles.titleSequence}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Top Telemetry Stamp */}
          <motion.div variants={lineVariants} className={styles.chapterBadge}>
            <span className={styles.redDot} />
            <span>CHAPTER 09 // CLOSING TITLE SEQUENCE</span>
          </motion.div>

          {/* Staggered Title Sequence */}
          <div className={styles.manifestoTypography}>
            <motion.div variants={lineVariants} className={styles.line}>
              WHERE ENGINEERS
            </motion.div>
            <motion.div variants={lineVariants} className={`${styles.line} ${styles.lineIndented}`}>
              DARE TO
            </motion.div>
            <motion.div variants={dreamVariants} className={`${styles.line} ${styles.lineDream}`}>
              DREAM.
            </motion.div>
          </div>

          {/* Technical Coordinate & Department Notation Line */}
          <motion.div variants={lineVariants} className={styles.coordinateBlock}>
            <div className={styles.axisLine} />
            <div className={styles.metaRow}>
              <div className={styles.metaColLeft}>
                <span className={styles.metaLabel}>CONCLAVE DATUM</span>
                <span className={styles.metaValue}>AMEYA &apos;26 // DEPARTMENT OF MECHANICAL ENGINEERING</span>
              </div>
              <div className={styles.metaColRight}>
                <span className={styles.metaLabel}>COORDINATES</span>
                <span className={styles.metaValue}>16.347° N, 80.526° E // VVITU NAMBUR</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
