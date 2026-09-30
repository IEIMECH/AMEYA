"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    quote: "The future of engineering is not drawing lines on a screen — it is teaching algorithms the laws of stress and thermal yield.",
  },
];

export default function SpeakerSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSpeaker = speakers[activeIdx];
  const headerRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Bulletproof one-time entrance reveal that NEVER reverts
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
        {/* Section Header: Animate once into view, permanently visible */}
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
                  {/* Active Speaker Sub-headline/Role on Left (matching reference) */}
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

          {/* Right Column: Prominent Portrait Card matching Reference */}
          <div className={styles.portraitCardWrapper}>
            <div className={styles.portraitCard}>
              <div className={styles.photoContainer}>
                <Image
                  src={activeSpeaker.image}
                  alt={activeSpeaker.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 460px"
                  className={styles.portraitImage}
                  priority
                />
                <div className={styles.photoVignette} />
                <div className={styles.sessionBadge}>
                  <span>{activeSpeaker.session}</span>
                </div>
              </div>

              {/* Card Topic & Details Below Photo */}
              <div className={styles.cardDetails}>
                <span className={styles.keynoteTag}>KEYNOTE ADDRESS</span>
                <h3 className={styles.cardTopicTitle}>{activeSpeaker.topic}</h3>
                <blockquote className={styles.cardQuote}>
                  &ldquo;{activeSpeaker.quote}&rdquo;
                </blockquote>
                <div className={styles.cardActionRow}>
                  <Link href="/events" className={styles.exploreArenasLink}>
                    <span>View Championship Arenas</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
