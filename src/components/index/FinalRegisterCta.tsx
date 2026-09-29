"use client";

import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import styles from "./FinalRegisterCta.module.css";

interface FinalRegisterCtaProps {
  onRegisterClick: () => void;
}

export default function FinalRegisterCta({ onRegisterClick }: FinalRegisterCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className={styles.ctaSection} aria-label="Registration Callout">
      {/* Background Kinetic Laser Axis */}
      <div className={styles.laserAxisContainer} aria-hidden="true">
        <motion.div
          className={styles.laserBeam}
          initial={{ scaleX: shouldReduceMotion ? 1 : 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: shouldReduceMotion ? 1 : 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left center" }}
        />
      </div>

      {/* Background Grid Marks */}
      <div className={styles.bgOverlay} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.stripInner}>
          {/* Left Text Block */}
          <div className={styles.textCol}>
            <motion.div
              className={styles.telemetryTag}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Sparkles size={12} className={styles.tagIcon} />
              <span>REGISTRATION OPEN</span>
              <span className={styles.dotSeparator}>•</span>
              <span className={styles.statusActive}>OCTOBER 04–05, 2026</span>
            </motion.div>

            <motion.h2
              className={styles.headline}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
              transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              READY TO COMPETE AT <br />
              <span className={styles.headlineHighlight}>AMEYA &apos;26?</span>
            </motion.h2>

            <motion.p
              className={styles.subtext}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              Secure your spot across 8 technical and non-technical solo challenges.
              Showcase your skills, earn merit certificates, and compete with the best.
            </motion.p>
          </div>

          {/* Right Action Block */}
          <motion.div
            className={styles.actionCol}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onRegisterClick}
              className={styles.registerButton}
              id="final-cta-register-btn"
              aria-label="Register for AMEYA 2026 Events"
            >
              <span className={styles.btnText}>REGISTER NOW</span>
              <span className={styles.btnArrowWrapper}>
                <ArrowRight size={18} className={styles.arrowIcon} />
              </span>
            </button>

            <div className={styles.actionAnnotation}>
              <span>8 SOLO COMPETITIONS</span>
              <span className={styles.sep}>//</span>
              <span>FREE REGISTRATION</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
