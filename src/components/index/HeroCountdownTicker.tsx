"use client";

import { useState, useEffect } from "react";
import styles from "@/app/page.module.css";

export default function HeroCountdownTicker() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const festDate = new Date("2026-10-04T09:00:00+05:30").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = festDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.heroCountdownTicker} suppressHydrationWarning>
      <span className={styles.pulseDot} />
      <span className={styles.tickerLabel}>AMEYA &apos;26 COUNTDOWN</span>
      <span className={styles.tickerDivider}>/</span>
      <span className={styles.tickerValue}>
        T-MINUS{" "}
        {mounted
          ? `${String(timeLeft.days).padStart(2, "0")}D : ${String(timeLeft.hours).padStart(2, "0")}H : ${String(timeLeft.minutes).padStart(2, "0")}M : ${String(timeLeft.seconds).padStart(2, "0")}S`
          : "08D : 11H : 31M : 40S"}
      </span>
      <span className={styles.tickerDivider}>/</span>
      <span className={styles.tickerDate}>OCT 04–05</span>
    </div>
  );
}
