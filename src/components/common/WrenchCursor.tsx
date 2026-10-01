"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./WrenchCursor.module.css";

export default function WrenchCursor() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const containerRef = useRef<HTMLDivElement>(null);
  const wrenchRef = useRef<HTMLDivElement>(null);

  // Only render on devices with a mouse/fine pointer and hover support
  const [isSupported, setIsSupported] = useState(false);

  // Handle custom cursor html class (disabled on admin)
  useEffect(() => {
    if (isAdmin) {
      document.documentElement.classList.remove("custom-cursor-active");
      return;
    }

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (finePointer.matches) {
      document.documentElement.classList.add("custom-cursor-active");
    }

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;

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

    // 1:1 Instant Coordinates (Zero positional lag)
    let pointerX = -100;
    let pointerY = -100;
    let prevPointerX = -100;
    let currentAngle = 0;
    let currentScale = 1;

    // Interaction & drag states
    let isPointerDown = false;
    let isDragging = false;
    let isTightened = false;
    let tightenProgress = 0; // 0.0 to 1.0
    let releaseStartTime = 0;
    const RELEASE_DURATION = 220; // 220ms mechanical release

    let dragStartX = 0;
    let dragStartY = 0;
    let currentState: "default" | "button" | "card" | "link" | "drag" = "default";
    let isVisible = false;

    let animationFrameId: number;

    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (containerRef.current) {
          containerRef.current.dataset.visible = "true";
        }
      }

      // Detect interactive targets with fast element lookup
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest(
          "button, a, input, select, textarea, [role='button'], [data-cursor='button'], .cursor-target-button"
        );
        const isCard = target.closest(
          "[data-cursor='card'], .event-card, .pillar-card, article"
        );
        const isDraggable = target.closest(
          "[data-cursor='drag'], canvas, .drag-handle"
        );

        let nextState: "default" | "button" | "card" | "link" | "drag" = "default";
        if (isDraggable) {
          nextState = "drag";
        } else if (isClickable) {
          nextState = "button";
        } else if (isCard) {
          nextState = "card";
        }

        if (nextState !== currentState) {
          currentState = nextState;
          if (containerRef.current) {
            containerRef.current.dataset.state = currentState;
          }
        }
      }

      // Check drag distance threshold
      if (isPointerDown && !isDragging) {
        const dx = pointerX - dragStartX;
        const dy = pointerY - dragStartY;
        if (dx * dx + dy * dy > 16) {
          isDragging = true;
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return; // Only primary button
      isPointerDown = true;
      isTightened = true;
      tightenProgress = 0;
      releaseStartTime = 0;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      isDragging = false;
    };

    const onPointerUp = () => {
      if (isPointerDown) {
        isPointerDown = false;
        isTightened = false;
        isDragging = false;
        releaseStartTime = performance.now();
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

    // Real-time animation frame loop
    const tick = (now: number) => {
      // 1:1 Instant Position - Zero trailing, zero momentum lag
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      }

      // Calculate subtle rotational velocity tilt
      const vx = pointerX - prevPointerX;
      prevPointerX = pointerX;

      if (isReduced) {
        currentAngle = 0;
        currentScale = 1;
      } else {
        // Subtle tilt based on movement direction (clamped to ±9deg)
        const targetTilt = Math.max(-9, Math.min(9, vx * 0.7));
        currentAngle += (targetTilt - currentAngle) * 0.28;
      }

      // Fast hover scale target (snappy 100-150ms response)
      let targetHoverScale = 1;
      let hoverTilt = 0;

      if (currentState === "button") {
        targetHoverScale = 1.08;
        hoverTilt = -4; // Subtle engagement tilt toward target fastener
      } else if (currentState === "card") {
        targetHoverScale = 1.06;
        hoverTilt = -3;
      } else if (currentState === "link") {
        targetHoverScale = 1.04;
        hoverTilt = -2;
      } else if (currentState === "drag") {
        targetHoverScale = 1.06;
      }

      currentScale += (targetHoverScale - currentScale) * 0.32;

      // Physical tightening torque (only on pointer down)
      let torqueAngle = 0;
      let torqueScale = 1;

      if (!isReduced) {
        if (isTightened) {
          // Attack: fast mechanical bite to +26 deg in ~50ms
          tightenProgress = Math.min(1, tightenProgress + 0.28);
          const ease = 1 - Math.pow(1 - tightenProgress, 3);
          torqueAngle = ease * 26; // Rotates clockwise +26 deg
          torqueScale = 1 - ease * 0.06; // Compresses to 0.94x

          // During drag, add subtle responsive drag flex (+-6 deg based on movement direction)
          if (isDragging) {
            const dragFlex = Math.max(-6, Math.min(6, vx * 0.35));
            torqueAngle += dragFlex;
          }
        } else if (releaseStartTime > 0) {
          tightenProgress = 0;
          const elapsed = now - releaseStartTime;

          if (elapsed < 85) {
            // Phase 1 (0-85ms): Torque released, recoils back past neutral to -10 deg
            const p = elapsed / 85;
            const ease = 1 - Math.pow(1 - p, 2);
            torqueAngle = 26 - ease * 36; // 26 -> -10 deg
            torqueScale = 0.94 + ease * 0.06; // 0.94 -> 1.0
          } else if (elapsed < RELEASE_DURATION) {
            // Phase 2 (85-220ms): Smooth mechanical settle from -10 deg back to 0 deg
            const p = (elapsed - 85) / 135;
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

      // Total composed angle & scale for wrench tool
      const totalAngle = isReduced
        ? 0
        : isTightened
        ? torqueAngle
        : currentAngle + torqueAngle + hoverTilt;

      const totalScale = currentScale * torqueScale;

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
  }, [isAdmin]);

  if (isAdmin || !isSupported) {
    return null;
  }

  return (
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
  );
}
