"use client";

import { ArrowRight, Terminal } from "lucide-react";
import styles from "./FinalRegisterCta.module.css";

interface FinalRegisterCtaProps {
  onRegisterClick: () => void;
}

export default function FinalRegisterCta({ onRegisterClick }: FinalRegisterCtaProps) {
  return (
    <section className={styles.ctaSection} aria-label="Final Registration Callout">
      {/* Background Kinetic Laser Axis */}
      <div className={styles.laserAxisContainer} aria-hidden="true">
        <div className={styles.laserBeam} />
      </div>

      {/* Background Architectural Grid Marks */}
      <div className={styles.bgOverlay} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.stripInner}>
          {/* Left Text Block */}
          <div className={styles.textCol}>
            <div className={styles.telemetryTag}>
              <Terminal size={12} className={styles.tagIcon} />
              <span>CHAPTER 07 // FINAL CONVERSION SEQUENCE</span>
              <span className={styles.dotSeparator}>•</span>
              <span className={styles.statusActive}>SYSTEM READY</span>
            </div>

            <h2 className={styles.headline}>
              READY TO ENTER <br />
              <span className={styles.headlineHighlight}>THE MACHINE?</span>
            </h2>

            <p className={styles.subtext}>
              Secure your place at AMEYA &apos;26. Two intense days of combat robotics, rapid fabrication, and engineering breakthroughs.
            </p>
          </div>

          {/* Right Action Block: Distinct conversion button */}
          <div className={styles.actionCol}>
            <button
              type="button"
              onClick={onRegisterClick}
              className={styles.registerButton}
              id="final-cta-register-btn"
              aria-label="Register for AMEYA 2026 Conclave"
            >
              <span className={styles.btnText}>REGISTER</span>
              <span className={styles.btnArrowWrapper}>
                <ArrowRight size={18} className={styles.arrowIcon} />
              </span>
            </button>

            <div className={styles.actionAnnotation}>
              <span>ENTRY CLOSES IN 6 DAYS</span>
              <span className={styles.sep}>//</span>
              <span>SLOTS CAPPED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
