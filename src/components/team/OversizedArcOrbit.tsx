"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { teamMembers, TeamMember } from "@/data/team";
import MemberInfoDrawer from "./MemberInfoDrawer";
import styles from "./OversizedArcOrbit.module.css";
import { Sparkles, ChevronRight, Info } from "lucide-react";

// Total orbital slots: 24 slots separated by exactly 15 degrees (360 / 24)
// Creates a dense, physical, continuous wheel with 5-7 portraits visible at once
const TOTAL_SLOTS = 24;
const SLOT_SEPARATION_RAD = (2 * Math.PI) / TOTAL_SLOTS;

// Base automatic clockwise rotation speed (~45s for 360 loop)
// In our coordinate system, positive speed = CLOCKWISE rotation across top arc
const BASE_SPEED = 0.0022;

// Proximity detection radius: covers card (165x230) + 75-100px invisible zone
const PROXIMITY_RADIUS = 210;
const PROXIMITY_LEAVE_RADIUS = 260; // Hysteresis to prevent edge jitter

export default function OversizedArcOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Orbit angle & physics velocity
  const rotationRef = useRef<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const dragOffsetYRef = useRef<number>(0);
  const [speedFactor, setSpeedFactor] = useState<number>(1);

  const currentSpeedRef = useRef<number>(BASE_SPEED);
  const targetSpeedRef = useRef<number>(BASE_SPEED);

  // Proximity & Focus States
  const [proximityCandidateId, setProximityCandidateId] = useState<string | null>(null);
  const [focusedSlotId, setFocusedSlotId] = useState<string | null>(null);
  const focusedSlotIdRef = useRef<string | null>(null);
  const proximityCandidateIdRef = useRef<string | null>(null);

  // Direct manipulation drag states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const isPointerDown = useRef<boolean>(false);
  const hasExceededDragThreshold = useRef<boolean>(false);

  // Drag coordinates & tracking
  const pointerStartX = useRef<number>(0);
  const pointerStartY = useRef<number>(0);
  const lastPointerX = useRef<number>(0);
  const lastPointerY = useRef<number>(0);
  const lastPointerTime = useRef<number>(0);
  const dragVelocityX = useRef<number>(0);

  // Inertia physics
  const isInertiaActiveRef = useRef<boolean>(false);
  const inertiaVelocityRef = useRef<number>(0);
  const springBackYRef = useRef<boolean>(false);

  // Intent detection timers
  const intentTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Slide-out Full Dossier Drawer
  const [selectedDrawerMember, setSelectedDrawerMember] = useState<TeamMember | null>(null);

  // Responsive Orbit Dimensions (Tighter radius for dense continuous wheel)
  const [geometry, setGeometry] = useState({
    vpW: 1440,
    vpH: 640,
    rx: 1050,  // Diameter ~2100px (desktop)
    ry: 820,
    yApex: 140, // Protected safe zone: apex sits safely below header
  });

  // Handle responsive resize
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      if (w < 640) {
        // Mobile
        setGeometry({
          vpW: w,
          vpH: Math.max(h * 0.70, 520),
          rx: Math.max(w * 0.92, 420),
          ry: 580,
          yApex: 110,
        });
      } else if (w < 1024) {
        // Tablet
        setGeometry({
          vpW: w,
          vpH: 600,
          rx: Math.max(w * 0.96, 750),
          ry: 700,
          yApex: 125,
        });
      } else {
        // Desktop: orbit diameter ~2100px with 15 deg separation -> ~110px gap between cards
        setGeometry({
          vpW: w,
          vpH: 640,
          rx: Math.max(w * 0.92, 1050),
          ry: 820,
          yApex: 140,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      targetSpeedRef.current = 0;
      currentSpeedRef.current = 0;
    }
  }, []);

  // Main Animation Frame Loop: Automatic Orbit + Deceleration/Acceleration + Inertia Damping
  useEffect(() => {
    let animId: number;

    const tick = () => {
      // 1. Direct Dragging: User controls wheel, auto rotation pauses
      if (isDraggingRef.current) {
        // Position updated directly in onPointerMove
      } 
      // 2. Inertia after Drag Release: Natural friction decay (0.94)
      else if (isInertiaActiveRef.current) {
        rotationRef.current += inertiaVelocityRef.current;
        inertiaVelocityRef.current *= 0.94; // Physical friction

        // Once velocity slows down near target speed, transition back to auto rotation
        if (Math.abs(inertiaVelocityRef.current) < Math.abs(BASE_SPEED) * 1.05) {
          isInertiaActiveRef.current = false;
          currentSpeedRef.current = BASE_SPEED;
          targetSpeedRef.current = focusedSlotIdRef.current ? 0 : BASE_SPEED;
        }
        setRotation(rotationRef.current);
      } 
      // 3. Normal Orbit & Smooth Deceleration / Acceleration
      else {
        const diff = targetSpeedRef.current - currentSpeedRef.current;
        currentSpeedRef.current += diff * 0.055; // Smooth deceleration (600-900ms)
        rotationRef.current += currentSpeedRef.current;
        setRotation(rotationRef.current);
      }

      // Vertical offset spring-back after dragging Y
      if (springBackYRef.current) {
        dragOffsetYRef.current *= 0.88;
        if (Math.abs(dragOffsetYRef.current) < 0.4) {
          dragOffsetYRef.current = 0;
          springBackYRef.current = false;
        }
        setDragOffsetY(dragOffsetYRef.current);
      }

      // Dynamic trail factor (0 when stopped, 1 at full speed)
      const ratio = Math.min(Math.abs(currentSpeedRef.current / BASE_SPEED), 1);
      setSpeedFactor(ratio);

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Orbit Center & Focus Point Coordinates
  const centerX = geometry.vpW / 2;
  const centerY = geometry.yApex + geometry.ry + dragOffsetY;

  // Dedicated Visual Focus Point: Center of the designated Team content area
  // Sits safely in visual center (50% X, 52% Y of arcWindow), completely below header safe zone
  const focusPointX = geometry.vpW / 2;
  const focusPointY = geometry.vpH * 0.52;

  // Calculate Member Positions for 24 dense slots
  const slotsData = useMemo(() => {
    return Array.from({ length: TOTAL_SLOTS }, (_, index) => {
      const slotId = `slot-${index}`;
      const m = teamMembers[index % teamMembers.length];

      // 15-degree equal angular separation (360 / 24)
      // Top apex is -PI/2 (12 o'clock). Clockwise rotation moves cards Left -> Right across top.
      const baseAngle = -Math.PI / 2 + index * SLOT_SEPARATION_RAD;
      const angle = baseAngle + rotation;

      // Position on the oversized ellipse
      const orbitX = centerX + geometry.rx * Math.cos(angle);
      const orbitY = centerY + geometry.ry * Math.sin(angle);

      // Distance from top apex (-PI/2) in radians
      let diffFromApex = ((angle + Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      if (diffFromApex > Math.PI) diffFromApex = 2 * Math.PI - diffFromApex;

      // Perspective Depth along the visible arc
      const cosApex = Math.cos(diffFromApex); // 1.0 at apex, drops towards edges
      const perspectiveScale = 0.85 + 0.25 * Math.max(0, cosApex); // [0.85 to 1.10]
      const perspectiveOpacity = 0.65 + 0.35 * Math.max(0, cosApex); // [0.65 to 1.00]
      const zIndex = Math.round(Math.max(0, cosApex) * 40) + 10;

      // Motion Trail Ghost Coordinates (lagging along arc during movement)
      const trailAngle = angle - 0.040 * speedFactor;
      const trailX = centerX + geometry.rx * Math.cos(trailAngle);
      const trailY = centerY + geometry.ry * Math.sin(trailAngle);

      // Overscan buffer: render slots within window + 240px buffer
      // Ensures extreme edge cards have active proximity zones even when 90% off-screen
      const isVisibleInWindow = orbitX >= -240 && orbitX <= geometry.vpW + 240 && orbitY <= geometry.vpH + 240;

      return {
        slotId,
        m,
        orbitX,
        orbitY,
        perspectiveScale,
        perspectiveOpacity,
        zIndex,
        trailX,
        trailY,
        isVisibleInWindow,
      };
    });
  }, [rotation, centerX, centerY, geometry.rx, geometry.ry, geometry.vpW, geometry.vpH, speedFactor, dragOffsetY]);

  // Keep refs in sync for event listeners
  useEffect(() => {
    focusedSlotIdRef.current = focusedSlotId;
  }, [focusedSlotId]);

  useEffect(() => {
    proximityCandidateIdRef.current = proximityCandidateId;
  }, [proximityCandidateId]);

  // Clear focus and resume orbit smoothly from exact current angle
  const handleClearFocus = useCallback(() => {
    if (intentTimerRef.current) {
      clearTimeout(intentTimerRef.current);
      intentTimerRef.current = null;
    }

    setProximityCandidateId(null);
    setFocusedSlotId(null);

    // 200ms grace pause before smoothly accelerating back to clockwise rotation
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      targetSpeedRef.current = BASE_SPEED;
    }, 200);
  }, []);

  // Forgiving Proximity-based Intent Detection on Pointer Move
  const handleContainerPointerMove = useCallback((e: React.PointerEvent) => {
    // If dragging, dragging handles rotation and overrides hover completely
    if (isPointerDown.current) {
      handlePointerDragMove(e);
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // If currently focused, check if mouse is still within the focused card's proximity zone
    if (focusedSlotIdRef.current) {
      const activeSlot = slotsData.find(s => s.slotId === focusedSlotIdRef.current);
      if (activeSlot) {
        // Distance to the center focus point
        const distToFocus = Math.hypot(mouseX - focusPointX, mouseY - focusPointY);
        // Generous exit boundary: 260px radius around center
        if (distToFocus > PROXIMITY_LEAVE_RADIUS) {
          handleClearFocus();
        }
        return;
      }
    }

    // Find the nearest card among all cards (including partially off-screen edge cards)
    let nearestSlotId: string | null = null;
    let minDistance = Infinity;

    for (const slot of slotsData) {
      if (!slot.isVisibleInWindow) continue;
      const dist = Math.hypot(mouseX - slot.orbitX, mouseY - slot.orbitY);
      if (dist < minDistance) {
        minDistance = dist;
        nearestSlotId = slot.slotId;
      }
    }

    // Check if pointer is within the invisible 60-100px proximity zone
    if (nearestSlotId && minDistance <= PROXIMITY_RADIUS) {
      if (proximityCandidateIdRef.current !== nearestSlotId) {
        setProximityCandidateId(nearestSlotId);

        // Cancel previous timer
        if (intentTimerRef.current) clearTimeout(intentTimerRef.current);

        // Proximity Intent Detection: pointer near portrait for 120ms -> Focus Hero
        intentTimerRef.current = setTimeout(() => {
          setFocusedSlotId(nearestSlotId);
          targetSpeedRef.current = 0; // Smooth deceleration over 600-900ms
        }, 120);
      }
    } else {
      // Pointer is outside all card proximity zones
      if (proximityCandidateIdRef.current && !focusedSlotIdRef.current) {
        if (intentTimerRef.current) {
          clearTimeout(intentTimerRef.current);
          intentTimerRef.current = null;
        }
        setProximityCandidateId(null);
      }
    }
  }, [slotsData, focusPointX, focusPointY, handleClearFocus]);

  // Pointer Down: Initiate potential direct manipulation drag
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Primary click or touch only

    isPointerDown.current = true;
    hasExceededDragThreshold.current = false;
    pointerStartX.current = e.clientX;
    pointerStartY.current = e.clientY;
    lastPointerX.current = e.clientX;
    lastPointerY.current = e.clientY;
    lastPointerTime.current = performance.now();
    dragVelocityX.current = 0;
    isInertiaActiveRef.current = false;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Pointer Drag Movement (Horizontal Rotation + Vertical Tilt)
  const handlePointerDragMove = (e: React.PointerEvent) => {
    const totalDx = e.clientX - pointerStartX.current;
    const totalDy = e.clientY - pointerStartY.current;
    const distance = Math.hypot(totalDx, totalDy);

    // 8px threshold distinguishes drag from a simple click/touch
    if (!hasExceededDragThreshold.current && distance > 8) {
      hasExceededDragThreshold.current = true;
      isDraggingRef.current = true;
      setIsDragging(true);

      // User input overrides hover: cancel any active focus or candidate immediately
      if (intentTimerRef.current) clearTimeout(intentTimerRef.current);
      setProximityCandidateId(null);
      setFocusedSlotId(null);
    }

    if (hasExceededDragThreshold.current) {
      const now = performance.now();
      const dt = Math.max(now - lastPointerTime.current, 1);
      const dx = e.clientX - lastPointerX.current;
      const dy = e.clientY - lastPointerY.current;

      lastPointerX.current = e.clientX;
      lastPointerY.current = e.clientY;
      lastPointerTime.current = now;

      // Horizontal mouse movement controls primary orbital rotation
      // Drag Right (dx > 0) -> CLOCKWISE rotation
      // Drag Left  (dx < 0) -> COUNTER-CLOCKWISE rotation
      const dAngle = dx * 0.0035;
      rotationRef.current += dAngle;
      setRotation(rotationRef.current);

      // Track release velocity for inertia
      dragVelocityX.current = (dx / dt) * 0.0025;

      // Vertical movement creates subtle vertical/depth adjustment (clamped to +/- 60px)
      dragOffsetYRef.current = Math.max(-60, Math.min(60, dragOffsetYRef.current + dy * 0.40));
      setDragOffsetY(dragOffsetYRef.current);
    }
  };

  // Pointer Up: Release drag, apply inertia, or handle click
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    if (hasExceededDragThreshold.current) {
      // Release Drag -> Apply subtle inertial momentum based on release velocity
      isDraggingRef.current = false;
      setIsDragging(false);

      const releaseVelocity = Math.max(-0.035, Math.min(0.035, dragVelocityX.current));
      if (Math.abs(releaseVelocity) > 0.003) {
        isInertiaActiveRef.current = true;
        inertiaVelocityRef.current = releaseVelocity;
      } else {
        // Natural return to normal slow clockwise automatic rotation
        targetSpeedRef.current = BASE_SPEED;
      }

      // Spring-back vertical displacement smoothly to 0
      springBackYRef.current = true;
    }
  };

  return (
    <section className={styles.stage} aria-label="Team Members Interactive Orbit">
      {/* Subtle Atmosphere & Background Lighting */}
      <div className={styles.ambientHalo} aria-hidden="true" />
      <div className={styles.gridMatrix} aria-hidden="true" />

      {/* Protected Header Safe Zone: Sits strictly above the orbit with ZERO instructional UI */}
      <header className={styles.centerStageHeader}>
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
      </header>

      {/* Oversized Arc Viewport Window with Proximity Hit Testing & Direct Drag */}
      <div 
        ref={containerRef}
        className={`${styles.arcWindow} ${isDragging ? styles.isDragging : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handleContainerPointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => {
          if (!isDraggingRef.current && !isPointerDown.current) {
            handleClearFocus();
          }
        }}
      >
        {slotsData.map(({ slotId, m, orbitX, orbitY, perspectiveScale, perspectiveOpacity, zIndex, trailX, trailY, isVisibleInWindow }) => {
          if (!isVisibleInWindow) return null;

          const isFocused = focusedSlotId === slotId;
          const isCandidate = proximityCandidateId === slotId && !isFocused;
          const isAnyFocused = focusedSlotId !== null;
          const isOtherDimmed = isAnyFocused && !isFocused;

          // Target Coordinates & Scale
          let targetX = orbitX;
          let targetY = orbitY;
          let targetScale = perspectiveScale;
          let targetOpacity = perspectiveOpacity;
          let targetZ = zIndex;

          if (isFocused) {
            // Focused portrait moves smoothly to the central focus point, scaled 1.4 - 1.6x
            targetX = focusPointX;
            targetY = focusPointY;
            targetScale = 1.50;
            targetOpacity = 1;
            targetZ = 200; // Stays topmost
          } else if (isCandidate) {
            // Proximity Intent Detected: Subtly scale from 1.0 to 1.05 and brighten
            targetScale = perspectiveScale * 1.05;
            targetOpacity = 1;
            targetZ = 150;
          } else if (isOtherDimmed) {
            // Surrounding portraits: 35-55% opacity, subtle blur
            targetOpacity = 0.42;
            targetScale = perspectiveScale * 0.92;
          }

          return (
            <div key={slotId}>
              {/* Kinetic Motion Trail (Active during continuous movement, dissolves on stop) */}
              {speedFactor > 0.12 && !isAnyFocused && !isDragging && (
                <div
                  className={styles.motionTrailGhost}
                  style={{
                    transform: `translate3d(calc(${trailX}px - 50%), calc(${trailY}px - 50%), 0px) scale(${perspectiveScale * 0.95})`,
                    opacity: 0.22 * speedFactor,
                    zIndex: zIndex - 1,
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Invisible 80px Proximity Interaction Zone wrapper */}
              <div
                className={styles.proximityWrapper}
                style={{
                  transform: `translate3d(calc(${targetX}px - 50%), calc(${targetY}px - 50%), 0px)`,
                  zIndex: targetZ,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasExceededDragThreshold.current) return;

                  if (isFocused) {
                    setSelectedDrawerMember(m);
                  } else {
                    setFocusedSlotId(slotId);
                    targetSpeedRef.current = 0;
                  }
                }}
              >
                {/* Pure Portrait Card: The Image is the Hero */}
                <div
                  className={`
                    ${styles.portraitCard} 
                    ${isFocused ? styles.cardFocused : ""} 
                    ${isCandidate ? styles.cardCandidate : ""} 
                    ${isOtherDimmed ? styles.cardDimmed : ""}
                  `}
                  style={{
                    transform: `scale(${targetScale})`,
                    opacity: targetOpacity,
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedDrawerMember(m);
                    }
                  }}
                  aria-label={`Team member portrait: ${m.name}, ${m.role}. Click to open dossier.`}
                >
                  {/* Visual Portrait Image (Pure Photo, No Text While Moving) */}
                  <div className={styles.imageSurface}>
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="320px"
                        className={styles.portraitPhoto}
                        priority={false}
                      />
                    ) : (
                      <div className={styles.fallbackMonogram}>
                        <span>{m.avatar}</span>
                      </div>
                    )}

                    {/* Subtle Bottom Vignette */}
                    <div className={styles.bottomVignette} />

                    {/* Minimal Information Revealed Subtly ONLY in Focused State */}
                    {isFocused && (
                      <div className={styles.focusedHeroOverlay}>
                        <div className={styles.heroInfoBlock}>
                          <span className={styles.heroCallsign}>{m.callsign} &bull; {m.year}</span>
                          <h3 className={styles.heroName}>{m.name}</h3>
                          <p className={styles.heroRole}>{m.role}</p>
                        </div>

                        <button
                          type="button"
                          className={styles.openDossierBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDrawerMember(m);
                          }}
                          title={`Open full technical dossier for ${m.name}`}
                        >
                          <Info size={12} />
                          <span>VIEW DOSSIER</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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
