"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { teamMembers } from "@/data/team";
import styles from "./InteractiveTeamGallery.module.css";

const DIVISIONS = [
  "ALL",
  "Core Leadership",
  "Technical Advisory",
  "Social Media Council",
  "Design Council",
  "Public Relations Council",
  "Drafting Council",
];

export default function InteractiveTeamGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDivision, setSelectedDivision] = useState("ALL");
  const dragStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter members by division if selected
  const visibleMembers = selectedDivision === "ALL"
    ? teamMembers
    : teamMembers.filter((m) => m.division === selectedDivision);

  // Clamp active index when division filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedDivision]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < visibleMembers.length - 1 ? prev + 1 : 0));
  }, [visibleMembers.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : visibleMembers.length - 1));
  }, [visibleMembers.length]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Mouse wheel horizontal navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 30 || Math.abs(e.deltaY) > 40) {
      if (e.deltaX > 30 || e.deltaY > 40) {
        handleNext();
      } else if (e.deltaX < -30 || e.deltaY < -40) {
        handlePrev();
      }
    }
  };

  // Touch / Pointer Drag
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const deltaX = e.clientX - dragStartX.current;
    dragStartX.current = null;

    if (deltaX < -45) {
      handleNext();
    } else if (deltaX > 45) {
      handlePrev();
    }
  };

  const activeMember = visibleMembers[activeIndex] || visibleMembers[0];
  const CARD_SPACING = 310;

  return (
    <div className={styles.teamPageWrapper}>
      {/* 1. Hero: Clean typography as requested in Item 9 */}
      <header className={styles.heroHeader}>
        <h1 className={styles.heroTitle}>
          THE <span className={styles.heroAccent}>TEAM</span>
        </h1>
        <p className={styles.heroSubtitle}>18 Council Officers</p>
        <p className={styles.heroDepartment}>Department of Mechanical Engineering</p>
      </header>

      {/* Division Quick Filter Pills */}
      <nav className={styles.divisionFilterRail} aria-label="Team divisions filter">
        {DIVISIONS.map((div) => {
          const isActive = selectedDivision === div;
          return (
            <button
              key={div}
              type="button"
              onClick={() => setSelectedDivision(div)}
              className={`${styles.divisionPill} ${isActive ? styles.divisionPillActive : ""}`}
            >
              {div}
            </button>
          );
        })}
      </nav>

      {/* 2. Horizontal Gallery Track with Apple Depth */}
      <div
        ref={containerRef}
        className={styles.galleryViewport}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className={styles.galleryTrack}>
          {visibleMembers.map((member, idx) => {
            const offset = idx - activeIndex;
            const absOffset = Math.abs(offset);

            // Don't render cards that are too far out to preserve performance
            if (absOffset > 3) return null;

            // Center: 100% opacity, scale 1.05
            // Adjacent: 75-85% opacity, scale 0.90
            // Outer: 40-60% opacity, scale 0.78
            let scale = 1.05;
            let opacity = 1;
            let zIndex = 10;

            if (absOffset === 1) {
              scale = 0.90;
              opacity = 0.80;
              zIndex = 8;
            } else if (absOffset === 2) {
              scale = 0.78;
              opacity = 0.45;
              zIndex = 5;
            } else if (absOffset >= 3) {
              scale = 0.70;
              opacity = 0.20;
              zIndex = 2;
            }

            const xPos = offset * CARD_SPACING;

            return (
              <motion.article
                key={member.id}
                className={`${styles.portraitCard} ${offset === 0 ? styles.portraitCardActive : ""}`}
                onClick={() => setActiveIndex(idx)}
                animate={{
                  x: xPos,
                  scale,
                  opacity,
                  zIndex,
                }}
                transition={{
                  type: "spring",
                  damping: 24,
                  stiffness: 220,
                  mass: 0.8,
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select ${member.name}, ${member.role}`}
              >
                <div className={styles.portraitImageWrapper}>
                  <Image
                    src={member.image || "/img/Hero/photo-wall-1.webp"}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 260px, 320px"
                    className={styles.portraitImage}
                    priority={absOffset <= 1}
                  />
                  <div className={styles.portraitOverlay}>
                    <span className={styles.memberDivisionTag}>{member.division}</span>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <p className={styles.memberRole}>{member.role}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* 3. Navigation Controls & Counter */}
      <div className={styles.controlsRow}>
        <button
          type="button"
          onClick={handlePrev}
          className={styles.navArrowBtn}
          aria-label="Previous team member"
        >
          <ChevronLeft size={20} />
        </button>

        <div className={styles.counterLabel}>
          <span className={styles.counterCurrent}>
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          {" / "}
          <span>{String(visibleMembers.length).padStart(2, "0")}</span>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className={styles.navArrowBtn}
          aria-label="Next team member"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 4. Active Member Editorial Profile Surface */}
      {activeMember && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMember.id}
            className={styles.profileSurface}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <p className={styles.profileBio}>{activeMember.bio}</p>

            <div className={styles.profileMetaGrid}>
              <div>
                <div className={styles.metaItemLabel}>SPECIALIZATION</div>
                <div className={styles.metaItemValue}>{activeMember.specialization}</div>
              </div>

              <div>
                <div className={styles.metaItemLabel}>YEAR &amp; STANDING</div>
                <div className={styles.metaItemValue}>{activeMember.year}</div>
              </div>

              {activeMember.socials?.email && (
                <div>
                  <div className={styles.metaItemLabel}>CONTACT</div>
                  <a
                    href={`mailto:${activeMember.socials.email}`}
                    className={styles.metaItemValue}
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <Mail size={12} color="var(--accent)" />
                    <span>{activeMember.socials.email}</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}