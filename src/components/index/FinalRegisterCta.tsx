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
  const isInView = useInView(sectionRef, { once: true, amount: "some" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className={styles.ctaSection} aria-label="Registration Callout">
      {/* Background Kinetic Laser Axis */}
      <div className={styles.laserAxisContainer} aria-hidden="true">
        <motion.div
          className={styles.laserBeam}
          initial={{ scaleX: shouldReduceMotion ? 1 : 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ type: "spring", bounce: 0, duration: 0.45 }}
            >
              <Sparkles size={12} className={styles.tagIcon} />
              <span>REGISTRATION OPEN</span>
              <span className={styles.dotSeparator}>•</span>
              <span className={styles.statusActive}>OCTOBER 04–05, 2026</span>
            </motion.div>

            <motion.h2
              className={styles.headline}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ type: "spring", bounce: 0, duration: 0.45, delay: shouldReduceMotion ? 0 : 0.06 }}
            >
              READY TO COMPETE AT <br />
              <span className={styles.headlineHighlight}>AMEYA &apos;26?</span>
            </motion.h2>

            <motion.p
              className={styles.subtext}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ type: "spring", bounce: 0, duration: 0.45, delay: shouldReduceMotion ? 0 : 0.12 }}
            >
              Secure your spot across 8 technical and non-technical solo challenges.
              Showcase your skills, earn merit certificates, and compete with the best.
            </motion.p>
          </div>

          {/* Right Action Block */}
          <motion.div
            className={styles.actionCol}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ type: "spring", bounce: 0, duration: 0.45, delay: shouldReduceMotion ? 0 : 0.16 }}
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
