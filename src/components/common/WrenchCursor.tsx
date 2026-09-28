"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WrenchCursor.module.css";

export default function WrenchCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrenchRef = useRef<HTMLDivElement>(null);
  const clickRingRef = useRef<HTMLDivElement>(null);
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

    // Physics & movement tracking
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let prevTargetX = -100;
    let currentAngle = 0;
    let isMouseDown = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let currentState: "default" | "button" | "card" | "drag" = "default";
    let isVisible = false;

    // Trail history (3 positions)
    const trailPositions = [
      { x: -100, y: -100 },
      { x: -100, y: -100 },
      { x: -100, y: -100 },
    ];

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (containerRef.current) {
          containerRef.current.dataset.visible = "true";
        }
      }

      // Detect drag threshold (movement > 4px while mouse down)
      if (isMouseDown && !isDragging) {
        if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) > 4) {
          isDragging = true;
        }
      }

      // Check interactive elements under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const isButton =
          !!target.closest(
            'button, a, [role="button"], input[type="submit"], input[type="button"], select, .btn, [class*="registerBtn"], [data-cursor="button"]'
          ) || window.getComputedStyle(target).cursor === "pointer";

        const isCard =
          !isButton &&
          !!target.closest(
            '[data-cursor="card"], [class*="card"], [class*="Card"], article, .glass-card, [class*="orbitCard"], [class*="teamMember"]'
          );

        const isDragEl =
          isMouseDown &&
          (isDragging ||
            !!target.closest('[data-cursor="drag"], [class*="orbit"], [class*="draggable"]') ||
            window.getComputedStyle(target).cursor === "grab" ||
            window.getComputedStyle(target).cursor === "grabbing");

        const newState = isDragEl ? "drag" : isButton ? "button" : isCard ? "card" : "default";

        if (newState !== currentState) {
          currentState = newState;
          if (containerRef.current) {
            containerRef.current.dataset.state = currentState;
          }
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;

      // Trigger click compression and mechanical shockwave pulse
      if (clickRingRef.current) {
        clickRingRef.current.classList.remove(styles.clickRingActive);
        // Force reflow
        void clickRingRef.current.offsetWidth;
        clickRingRef.current.classList.add(styles.clickRingActive);
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
      isDragging = false;
      if (currentState === "drag") {
        currentState = "default";
        if (containerRef.current) {
          containerRef.current.dataset.state = "default";
        }
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (containerRef.current) {
        containerRef.current.dataset.visible = "false";
      }
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (containerRef.current) {
        containerRef.current.dataset.visible = "true";
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave, { passive: true });
    document.documentElement.addEventListener("mouseenter", onMouseEnter, { passive: true });

    // High performance physics loop
    const tick = () => {
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

        // Subtle horizontal directional tilt (clamped to ±12deg)
        const vx = targetX - prevTargetX;
        prevTargetX = targetX;

        // In dragging mode, wrench rotates slightly more to communicate grip
        const targetAngle = isDragging
          ? 18
          : currentState === "button"
          ? 0 // Settle cleanly on buttons
          : Math.max(-12, Math.min(12, vx * 0.85));

        currentAngle += (targetAngle - currentAngle) * 0.22;

        // Trail updates
        trailPositions[2] = { ...trailPositions[1] };
        trailPositions[1] = { ...trailPositions[0] };
        trailPositions[0] = { x: currentX, y: currentY };

        const speed = Math.abs(vx);
        trailDotsRef.current.forEach((dot, idx) => {
          if (!dot) return;
          const pos = trailPositions[idx];
          dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
          dot.style.opacity = speed > 4 ? String((0.35 / (idx + 1)).toFixed(2)) : "0";
        });
      }

      // Scale calculation based on interactive state
      let scale = 1;
      if (isMouseDown) {
        scale = 0.85; // Physical press compression
      } else if (currentState === "button") {
        scale = 1.15; // Button hover scale
      } else if (currentState === "card") {
        scale = 1.10; // Card hover scale
      } else if (currentState === "drag") {
        scale = 1.05; // Dragging scale
      }

      // Render transform on container and wrench assembly
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      if (wrenchRef.current) {
        wrenchRef.current.style.transform = `rotate(${currentAngle.toFixed(2)}deg) scale(${scale})`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      reducedMotion.removeEventListener("change", onMotionChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Ghost trail dots */}
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

      {/* Primary Custom Wrench Cursor */}
      <div
        ref={containerRef}
        className={styles.cursorContainer}
        data-state="default"
        data-visible="false"
        aria-hidden="true"
      >
        {/* Subtle Mechanical Targeting Reticle */}
        <div className={styles.targetingRing}>
          <div className={styles.tickTop} />
          <div className={styles.tickBottom} />
          <div className={styles.tickLeft} />
          <div className={styles.tickRight} />
        </div>

        {/* Click Shockwave Feedback Ring */}
        <div ref={clickRingRef} className={styles.clickRing} />

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
