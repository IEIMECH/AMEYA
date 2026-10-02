"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import styles from "./ClosingManifesto.module.css";

export default function ClosingManifesto() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: "some" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section ref={containerRef} className={styles.section} id="manifesto" aria-label="Closing Manifesto">
      {/* Background Architectural Atmosphere with Opacity Reveal */}
      <motion.div
        className={styles.ambientGradients}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      />
      

      <div className={styles.container}>
        {/* Terminal Title Sequence */}
        <div className={styles.titleSequence}>
          {/* Top Cinematic Brand Header (Req 7) */}
          <motion.div
            className={styles.chapterBadge}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ type: "spring", bounce: 0, duration: 0.45 }}
          >
            <span>AMEYA &apos;26</span>
          </motion.div>

          {/* Staggered Cinematic Title Sequence */}
          <div className={styles.manifestoTypography}>
            <motion.div
              className={styles.line}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ type: "spring", bounce: 0, duration: 0.5, delay: shouldReduceMotion ? 0 : 0.08 }}
            >
              WHERE ENGINEERS
            </motion.div>
            <motion.div
              className={`${styles.line} ${styles.lineIndented}`}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ type: "spring", bounce: 0, duration: 0.5, delay: shouldReduceMotion ? 0 : 0.16 }}
            >
              DARE TO
            </motion.div>
            <motion.div
              className={`${styles.line} ${styles.lineIndented}`}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: shouldReduceMotion ? 1 : 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ type: "spring", bounce: 0, duration: 0.55, delay: shouldReduceMotion ? 0 : 0.24 }}
            >
              DREAM.
            </motion.div>
          </div>

          {/* Technical Coordinate & Department Notation Line */}
          <motion.div
            className={styles.coordinateBlock}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ type: "spring", bounce: 0, duration: 0.45, delay: shouldReduceMotion ? 0 : 0.32 }}
          >
            <div className={styles.axisLine} />
            <div className={styles.metaRow}>
              <div className={styles.metaColLeft}>
                <span className={styles.metaLabel}>ORGANIZED BY</span>
                <span className={styles.metaValue}>AMEYA &apos;26 // IEISAME</span>
              </div>
              <div className={styles.metaColRight}>
                <span className={styles.metaLabel}>LOCATION</span>
                <span className={styles.metaValue}>16.347&deg; N, 80.526&deg; E // VVITU NAMBUR</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
