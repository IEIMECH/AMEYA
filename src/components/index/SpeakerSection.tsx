"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./SpeakerSection.module.css";

interface Speaker {
  id: number;
  code: string;
  name: string;
  role: string;
  field: string;
  affiliation: string;
  session: string;
  topic: string;
  desc: string;
  image: string;
  quote: string;
}

const speakers: Speaker[] = [
  {
    id: 1,
    code: "SPEAKER_01",
    name: "Dr. A. K. Sharma",
    role: "Chief Scientist & Robotics Fellow",
    field: "Autonomous Kinematics & High-Speed Rover Swarms",
    affiliation: "IIT Madras // Center for Autonomous Robotics",
    session: "Auditorium Main // Day 1 // 10:30 IST",
    topic: "Autonomous Kinematics & Swarm Resilience Under Environmental Friction",
    desc: "Pioneering research in autonomous navigation, real-time kinematics, and multi-agent cyber-physical systems across aerospace and terrestrial defense operations.",
    image: "/img/guest/speaker-1.webp",
    quote: "True autonomy is not merely algorithmic perfection &mdash; it is the mechanical resilience to withstand the friction of the physical world.",
  },
  {
    id: 2,
    code: "SPEAKER_02",
    name: "Er. Priya Venkatesh",
    role: "Principal Automotive Architect",
    field: "EV Powertrain Dynamics & Lightweight Carbon Composites",
    affiliation: "Tata Technologies // EV Propulsion Group",
    session: "Auditorium Main // Day 1 // 14:00 IST",
    topic: "Chassis Optimization & Thermal Management in High-Discharge Battery Packs",
    desc: "Specializes in electric vehicle powertrain optimization, structural composite stress simulations, and computational aerodynamics for endurance motorsport racing.",
    image: "/img/guest/speaker-2.webp",
    quote: "Every gram shaved from a chassis structure is horsepower handed straight back to the driver.",
  },
  {
    id: 3,
    code: "SPEAKER_03",
    name: "Prof. M. R. K. Prasad",
    role: "Chair of Aerospace Aerodynamics",
    field: "Supersonic Propulsion & Computational Fluid Dynamics",
    affiliation: "IISc Bangalore // High Enthalpy Aerodynamics Lab",
    session: "Auditorium Main // Day 2 // 11:00 IST",
    topic: "Shockwave Boundary Layer Interactions in Hypersonic Inlets",
    desc: "Decades of defense consulting on shock wave interactions, scramjet internal compression dynamics, and extreme thermal stress analysis for high-Mach aerospace flight.",
    image: "/img/guest/speaker-3.webp",
    quote: "When you break Mach 1, physics demands absolute, uncompromising honesty from your materials.",
  },
  {
    id: 4,
    code: "SPEAKER_04",
    name: "Vikram Singhania",
    role: "Founder & Chief Technology Officer",
    field: "Generative CAD Synthesis & Digital Twins",
    affiliation: "AeroDynamics AI // Prototyping Systems",
    session: "Auditorium Main // Day 2 // 15:30 IST",
    topic: "Neural Topology Optimization & 5-Axis CNC Synthesis",
    desc: "Bridging generative AI topology algorithms directly with precision multi-axis CNC subtractive manufacturing and digital twin physical sensor telemetry.",
    image: "/img/guest/speaker-4.webp",
    quote: "The future of engineering is not drawing lines on a screen &mdash; it is teaching algorithms the laws of stress and thermal yield.",
  },
];

