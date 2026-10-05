"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { teamMembers, teamDivisions, TeamMember } from "@/data/team";
import styles from "./ExploreUniverse.module.css";
import { Move, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ExploreUniverseProps {
  isEmbedded?: boolean;
  onSelectMember?: (m: TeamMember) => void;
  targetDivisionId?: string;
}

export default function ExploreUniverse({
  isEmbedded = false,
  onSelectMember,
  targetDivisionId,
}: ExploreUniverseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panRef = useRef({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  const zoomRef = useRef(0.85);
  const [zoom, setZoom] = useState(0.85);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const hasMovedRef = useRef(false);

  // Board dimensions
  const UNIVERSE_WIDTH = 2600;
  const UNIVERSE_HEIGHT = 2000;

  // Pan to arbitrary board coordinates with optional zoom
  const panToCoords = useCallback((targetX: number, targetY: number, newZoom = zoomRef.current) => {
    if (!containerRef.current) return;
    const vpW = containerRef.current.clientWidth || window.innerWidth;
    const vpH = containerRef.current.clientHeight || window.innerHeight;

    // Desired screen center position for target (with transformOrigin: 0 0)
    const destX = vpW / 2 - targetX * newZoom;
    const destY = vpH / 2 - targetY * newZoom;

    const startX = panRef.current.x;
    const startY = panRef.current.y;
    const startTime = performance.now();
    const duration = 420;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);

      const curX = startX + (destX - startX) * ease;
      const curY = startY + (destY - startY) * ease;

      panRef.current = { x: curX, y: curY };
      setPan({ x: curX, y: curY });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Initial mount: Center on the full council constellation overview
  useEffect(() => {
    if (!containerRef.current) return;
    const vpW = containerRef.current.clientWidth || window.innerWidth;
    const vpH = containerRef.current.clientHeight || window.innerHeight;

    const initialZoom = vpW < 768 ? 0.52 : vpW < 1200 ? 0.72 : 0.85;
    zoomRef.current = initialZoom;
    setZoom(initialZoom);

    // Council constellation center is (1400, 1050)
    const initX = vpW / 2 - 1400 * initialZoom;
    const initY = vpH / 2 - 1050 * initialZoom;

    panRef.current = { x: initX, y: initY };
    setPan({ x: initX, y: initY });
  }, []);

  // Respond to targetDivisionId change without creating infinite loops
  const prevDivRef = useRef<string | null>(null);
  useEffect(() => {
    if (!targetDivisionId) return;
    if (prevDivRef.current === null) {
      prevDivRef.current = targetDivisionId;
      return;
    }
    if (prevDivRef.current === targetDivisionId) return;
    prevDivRef.current = targetDivisionId;

    const div = teamDivisions.find((d) => d.id === targetDivisionId);
    if (div && div.centerCoords) {
      panToCoords(div.centerCoords.x, div.centerCoords.y, Math.max(zoomRef.current, 0.95));
    }
  }, [targetDivisionId, panToCoords]);

  // Non-passive wheel listener for smooth zoom in/out with scroll wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const prevZ = zoomRef.current;
      const newZ = Math.min(Math.max(prevZ * zoomFactor, 0.4), 2.2);

      if (newZ === prevZ) return;

      // Keep coordinate under mouse cursor stable
      const curPan = panRef.current;
      const newPanX = mouseX - (mouseX - curPan.x) * (newZ / prevZ);
      const newPanY = mouseY - (mouseY - curPan.y) * (newZ / prevZ);

      panRef.current = { x: newPanX, y: newPanY };
      zoomRef.current = newZ;
      setPan({ x: newPanX, y: newPanY });
      setZoom(newZ);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMovedRef.current = true;
    }

    const newX = dragStartRef.current.panX + dx;
    const newY = dragStartRef.current.panY + dy;
    panRef.current = { x: newX, y: newY };
    setPan({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile
  const touchState = useRef<{ x: number; y: number; panX: number; panY: number; dist?: number }>({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      setIsDragging(true);
      hasMovedRef.current = false;
      touchState.current = {
        x: t.clientX,
        y: t.clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchState.current.dist = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const t = e.touches[0];
      const dx = t.clientX - touchState.current.x;
      const dy = t.clientY - touchState.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMovedRef.current = true;
      const newX = touchState.current.panX + dx;
      const newY = touchState.current.panY + dy;
      panRef.current = { x: newX, y: newY };
      setPan({ x: newX, y: newY });
    } else if (e.touches.length === 2 && touchState.current.dist) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const scale = newDist / touchState.current.dist;
      const newZ = Math.min(Math.max(zoomRef.current * scale, 0.4), 2.2);
      zoomRef.current = newZ;
      setZoom(newZ);
      touchState.current.dist = newDist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchState.current.dist = undefined;
  };

  const handleTokenClick = (m: TeamMember) => {
    if (hasMovedRef.current) return;
    if (onSelectMember) {
      onSelectMember(m);
    }
  };

  const zoomIn = () => {
    const newZ = Math.min(zoomRef.current * 1.25, 2.2);
    zoomRef.current = newZ;
    setZoom(newZ);
  };

  const zoomOut = () => {
    const newZ = Math.max(zoomRef.current / 1.25, 0.4);
    zoomRef.current = newZ;
    setZoom(newZ);
  };

  const recenter = () => {
    panToCoords(1400, 1050, 0.85);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isEmbedded ? styles.embedded : ""}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Interactive Explore Board. Drag to pan, scroll to zoom."
    >
      {/* Top Floating HUD: Controls & Instructions */}
      <div className={styles.topHud}>
        <div className={styles.hudBadge}>
          <Move size={12} />
          <span>DRAG TO PAN &bull; SCROLL TO ZOOM</span>
        </div>

        {/* Zoom Controls */}
        <div className={styles.zoomControls}>
          <button 
            type="button" 
            onClick={zoomOut} 
            className={styles.zoomBtn} 
            aria-label="Zoom Out"
            title="Zoom Out (or scroll wheel)"
          >
            <ZoomOut size={13} />
          </button>

          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>

          <button 
            type="button" 
            onClick={zoomIn} 
            className={styles.zoomBtn} 
            aria-label="Zoom In"
            title="Zoom In (or scroll wheel)"
          >
            <ZoomIn size={13} />
          </button>

          <button 
            type="button" 
            onClick={recenter} 
            className={styles.recenterBtn} 
            aria-label="Recenter Board"
            title="Recenter Constellation"
          >
            <RotateCcw size={12} />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Infinite Draggable & Zoomable Canvas Board */}
      <div
        className={styles.universeBoard}
        style={{
          width: `${UNIVERSE_WIDTH}px`,
          height: `${UNIVERSE_HEIGHT}px`,
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Subtle Architectural Grid */}
        <div className={styles.gridOverlay} aria-hidden="true" />

        {/* Floating Division Group Labels on Board Floor */}
        {teamDivisions.map((div) => (
          <div
            key={div.id}
            className={styles.divisionAnchor}
            style={{
              left: `${div.centerCoords.x}px`,
              top: `${div.centerCoords.y - 120}px`,
            }}
          >
            <span className={styles.divisionCode}>{div.code}</span>
            <h3 className={styles.divisionTitle}>{div.name}</h3>
          </div>
        ))}

        {/* Circular Member Photo Tokens interactive design */}
        {teamMembers.map((m) => {
          return (
            <div
              key={m.id}
              className={styles.memberAvatarDisc}
              style={{
                left: `${m.exploreCoords.x}px`,
                top: `${m.exploreCoords.y}px`,
              }}
              onClick={() => handleTokenClick(m)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTokenClick(m);
                }
              }}
              aria-label={`Inspect ${m.name}, ${m.role}`}
            >
              <div className={styles.photoCore}>
                {m.image ? (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="120px"
                    className={styles.photoImg}
                    priority={false}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                ) : (
                  <div className={styles.photoFallback}>
                    <span>{m.avatar}</span>
                  </div>
                )}
              </div>

              {/* Hover Pop-Up Tooltip Info */}
              <div className={styles.avatarTooltip} aria-hidden="true">
                <span className={styles.tooltipName}>{m.name}</span>
                <span className={styles.tooltipRole}>{m.role}</span>
                <span className={styles.tooltipId}>{m.year}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
