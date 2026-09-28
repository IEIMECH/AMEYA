"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import styles from "./SectionTransition.module.css";

export type TransitionVariant =
  | "orbit-travel"
  | "telemetry-slide"
  | "central-dossier"
  | "blueprint-datum"
  | "pricing-rise"
  | "laser-expand"
  | "spacious-axis"
  | "terminal-horizon";

interface SectionTransitionProps {
  sourceChapter: string;
  targetChapter: string;
  coordinate?: string;
  axisLabel?: string;
  variant?: TransitionVariant;
}

export default function SectionTransition({
  sourceChapter,
  targetChapter,
  coordinate = "MECH_CONCLAVE // VVITU",
  axisLabel = "AXIS_DATUM",
  variant = "orbit-travel",
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Tie transitions smoothly to viewport scroll progress
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Unique scroll-linked physical dynamics per variant
  const isCenterOrigin = variant === "central-dossier" || variant === "laser-expand";
  const origin = isCenterOrigin ? "center center" : "left center";

  const scaleX = useTransform(scrollYProgress, [0.12, 0.68], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0.08, 0.45, 0.88], [0, 1, 0.3]);
  const translateX = useTransform(
    scrollYProgress,
    [0.12, 0.65],
    variant === "telemetry-slide" ? [-45, 0] : [-20, 0]
  );
  const markerTravel = useTransform(scrollYProgress, [0.15, 0.75], ["0%", "100%"]);

  return (
    <div
      ref={ref}
      className={`${styles.transitionContainer} ${styles[variant] || ""}`}
      aria-hidden="true"
    >
      <div className={styles.inner}>
        {/* Left Telemetry Stamp */}
        <motion.div
          className={styles.labelLeft}
          style={{ opacity: shouldReduceMotion ? 0.75 : opacity }}
        >
          <span className={styles.pulseDot} />
          <span className={styles.sourceText}>{sourceChapter}</span>
          <span className={styles.arrowIcon}>──→</span>
          <span className={styles.targetText}>{targetChapter}</span>
        </motion.div>

        {/* 1px Traveling Engineering Axis Track */}
        <div className={styles.axisTrack}>
          {/* Main 1px Engineered Line */}
          <motion.div
            className={`${styles.axisLine} ${styles[`line_${variant}`] || ""}`}
            style={{
              scaleX: shouldReduceMotion ? 1 : scaleX,
              opacity: shouldReduceMotion ? 0.5 : opacity,
              transformOrigin: origin,
            }}
          />

          {/* Traveling Coordinate Node on the 1px line */}
          {!shouldReduceMotion && (
            <motion.div
              className={styles.travelingNode}
              style={{
                left: markerTravel,
                opacity: opacity,
              }}
            >
              <span className={styles.microTick} />
            </motion.div>
          )}

          {/* Variant-specific technical micro-accents */}
          {variant === "blueprint-datum" && (
            <div className={styles.blueprintCrosses}>
              <span className={styles.cross}>+</span>
              <span className={styles.cross}>+</span>
              <span className={styles.cross}>+</span>
            </div>
          )}

          {variant === "pricing-rise" && (
            <div className={styles.calibrationMarks}>
              <span className={styles.tick} />
              <span className={styles.tick} />
              <span className={styles.tick} />
              <span className={styles.tick} />
            </div>
          )}
        </div>

        {/* Right Coordinate Stamp */}
        <motion.div
          className={styles.labelRight}
          style={{
            opacity: shouldReduceMotion ? 0.75 : opacity,
            x: shouldReduceMotion ? 0 : translateX,
          }}
        >
          <span className={styles.axisTitle}>{axisLabel}</span>
          <span className={styles.coordinateStamp}>[{coordinate}]</span>
        </motion.div>
      </div>
    </div>
  );
}