export default function SpeakerSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSpeaker = speakers[activeIdx];

  return (
    <section className={styles.section} id="speakers">
      <div className={styles.innerContainer}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.kicker}>
            <span className={styles.kickerDot} />
            CHAPTER_04 // ENGINEERING MINDS
          </div>
          <h2 className={styles.title}>
            Keynote &amp; Invited Speakers
          </h2>
          <p className={styles.subtext}>
            Pioneers across aerospace defense, autonomous kinematics, and generative CAD synthesis.
            Select a dignitary to inspect their full technical dossier.
          </p>
        </div>

        {/* 2-Column Dossier Layout */}
        <div className={styles.dossierGrid}>
          {/* Left Column: Speaker Index List */}
          <div className={styles.speakerList} role="tablist" aria-label="Speakers List">
            {speakers.map((sp, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={sp.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.speakerListItem} ${isActive ? styles.itemActive : ""}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <span className={styles.speakerIndex}>0{idx + 1}</span>
                  <div className={styles.itemContent}>
                    <div className={styles.itemCode}>{sp.code}</div>
                    <div className={styles.itemName}>{sp.name}</div>
                    <div className={styles.itemRole}>{sp.role}</div>
                  </div>
                  {isActive && <div className={styles.activePillIndicator} />}
                </button>
              );
            })}
          </div>

          {/* Right Column: Selected Speaker Dossier Sheet */}
          <div className={styles.dossierSheet}>
            <span className={styles.cornerMarkerTL}>+</span>
            <span className={styles.cornerMarkerTR}>+</span>
            <span className={styles.cornerMarkerBL}>+</span>
            <span className={styles.cornerMarkerBR}>+</span>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSpeaker.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={styles.dossierInner}
              >
                {/* Dossier Telemetry Header */}
                <div className={styles.telemetryBar}>
                  <div className={styles.dossierId}>
                    <span className={styles.redDot} />
                    <span>DOSSIER // {activeSpeaker.code}</span>
                  </div>
                  <div className={styles.securityStatus}>STATUS: CONFIRMED KEYNOTE</div>
                </div>

                {/* Speaker Identity Row */}
                <div className={styles.speakerBioRow}>
                  {/* Portrait */}
                  <div className={styles.portraitWrapper}>
                    <Image
                      src={activeSpeaker.image}
                      alt={`Official portrait of keynote speaker ${activeSpeaker.name}`}
                      fill
                      sizes="220px"
                      className={styles.portraitImage}
                      priority
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    <div className={styles.portraitOverlay} />
                    <div className={styles.photoCrosshairTL}>+</div>
                    <div className={styles.photoCrosshairBR}>+</div>
                  </div>

                  {/* Metadata Specs */}
                  <div className={styles.identityDetails}>
                    <div className={styles.specGroup}>
                      <span className={styles.specLabel}>NAME</span>
                      <h3 className={styles.speakerName}>{activeSpeaker.name}</h3>
                      <span className={styles.speakerRole}>{activeSpeaker.role}</span>
                    </div>

                    <div className={styles.specGrid}>
                      <div className={styles.specField}>
                        <span className={styles.fieldLabel}>FIELD OF EXPERTISE</span>
                        <span className={styles.fieldValue}>{activeSpeaker.field}</span>
                      </div>

                      <div className={styles.specField}>
                        <span className={styles.fieldLabel}>AFFILIATION / INSTITUTION</span>
                        <span className={styles.fieldValue}>{activeSpeaker.affiliation}</span>
                      </div>

                      <div className={styles.specField}>
                        <span className={styles.fieldLabel}>SESSION PROTOCOL</span>
                        <span className={styles.fieldValueHighlight}>{activeSpeaker.session}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keynote Topic & Manifesto Quote */}
                <div className={styles.topicSection}>
                  <div className={styles.topicHeaderLabel}>KEYNOTE ADDRESS</div>
                  <h4 className={styles.topicTitle}>{activeSpeaker.topic}</h4>

                  <blockquote className={styles.quoteBlock}>
                    &ldquo;{activeSpeaker.quote}&rdquo;
                  </blockquote>

                  <p className={styles.topicDesc}>{activeSpeaker.desc}</p>
                </div>

                {/* Footer Action */}
                <div className={styles.dossierFooter}>
                  <div className={styles.footerNote}>
                    DEPARTMENT OF MECHANICAL ENGINEERING // PLENARY HALL
                  </div>
                  <Link href="/agenda" className={styles.agendaButton}>
                    <span>View Conclave Agenda</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
