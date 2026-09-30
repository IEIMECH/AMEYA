"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./SpeakerSection.module.css";

interface Speaker {
  id: number;
  code: string;
  name: string;
  role: string;
  affiliation: string;
  image: string;
}

const speakers: Speaker[] = [
  {
    id: 1,
    code: "GUEST 01",
    name: "Dr. A. K. Sharma",
    role: "Chief Scientist & Robotics Fellow",
    affiliation: "IIT Madras // Center for Autonomous Robotics",
    image: "/img/guest/speaker-1.webp",
  },
  {
    id: 2,
    code: "GUEST 02",
    name: "Er. Priya Venkatesh",
    role: "Principal Automotive Architect",
    affiliation: "Tata Technologies // EV Propulsion Group",
    image: "/img/guest/speaker-2.webp",
  },
  {
    id: 3,
    code: "GUEST 03",
    name: "Prof. M. R. K. Prasad",
    role: "Chair of Aerospace Aerodynamics",
    affiliation: "IISc Bangalore // Aerodynamics Lab",
    image: "/img/guest/speaker-3.webp",
  },
  {
    id: 4,
    code: "GUEST 04",
    name: "Vikram Singhania",
    role: "Founder & Chief Technology Officer",
    affiliation: "AeroDynamics AI // Prototyping Systems",
    image: "/img/guest/speaker-4.webp",
  },
];

export default function SpeakerSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSpeaker = speakers[activeIdx];
  const headerRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // One-time header reveal
  useEffect(() => {
    if (isRevealed) return;
    const el = headerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 150) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight + 150)) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isRevealed]);

  return (
    <section className={styles.section} id="speakers">
      <div className={styles.innerContainer}>
        {/* Section Header */}
        <header
          ref={headerRef}
          className={`${styles.header} ${isRevealed ? styles.headerRevealed : styles.headerHidden}`}
        >
          <h2 className={styles.title}>Meet Our Guests</h2>
          <p className={styles.subtext}>
            Meet the researchers, industry leaders, and engineering specialists sharing their insights at AMEYA &apos;26.
          </p>
        </header>

        {/* Editorial Guest Showcase Layout matching Reference */}
        <div className={styles.editorialShowcase}>
          {/* Left Column: Big Typographic Stack of Speaker Names */}
          <div className={styles.namesColumn} role="tablist" aria-label="Keynote Speakers">
            {speakers.map((sp, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={sp.id}
                  className={`${styles.speakerRow} ${isActive ? styles.speakerRowActive : ""}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  {/* Active Speaker Sub-headline/Role on Left */}
                  <div className={styles.roleCol}>
                    {isActive ? (
                      <div className={styles.activeMetaBlock}>
                        <span className={styles.activeRoleText}>{sp.role}</span>
                        <span className={styles.activeAffiliationText}>{sp.affiliation}</span>
                      </div>
                    ) : (
                      <span className={styles.inactivePlaceholder} aria-hidden="true" />
                    )}
                  </div>

                  {/* Speaker Name in Bold Typographic Scale */}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.nameButton} ${isActive ? styles.nameButtonActive : ""}`}
                  >
                    {sp.name}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Column: Clean Photocard with In/Out Transition (No Information) */}
          <div className={styles.portraitCardWrapper}>
            <div className={styles.portraitCard}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpeaker.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className={styles.photoContainer}
                >
                  <Image
                    src={activeSpeaker.image}
                    alt={activeSpeaker.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    className={styles.portraitImage}
                    priority
                  />
                  <div className={styles.subtleVignette} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
