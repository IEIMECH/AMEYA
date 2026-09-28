"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { teamMembers, teamDivisions, TeamMember } from "@/data/team";
import MemberInfoDrawer from "./MemberInfoDrawer";
import styles from "./CircularOrbit.module.css";
import { 
  Play, 
  Pause, 
  Mail, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  RotateCw,
  Compass,
  ChevronRight
} from "lucide-react";

export default function CircularOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion states
  const rotationRef = useRef<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [speedRatio, setSpeedRatio] = useState<number>(1);
  
  const BASE_SPEED = 0.0028; // ~37 seconds per full 360 rotation
  const currentSpeedRef = useRef<number>(BASE_SPEED);
  const targetSpeedRef = useRef<number>(BASE_SPEED);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedDrawerMember, setSelectedDrawerMember] = useState<TeamMember | null>(null);
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>("all");
  
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive Orbit Radii
  const [radii, setRadii] = useState({ rx: 500, ry: 290 });

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setRadii({ rx: 175, ry: 250 });
      } else if (w < 1024) {
        setRadii({ rx: 360, ry: 230 });
      } else if (w < 1440) {
        setRadii({ rx: 480, ry: 280 });
      } else {
        setRadii({ rx: 540, ry: 310 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      targetSpeedRef.current = 0;
      currentSpeedRef.current = 0;
      setIsPlaying(false);
    }
  }, []);

  // Animation Loop: Smooth Deceleration & Acceleration with Physics Easing
  useEffect(() => {
    let animId: number;

    const tick = () => {
      // Smoothly interpolate current speed towards target speed
      const diff = targetSpeedRef.current - currentSpeedRef.current;
      currentSpeedRef.current += diff * 0.065;

      // Update rotation
      rotationRef.current += currentSpeedRef.current;
      setRotation(rotationRef.current);

      // Speed ratio for board-tail / motion blur calculation (0 when stopped, 1 at full speed)
      const ratio = Math.min(Math.abs(currentSpeedRef.current / BASE_SPEED), 1);
      setSpeedRatio(ratio);

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Hover Handlers with Controlled Curiosity Timing
  const handleMouseEnterMember = (id: string) => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setHoveredId(id);
    targetSpeedRef.current = 0; // Smooth deceleration to full stop
  };

  const handleMouseLeaveMember = () => {
    setHoveredId(null);
    if (!isPlaying) return;

    // Smooth delay before resuming orbit
    resumeTimerRef.current = setTimeout(() => {
      targetSpeedRef.current = BASE_SPEED;
    }, 400);
  };

  // Toggle Play / Pause button
  const togglePlay = () => {
    if (isPlaying) {
      targetSpeedRef.current = 0;
      setIsPlaying(false);
    } else {
      targetSpeedRef.current = BASE_SPEED;
      setIsPlaying(true);
      setHoveredId(null);
    }
  };

  // Calculate Positions along Orbit with 3D Spatial Depth
  const totalMembers = teamMembers.length;

  const memberPositions = useMemo(() => {
    return teamMembers.map((m, index) => {
      // Angle for this member
      const angle = rotation + (2 * Math.PI * index) / totalMembers;

      // Elliptical spatial coordinates
      const x = radii.rx * Math.cos(angle);
      const y = radii.ry * Math.sin(angle);

      // Depth z: positive when closer to front (bottom of ellipse)
      const z = Math.sin(angle); // [-1 to +1]
      const depthNorm = (z + 1) / 2; // [0 to 1]

      // Foreground cards are larger, background cards smaller
      const depthScale = 0.86 + 0.22 * depthNorm; // [0.86 to 1.08]
      const depthOpacity = 0.70 + 0.30 * depthNorm; // [0.70 to 1.00]
      const zIndex = Math.round(depthNorm * 40) + 10;

      // Board-tail trail offsets (lagging behind rotation)
      const trail1Angle = angle - 0.045 * speedRatio;
      const trail1X = radii.rx * Math.cos(trail1Angle);
      const trail1Y = radii.ry * Math.sin(trail1Angle);

      const trail2Angle = angle - 0.085 * speedRatio;
      const trail2X = radii.rx * Math.cos(trail2Angle);
      const trail2Y = radii.ry * Math.sin(trail2Angle);

      return {
        m,
        x,
        y,
        depthScale,
        depthOpacity,
        zIndex,
        trail1X,
        trail1Y,
        trail2X,
        trail2Y,
      };
    });
  }, [rotation, totalMembers, radii.rx, radii.ry, speedRatio]);

  return (
    <section className={styles.orbitSection} aria-label="Team Members Circular Orbit">
      {/* Background Ambience & Orbital Halo */}
      <div className={styles.haloGlow} aria-hidden="true" />
      <div className={styles.gridCanvas} aria-hidden="true" />

      {/* Hero Header */}
      <div className={styles.sectionHeader}>
        <div className="section-label">
          <Sparkles size={13} color="#e61d1d" />
          <span>IEI STUDENT CHAPTER // COUNCIL CADRE</span>
        </div>
        <h1 className={styles.mainHeading}>
          The Engineers Behind <span className="gradient-text">AMEYA &apos;26</span>
        </h1>
        <p className={styles.subHeading}>
          [CONTINUOUS ORBIT]: 18 student council leads of IEI SAME driving national technical symposiums at VVIT.
          Hover over any member to freeze orbit and inspect their profile.
        </p>

        {/* Division Spotlight Filter Strip */}
        <div className={styles.filterStrip}>
          <button
            type="button"
            className={`${styles.filterPill} ${selectedDivisionFilter === "all" ? styles.activeFilter : ""}`}
            onClick={() => setSelectedDivisionFilter("all")}
          >
            <span>ALL COUNCILS ({teamMembers.length})</span>
          </button>
          {teamDivisions.map((div) => {
            const count = teamMembers.filter((m) => m.divisionIndex === div.index).length;
            const isSelected = selectedDivisionFilter === div.id;
            return (
              <button
                key={div.id}
                type="button"
                className={`${styles.filterPill} ${isSelected ? styles.activeFilter : ""}`}
                onClick={() => setSelectedDivisionFilter(isSelected ? "all" : div.id)}
              >
                <span>{div.name.replace(" Council", "").replace(" Team", "")} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Circular Orbit Viewport */}
      <div 
        ref={containerRef}
        className={styles.orbitViewport}
        onClick={(e) => {
          // If clicked outside cards on touch device, resume
          if ((e.target as HTMLElement).classList.contains(styles.orbitViewport)) {
            setHoveredId(null);
            targetSpeedRef.current = BASE_SPEED;
          }
        }}
      >
        {/* SVG Orbital Track with Dynamic Comet Laser Sweep */}
        <svg 
          className={styles.orbitSvgTrack} 
          viewBox="-700 -400 1400 800" 
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="orbitalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e61d1d" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ff5555" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#e61d1d" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <ellipse
            cx="0"
            cy="0"
            rx={radii.rx}
            ry={radii.ry}
            fill="none"
            stroke="url(#orbitalGradient)"
            strokeWidth="1.5"
            strokeDasharray="5 7"
            className={styles.orbitSvgPath}
          />
          <ellipse
            cx="0"
            cy="0"
            rx={radii.rx + 24}
            ry={radii.ry + 24}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            strokeDasharray="2 12"
          />
        </svg>

        {/* Centerpiece: Negative Space Core Emblem & Playback HUD */}
        <div className={styles.centerNegativeSpace}>
          <div className={styles.centerReticleRing} aria-hidden="true">
            <div className={styles.reticleCrossH} />
            <div className={styles.reticleCrossV} />
            <div className={styles.reticleCore} />
          </div>

          <div className={styles.centerHud}>
            <div className={styles.centerTag}>IEI CHAPTER // MECH</div>
            <div className={styles.centerTitle}>AMEYA &apos;26</div>
            <div className={styles.centerSub}>18 CADRE OFFICERS &bull; 4TH YEAR</div>
            
            <button
              type="button"
              className={styles.playbackBtn}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause Orbit Rotation" : "Resume Orbit Rotation"}
              title={isPlaying ? "Pause Rotation" : "Resume Rotation"}
            >
              {isPlaying ? (
                <>
                  <Pause size={12} />
                  <span>ORBIT ACTIVE</span>
                </>
              ) : (
                <>
                  <Play size={12} />
                  <span>RESUME ORBIT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Orbiting Member Cards */}
        {memberPositions.map(({ m, x, y, depthScale, depthOpacity, zIndex, trail1X, trail1Y, trail2X, trail2Y }) => {
          const isHovered = hoveredId === m.id;
          const isOtherHovered = hoveredId !== null && !isHovered;
          
          // Division filtering
          const isFilteredOut = selectedDivisionFilter !== "all" && m.division.toLowerCase().replace(/[^a-z0-9]+/g, "-") !== selectedDivisionFilter && !m.id.startsWith(selectedDivisionFilter.slice(0, 3));
          
          // Compute final card scale & styling
          let cardScale = depthScale;
          let cardOpacity = isFilteredOut ? 0.2 : depthOpacity;
          let cardZ = zIndex;

          if (isHovered) {
            cardScale = 1.22;
            cardOpacity = 1;
            cardZ = 120;
          } else if (isOtherHovered) {
            cardScale = depthScale * 0.88;
            cardOpacity = isFilteredOut ? 0.15 : 0.28;
          }

          return (
            <div key={m.id}>
              {/* Ethereal Board-Tail Motion Trail (disappears when stopped) */}
              {speedRatio > 0.05 && !isHovered && !isOtherHovered && (
                <>
                  {/* Trail 2: Deepest motion echo */}
                  <div
                    className={styles.motionTrail}
                    style={{
                      transform: `translate3d(calc(${trail2X}px - 50%), calc(${trail2Y}px - 50%), 0px) scale(${depthScale * 0.88})`,
                      opacity: 0.14 * speedRatio,
                      zIndex: zIndex - 2,
                    }}
                    aria-hidden="true"
                  />
                  {/* Trail 1: Primary motion tail */}
                  <div
                    className={styles.motionTrail}
                    style={{
                      transform: `translate3d(calc(${trail1X}px - 50%), calc(${trail1Y}px - 50%), 0px) scale(${depthScale * 0.94})`,
                      opacity: 0.28 * speedRatio,
                      zIndex: zIndex - 1,
                    }}
                    aria-hidden="true"
                  />
                </>
              )}

              {/* Primary Interactive Member Card */}
              <div
                className={`${styles.memberOrbitalCard} ${isHovered ? styles.cardHovered : ""} ${isOtherHovered ? styles.cardDimmed : ""}`}
                style={{
                  transform: `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0px) scale(${cardScale})`,
                  opacity: cardOpacity,
                  zIndex: cardZ,
                }}
                onMouseEnter={() => handleMouseEnterMember(m.id)}
                onMouseLeave={handleMouseLeaveMember}
                onClick={() => {
                  if (isHovered) {
                    setSelectedDrawerMember(m);
                  } else {
                    handleMouseEnterMember(m.id);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedDrawerMember(m);
                  }
                }}
                aria-label={`${m.name}, ${m.role} - Hover to focus, Click for dossier`}
              >
                {/* Tech Crosshair Accents on Card Corners */}
                <span className={styles.cornerTL} aria-hidden="true">+</span>
                <span className={styles.cornerTR} aria-hidden="true">+</span>
                <span className={styles.cornerBR} aria-hidden="true">+</span>

                {/* Card Portrait Showcase */}
                <div className={styles.portraitBox} onDragStart={(e) => e.preventDefault()}>
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="300px"
                      className={styles.cardImage}
                      priority={false}
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  ) : (
                    <div className={styles.avatarFallback}>
                      <span>{m.avatar}</span>
                    </div>
                  )}
                  <div className={styles.torsoFade} />

                  {/* Top HUD Callsign Pill */}
                  <div className={styles.cardTopPill}>
                    <span className={styles.rollBadge}>{m.callsign}</span>
                    <span className={styles.yearBadge}>{m.year}</span>
                  </div>
                </div>

                {/* Card Content State (Compact vs Detailed on Hover) */}
                <div className={styles.cardBody}>
                  <div className={styles.identityGroup}>
                    <h3 className={styles.cardName}>{m.name}</h3>
                    <p className={styles.cardRole}>{m.role}</p>
                    <p className={styles.cardDept}>{m.department}</p>
                  </div>

                  {/* Expanded Profile Details when Hovered */}
                  {isHovered && (
                    <div className={styles.expandedContent}>
                      {m.bio && <p className={styles.cardBio}>{m.bio}</p>}

                      <div className={styles.cardActionRow}>
                        {m.socials.email && (
                          <a
                            href={`mailto:${m.socials.email}`}
                            className={styles.emailPill}
                            onClick={(e) => e.stopPropagation()}
                            title={`Send email to ${m.name}`}
                          >
                            <Mail size={12} />
                            <span>{m.socials.email.split("@")[0]}</span>
                          </a>
                        )}

                        <button
                          type="button"
                          className={styles.dossierBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDrawerMember(m);
                          }}
                          title="Open Full Technical Dossier"
                        >
                          <span>DOSSIER</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subordinate Glow Edge */}
                <div className={styles.cardHighlight} aria-hidden="true" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-out Technical Dossier Sidebar */}
      <MemberInfoDrawer
        member={selectedDrawerMember}
        onClose={() => setSelectedDrawerMember(null)}
      />
    </section>
  );
}
