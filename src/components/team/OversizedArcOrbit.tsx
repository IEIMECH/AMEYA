"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { teamMembers, TeamMember } from "@/data/team";
import MemberInfoDrawer from "./MemberInfoDrawer";
import styles from "./OversizedArcOrbit.module.css";
import { 
  Pause, 
  Play, 
  Mail, 
  Sparkles, 
  ChevronRight, 
  X
} from "lucide-react";

export default function OversizedArcOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Orbital angle & velocity
  const rotationRef = useRef<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [speedFactor, setSpeedFactor] = useState<number>(1);

  // Constant base speed: clockwise rotation, ~40s per 360 loop
  const BASE_SPEED = 0.0026;
  const currentSpeedRef = useRef<number>(BASE_SPEED);
  const targetSpeedRef = useRef<number>(BASE_SPEED);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [selectedDrawerMember, setSelectedDrawerMember] = useState<TeamMember | null>(null);
  
  // Staged profile reveal: details only appear after stabilization (~400ms)
  const [isStabilized, setIsStabilized] = useState<boolean>(false);
  const stabilizationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive Oversized Orbit Geometry
  const [geometry, setGeometry] = useState({
    vpW: 1440,
    vpH: 850,
    rx: 1420,
    ry: 1080,
    yApex: 210,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      if (w < 640) {
        // Mobile: sized for 2-4 visible portraits at a time
        setGeometry({
          vpW: w,
          vpH: h,
          rx: Math.max(w * 0.88, 380),
          ry: Math.max(h * 0.82, 540),
          yApex: 180,
        });
      } else if (w < 1024) {
        // Tablet: sized for 4-6 visible portraits
        setGeometry({
          vpW: w,
          vpH: h,
          rx: Math.max(w * 0.95, 780),
          ry: Math.max(h * 0.95, 780),
          yApex: 200,
        });
      } else {
        // Desktop: massive oversized orbit (diameter ~2800px) showing 5-8 portraits
        setGeometry({
          vpW: w,
          vpH: h,
          rx: Math.max(w * 0.98, 1420),
          ry: Math.max(h * 1.18, 1080),
          yApex: 215,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      targetSpeedRef.current = 0;
      currentSpeedRef.current = 0;
      setIsPlaying(false);
    }
  }, []);

  // Main Continuous Orbit Loop with Smooth Deceleration / Acceleration
  useEffect(() => {
    let animId: number;

    const tick = () => {
      // Smoothly ease current speed to target speed (duration ~600-900ms)
      const diff = targetSpeedRef.current - currentSpeedRef.current;
      currentSpeedRef.current += diff * 0.055;

      // Update rotation angle
      rotationRef.current += currentSpeedRef.current;
      setRotation(rotationRef.current);

      // Speed factor: 1 at full rotation, smoothly decays to 0 on stop
      const ratio = Math.min(Math.abs(currentSpeedRef.current / BASE_SPEED), 1);
      setSpeedFactor(ratio);

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Focus Member on Hover / Tap
  const handleFocusMember = (id: string) => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    if (stabilizationTimerRef.current) {
      clearTimeout(stabilizationTimerRef.current);
      stabilizationTimerRef.current = null;
    }

    setActiveMemberId(id);
    setIsStabilized(false);
    targetSpeedRef.current = 0; // Smooth deceleration to full stop

    // Reveal profile metadata only after motion stabilizes (~400ms)
    stabilizationTimerRef.current = setTimeout(() => {
      setIsStabilized(true);
    }, 400);
  };

  // Leave Hover State / Tap Away
  const handleBlurMember = () => {
    if (stabilizationTimerRef.current) {
      clearTimeout(stabilizationTimerRef.current);
      stabilizationTimerRef.current = null;
    }

    setIsStabilized(false);
    setActiveMemberId(null);

    if (!isPlaying) return;

    // Smooth delay (200-300ms) before resuming rotation from current angle
    resumeTimerRef.current = setTimeout(() => {
      targetSpeedRef.current = BASE_SPEED;
    }, 250);
  };

  // Toggle Play / Pause button
  const togglePlay = () => {
    if (isPlaying) {
      targetSpeedRef.current = 0;
      setIsPlaying(false);
    } else {
      targetSpeedRef.current = BASE_SPEED;
      setIsPlaying(true);
      setActiveMemberId(null);
      setIsStabilized(false);
    }
  };

  // Center Coordinates of the Giant Invisible Orbit
  const centerX = geometry.vpW / 2;
  const centerY = geometry.yApex + geometry.ry;

  const totalMembers = teamMembers.length;

  // Calculate Member Positions along the Oversized Arc
  const cardData = useMemo(() => {
    return teamMembers.map((m, index) => {
      // 20-degree equal angular separation (360 / 18)
      // Top apex is -PI/2 (12 o'clock). Clockwise rotation moves cards Left -> Right across top.
      const baseAngle = -Math.PI / 2 + (2 * Math.PI * index) / totalMembers;
      const angle = baseAngle + rotation;

      // Position on the oversized ellipse
      const x = centerX + geometry.rx * Math.cos(angle);
      const y = centerY + geometry.ry * Math.sin(angle);

      // Distance from top apex (-PI/2) in radians
      let diffFromApex = ((angle + Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      if (diffFromApex > Math.PI) diffFromApex = 2 * Math.PI - diffFromApex;

      // Perspective Scale & Depth: Apex cards are larger, edge cards smaller
      const cosApex = Math.cos(diffFromApex); // 1.0 at apex, drops towards edges
      const perspectiveScale = 0.80 + 0.36 * Math.max(0, cosApex); // [0.80 to 1.16]
      const perspectiveOpacity = 0.55 + 0.45 * Math.max(0, cosApex); // [0.55 to 1.00]
      const zIndex = Math.round(Math.max(0, cosApex) * 40) + 10;

      // Motion Trail Ghost Coordinates (lagging behind rotation along arc)
      const trail1Angle = angle - 0.038 * speedFactor;
      const trail1X = centerX + geometry.rx * Math.cos(trail1Angle);
      const trail1Y = centerY + geometry.ry * Math.sin(trail1Angle);

      const trail2Angle = angle - 0.076 * speedFactor;
      const trail2X = centerX + geometry.rx * Math.cos(trail2Angle);
      const trail2Y = centerY + geometry.ry * Math.sin(trail2Angle);

      // Overscan buffer: only render cards within window + 200px buffer
      const isVisibleInWindow = x >= -220 && x <= geometry.vpW + 220 && y <= geometry.vpH + 220;

      return {
        m,
        x,
        y,
        perspectiveScale,
        perspectiveOpacity,
        zIndex,
        trail1X,
        trail1Y,
        trail2X,
        trail2Y,
        isVisibleInWindow,
      };
    });
  }, [rotation, totalMembers, centerX, centerY, geometry.rx, geometry.ry, geometry.vpW, geometry.vpH, speedFactor]);

  return (
    <section className={styles.stage} aria-label="Team Members Oversized Arc Orbit">
      {/* Subtle Atmosphere & Background Halo */}
      <div className={styles.ambientHalo} aria-hidden="true" />
      <div className={styles.gridMatrix} aria-hidden="true" />

      {/* Center Static Title & Subordinate Chapter Composition */}
      <div className={styles.centerStageHeader}>
        <div className={styles.cadreTag}>
          <Sparkles size={12} color="#e61d1d" />
          <span>IEI STUDENT CHAPTER // COUNCIL CADRE</span>
        </div>
        <h1 className={styles.centerTitle}>
          The Engineers Behind <span className="gradient-text">AMEYA &apos;26</span>
        </h1>
        <p className={styles.centerSub}>
          Department of Mechanical Engineering &bull; 18 Council Officers &bull; 4th Year
        </p>

        {/* Orbit State HUD & Controls */}
        <div className={styles.orbitControlsRow}>
          <button
            type="button"
            className={styles.orbitStateBtn}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause Orbit" : "Resume Orbit"}
            title={isPlaying ? "Pause Rotation" : "Resume Rotation"}
          >
            {isPlaying ? (
              <>
                <Pause size={12} />
                <span>ORBIT ROTATING</span>
              </>
            ) : (
              <>
                <Play size={12} />
                <span>RESUME ORBIT</span>
              </>
            )}
          </button>
          <span className={styles.hintText}>HOVER TO FOCUS // PURE PORTRAITS IN MOTION</span>
        </div>
      </div>

      {/* Oversized Arc Viewport Window */}
      <div 
        ref={containerRef}
        className={styles.arcWindow}
        onClick={(e) => {
          // Tap background on touch screen to deselect
          if ((e.target as HTMLElement).classList.contains(styles.arcWindow)) {
            handleBlurMember();
          }
        }}
      >
        {cardData.map(({ m, x, y, perspectiveScale, perspectiveOpacity, zIndex, trail1X, trail1Y, trail2X, trail2Y, isVisibleInWindow }) => {
          if (!isVisibleInWindow) return null;

          const isHovered = activeMemberId === m.id;
          const isOtherHovered = activeMemberId !== null && !isHovered;

          // Scale and opacity adjustments
          let cardScale = perspectiveScale;
          let cardOpacity = perspectiveOpacity;
          let cardZ = zIndex;

          if (isHovered) {
            cardScale = 1.24;
            cardOpacity = 1;
            cardZ = 120;
          } else if (isOtherHovered) {
            cardScale = perspectiveScale * 0.88;
            cardOpacity = 0.28;
          }

          return (
            <div key={m.id}>
              {/* Ethereal Motion Trail (active during movement, dissolves smoothly on freeze) */}
              {speedFactor > 0.08 && !isHovered && !isOtherHovered && (
                <>
                  <div
                    className={styles.motionTrailGhost}
                    style={{
                      transform: `translate3d(calc(${trail2X}px - 50%), calc(${trail2Y}px - 50%), 0px) scale(${perspectiveScale * 0.90})`,
                      opacity: 0.12 * speedFactor,
                      zIndex: zIndex - 2,
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className={styles.motionTrailGhost}
                    style={{
                      transform: `translate3d(calc(${trail1X}px - 50%), calc(${trail1Y}px - 50%), 0px) scale(${perspectiveScale * 0.95})`,
                      opacity: 0.25 * speedFactor,
                      zIndex: zIndex - 1,
                    }}
                    aria-hidden="true"
                  />
                </>
              )}

              {/* Pure Visual Portrait Card during Motion -> Profile Details on Interaction */}
              <div
                className={`${styles.portraitCard} ${isHovered ? styles.cardActive : ""} ${isOtherHovered ? styles.cardDimmed : ""}`}
                style={{
                  transform: `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0px) scale(${cardScale})`,
                  opacity: cardOpacity,
                  zIndex: cardZ,
                }}
                onMouseEnter={() => handleFocusMember(m.id)}
                onMouseLeave={handleBlurMember}
                onClick={() => {
                  if (isHovered) {
                    setSelectedDrawerMember(m);
                  } else {
                    handleFocusMember(m.id);
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
                aria-label={`Team member portrait: ${m.name}, ${m.role}. Focus to reveal full profile.`}
              >
                {/* Visual Portrait Image (Pure Photo, No Text While Moving) */}
                <div className={styles.imageSurface}>
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="360px"
                      className={styles.portraitPhoto}
                      priority={false}
                    />
                  ) : (
                    <div className={styles.fallbackMonogram}>
                      <span>{m.avatar}</span>
                    </div>
                  )}

                  {/* Gradient bottom shadow */}
                  <div className={`${styles.bottomVignette} ${isHovered ? styles.vignetteExpanded : ""}`} />
                </div>

                {/* Profile Information: Revealed ONLY on interaction / hover */}
                {isHovered && isStabilized && (
                  <div className={styles.profileDetailsReveal}>
                    <div className={styles.detailsHeader}>
                      <span className={styles.detailCallsign}>{m.callsign} &bull; {m.year}</span>
                      <h3 className={styles.detailName}>{m.name}</h3>
                      <p className={styles.detailRole}>{m.role}</p>
                      <p className={styles.detailDept}>{m.department}</p>
                    </div>

                    {m.bio && <p className={styles.detailBio}>{m.bio}</p>}

                    <div className={styles.detailActions}>
                      {m.socials.email && (
                        <a
                          href={`mailto:${m.socials.email}`}
                          className={styles.emailAction}
                          onClick={(e) => e.stopPropagation()}
                          title={`Email ${m.name}`}
                        >
                          <Mail size={12} />
                          <span>{m.socials.email.split("@")[0]}</span>
                        </a>
                      )}

                      <button
                        type="button"
                        className={styles.dossierAction}
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
            </div>
          );
        })}
      </div>

      {/* Slide-out Full Dossier Drawer */}
      <MemberInfoDrawer
        member={selectedDrawerMember}
        onClose={() => setSelectedDrawerMember(null)}
      />
    </section>
  );
}
