"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./SectionTransitionOverlay.module.css";

export default function SectionTransitionOverlay() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const prevPathRef = useRef(pathname);

  // Trigger brief, elegant transition state whenever pathname changes
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setIsTransitioning(true);
      setIsExiting(false);

      // Brief transition (260ms active, then fade out)
      const timerActive = setTimeout(() => {
        setIsExiting(true);
      }, 260);

      const timerDone = setTimeout(() => {
        setIsTransitioning(false);
        setIsExiting(false);
      }, 480);

      return () => {
        clearTimeout(timerActive);
        clearTimeout(timerDone);
      };
    }
  }, [pathname]);

  if (!isTransitioning) return null;

  return (
    <div
      className={`${styles.overlay} ${isExiting ? styles.overlayExiting : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading section"
    >
      <div className={styles.laserBeam} aria-hidden="true" />
      <div className={styles.card}>
        <div className={styles.emblemWrapper}>
          <div className={styles.pulsingRing} aria-hidden="true" />
          <div className={styles.spinningRing} aria-hidden="true" />
          <Image
            src="/same-logo.png"
            alt="AMEYA Emblem"
            width={44}
            height={44}
            className={styles.emblem}
            priority
          />
        </div>
        <div className={styles.labelWrapper}>
          <div className={styles.festTitle}>
            AMEYA <span>&apos;26</span>
          </div>
          <span className={styles.sublabel}>CALIBRATING SECTION...</span>
        </div>
      </div>
    </div>
  );
}
