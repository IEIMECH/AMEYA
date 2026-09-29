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
  variant?: TransitionVariant;
}

export default function SectionTransition({
  variant = "orbit-travel",
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const isCenterOrigin = variant === "central-dossier" || variant === "laser-expand";
  const origin = isCenterOrigin ? "center center" : "left center";

  const scaleX = useTransform(scrollYProgress, [0.12, 0.68], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0.08, 0.45, 0.88], [0, 1, 0.4]);
  const markerTravel = useTransform(scrollYProgress, [0.15, 0.75], ["0%", "100%"]);

  return (
    <div
      ref={ref}
      className={`${styles.transitionContainer} ${styles[variant] || ""}`}
      aria-hidden="true"
    >
      <div className={styles.inner}>
        {/* Clean 1px Engineered Axis Track */}
        <div className={styles.axisTrack}>
          <motion.div
            className={`${styles.axisLine} ${styles[`line_${variant}`] || ""}`}
            style={{
              scaleX: shouldReduceMotion ? 1 : scaleX,
              opacity: shouldReduceMotion ? 0.4 : opacity,
              transformOrigin: origin,
            }}
          />

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
        </div>
      </div>
    </div>
  );
}
