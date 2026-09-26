"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronRight, Settings, Activity } from "lucide-react";

interface SlideToRegisterProps {
  onRegisterClick: () => void;
}

export default function SlideToRegister({ onRegisterClick }: SlideToRegisterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !containerRef.current || !handleRef.current) return;
      const maxOffset = containerRef.current.offsetWidth - handleRef.current.offsetWidth - 8;
      const currentX = e.clientX - startXRef.current;
      const clamped = Math.max(0, Math.min(currentX, maxOffset));
      setOffsetX(clamped);

      if (clamped >= maxOffset * 0.85) {
        setIsDragging(false);
        setOffsetX(0);
        onRegisterClick();
      }
    };

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setOffsetX(0);
      }
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, onRegisterClick]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "320px",
        height: "64px",
        borderRadius: "4px",
        background: "#0c0c0c",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        padding: "4px",
        userSelect: "none",
        cursor: "pointer",
        overflow: "hidden",
        transition: "all 0.25s ease",
      }}
      onClick={onRegisterClick}
      suppressHydrationWarning
    >
      {/* Red Progress Fill Behind Knob */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${offsetX + 56}px`,
          background: "linear-gradient(90deg, rgba(230, 29, 29, 0.12) 0%, rgba(230, 29, 29, 0.35) 100%)",
          borderRight: "1px solid rgba(230, 29, 29, 0.5)",
          pointerEvents: "none",
        }}
      />

      {/* Background Label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "60px",
          gap: "8px",
          color: "#ffffff",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "0.88rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          opacity: Math.max(0, 1 - offsetX / 110),
          pointerEvents: "none",
        }}
      >
        <span>SLIDE TO REGISTER</span>
        <ChevronRight size={16} color="#e61d1d" />
      </div>

      {/* Draggable Crimson Handle */}
      <div
        ref={handleRef}
        onPointerDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          startXRef.current = e.clientX - offsetX;
        }}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "3px",
          background: "linear-gradient(135deg, #e61d1d 0%, #b51212 100%)",
          border: "1px solid rgba(255, 59, 59, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 0 20px rgba(230, 29, 29, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)",
          cursor: "grab",
          zIndex: 2,
        }}
      >
        <Settings size={22} color="#ffffff" style={{ animation: isDragging ? "spin 2s linear infinite" : "none" }} />
      </div>
    </div>
  );
}
