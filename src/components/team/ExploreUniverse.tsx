"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { teamMembers, teamDivisions, TeamMember } from "@/data/team";
import MemberInfoDrawer from "./MemberInfoDrawer";
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
  const [pan, setPan] = useState({ x: -400, y: -100 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Universe dimensions
  const UNIVERSE_WIDTH = 2600;
  const UNIVERSE_HEIGHT = 1900;

  // Center on Executive Directorate on initial mount
  useEffect(() => {
    if (!containerRef.current) return;
    const vpW = containerRef.current.clientWidth;
    const vpH = containerRef.current.clientHeight;
    setPan({
      x: -(1350 - vpW / 2),
      y: -(460 - vpH / 2),
    });
  }, []);

  // Smooth pan to cluster coordinates
  const panToCluster = useCallback((coords: { x: number; y: number }) => {
    if (!containerRef.current) return;
    const vpW = containerRef.current.clientWidth;
    const vpH = containerRef.current.clientHeight;

    const targetX = -(coords.x - vpW / 2);
    const targetY = -(coords.y - vpH / 2);

    const startX = pan.x;
    const startY = pan.y;
    const startTime = performance.now();
    const duration = 400;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setPan({
        x: startX + (targetX - startX) * ease,
        y: startY + (targetY - startY) * ease,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [pan.x, pan.y]);

  // Respond to targetDivisionId change from CommitteeBar
  useEffect(() => {
    if (!targetDivisionId) return;
    const div = teamDivisions.find((d) => d.id === targetDivisionId);
    if (div && div.centerCoords) {
      panToCluster(div.centerCoords);
    }
  }, [targetDivisionId, panToCluster]);

  // Non-passive wheel listener for smooth zoom in/out with scroll wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Smooth exponential zoom step
      const zoomFactor = e.deltaY < 0 ? 1.09 : 0.91;
      setZoom((prevZoom) => {
        const next = prevZoom * zoomFactor;
        return Math.min(Math.max(next, 0.45), 2.2);
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      setHasMoved(true);
    }

    setPan({
      x: dragStart.panX + dx,
      y: dragStart.panY + dy,
    });
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
      setHasMoved(false);
      touchState.current = {
        x: t.clientX,
        y: t.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    } else if (e.touches.length === 2) {
      // Pinch zoom start
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
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) setHasMoved(true);
      setPan({
        x: touchState.current.panX + dx,
        y: touchState.current.panY + dy,
      });
    } else if (e.touches.length === 2 && touchState.current.dist) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const scale = newDist / touchState.current.dist;
      setZoom((z) => Math.min(Math.max(z * scale, 0.45), 2.2));
      touchState.current.dist = newDist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchState.current.dist = undefined;
  };

  const handleTokenClick = (m: TeamMember) => {
    if (hasMoved) return; // Prevent clicking when panning
    if (onSelectMember) {
      onSelectMember(m);
    } else {
      setSelectedMember(m);
    }
  };

  const zoomIn = () => setZoom((z) => Math.min(z * 1.2, 2.2));
  const zoomOut = () => setZoom((z) => Math.max(z / 1.2, 0.45));
  const recenter = () => {
    setZoom(1);
    panToCluster({ x: 1350, y: 460 });
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
      aria-label="Interactive 2.5D Explore Universe board. Drag to pan, scroll mouse wheel to zoom."
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
            title="Recenter Board"
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
          transformOrigin: "center center",
        }}
      >
        {/* Architectural Subtle Grid */}
        <div className={styles.gridOverlay} aria-hidden="true" />

        {/* Floating Division Group Labels on the Board Floor */}
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

        {/* Circular Member Photo Tokens matching SITCON reference */}
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
                    sizes="100px"
                    className={styles.photoImg}
                    priority={false}
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
                <span className={styles.tooltipId}>{m.callsign} &bull; 4th Year</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Internal Slide-out Drawer fallback when not controlled externally */}
      {!onSelectMember && (
        <MemberInfoDrawer
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
