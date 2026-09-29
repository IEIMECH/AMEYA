"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
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
    code: "GUEST 01",
    name: "Dr. A. K. Sharma",
    role: "Chief Scientist & Robotics Fellow",
    field: "Autonomous Kinematics & Rover Systems",
    affiliation: "IIT Madras // Center for Autonomous Robotics",
    session: "Main Auditorium // Day 1 // 10:30 AM",
    topic: "Autonomous Kinematics & Swarm Resilience Under Environmental Friction",
    desc: "Pioneering research in autonomous navigation, real-time kinematics, and multi-agent cyber-physical systems across aerospace and terrestrial defense operations.",
    image: "/img/guest/speaker-1.webp",
    quote: "True autonomy is not merely algorithmic perfection &mdash; it is the mechanical resilience to withstand the friction of the physical world.",
  },
  {
    id: 2,
    code: "GUEST 02",
    name: "Er. Priya Venkatesh",
    role: "Principal Automotive Architect",
    field: "EV Powertrain Dynamics & Lightweight Composites",
    affiliation: "Tata Technologies // EV Propulsion Group",
    session: "Main Auditorium // Day 1 // 02:00 PM",
    topic: "Chassis Optimization & Thermal Management in High-Discharge Battery Packs",
    desc: "Specializes in electric vehicle powertrain optimization, structural composite stress simulations, and computational aerodynamics for endurance motorsport racing.",
    image: "/img/guest/speaker-2.webp",
    quote: "Every gram shaved from a chassis structure is horsepower handed straight back to the driver.",
  },
  {
    id: 3,
    code: "GUEST 03",
    name: "Prof. M. R. K. Prasad",
    role: "Chair of Aerospace Aerodynamics",
    field: "Supersonic Propulsion & Fluid Dynamics",
    affiliation: "IISc Bangalore // Aerodynamics Lab",
    session: "Main Auditorium // Day 2 // 11:00 AM",
    topic: "Shockwave Boundary Layer Interactions in Hypersonic Inlets",
    desc: "Decades of defense consulting on shock wave interactions, scramjet internal compression dynamics, and extreme thermal stress analysis for high-Mach aerospace flight.",
    image: "/img/guest/speaker-3.webp",
    quote: "When you break Mach 1, physics demands absolute, uncompromising honesty from your materials.",
  },
  {
    id: 4,
    code: "GUEST 04",
    name: "Vikram Singhania",
    role: "Founder & Chief Technology Officer",
    field: "Generative CAD & Advanced Manufacturing",
    affiliation: "AeroDynamics AI // Prototyping Systems",
    session: "Main Auditorium // Day 2 // 03:30 PM",
    topic: "Neural Topology Optimization & 5-Axis CNC Synthesis",
    desc: "Bridging generative AI topology algorithms directly with precision multi-axis CNC subtractive manufacturing and digital twin physical sensor telemetry.",
    image: "/img/guest/speaker-4.webp",
    quote: "The future of engineering is not drawing lines on a screen &mdash; it is teaching algorithms the laws of stress and thermal yield.",
  },
];

export default function SpeakerSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSpeaker = speakers[activeIdx];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: "some" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className={styles.section} id="speakers">
      <div className={styles.innerContainer}>
        {/* Section Header with Staggered Entrance */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.kicker}>
            <span className={styles.kickerDot} />
            INVITED EXPERTS
          </div>
          <h2 className={styles.title}>
            Guests &amp; Speakers
          </h2>
          <p className={styles.subtext}>
            Meet the researchers, industry leaders, and engineering specialists sharing their insights
            at AMEYA &apos;26. Select a speaker to view their profile.
          </p>
        </motion.div>

        {/* 2-Column Guest Layout */}
        <div className={styles.dossierGrid}>
          {/* Left Column: Speaker Selector List */}
          <motion.div
            className={styles.speakerList}
            role="tablist"
            aria-label="Guests and Speakers List"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.div>

          {/* Right Column: Selected Speaker Information Sheet */}
          <motion.div
            className={styles.dossierSheet}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.cornerMarkerTL}>+</span>
            <span className={styles.cornerMarkerTR}>+</span>
            <span className={styles.cornerMarkerBL}>+</span>
            <span className={styles.cornerMarkerBR}>+</span>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSpeaker.id}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -12 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={styles.dossierInner}
              >
                {/* Clean Status Header */}
                <div className={styles.telemetryBar}>
                  <div className={styles.dossierId}>
                    <span className={styles.redDot} />
                    <span>GUEST PROFILE // 0{activeSpeaker.id}</span>
                  </div>
                  <div className={styles.securityStatus}>CONFIRMED SPEAKER</div>
                </div>

                {/* Speaker Identity Row */}
                <div className={styles.speakerBioRow}>
                  {/* Portrait with Cinematic Entrance */}
                  <motion.div
                    className={styles.portraitWrapper}
                    initial={{
                      opacity: 0,
                      scale: shouldReduceMotion ? 1 : 0.96,
                      y: shouldReduceMotion ? 0 : 16,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.32,
                      delay: shouldReduceMotion ? 0 : 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Image
                      src={activeSpeaker.image}
                      alt={`Photo of speaker ${activeSpeaker.name}`}
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
                  </motion.div>

                  {/* Metadata Specs */}
                  <motion.div
                    className={styles.identityDetails}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
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
                        <span className={styles.fieldLabel}>SESSION SCHEDULE</span>
                        <span className={styles.fieldValueHighlight}>{activeSpeaker.session}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Keynote Topic & Quote */}
                <motion.div
                  className={styles.topicSection}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.topicHeaderLabel}>KEYNOTE ADDRESS</div>
                  <h4 className={styles.topicTitle}>{activeSpeaker.topic}</h4>

                  <blockquote className={styles.quoteBlock}>
                    &ldquo;{activeSpeaker.quote}&rdquo;
                  </blockquote>

                  <p className={styles.topicDesc}>{activeSpeaker.desc}</p>
                </motion.div>

                {/* Footer Action */}
                <div className={styles.dossierFooter}>
                  <div className={styles.footerNote}>
                    DEPARTMENT OF MECHANICAL ENGINEERING // MAIN AUDITORIUM
                  </div>
                  <Link href="/events" className={styles.eventsButton}>
                    <span>Explore All Events</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
