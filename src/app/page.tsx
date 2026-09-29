"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero3DCanvas from "@/components/index/Hero3DCanvas";
import FestivalStory from "@/components/index/FestivalStory";
import PhotoWall from "@/components/index/PhotoWall";
import SpeakerSection from "@/components/index/SpeakerSection";
import FinalRegisterCta from "@/components/index/FinalRegisterCta";
import SponsorSection from "@/components/index/SponsorSection";
import ClosingManifesto from "@/components/index/ClosingManifesto";
import SectionTransition from "@/components/index/SectionTransition";
import RegistrationDialog from "@/components/RegistrationDialog";
import { events, Event } from "@/data/events";
import styles from "./page.module.css";

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fest Countdown to October 4, 2026 (Asia/Kolkata timezone standard)
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

  const handleOpenRegister = (eventName?: string) => {
    if (eventName) {
      const match = events.find(
        (e) =>
          e.name.toLowerCase().includes(eventName.toLowerCase()) ||
          eventName.toLowerCase().includes(e.name.toLowerCase())
      );
      setSelectedEvent(match || events[0]);
    } else {
      setSelectedEvent(events[0]);
    }
  };

  return (
    <main className={styles.mainWrapper}>
      {/* ============================================================ */}
      {/* 01. HERO: Kinetic 3D Gear Assembly & Editorial Headline     */}
      {/* ============================================================ */}
      <Hero3DCanvas />

      <section className={styles.heroSection} id="hero" aria-label="AMEYA Hero">
        <div className={styles.heroGrid}>
          {/* Main Left Content Block - Unobstructed Headline Dominance */}
          <div className={styles.leftHeroBlock}>
            {/* Sleek Integrated Countdown Ticker (Extracted naturally) */}
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

            {/* Monumental Headline */}
            <h1 className={styles.editorialTitle}>
              <span className={styles.titleLineWhere}>WHERE</span>
              <span className={styles.titleLineEngineers}>ENGINEERS</span>
              <span className={styles.titleLineDareTo}>DARE TO</span>
              <span className={styles.titleLineDream}>DREAM</span>
            </h1>

            <p className={styles.editorialSub}>
              Two days of high-precision design, kinetic challenges,
              and mechanical engineering excellence at Vasireddy Venkatadri Institute of Technology.
            </p>

            <div className={styles.ctaRow}>
              <Link href="/events" className={styles.primaryHeroCta} id="hero-primary-cta">
                <span>EXPLORE EVENTS</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/venue" className={styles.secondaryHeroCta} id="hero-secondary-cta">
                <span>3D CAMPUS MAP</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clean 1px Laser Track */}
      <SectionTransition variant="orbit-travel" />

      {/* ============================================================ */}
      {/* 02. ABOUT AMEYA: Editorial Statement & Live Counters        */}
      {/* ============================================================ */}
      <FestivalStory />

      {/* Clean 1px Laser Track */}
      <SectionTransition variant="telemetry-slide" />

      {/* ============================================================ */}
      {/* 03. MEMORIES FROM LAST YEAR: Visual Memory Wall             */}
      {/* ============================================================ */}
      <PhotoWall />

      {/* Clean 1px Laser Track */}
      <SectionTransition variant="central-dossier" />

      {/* ============================================================ */}
      {/* 04. GUESTS & SPEAKERS: Guest Profiles & Technical Keynotes   */}
      {/* ============================================================ */}
      <SpeakerSection />

      {/* Clean 1px Laser Track */}
      <SectionTransition variant="laser-expand" />

      {/* ============================================================ */}
      {/* 05. REGISTRATION: Call to Action Strip                      */}
      {/* ============================================================ */}
      <FinalRegisterCta onRegisterClick={() => handleOpenRegister()} />

      {/* Clean 1px Laser Track */}
      <SectionTransition variant="spacious-axis" />

      {/* ============================================================ */}
      {/* 06. SPONSORS: Industry Partners & Professional Chapters     */}
      {/* ============================================================ */}
      <SponsorSection />

      {/* Clean 1px Laser Track */}
      <SectionTransition variant="terminal-horizon" />

      {/* ============================================================ */}
      {/* 07. CLOSING: Manifesto & Department Credits                 */}
      {/* ============================================================ */}
      <ClosingManifesto />

      {/* Registration Dialog Modal */}
      {selectedEvent && (
        <RegistrationDialog
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </main>
  );
}
