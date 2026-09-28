"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./MotionBackground.module.css";

export default function MotionBackground() {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Exclude Home ('/') and all Team routes ('/team', '/team/explore', etc.)
  const isExcluded = pathname === "/" || pathname?.startsWith("/team");

  // Ensure autoplay and muted state work reliably across all desktop and mobile browsers
  useEffect(() => {
    if (!isExcluded && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy fallback: video will resume on user gesture
        });
      }
    }
  }, [isExcluded, pathname]);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  if (isExcluded) return null;

  return (
    <div className={styles.videoBackgroundWrapper} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.videoElement}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/motion_background.mp4" type="video/mp4" />
      </video>

      {/* Cinematic dark tint overlay to maintain crisp typography contrast */}
      <div className={styles.videoOverlay} />
      <div className={styles.gridOverlay} />
    </div>
  );
}
