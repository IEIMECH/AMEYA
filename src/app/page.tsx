"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Hero3DCanvas from "@/components/index/Hero3DCanvas";
import HeroCountdownTicker from "@/components/index/HeroCountdownTicker";
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
        {/* VVITU Institutional Portal Redirect at Top Left */}
        <a
          href="https://www.vvitu.ac.in/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.vvitTopLogoLink}
          aria-label="Vasireddy Venkatadri International Technological University (VVITU)"
          title="Vasireddy Venkatadri International Technological University — Official Website"
        >
          <Image
            src="/vvit-logo.jpg"
            alt="VVITU Logo"
            width={90}
            height={68}
            className={styles.vvitLogoImg}
            priority
          />
        </a>
        <div className={styles.heroGrid}>
          {/* Main Left Content Block - Unobstructed Headline Dominance */}
          <div className={styles.leftHeroBlock}>
            {/* Sleek Integrated Countdown Ticker (Independent, no whole-page re-renders) */}
            <HeroCountdownTicker />

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
                <span>EXPLORE CAMPUS</span>
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
