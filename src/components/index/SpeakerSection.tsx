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
    quote: "True autonomy is not merely algorithmic perfection — it is the mechanical resilience to withstand the friction of the physical world.",
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
    id: "4",
    code: "GUEST 04",
    name: "Vikram Singhania",
    role: "Founder & Chief Technology Officer",
    field: "Generative CAD & Advanced Manufacturing",
    affiliation: "AeroDynamics AI // Prototyping Systems",
    session: "Main Auditorium // Day 2 // 03:30 PM",
    topic: "Neural Topology Optimization & 5-Axis CNC Synthesis",
    desc: "Bridging generative AI topology algorithms directly with precision multi-axis CNC subtractive manufacturing and digital twin physical sensor telemetry.",
    image: "/img/guest/speaker-4.webp",
    quote: "The future of engineering is not drawing lines on a screen — it is teaching algorithms the laws of stress and thermal yield.",
  },
] as unknown as Speaker[];

export default function SpeakerSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSpeaker = speakers[activeIdx];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: "some" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className={styles.section} id="speakers">
      <div className={styles.innerContainer}>
        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Keynote Guests &amp; <span className={styles.titleAccent}>Speakers</span>
          </h2>
          <p className={styles.subtext}>
            Meet the researchers, industry leaders, and engineering specialists sharing their insights at AMEYA &apos;26. Select a speaker to inspect their session dossier.
          </p>
        </div>

        {/* 2-Column Guest Layout */}
        <div className={styles.dossierGrid}>
          {/* Left Column: Speaker Selector List */}
          <div className={styles.speakerList} role="tablist" aria-label="Guests and Speakers List">
            {speakers.map((sp, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={sp.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIdx(idx)}
                  className={`${styles.speakerListItem} ${isActive ? styles.itemActive : ""}`}
                >
                  <div className={styles.thumbWrapper}>
                    <Image
                      src={sp.image}
                      alt={sp.name}
                      fill
                      sizes="48px"
                      className={styles.thumbImage}
                      priority={idx === 0}
                    />
                  </div>

                  <div className={styles.itemMeta}>
                    <span className={styles.itemCode}>{sp.code}</span>
                    <h3 className={styles.itemName}>{sp.name}</h3>
                    <p className={styles.itemRole}>{sp.role}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Profile Surface with Crossfade + Directional Transition (Item 6) */}
          <div className={styles.profileSurface}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSpeaker.id}
                className={styles.profileInner}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -14 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Profile Top Row: Photo + Bio Meta */}
                <div className={styles.profileTopRow}>
                  <div className={styles.portraitWrapper}>
                    <Image
                      src={activeSpeaker.image}
                      alt={activeSpeaker.name}
                      fill
                      sizes="220px"
                      className={styles.portraitImage}
                      priority
                    />
                  </div>

                  <div className={styles.identityDetails}>
                    <span className={styles.codeTag}>{activeSpeaker.code}</span>
                    <h3 className={styles.speakerName}>{activeSpeaker.name}</h3>
                    <p className={styles.speakerRole}>{activeSpeaker.role}</p>

                    <div className={styles.specGrid}>
                      <div>
                        <span className={styles.specLabel}>FIELD OF EXPERTISE</span>
                        <span className={styles.specValue}>{activeSpeaker.field}</span>
                      </div>
                      <div>
                        <span className={styles.specLabel}>AFFILIATION</span>
                        <span className={styles.specValue}>{activeSpeaker.affiliation}</span>
                      </div>
                      <div>
                        <span className={styles.specLabel}>SESSION TIMING</span>
                        <span className={styles.specValueHighlight}>{activeSpeaker.session}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Topic & Quote */}
                <div className={styles.topicSection}>
                  <div className={styles.topicHeaderLabel}>KEYNOTE ADDRESS TOPIC</div>
                  <h4 className={styles.topicTitle}>{activeSpeaker.topic}</h4>

                  <blockquote className={styles.quoteBlock}>
                    &ldquo;{activeSpeaker.quote}&rdquo;
                  </blockquote>

                  <p className={styles.topicDesc}>{activeSpeaker.desc}</p>
                </div>

                {/* Footer Action */}
                <div className={styles.dossierFooter}>
                  <span className={styles.footerNote}>
                    DEPARTMENT OF MECHANICAL ENGINEERING // MAIN AUDITORIUM
                  </span>
                  <Link href="/events" className={styles.eventsButton}>
                    <span>View Championship Arenas</span>
                    <ArrowRight size={13} />
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