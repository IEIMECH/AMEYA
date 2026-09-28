"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero3DCanvas from "@/components/index/Hero3DCanvas";
import FestivalStory from "@/components/index/FestivalStory";
import PhotoWall from "@/components/index/PhotoWall";
import SpeakerSection from "@/components/index/SpeakerSection";
import EventsPreview from "@/components/index/EventsPreview";
import GetTicketsSection from "@/components/index/GetTicketsSection";
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
      {/* CHAPTER 01 // MACHINE: Hero + Kinetic 3D Gear Assembly      */}
      {/* ============================================================ */}
      <Hero3DCanvas />

      <section className={styles.heroSection} id="hero" aria-label="Conclave Hero">
        <div className={styles.heroGrid}>
          {/* Main Left Content Block */}
          <div className={styles.leftHeroBlock}>
            {/* Major Typographic Moment: Deliberate Editorial Stagger */}
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

          {/* Bottom Right Clean Technical Metadata Block */}
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

      {/* TRANSITION 01 -> 02: Orbit Travel Line */}
      <SectionTransition
        sourceChapter="01 // MACHINE"
        targetChapter="02 // IDEA"
        coordinate="16.347°N 80.526°E"
        axisLabel="ROTATIONAL_DATUM"
        variant="orbit-travel"
      />

      {/* ============================================================ */}
      {/* CHAPTER 02 // IDEA: Editorial Festival Statement & Counters  */}
      {/* ============================================================ */}
      <FestivalStory />

      {/* TRANSITION 02 -> 03: Telemetry Slide Line */}
      <SectionTransition
        sourceChapter="02 // IDEA"
        targetChapter="03 // PEOPLE"
        coordinate="REEL_35MM // 24FPS"
        axisLabel="HISTOGRAM_DATUM"
        variant="telemetry-slide"
      />

      {/* ============================================================ */}
      {/* CHAPTER 03 // PEOPLE: Documentary Filmstrip & Moments       */}
      {/* ============================================================ */}
      <PhotoWall />

      {/* TRANSITION 03 -> 04: Central Dossier Line */}
      <SectionTransition
        sourceChapter="03 // PEOPLE"
        targetChapter="04 // MINDS"
        coordinate="DOSSIER_ARCHIVE // 2026"
        axisLabel="CENTRAL_AXIS"
        variant="central-dossier"
      />

      {/* ============================================================ */}
      {/* CHAPTER 04 // MINDS: Keynote & Guest Engineering Dossier    */}
      {/* ============================================================ */}
      <SpeakerSection />

      {/* TRANSITION 04 -> 05: Blueprint Vector Datum Line */}
      <SectionTransition
        sourceChapter="04 // MINDS"
        targetChapter="05 // CHALLENGE"
        coordinate="ARENA_BLUEPRINTS // 10_LABS"
        axisLabel="BLUEPRINT_VECTOR"
        variant="blueprint-datum"
      />

      {/* ============================================================ */}
      {/* CHAPTER 05 // CHALLENGE: Arenas & Lineup Hierarchy           */}
      {/* ============================================================ */}
      <EventsPreview onRegisterClick={handleOpenRegister} />

      {/* TRANSITION 05 -> 06: Pricing Calibration Line */}
      <SectionTransition
        sourceChapter="05 // CHALLENGE"
        targetChapter="06 // ENTRY"
        coordinate="TIER_CALIBRATION // 01_03"
        axisLabel="CALIBRATION_AXIS"
        variant="pricing-rise"
      />

      {/* ============================================================ */}
      {/* CHAPTER 06 // ENTRY: Entry Passes & Access Decisions        */}
      {/* ============================================================ */}
      <GetTicketsSection onRegisterClick={handleOpenRegister} />

      {/* TRANSITION 06 -> 07: Laser Expand Line */}
      <SectionTransition
        sourceChapter="06 // ENTRY"
        targetChapter="07 // DECISION"
        coordinate="MACHINE_GATE // PASS_OK"
        axisLabel="CONVERSION_VECTOR"
        variant="laser-expand"
      />

      {/* ============================================================ */}
      {/* CHAPTER 07 // DECISION: Final Registration Conversion Strip */}
      {/* ============================================================ */}
      <FinalRegisterCta onRegisterClick={() => handleOpenRegister()} />

      {/* TRANSITION 07 -> 08: Spacious Alliance Axis */}
      <SectionTransition
        sourceChapter="07 // DECISION"
        targetChapter="08 // SUPPORT"
        coordinate="INDUSTRIAL_ALLIANCE"
        axisLabel="ALLIANCE_DATUM"
        variant="spacious-axis"
      />

      {/* ============================================================ */}
      {/* CHAPTER 08 // SUPPORT: Sponsors & Technical Supporters      */}
      {/* ============================================================ */}
      <SponsorSection />

      {/* TRANSITION 08 -> 09: Terminal Horizon Line */}
      <SectionTransition
        sourceChapter="08 // SUPPORT"
        targetChapter="09 // MANIFESTO"
        coordinate="TERMINAL_HORIZON // VVITU"
        axisLabel="TERMINAL_VECTOR"
        variant="terminal-horizon"
      />

      {/* ============================================================ */}
      {/* CHAPTER 09 // MANIFESTO: Closing Title Sequence            */}
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
