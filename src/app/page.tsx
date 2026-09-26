"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Hero3DCanvas from "@/components/index/Hero3DCanvas";
import FestivalStory from "@/components/index/FestivalStory";
import PhotoWall from "@/components/index/PhotoWall";
import SpeakerSection from "@/components/index/SpeakerSection";
import EventsPreview from "@/components/index/EventsPreview";
import GetTicketsSection from "@/components/index/GetTicketsSection";
import Danmaku from "@/components/index/Danmaku";
import SponsorSection from "@/components/index/SponsorSection";
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
    <>
      {/* 3D Kinematic Mechanical Assembly (The Visual Protagonist of AMEYA) */}
      <Hero3DCanvas />

      {/* Editorial Asymmetric Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          {/* Main Left Content Block */}
          <div className={styles.leftHeroBlock}>
            {/* Top Telemetry Identity Kicker */}
            <div className={styles.kicker}>
              <span className={styles.kickerDot} />
              IEI SAME // AMEYA &apos;26 NATIONAL CONCLAVE
            </div>

            {/* Major Typographic Moment 1: One Unified Monumental Statement (Priority 1 & 2) */}
            <h1 className={styles.editorialTitle}>
              <span className={styles.titleLine1}>WHERE</span>
              <span className={styles.titleLineEngineers}>ENGINEERS</span>
              <span className={styles.titleLine3}>
                DARE TO <span className={styles.accentWord}>DREAM</span>
              </span>
            </h1>

            <p className={styles.editorialSub}>
              Two days of autonomous robotics warfare, 24-hour rapid hardware prototyping,
              and mechanical engineering excellence at Vasireddy Venkatadri Institute of Technology.
            </p>

            <div className={styles.ctaRow}>
              <Link href="/events" className={styles.primaryHeroCta} id="hero-primary-cta">
                <span>EXPLORE EVENTS</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/agenda" className={styles.secondaryHeroCta} id="hero-secondary-cta">
                <span>VIEW AGENDA</span>
              </Link>
            </div>
          </div>

          {/* Bottom Right Clean Technical Metadata Block (Section 22) */}
          <div className={styles.bottomMetaBlock}>
            <div className={styles.metaDept}>
              DEPARTMENT OF MECHANICAL ENGINEERING
            </div>
            <div className={styles.metaCollege}>
              VVITU // NAMBUR, GUNTUR
            </div>
            <div className={styles.metaDate}>
              2026 // OCTOBER 04 &ndash; 05
            </div>
            <div className={styles.metaCountdown} suppressHydrationWarning>
              T-MINUS{" "}
              {mounted
                ? `${String(timeLeft.days).padStart(2, "0")}D : ${String(timeLeft.hours).padStart(2, "0")}H : ${String(timeLeft.minutes).padStart(2, "0")}M : ${String(timeLeft.seconds).padStart(2, "0")}S`
                : "08D : 11H : 31M : 40S"}
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Step 2: Editorial Festival Statement & Raw Data (Section 21, 28, 31) */}
      <FestivalStory />

      {/* Narrative Step 3: Documentary Moments / Real Human Energy (Section 05, 69) */}
      <PhotoWall />

      {/* Narrative Step 4: Keynote & Guest Speakers (Section 21) */}
      <SpeakerSection />

      {/* Narrative Step 5: Events Lineup with True Visual Hierarchy (Section 32-37) */}
      <EventsPreview onRegisterClick={handleOpenRegister} />

      {/* Narrative Step 6: Registration & Entry Passes */}
      <GetTicketsSection onRegisterClick={handleOpenRegister} />

      {/* Live Danmaku Telemetry Comments */}
      <Danmaku />

      {/* Narrative Step 7: Sponsors & Industrial Alliances */}
      <SponsorSection />

      {/* Registration Dialog Modal */}
      {selectedEvent && (
        <RegistrationDialog
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
