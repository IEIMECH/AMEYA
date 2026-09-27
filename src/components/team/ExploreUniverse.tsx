"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { teamMembers, teamDivisions, TeamMember, TeamDivision } from "@/data/team";
import MemberInfoDrawer from "./MemberInfoDrawer";
import styles from "./ExploreUniverse.module.css";
import { List, Crosshair, Move, Radio, Sparkles } from "lucide-react";

export default function ExploreUniverse({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: -600, y: -150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeDivisionIndex, setActiveDivisionIndex] = useState(0);

  // Parallax offsets for tokens
  const [hoveredTokenId, setHoveredTokenId] = useState<string | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Universe boundaries
  const UNIVERSE_WIDTH = 2800;
  const UNIVERSE_HEIGHT = 2000;

  // Clamp pan so universe remains visible
  const clampPan = useCallback((x: number, y: number) => {
    if (!containerRef.current) return { x, y };
    const vpW = containerRef.current.clientWidth;
    const vpH = containerRef.current.clientHeight;

    const minX = Math.min(0, -(UNIVERSE_WIDTH - vpW));
    const maxX = 0;
    const minY = Math.min(0, -(UNIVERSE_HEIGHT - vpH));
    const maxY = 0;

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  }, []);

  // Center on Executive Directorate on initial mount
  useEffect(() => {
    if (!containerRef.current) return;
    const vpW = containerRef.current.clientWidth;
    const vpH = containerRef.current.clientHeight;
    const initialX = -(1400 - vpW / 2);
    const initialY = -(460 - vpH / 2);
    setPan(clampPan(initialX, initialY));
  }, [clampPan]);

  // Smooth pan to cluster coordinates
  const panToCluster = (coords: { x: number; y: number }, divisionIdx: number) => {
    if (!containerRef.current) return;
    const vpW = containerRef.current.clientWidth;
    const vpH = containerRef.current.clientHeight;

    const targetX = -(coords.x - vpW / 2);
    const targetY = -(coords.y - vpH / 2);
    const clamped = clampPan(targetX, targetY);

    setActiveDivisionIndex(divisionIdx);

    // Smooth animation loop
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
        x: startX + (clamped.x - startX) * ease,
        y: startY + (clamped.y - startY) * ease,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // If clicking an interactive button or member token directly, don't hijack unless dragged
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

    setPan(clampPan(dragStart.panX + dx, dragStart.panY + dy));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: touch.clientX,
      y: touch.clientY,
      panX: pan.x,
      panY: pan.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.x;
    const dy = touch.clientY - dragStart.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      setHasMoved(true);
    }

    setPan(clampPan(dragStart.panX + dx, dragStart.panY + dy));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 2.5D Parallax calculation on member token hover
  const handleTokenMouseMove = (e: React.MouseEvent<HTMLDivElement>, memberId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    setHoveredTokenId(memberId);
    setParallaxOffset({ x: normX, y: normY });
  };

  const handleTokenMouseLeave = () => {
    setHoveredTokenId(null);
    setParallaxOffset({ x: 0, y: 0 });
  };

  const handleTokenClick = (m: TeamMember) => {
    if (hasMoved) return; // Prevent click trigger when dragging universe
    setSelectedMember(m);
  };

  return (
    <div 
      className={`${styles.container} ${isEmbedded ? styles.embedded : ""}`} 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top & Bottom Ambient Nav Masks */}
      <div className={styles.navMaskTop} aria-hidden="true" />
      <div className={styles.navMaskBottom} aria-hidden="true" />

      {/* Top HUD Telemetry Banner */}
      <div className={styles.topHud}>
        <div className={styles.hudCoordinates}>
          <Radio size={12} className={styles.hudBeacon} />
          <span>EXPLORE CADRE // SECTOR PAN: [{Math.round(-pan.x)}, {Math.round(-pan.y)}]</span>
        </div>

        <div className={styles.hudInstruction}>
          <Move size={12} />
          <span>DRAG UNIVERSE // CLICK AGENT FOR SPEC</span>
        </div>

        <button 
          type="button" 
          onClick={() => panToCluster({ x: 1400, y: 460 }, 0)} 
          className={styles.recenterBtn}
          aria-label="Recenter Universe"
        >
          <Crosshair size={13} />
          <span>RECENTER</span>
        </button>
      </div>

      {/* Pannable Universe Canvas */}
      <div 
        id="explore-universe" 
        className={styles.universe}
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px)`,
        }}
      >
        {/* Architectural Background Grid & Radar Markers */}
        <div className={styles.gridOverlay} aria-hidden="true" />
        <div className={styles.radarRing1} aria-hidden="true" />
        <div className={styles.radarRing2} aria-hidden="true" />
        <div className={styles.axisH} aria-hidden="true" />
        <div className={styles.axisV} aria-hidden="true" />

        {/* Division Zone Cluster Badges */}
        {teamDivisions.map((div) => (
          <div 
            key={div.id} 
            className={styles.divisionZone}
            style={{
              left: `${div.centerCoords.x}px`,
              top: `${div.centerCoords.y - 120}px`,
            }}
          >
            <div className={styles.zonePill}>{div.code}</div>
            <h3 className={styles.zoneTitle}>{div.name}</h3>
            <p className={styles.zoneDesc}>{div.description}</p>
          </div>
        ))}

        {/* Floating Interactive Member Tokens */}
        {teamMembers.map((m) => {
          const isHovered = hoveredTokenId === m.id;
          const px = isHovered ? parallaxOffset.x : 0;
          const py = isHovered ? parallaxOffset.y : 0;

          return (
            <div
              key={m.id}
              className={styles.memberToken}
              style={{
                left: `${m.exploreCoords.x}px`,
                top: `${m.exploreCoords.y}px`,
              }}
              onMouseMove={(e) => handleTokenMouseMove(e, m.id)}
              onMouseLeave={handleTokenMouseLeave}
              onClick={() => handleTokenClick(m)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedMember(m);
                }
              }}
              aria-label={`${m.name} - ${m.role} - Click to inspect dossier`}
            >
              {/* Token Avatar Disc with 2.5D Parallax */}
              <div className={styles.avatarDisc}>
                {/* Back Layer: Reticle Ring */}
                <div 
                  className={styles.avatarLayerBack}
                  style={{
                    transform: `translate(${px * -5}px, ${py * -5}px) scale(1.1)`,
                  }}
                />

                {/* Core Layer: Carbon Plate with Initials or Photo */}
                <div 
                  className={styles.avatarLayerCore}
                  style={{
                    transform: `translate(${px * 6}px, ${py * 6}px)`,
                  }}
                >
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="96px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span className={styles.tokenInitials}>{m.avatar}</span>
                  )}
                </div>

                {/* Front Layer: Glowing Reticle Hairline */}
                <div 
                  className={styles.avatarLayerFront}
                  style={{
                    transform: `translate(${px * 3}px, ${py * 3}px)`,
                  }}
                />
              </div>

              {/* Tactical Nameplate Tooltip */}
              <div className={styles.tokenNameplate}>
                <div className={styles.tokenCallsign}>[{m.callsign}]</div>
                <div className={styles.tokenName}>{m.name}</div>
                <div className={styles.tokenRole}>{m.role}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating HUD Anchor Dock */}
      <div className={styles.anchorDock}>
        {/* Mode Switch Button */}
        <Link 
          href="/team" 
          className={styles.modeSwitchBtn}
          aria-label="Switch to List Mode"
        >
          <List size={16} />
          <span>LIST MODE</span>
        </Link>

        {/* Division Jump Fast-Links */}
        <div className={styles.divisionLinks}>
          {teamDivisions.map((div) => {
            const isActive = activeDivisionIndex === div.index;
            return (
              <button
                key={div.id}
                type="button"
                className={`${styles.anchorBtn} ${isActive ? styles.activeAnchor : ""}`}
                onClick={() => panToCluster(div.centerCoords, div.index)}
                aria-label={`Jump to ${div.name}`}
              >
                <span className={styles.anchorIndicator} />
                <span className={styles.anchorText}>{div.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide-out Member Info Drawer */}
      <MemberInfoDrawer 
        member={selectedMember} 
        onClose={() => setSelectedMember(null)} 
      />
    </div>
  );
}
