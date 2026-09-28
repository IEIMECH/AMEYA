"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WrenchCursor.module.css";

export default function WrenchCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrenchRef = useRef<HTMLDivElement>(null);
  const trailDotsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Only render on devices with a mouse/fine pointer and hover support
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if desktop pointer with hover
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches) {
      return;
    }

    setIsSupported(true);

    let isReduced = reducedMotion.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      isReduced = e.matches;
    };
    reducedMotion.addEventListener("change", onMotionChange);

    // Coordinates & velocity
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let prevTargetX = -100;
    let currentAngle = 0;

    // Interaction & drag states
    let isPointerDown = false;
    let isDragging = false;
    let isTightened = false;
    let tightenProgress = 0; // 0.0 to 1.0
    let releaseStartTime = 0;
    const RELEASE_DURATION = 240; // 240ms mechanical release

    let dragStartX = 0;
    let dragStartY = 0;
    let currentState: "default" | "button" | "card" | "link" | "drag" = "default";
    let isVisible = false;

    // Trail history (3 positions)
    const trailPositions = [
      { x: -100, y: -100 },
      { x: -100, y: -100 },
      { x: -100, y: -100 },
    ];

    let animationFrameId: number;

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (containerRef.current) {
          containerRef.current.dataset.visible = "true";
        }
      }

      // Detect drag threshold (movement > 4px while pointer down)
      if (isPointerDown && !isDragging) {
        if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) > 4) {
          isDragging = true;
          isTightened = true; // Dragging is always firmly tightened grip
        }
      }

      // Check interactive elements under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const isButton = !!target.closest(
          'button, [role="button"], input[type="submit"], input[type="button"], select, .btn, [class*="registerBtn"], [class*="filterBtn"], [data-cursor="button"]'
        );

        const isLink =
          !isButton &&
          (!!target.closest('a, [class*="navItem"], [class*="mobileLink"], [data-cursor="link"]') ||
            window.getComputedStyle(target).cursor === "pointer");

        const isCard =
          !isButton &&
          !isLink &&
          !!target.closest(
            '[data-cursor="card"], [class*="card"], [class*="Card"], article, .glass-card, [class*="orbitCard"], [class*="teamMember"], [class*="portrait"]'
          );

        const isDragEl =
          isPointerDown &&
          (isDragging ||
            !!target.closest('[data-cursor="drag"], [class*="orbit"], [class*="draggable"]') ||
            window.getComputedStyle(target).cursor === "grab" ||
            window.getComputedStyle(target).cursor === "grabbing");

        const newState = isDragEl
          ? "drag"
          : isButton
          ? "button"
          : isCard
          ? "card"
          : isLink
          ? "link"
          : "default";

        if (newState !== currentState) {
          currentState = newState;
          if (containerRef.current) {
            containerRef.current.dataset.state = currentState;
          }
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      releaseStartTime = 0; // Cancel any ongoing release recoil

      // Check if click target is interactive
      const target = e.target as HTMLElement | null;
      const isInteractive =
        target &&
        (!!target.closest(
          'button, a, [role="button"], input, select, textarea, [class*="btn"], [class*="Btn"], [class*="card"], [class*="Card"], [class*="orbit"], [class*="team"], [class*="portrait"], [class*="navItem"], [class*="filterBtn"], [data-cursor], label'
        ) ||
          window.getComputedStyle(target).cursor === "pointer" ||
          window.getComputedStyle(target).cursor === "grab");

      if (isInteractive) {
        // Enters continuous physical fastener tightening/grip state
        isTightened = true;
      }
    };

    const onPointerUp = () => {
      if (isTightened) {
        // Trigger mechanical torque release recoil animation
        releaseStartTime = performance.now();
      }
      isPointerDown = false;
      isDragging = false;
      isTightened = false;
      if (currentState === "drag") {
        currentState = "default";
        if (containerRef.current) {
          containerRef.current.dataset.state = "default";
        }
      }
    };

    const onPointerLeave = () => {
      isVisible = false;
      if (containerRef.current) {
        containerRef.current.dataset.visible = "false";
      }
    };

    const onPointerEnter = () => {
      isVisible = true;
      if (containerRef.current) {
        containerRef.current.dataset.visible = "true";
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.documentElement.addEventListener("pointerenter", onPointerEnter, { passive: true });

    // High performance physics loop
    const tick = (now: number) => {
      if (isReduced) {
        // Reduced motion: snap directly with 0 rotation or inertia
        currentX = targetX;
        currentY = targetY;
        currentAngle = 0;
      } else {
        // Physical lerp: ~35-50ms settling time for snappy precision
        const lerp = 0.38;
        currentX += (targetX - currentX) * lerp;
        currentY += (targetY - currentY) * lerp;

        // Subtle horizontal directional tilt (clamped to ±10deg)
        const vx = targetX - prevTargetX;
        prevTargetX = targetX;

        const targetTilt = Math.max(-10, Math.min(10, vx * 0.8));
        currentAngle += (targetTilt - currentAngle) * 0.2;

        // Trail micro-dot updates (subtle kinetic feedback)
        trailPositions[2] = { ...trailPositions[1] };
        trailPositions[1] = { ...trailPositions[0] };
        trailPositions[0] = { x: currentX, y: currentY };

        const speed = Math.abs(vx);
        trailDotsRef.current.forEach((dot, idx) => {
          if (!dot) return;
          const pos = trailPositions[idx];
          dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
          dot.style.opacity = speed > 4 ? String((0.30 / (idx + 1)).toFixed(2)) : "0";
        });
      }

      // Calculate interactive hover engagement (restrained, 1.04-1.08x)
      let hoverScale = 1;
      let hoverTilt = 0;

      if (currentState === "button") {
        hoverScale = 1.08;
        hoverTilt = -4; // Subtle engagement tilt toward target fastener
      } else if (currentState === "card") {
        hoverScale = 1.06;
        hoverTilt = -3;
      } else if (currentState === "link") {
        hoverScale = 1.04;
        hoverTilt = -2;
      } else if (currentState === "drag") {
        hoverScale = 1.06;
      }

      // Physical tightening / hold / release mechanics
      let torqueAngle = 0;
      let torqueScale = 1;

      if (!isReduced) {
        if (isTightened) {
          // Attack: fast mechanical bite to +26 deg in ~60ms
          tightenProgress = Math.min(1, tightenProgress + 0.24);
          const ease = 1 - Math.pow(1 - tightenProgress, 3);
          torqueAngle = ease * 26; // Rotates clockwise ~26 deg
          torqueScale = 1 - ease * 0.06; // Compresses to ~0.94x

          // During drag, add subtle responsive drag flex (+-6 deg based on movement direction)
          if (isDragging) {
            const vx = targetX - prevTargetX;
            const dragFlex = Math.max(-6, Math.min(6, vx * 0.35));
            torqueAngle += dragFlex;
          }
        } else if (releaseStartTime > 0) {
          tightenProgress = 0;
          const elapsed = now - releaseStartTime;

          if (elapsed < 90) {
            // Phase 1 (0-90ms): Torque released, recoils back past neutral to -10 deg
            const p = elapsed / 90;
            const ease = 1 - Math.pow(1 - p, 2);
            torqueAngle = 26 - ease * 36; // 26 -> -10 deg
            torqueScale = 0.94 + ease * 0.06; // 0.94 -> 1.0
          } else if (elapsed < RELEASE_DURATION) {
            // Phase 2 (90-240ms): Smooth mechanical settle from -10 deg back to 0 deg
            const p = (elapsed - 90) / 150;
            const ease = Math.sin((p * Math.PI) / 2);
            torqueAngle = -10 * (1 - ease); // -10 -> 0 deg
            torqueScale = 1.0;
          } else {
            releaseStartTime = 0;
            torqueAngle = 0;
            torqueScale = 1.0;
          }
        } else {
          tightenProgress = 0;
        }
      }

      // Total composed angle & scale
      const totalAngle = isReduced
        ? 0
        : isTightened
        ? torqueAngle
        : currentAngle + torqueAngle + hoverTilt;

      const totalScale = hoverScale * torqueScale;

      // Render hardware-accelerated transforms
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      if (wrenchRef.current) {
        wrenchRef.current.style.transform = `rotate(${totalAngle.toFixed(2)}deg) scale(${totalScale.toFixed(3)})`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.removeEventListener("pointerenter", onPointerEnter);
      reducedMotion.removeEventListener("change", onMotionChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Subtle ghost trail micro-dots */}
      <div
        ref={(el) => {
          trailDotsRef.current[0] = el;
        }}
        className={styles.trailDot}
        aria-hidden="true"
      />
      <div
        ref={(el) => {
          trailDotsRef.current[1] = el;
        }}
        className={styles.trailDot}
        aria-hidden="true"
      />
      <div
        ref={(el) => {
          trailDotsRef.current[2] = el;
        }}
        className={styles.trailDot}
        aria-hidden="true"
      />

      {/* Primary Custom Wrench Cursor (Clean Mechanical Tool, No Targeting Reticle/HUD) */}
      <div
        ref={containerRef}
        className={styles.cursorContainer}
        data-state="default"
        data-visible="false"
        aria-hidden="true"
      >
        {/* High-Precision Wrench Assembly */}
        <div ref={wrenchRef} className={styles.wrenchAssembly}>
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Brushed Dark Titanium / Machined Steel */}
              <linearGradient id="cursorWrenchSteel" x1="2" y1="2" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#9aa0ab" />
                <stop offset="25%" stopColor="#676d78" />
                <stop offset="55%" stopColor="#41454e" />
                <stop offset="85%" stopColor="#2a2d33" />
                <stop offset="100%" stopColor="#1a1b1f" />
              </linearGradient>
              {/* Top Edge Machined Highlight */}
              <linearGradient id="cursorEdgeHighlight" x1="0" y1="0" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#b8bec9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#111215" stopOpacity="0.85" />
              </linearGradient>
              {/* Recessed I-Beam Slot */}
              <linearGradient id="cursorBeamSlot" x1="8" y1="8" x2="18" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#141518" />
                <stop offset="100%" stopColor="#26282d" />
              </linearGradient>
            </defs>

            {/* Ambient Shadow for crisp separation across all backgrounds */}
            <path
              d="M 5.5 1.5 C 6.0 0.8 7.0 1.0 7.7 1.7 L 9.8 3.8 C 10.7 4.7 11.1 6.1 10.6 7.4 L 11.2 8.0 L 18.6 15.4 C 19.3 14.9 20.2 14.8 21.0 15.1 C 22.5 15.7 23.5 17.1 23.6 18.7 C 23.7 20.3 22.8 21.8 21.4 22.5 C 19.9 23.1 18.1 22.7 17.1 21.5 C 16.5 20.7 16.4 19.8 16.8 19.0 L 9.4 11.6 L 8.8 12.2 C 7.5 12.7 6.1 12.3 5.2 11.4 L 3.1 9.3 C 2.4 8.6 2.2 7.6 2.9 7.1 L 4.8 7.9 C 5.6 8.2 6.5 7.9 7.0 7.2 C 7.5 6.5 7.4 5.6 6.8 5.0 L 4.7 2.9 C 4.2 2.4 4.5 1.7 5.5 1.5 Z"
              fill="rgba(0,0,0,0.6)"
              transform="translate(0.8, 0.8)"
            />

            {/* Main Machined Wrench Body */}
            <path
              d="M 5.5 1.5 C 6.0 0.8 7.0 1.0 7.7 1.7 L 9.8 3.8 C 10.7 4.7 11.1 6.1 10.6 7.4 L 11.2 8.0 L 18.6 15.4 C 19.3 14.9 20.2 14.8 21.0 15.1 C 22.5 15.7 23.5 17.1 23.6 18.7 C 23.7 20.3 22.8 21.8 21.4 22.5 C 19.9 23.1 18.1 22.7 17.1 21.5 C 16.5 20.7 16.4 19.8 16.8 19.0 L 9.4 11.6 L 8.8 12.2 C 7.5 12.7 6.1 12.3 5.2 11.4 L 3.1 9.3 C 2.4 8.6 2.2 7.6 2.9 7.1 L 4.8 7.9 C 5.6 8.2 6.5 7.9 7.0 7.2 C 7.5 6.5 7.4 5.6 6.8 5.0 L 4.7 2.9 C 4.2 2.4 4.5 1.7 5.5 1.5 Z"
              fill="url(#cursorWrenchSteel)"
              stroke="url(#cursorEdgeHighlight)"
              strokeWidth="0.65"
              strokeLinejoin="round"
            />

            {/* Shank I-Beam Center Web */}
            <line x1="11.5" y1="10.5" x2="16.5" y2="15.5" stroke="url(#cursorBeamSlot)" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="11.5" y1="10.5" x2="16.5" y2="15.5" stroke="rgba(255,255,255,0.12)" strokeWidth="0.35" strokeLinecap="round" />

            {/* Tail Closed Ring Opening */}
            <circle cx="20.2" cy="20.2" r="1.5" fill="#0b0c0e" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />

            {/* AMEYA Precision Red Indicator Dot */}
            <circle className={styles.redIndicator} cx="7.4" cy="7.4" r="1.1" fill="#e51d25" />
            <circle className={styles.redIndicator} cx="7.4" cy="7.4" r="0.55" fill="#ff4d4d" />
          </svg>
        </div>
      </div>
    </>
  );
}
