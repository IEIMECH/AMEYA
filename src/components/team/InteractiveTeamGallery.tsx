"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}
import { teamMembers } from "@/data/team";
import styles from "./InteractiveTeamGallery.module.css";

const TOTAL_MEMBERS = teamMembers.length;

export default function InteractiveTeamGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Continuous physical carousel state
  const offsetRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isInteractingRef = useRef<boolean>(false);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const springTargetRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const cardSpacingRef = useRef<number>(320);

  // UI Display states
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);
  const [renderSlots, setRenderSlots] = useState<Array<{
    key: string;
    member: typeof teamMembers[0];
    xPos: number;
    scale: number;
    opacity: number;
    zIndex: number;
    isCenter: boolean;
  }>>([]);

  // Responsive card spacing
  const updateSpacing = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    cardSpacingRef.current = w < 768 ? Math.min(270, w * 0.72) : 320;
  }, []);

  useEffect(() => {
    updateSpacing();
    window.addEventListener("resize", updateSpacing);
    return () => window.removeEventListener("resize", updateSpacing);
  }, [updateSpacing]);

  // Compute active card & 7-slot continuous visual projection
  const computeSlots = useCallback(() => {
    const spacing = cardSpacingRef.current;
    const currentOffset = offsetRef.current;
    const centerFloat = -currentOffset / spacing;
    const centerInt = Math.round(centerFloat);
    
    // Normalized active member index [0..17]
    const normActiveIdx = ((centerInt % TOTAL_MEMBERS) + TOTAL_MEMBERS) % TOTAL_MEMBERS;
    setActiveIndex(normActiveIdx);

    // 7 continuous virtual slots: -3, -2, -1, 0, 1, 2, 3
    const slots = [];
    for (let k = -3; k <= 3; k++) {
      const slotIndex = centerInt + k;
      const memberIdx = ((slotIndex % TOTAL_MEMBERS) + TOTAL_MEMBERS) % TOTAL_MEMBERS;
      const member = teamMembers[memberIdx];
      const xPos = slotIndex * spacing + currentOffset;
      const dist = Math.abs(xPos);

      // Depth calculations
      const isCenter = k === 0 && dist < spacing * 0.5;
      const scale = Math.max(0.74, 1.05 - (dist / (spacing * 2.2)) * 0.32);
      const opacity = Math.max(0.20, 1.0 - (dist / (spacing * 2.2)) * 0.72);
      const zIndex = Math.max(1, 50 - Math.round(dist / 8));

      slots.push({
        key: `slot-${slotIndex}`,
        member,
        xPos,
        scale,
        opacity,
        zIndex,
        isCenter,
      });
    }

    setRenderSlots(slots);
  }, []);

  // Authoritative 60 FPS momentum & spring animation loop
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) * 0.001, 0.05); // seconds
      lastTimestamp = timestamp;

      const spacing = cardSpacingRef.current;

      if (!isDraggingRef.current) {
        if (springTargetRef.current !== null) {
          // Spring settling to nearest card
          const target = springTargetRef.current;
          const current = offsetRef.current;
          const diff = target - current;

          // Spring physics: stiffness 160, damping 20
          const springForce = diff * 18.0;
          velocityRef.current += springForce * dt;
          velocityRef.current *= Math.pow(0.08, dt); // smooth deceleration
          offsetRef.current += velocityRef.current * dt * 1000;

          if (Math.abs(diff) < 0.3 && Math.abs(velocityRef.current) < 0.01) {
            offsetRef.current = target;
            velocityRef.current = 0;
            springTargetRef.current = null;
            isInteractingRef.current = false;
          }
        } else if (Math.abs(velocityRef.current) > 0.05) {
          // Momentum coasting after gesture release
          velocityRef.current *= Math.pow(0.12, dt);
          offsetRef.current += velocityRef.current * dt * 1000;

          if (Math.abs(velocityRef.current) <= 0.05) {
            // Velocity decayed: lock target to closest card and snap
            const closest = Math.round(offsetRef.current / spacing) * spacing;
            springTargetRef.current = closest;
          }
        } else if (!isInteractingRef.current) {
          // Gentle idle drift (Item 16)
          offsetRef.current -= 0.18;
        }
      }

      computeSlots();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [computeSlots]);

  // Pointer Gesture Handlers (Direct manipulation, 1:1 response, immediate interruptibility)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Interrupt any ongoing momentum or spring immediately (Item 15)
    springTargetRef.current = null;
    velocityRef.current = 0;
    isDraggingRef.current = true;
    isInteractingRef.current = true;
    setIsGrabbing(true);

    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Safe fallback
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const now = performance.now();
    const deltaX = currentX - lastXRef.current;
    const dt = Math.max(now - lastTimeRef.current, 1);

    // 1:1 direct horizontal movement
    offsetRef.current += deltaX;

    // Smoothed velocity estimation (pixels per ms)
    const instantVelocity = deltaX / dt;
    velocityRef.current = velocityRef.current * 0.35 + instantVelocity * 0.65;

    lastXRef.current = currentX;
    lastTimeRef.current = now;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsGrabbing(false);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Safe fallback
    }

    const spacing = cardSpacingRef.current;
    const currentOffset = offsetRef.current;
    const v = velocityRef.current;

    // Momentum fling or nearest snap (Item 13)
    if (Math.abs(v) > 0.25) {
      // Projected coasting position
      const projectedOffset = currentOffset + v * 280;
      const targetCard = Math.round(projectedOffset / spacing) * spacing;
      springTargetRef.current = targetCard;
    } else {
      // Gentle release: snap directly to nearest card
      const nearestCard = Math.round(currentOffset / spacing) * spacing;
      springTargetRef.current = nearestCard;
    }
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerUp(e);
  };

  // Direct card click to center
  const snapToSlot = (xPos: number) => {
    springTargetRef.current = offsetRef.current - xPos;
    isInteractingRef.current = true;
  };

  const activeMember = teamMembers[activeIndex] || teamMembers[0];

  return (
    <div className={styles.teamPageWrapper}>
      {/* 1. Header: Clean typography directly on background (No opaque boxes, No classification bar) */}
      <header className={styles.heroHeader}>
        <h1 className={styles.heroTitle}>
          THE <span className={styles.heroAccent}>TEAM</span>
        </h1>
        <p className={styles.heroSubtitle}>18 Council Officers</p>
        <p className={styles.heroDepartment}>Department of Mechanical Engineering</p>
      </header>

      {/* 2. Direct-Manipulation Infinite Carousel Viewport */}
      <div
        ref={containerRef}
        className={`${styles.galleryViewport} ${isGrabbing ? styles.grabbing : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        aria-label="Direct manipulation team cards carousel. Drag or swipe left and right to inspect members."
        role="region"
      >
        <div className={styles.carouselTrack}>
          {renderSlots.map((slot) => {
            const { key, member, xPos, scale, opacity, zIndex, isCenter } = slot;
            return (
              <article
                key={key}
                className={`${styles.portraitCard} ${isCenter ? styles.portraitCardActive : ""}`}
                style={{
                  transform: `translate3d(${xPos}px, -50%, 0) scale(${scale})`,
                  opacity,
                  zIndex,
                }}
                onClick={() => !isDraggingRef.current && snapToSlot(xPos)}
              >
                <div className={styles.portraitImageWrapper}>
                  <Image
                    src={member.image || "/img/Hero/photo-wall-1.webp"}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 250px, 310px"
                    className={styles.portraitImage}
                    priority={isCenter}
                    draggable={false}
                  />
                  <div className={styles.portraitOverlay}>
                    <span className={styles.memberDivisionTag}>{member.division}</span>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <p className={styles.memberRole}>{member.role}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Minimal Subtle Counter Metadata (Item 17: No arrows) */}
        <div className={styles.counterMeta} aria-live="polite">
          <span className={styles.counterCurrent}>
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className={styles.counterDivider}>/</span>
          <span className={styles.counterTotal}>
            {String(TOTAL_MEMBERS).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* 3. Detailed Profile Panel for Active Center Member */}
      <section className={styles.activeDetailSection} aria-label="Selected Officer Dossier">
        <div className={styles.detailContainer}>
          <div className={styles.detailMetaRow}>
            <span className={styles.detailCallsign}>{activeMember.callsign}</span>
            <span className={styles.detailClearance}>{activeMember.clearance}</span>
          </div>

          <h2 className={styles.detailName}>{activeMember.name}</h2>
          <p className={styles.detailRole}>{activeMember.role} &bull; {activeMember.department}</p>
          <p className={styles.detailBio}>{activeMember.bio}</p>

          <div className={styles.detailFooter}>
            <div className={styles.specializationBadge}>
              <span className={styles.specLabel}>SPECIALIZATION</span>
              <span className={styles.specValue}>{activeMember.specialization}</span>
            </div>

            <div className={styles.socialLinks}>
              {activeMember.socials?.email && (
                <a
                  href={`mailto:${activeMember.socials.email}`}
                  className={styles.socialIcon}
                  aria-label={`Email ${activeMember.name}`}
                >
                  <Mail size={16} />
                </a>
              )}
              {activeMember.socials?.linkedin && (
                <a
                  href={activeMember.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label={`${activeMember.name} LinkedIn`}
                >
                  <LinkedinIcon size={16} />
                </a>
              )}
              {activeMember.socials?.github && (
                <a
                  href={activeMember.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label={`${activeMember.name} GitHub`}
                >
                  <GithubIcon size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
