"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { TeamDivision } from "@/data/team";
import styles from "./CommitteeBar.module.css";
import { List } from "lucide-react";

interface CommitteeBarProps {
  divisions: TeamDivision[];
  activeDivisionId: string;
  viewMode: "list" | "explore";
  onToggleMode: () => void;
  onSelectDivision: (divisionId: string) => void;
}

export default function CommitteeBar({
  divisions,
  activeDivisionId,
  viewMode,
  onToggleMode,
  onSelectDivision,
}: CommitteeBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const setBtnRef = useCallback((key: string, el: HTMLButtonElement | null) => {
    if (el) {
      btnRefs.current.set(key, el);
    } else {
      btnRefs.current.delete(key);
    }
  }, []);

  // Update sliding indicator position with scroll offset support
  const updateIndicatorToKey = useCallback((key: string) => {
    const btn = btnRefs.current.get(key);
    const bar = barRef.current;
    if (!btn || !bar) return;

    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const left = btnRect.left - barRect.left + bar.scrollLeft;

    setIndicatorStyle({
      left,
      width: btnRect.width,
      opacity: 1,
    });
  }, []);

  // Sync indicator with active item when not hovered
  useEffect(() => {
    if (hoveredKey) return;

    const target = viewMode === "explore" ? "explore" : activeDivisionId;
    if (target) {
      const timer = setTimeout(() => {
        updateIndicatorToKey(target);
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [viewMode, activeDivisionId, hoveredKey, updateIndicatorToKey]);

  // Recalculate indicator on resize or scroll
  useEffect(() => {
    const handleUpdate = () => {
      const target = hoveredKey || (viewMode === "explore" ? "explore" : activeDivisionId);
      if (target) {
        updateIndicatorToKey(target);
      }
    };

    window.addEventListener("resize", handleUpdate);
    const bar = barRef.current;
    if (bar) {
      bar.addEventListener("scroll", handleUpdate, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", handleUpdate);
      if (bar) bar.removeEventListener("scroll", handleUpdate);
    };
  }, [hoveredKey, viewMode, activeDivisionId, updateIndicatorToKey]);

  // Handle hover enter
  const handleMouseEnter = (key: string) => {
    setHoveredKey(key);
    updateIndicatorToKey(key);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredKey(null);
    const target = viewMode === "explore" ? "explore" : activeDivisionId;
    if (target) {
      updateIndicatorToKey(target);
    }
  };

  const isExploreHighlight = hoveredKey === "explore" || (viewMode === "explore" && !hoveredKey);

  return (
    <nav className={styles.dockWrapper} aria-label="Committees and View Navigation">
      <div 
        ref={barRef} 
        className={styles.dockBar}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dynamic Sliding Glass Highlight Pill */}
        <div
          className={`${styles.slidingPill} ${isExploreHighlight ? styles.slidingPillExplore : ""}`}
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity,
          }}
          aria-hidden="true"
        />

        {/* Mode Toggle Button interactive design */}
        <button
          ref={(el) => setBtnRef("explore", el)}
          type="button"
          className={`${styles.dockBtn} ${styles.exploreBtn} ${viewMode === "explore" ? styles.activeExplore : ""}`}
          onClick={onToggleMode}
          onMouseEnter={() => handleMouseEnter("explore")}
          aria-pressed={viewMode === "explore"}
          title={viewMode === "explore" ? "Switch back to List Mode" : "Switch to Interactive Explore Mode"}
        >
          {viewMode === "explore" ? (
            <>
              {/* List Mode Icon custom design */}
              <List size={14} className={styles.dotGridIcon} />
              <span className={styles.exploreLabel}>List Mode</span>
            </>
          ) : (
            <>
              {/* 3x3 Dot Grid Matrix Icon custom design */}
              <svg
                className={styles.dotGridIcon}
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="3.5" cy="3.5" r="1.5" />
                <circle cx="8" cy="3.5" r="1.5" />
                <circle cx="12.5" cy="3.5" r="1.5" />
                <circle cx="3.5" cy="8" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="12.5" cy="8" r="1.5" />
                <circle cx="3.5" cy="12.5" r="1.5" />
                <circle cx="8" cy="12.5" r="1.5" />
                <circle cx="12.5" cy="12.5" r="1.5" />
              </svg>
              <span className={styles.exploreLabel}>Explore Mode</span>
            </>
          )}
        </button>

        {/* Subtle Glass Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Scrollable Committee Tabs */}
        <div className={styles.committeesTrack}>
          {divisions.map((div) => {
            const isActive = viewMode === "list" && activeDivisionId === div.id;

            return (
              <button
                key={div.id}
                ref={(el) => setBtnRef(div.id, el)}
                type="button"
                className={`${styles.dockBtn} ${styles.committeeBtn} ${isActive ? styles.activeCommittee : ""}`}
                onClick={() => onSelectDivision(div.id)}
                onMouseEnter={() => handleMouseEnter(div.id)}
                aria-current={isActive ? "true" : undefined}
                title={viewMode === "explore" ? `Pan board to ${div.name}` : `Scroll to ${div.name}`}
              >
                <span>{div.name.replace(" Council", "").replace(" Team", "")}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
