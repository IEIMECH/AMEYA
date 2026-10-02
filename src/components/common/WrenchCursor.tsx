"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./WrenchCursor.module.css";

export default function WrenchCursor() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const containerRef = useRef<HTMLDivElement>(null);
  const wrenchRef = useRef<HTMLDivElement>(null);

  // Only render on desktop devices with a fine mouse pointer and hover support
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

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) {
      return;
    }

    setIsSupported(true);

    let isVisible = false;
    let currentState: "default" | "button" | "card" | "link" | "drag" = "default";
    let isPointerDown = false;

    const isExemptElement = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      return Boolean(
        target.closest(
          "#bus-schedule-viewer, [data-no-custom-cursor='true'], iframe, object, embed"
        )
      );
    };

    // Instant Synchronous Position Update — 0ms Latency Hardware Tracking
    const updatePosition = (x: number, y: number) => {
      if (containerRef.current) {
        // Offset by (4px, 2px) to align the wrench jaw tip directly under the click point
        containerRef.current.style.transform = `translate3d(${x - 4}px, ${y - 2}px, 0)`;
        if (!isVisible) {
          isVisible = true;
          containerRef.current.dataset.visible = "true";
        }
      }
    };

    const updateHoverTransform = (state: string, isDown: boolean) => {
      if (!wrenchRef.current) return;
      if (isDown) {
        wrenchRef.current.style.transform = "rotate(20deg) scale(0.93)";
      } else if (state === "button" || state === "link") {
        wrenchRef.current.style.transform = "scale(1.08) rotate(-3deg)";
      } else if (state === "card") {
        wrenchRef.current.style.transform = "scale(1.05) rotate(-2deg)";
      } else if (state === "drag") {
        wrenchRef.current.style.transform = "scale(1.06)";
      } else {
        wrenchRef.current.style.transform = "none";
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;

      // When hovering embedded PDFs/iframes, hide custom cursor instantly and restore native OS pointer
      if (isExemptElement(target)) {
        if (isVisible) {
          isVisible = false;
          if (containerRef.current) {
            containerRef.current.dataset.visible = "false";
          }
        }
        document.documentElement.classList.add("hide-custom-cursor");
        return;
      } else {
        document.documentElement.classList.remove("hide-custom-cursor");
      }

      // 1:1 Instant Synchronous Transform on pointer event
      updatePosition(e.clientX, e.clientY);

      // Fast interactive target lookup
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
          updateHoverTransform(currentState, isPointerDown);
        }
      }
    };

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (isExemptElement(target)) {
        isVisible = false;
        if (containerRef.current) {
          containerRef.current.dataset.visible = "false";
        }
        document.documentElement.classList.add("hide-custom-cursor");
      }
    };

    const onWindowBlur = () => {
      isVisible = false;
      if (containerRef.current) {
        containerRef.current.dataset.visible = "false";
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isPointerDown = true;
      updateHoverTransform(currentState, true);
    };

    const onPointerUp = () => {
      if (isPointerDown) {
        isPointerDown = false;
        updateHoverTransform(currentState, false);
      }
    };

    const onPointerLeave = () => {
      isVisible = false;
      if (containerRef.current) {
        containerRef.current.dataset.visible = "false";
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("blur", onWindowBlur);
    document.documentElement.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.documentElement.addEventListener("pointerenter", onPointerEnter, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("blur", onWindowBlur);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.removeEventListener("pointerenter", onPointerEnter);
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
