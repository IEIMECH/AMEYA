"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { teamMembers } from "@/data/team";
import styles from "./InteractiveTeamGallery.module.css";

const TOTAL_MEMBERS = teamMembers.length; // 18
const IDLE_DRIFT_SPEED = 28; // pixels per second (smooth, continuous idle motion)

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

// 3 identical sets of 18 members for an infinitely continuous track
const TRIPLE_MEMBERS = [
  ...teamMembers.map((m, i) => ({ ...m, globalIndex: i })),
  ...teamMembers.map((m, i) => ({ ...m, globalIndex: i + TOTAL_MEMBERS })),
  ...teamMembers.map((m, i) => ({ ...m, globalIndex: i + TOTAL_MEMBERS * 2 })),
];

export default function InteractiveTeamGallery() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Single authoritative source of truth for carousel position
  const currentXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const hasDraggedRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const carouselStartXRef = useRef<number>(0);
  const pointerHistoryRef = useRef<Array<{ x: number; time: number }>>([]);
  const cardSpacingRef = useRef<number>(314);

  // Motion state machine: "DRIFT" | "SPRING" | "PAUSE"
  const motionModeRef = useRef<"DRIFT" | "SPRING" | "PAUSE">("DRIFT");
  const springTargetRef = useRef<number>(0);
  const springVelocityRef = useRef<number>(0);
  const pauseUntilRef = useRef<number>(0);
  const currentActiveIdxRef = useRef<number>(0);

  const [activeDataIndex, setActiveDataIndex] = useState<number>(0);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

  // Responsive card spacing calculation
  const updateSpacing = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    // Desktop: 290px card + 24px gap = 314px; Mobile: 230px card + 16px gap = 246px
    cardSpacingRef.current = w < 768 ? 246 : 314;
  }, []);

  // Direct DOM transform update (sole owner of translateX)
  const applyTrackX = useCallback((x: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
    }
  }, []);

  // Read actual presentation position from DOM matrix to guarantee 0-jump interrupts
  const getPresentationX = useCallback((): number => {
    if (!trackRef.current) return currentXRef.current;
    const style = window.getComputedStyle(trackRef.current);
    const transform = style.transform || (style as unknown as { webkitTransform?: string }).webkitTransform;
    if (!transform || transform === "none") return currentXRef.current;

    const match2d = transform.match(/^matrix\((.+)\)$/);
    if (match2d) {
      const parts = match2d[1].split(",");
      const tx = parseFloat(parts[4]);
      return Number.isFinite(tx) ? tx : currentXRef.current;
    }

    const match3d = transform.match(/^matrix3d\((.+)\)$/);
    if (match3d) {
      const parts = match3d[1].split(",");
      const tx = parseFloat(parts[12]);
      return Number.isFinite(tx) ? tx : currentXRef.current;
    }

    return currentXRef.current;
  }, []);

  // Seamless infinite wrapping kept within the middle set range
  const wrapPosition = useCallback((x: number): number => {
    const spacing = cardSpacingRef.current;
    const setWidth = TOTAL_MEMBERS * spacing;
    const minX = -35.5 * spacing;
    const maxX = -17.5 * spacing;

    let wrapped = x;
    while (wrapped < minX) wrapped += setWidth;
    while (wrapped > maxX) wrapped -= setWidth;
    return wrapped;
  }, []);

  // Single authoritative continuous physics / animation loop
  useEffect(() => {
    updateSpacing();
    const spacing = cardSpacingRef.current;
    const startX = -18 * spacing; // Start on member 0 of middle set
    currentXRef.current = startX;
    applyTrackX(startX);

    let rafId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.04);
      lastTime = now;

      const currentSpacing = cardSpacingRef.current;

      // 1. If currently being dragged, pointer handlers directly manipulate DOM
      if (!isDraggingRef.current) {
        if (motionModeRef.current === "SPRING") {
          const target = springTargetRef.current;
          let current = currentXRef.current;
          let v = springVelocityRef.current;

          // Critically damped spring physics: k = 180, c = 27
          const displacement = current - target;
          const springForce = -180 * displacement;
          const dampingForce = -27 * v;
          const acceleration = springForce + dampingForce;

          v += acceleration * dt;
          current += v * dt;

          springVelocityRef.current = v;
          currentXRef.current = current;
          applyTrackX(current);

          // Settling check
          if (Math.abs(displacement) < 0.4 && Math.abs(v) < 15) {
            current = wrapPosition(target);
            currentXRef.current = current;
            applyTrackX(current);
            // Pause after user drag/click snap so user can read dossier
            pauseUntilRef.current = now + 5000;
            motionModeRef.current = "PAUSE";
          }
        } else if (motionModeRef.current === "PAUSE") {
          if (now >= pauseUntilRef.current) {
            motionModeRef.current = "DRIFT";
          }
        } else if (motionModeRef.current === "DRIFT") {
          // Smooth continuous horizontal progression
          let nextX = currentXRef.current - IDLE_DRIFT_SPEED * dt;
          nextX = wrapPosition(nextX);
          currentXRef.current = nextX;
          applyTrackX(nextX);
        }
      }

      // Check center active index (only triggers React render when center card actually changes)
      const nearestGlobal = Math.round(-currentXRef.current / currentSpacing);
      const normIdx = ((nearestGlobal % TOTAL_MEMBERS) + TOTAL_MEMBERS) % TOTAL_MEMBERS;
      if (normIdx !== currentActiveIdxRef.current) {
        currentActiveIdxRef.current = normIdx;
        setActiveDataIndex(normIdx);
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    const onResize = () => {
      updateSpacing();
      const newSpacing = cardSpacingRef.current;
      const target = -(18 + currentActiveIdxRef.current) * newSpacing;
      currentXRef.current = target;
      applyTrackX(target);
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [applyTrackX, updateSpacing, wrapPosition]);

  // Pointer Down (Immediate interruptible grab: reads actual presentation value)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // 1. Interrupt motion
    motionModeRef.current = "PAUSE";
    pauseUntilRef.current = Infinity;

    // 2. Read current presentation position from the DOM (0 visual jump)
    let currentX = getPresentationX();
    currentX = wrapPosition(currentX);
    currentXRef.current = currentX;
    applyTrackX(currentX);

    // 3. Capture pointer
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Safe fallback
    }

    // 4. Store drag anchors
    dragStartXRef.current = e.clientX;
    carouselStartXRef.current = currentX;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    setIsGrabbing(true);

    // 5. Initialize velocity tracking
    pointerHistoryRef.current = [{ x: e.clientX, time: performance.now() }];
  };

  // Pointer Move (Direct 1:1 manipulation without React re-renders)
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 5) {
      hasDraggedRef.current = true;
    }

    let nextX = carouselStartXRef.current + delta;

    // Seamless continuous wrapping during long drag strokes
    const wrapped = wrapPosition(nextX);
    if (wrapped !== nextX) {
      const shift = wrapped - nextX;
      carouselStartXRef.current += shift;
      nextX = wrapped;
    }

    // Direct DOM write: 1:1 tracking with zero lag
    currentXRef.current = nextX;
    applyTrackX(nextX);

    // Track recent pointer positions for velocity estimation (last 100ms window)
    const now = performance.now();
    const history = pointerHistoryRef.current;
    history.push({ x: e.clientX, time: now });
    while (history.length > 1 && now - history[0].time > 100) {
      history.shift();
    }
  };

  // Pointer Up / Release (Momentum projection & spring snap)
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

    if (!hasDraggedRef.current) {
      // Was a tap/click, click handler handles it
      return;
    }

    // Calculate release velocity from recent history (px/ms)
    const history = pointerHistoryRef.current;
    let velocityPxPerMs = 0;
    if (history.length >= 2) {
      const oldest = history[0];
      const newest = history[history.length - 1];
      const dt = Math.max(newest.time - oldest.time, 1);
      if (performance.now() - newest.time < 80) {
        velocityPxPerMs = (newest.x - oldest.x) / dt;
      }
    }

    // Clamp velocity to prevent wild teleports
    velocityPxPerMs = Math.max(-3.5, Math.min(3.5, velocityPxPerMs));

    const spacing = cardSpacingRef.current;
    const currentX = currentXRef.current;

    // Momentum projection: project position based on velocity
    const projectedX = currentX + velocityPxPerMs * 220;
    const targetGlobal = Math.round(-projectedX / spacing);
    const targetX = -targetGlobal * spacing;

    // Switch to spring settling mode
    springTargetRef.current = targetX;
    springVelocityRef.current = velocityPxPerMs * 1000; // px/sec
    motionModeRef.current = "SPRING";
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerUp(e);
  };

  // When user clicks a card: immediately center it and display info
  const handleCardClick = (globalIdx: number) => {
    if (hasDraggedRef.current) return; // Ignore if user was actively dragging
    const spacing = cardSpacingRef.current;
    const targetX = -globalIdx * spacing;

    // 1. Immediately update active member info
    const normIdx = ((globalIdx % TOTAL_MEMBERS) + TOTAL_MEMBERS) % TOTAL_MEMBERS;
    setActiveDataIndex(normIdx);
    currentActiveIdxRef.current = normIdx;

    // 2. Smoothly spring the clicked card to the exact center
    springTargetRef.current = targetX;
    springVelocityRef.current = 0;
    motionModeRef.current = "SPRING";

    // 3. Pause auto-drift so user can comfortably inspect the card
    pauseUntilRef.current = performance.now() + 6000;
  };

  const activeMember = teamMembers[activeDataIndex] || teamMembers[0];

  return (
    <div className={styles.teamPageWrapper}>
      {/* 1. Header: Clean typography directly on background (No opaque boxes) */}
      <header className={styles.heroHeader}>
        <h1 className={styles.heroTitle}>
          THE <span className={styles.heroAccent}>TEAM</span>
        </h1>
        <p className={styles.heroSubtitle}>18 Council Officers</p>
        <p className={styles.heroDepartment}>Department of Mechanical Engineering</p>
      </header>

      {/* 2. Isolated Carousel Viewport (Only the track moves horizontally) */}
      <div
        ref={viewportRef}
        className={`${styles.galleryViewport} ${isGrabbing ? styles.grabbing : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        aria-label="Interactive Team Carousel. Click any card to center and inspect."
        role="region"
      >
        <div ref={trackRef} className={styles.track}>
          {TRIPLE_MEMBERS.map((m) => {
            const isCenter = (m.globalIndex % TOTAL_MEMBERS) === activeDataIndex;
            return (
              <article
                key={`member-card-${m.globalIndex}`}
                className={`${styles.portraitCard} ${isCenter ? styles.portraitCardActive : ""}`}
                onClick={() => handleCardClick(m.globalIndex)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${m.name}, ${m.role}`}
              >
                <div className={styles.portraitImageWrapper}>
                  <Image
                    src={m.image || "/img/Hero/photo-wall-1.webp"}
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 230px, 290px"
                    className={styles.portraitImage}
                    priority={m.globalIndex >= 16 && m.globalIndex <= 20}
                    draggable={false}
                  />
                  <div className={styles.portraitOverlay}>
                    <span className={styles.memberDivisionTag}>{m.division}</span>
                    <h3 className={styles.memberName}>{m.name}</h3>
                    <p className={styles.memberRole}>{m.role}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Profile Panel for Active Center Member (No Level-1 2 3 4) */}
      <section className={styles.activeDetailSection} aria-label="Selected Officer Dossier">
        <div className={styles.detailContainer}>
          {/* Structural Header Row: ID on Left, Committee on Right (No Level Indicator) */}
          <div className={styles.detailMetaRow}>
            <div className={styles.detailIdBlock}>
              <span className={styles.detailIdLabel}>OFFICER ID //</span>
              <span className={styles.detailCallsign}>{activeMember.callsign}</span>
            </div>
            <span className={styles.detailDivisionBadge}>{activeMember.division}</span>
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
