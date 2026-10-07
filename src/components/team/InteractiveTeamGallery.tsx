"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { teamMembers } from "@/data/team";
import styles from "./InteractiveTeamGallery.module.css";

const TOTAL_MEMBERS = teamMembers.length; // 18
const IDLE_DRIFT_SPEED = 28; // pixels per second (smooth, continuous idle motion)



// 3 identical sets of 18 members for an infinitely continuous track
const TRIPLE_MEMBERS = [
  ...teamMembers.map((m, i) => ({ ...m, globalIndex: i })),
  ...teamMembers.map((m, i) => ({ ...m, globalIndex: i + TOTAL_MEMBERS })),
  ...teamMembers.map((m, i) => ({ ...m, globalIndex: i + TOTAL_MEMBERS * 2 })),
];

export default function InteractiveTeamGallery() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Authoritative carousel position
  const currentXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const hasDraggedRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const carouselStartXRef = useRef<number>(0);
  const pointerHistoryRef = useRef<Array<{ x: number; time: number }>>([]);
  const cardSpacingRef = useRef<number>(314);

  // Motion state machine: "DRIFT" | "MOMENTUM" | "SPRING" | "PAUSE"
  const motionModeRef = useRef<"DRIFT" | "MOMENTUM" | "SPRING" | "PAUSE">("DRIFT");
  const momentumVelocityRef = useRef<number>(0);
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

  // Authoritative continuous physics / animation loop
  useEffect(() => {
    updateSpacing();
    const spacing = cardSpacingRef.current;
    const startX = -TOTAL_MEMBERS * spacing; // Start on member 0 of middle set
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
        if (motionModeRef.current === "MOMENTUM") {
          let current = currentXRef.current;
          let v = momentumVelocityRef.current;

          // Smooth exponential friction decay (0.92 per 60fps frame)
          const friction = Math.pow(0.92, dt * 60);
          v = v * friction;

          current += v * dt;
          current = wrapPosition(current);
          currentXRef.current = current;
          applyTrackX(current);

          // When momentum decays to near idle drift speed, seamlessly blend back to continuous DRIFT
          if (Math.abs(v) <= IDLE_DRIFT_SPEED * 1.15 || (v < 0 && Math.abs(v - (-IDLE_DRIFT_SPEED)) < 8)) {
            motionModeRef.current = "DRIFT";
          } else {
            momentumVelocityRef.current = v;
          }
        } else if (motionModeRef.current === "SPRING") {
          const target = springTargetRef.current;
          let current = currentXRef.current;
          let v = springVelocityRef.current;

          // Critically damped spring physics: k = 180, c = 26
          const displacement = current - target;
          const springForce = -180 * displacement;
          const dampingForce = -26 * v;
          const acceleration = springForce + dampingForce;

          v += acceleration * dt;
          current += v * dt;

          springVelocityRef.current = v;
          currentXRef.current = current;
          applyTrackX(current);

          // Quick settling check:
          if (Math.abs(displacement) < 0.6 && Math.abs(v) < 20) {
            current = wrapPosition(target);
            currentXRef.current = current;
            applyTrackX(current);
            // Brief 1.2s pause to view centered card, then automatically resume DRIFT
            pauseUntilRef.current = now + 1200;
            motionModeRef.current = "PAUSE";
          }
        } else if (motionModeRef.current === "PAUSE") {
          if (now >= pauseUntilRef.current) {
            motionModeRef.current = "DRIFT";
          }
        } else if (motionModeRef.current === "DRIFT") {
          // Smooth continuous horizontal progression (never stops!)
          let nextX = currentXRef.current - IDLE_DRIFT_SPEED * dt;
          nextX = wrapPosition(nextX);
          currentXRef.current = nextX;
          applyTrackX(nextX);
        }
      }

      // Check center active index
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
      const target = -(TOTAL_MEMBERS + currentActiveIdxRef.current) * newSpacing;
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
    // 1. Interrupt motion while user holds pointer
    motionModeRef.current = "PAUSE";
    pauseUntilRef.current = 0; // NEVER Infinity!

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

  // Pointer Up / Release: Momentum glide seamlessly blending back into continuous drift!
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
      // User tapped without dragging - resume drift immediately!
      motionModeRef.current = "DRIFT";
      return;
    }

    // Calculate release velocity from recent history (px/ms)
    const history = pointerHistoryRef.current;
    let velocityPxPerMs = 0;
    if (history.length >= 2) {
      const oldest = history[0];
      const newest = history[history.length - 1];
      const dt = Math.max(newest.time - oldest.time, 1);
      if (performance.now() - newest.time < 120) {
        velocityPxPerMs = (newest.x - oldest.x) / dt;
      }
    }

    // Clamp velocity to prevent wild teleports
    velocityPxPerMs = Math.max(-2.8, Math.min(2.8, velocityPxPerMs));
    const velocityPxPerSec = velocityPxPerMs * 1000; // px/sec

    // If there is significant fling/momentum, glide with friction then transition back to DRIFT
    if (Math.abs(velocityPxPerSec) > IDLE_DRIFT_SPEED) {
      momentumVelocityRef.current = velocityPxPerSec;
      motionModeRef.current = "MOMENTUM";
    } else {
      // Released slowly: resume continuous drift immediately without any pause!
      motionModeRef.current = "DRIFT";
    }
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

    // 2. Smoothly spring the clicked card to center
    springTargetRef.current = targetX;
    springVelocityRef.current = 0;
    motionModeRef.current = "SPRING";
  };

  const activeMember = teamMembers[activeDataIndex] || teamMembers[0];

  return (
    <div className={styles.teamPageWrapper}>
      {/* 1. Header: Clean typography directly on background */}
      <header className={styles.heroHeader}>
        <h1 className={styles.heroTitle}>
          THE <span className={styles.heroAccent}>TEAM</span>
        </h1>
        <p className={styles.heroSubtitle}>{TOTAL_MEMBERS} Council Officers</p>
        <p className={styles.heroDepartment}>Department of Mechanical Engineering</p>
      </header>

      {/* 2. Isolated Carousel Viewport (Continuous horizontal motion track) */}
      <div
        ref={viewportRef}
        className={`${styles.galleryViewport} ${isGrabbing ? styles.grabbing : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        aria-label="Interactive Team Carousel. Drag to browse officers, or watch continuous progression."
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
                    src={m.image || "/img/Hero/photowall_1.jpeg"}
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

      {/* 3. Detailed Profile Panel for Active Center Member */}
      <section className={styles.activeDetailSection} aria-label="Selected Officer Dossier">
        <div className={styles.detailContainer}>
          {/* Structural Header Row: ID on Left, Committee on Right */}
          <div className={styles.detailMetaRow}>
            
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
          </div>
        </div>
      </section>
    </div>
  );
}
