"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import styles from "./PhotoWall.module.css";

interface PhotoItem {
  id: number;
  src: string;
  isPrimary?: boolean;
  angle: number;
  offsetY: number;
  entranceY: number;
}

const photoArchive: PhotoItem[] = [
  {
    id: 1,
    src: "/img/Hero/photo-wall-1.webp",
    angle: -1.8,
    offsetY: 20,
    entranceY: 20,
  },
  {
    id: 2,
    src: "/img/Hero/photo-wall-2.webp",
    isPrimary: true,
    angle: 0,
    offsetY: 0,
    entranceY: 30,
  },
  {
    id: 3,
    src: "/img/Hero/photo-wall-3.webp",
    angle: 2.2,
    offsetY: 35,
    entranceY: 16,
  },
  {
    id: 4,
    src: "/img/Hero/photo-wall-4.webp",
    angle: -2.5,
    offsetY: -15,
    entranceY: 26,
  },
  {
    id: 5,
    src: "/img/Hero/photo-wall-5.webp",
    angle: 1.8,
    offsetY: 25,
    entranceY: 20,
  },
];

export default function PhotoWall() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: "some" });
  const shouldReduceMotion = useReducedMotion();

  // Escape key & scroll-lock listener for lightbox
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePhoto(null);
      }
    };

    if (activePhoto) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activePhoto]);

  return (
    <section ref={containerRef} className={styles.section} id="experience">
      <div className={styles.innerContainer}>
        {/* Section Header with Staggered Entrance */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ type: "spring", bounce: 0, duration: 0.45 }}
        >
          <div className={styles.kicker}>
            <span className={styles.kickerDot} />
            AMEYA &apos;25 HIGHLIGHTS
          </div>
          <h2 className={styles.title}>
            Memories from Last Year
          </h2>
          <p className={styles.subtext}>
            Unforgettable moments from last year&apos;s fest &mdash; student engineers designing, building,
            and celebrating mechanical engineering excellence.
          </p>
        </motion.div>

        {/* Pure Visual Photo Grid */}
        <div className={styles.filmstripTrack}>
          {photoArchive.map((item, idx) => {
            const isHovered = hoveredId === item.id;
            const isNeighbor =
              hoveredId !== null &&
              Math.abs(photoArchive.findIndex((p) => p.id === hoveredId) - idx) === 1;

            return (
              <motion.div
                key={item.id}
                className={`${styles.photoCard} ${item.isPrimary ? styles.primaryCard : styles.secondaryCard} ${
                  isHovered ? styles.cardHovered : ""
                } ${isNeighbor ? styles.cardNeighbor : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`View full resolution photo ${item.id}`}
                onClick={() => setActivePhoto(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActivePhoto(item);
                  }
                }}
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : item.offsetY + item.entranceY,
                  rotate: shouldReduceMotion ? 0 : item.angle,
                  scale: shouldReduceMotion ? 1 : 0.98,
                }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        y: shouldReduceMotion ? 0 : item.offsetY,
                        rotate: shouldReduceMotion ? 0 : item.angle,
                        scale: 1,
                      }
                    : {
                        opacity: 0,
                        y: shouldReduceMotion ? 0 : item.offsetY + item.entranceY,
                        rotate: shouldReduceMotion ? 0 : item.angle,
                        scale: shouldReduceMotion ? 1 : 0.98,
                      }
                }
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.035,
                        y: item.offsetY - 6,
                        rotate: 0,
                        transition: { type: "spring", bounce: 0, duration: 0.3 },
                      }
                }
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: "spring",
                  bounce: 0,
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : 0.08 + idx * 0.05,
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Corner Crosshairs */}
                <div className={styles.crosshairTL}>+</div>
                <div className={styles.crosshairBR}>+</div>

                {/* Pure Photograph Viewport */}
                <div className={styles.imageWrapper} onDragStart={(e) => e.preventDefault()}>
                  <Image
                    src={item.src}
                    alt={`AMEYA '25 memory capture ${item.id}`}
                    fill
                    sizes={item.isPrimary ? "420px" : "260px"}
                    className={styles.imageElement}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                  <div className={styles.lensOverlay} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal with Smooth Scale & Fade */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            className={styles.lightboxBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={() => setActivePhoto(null)}
          >
            <motion.div
              className={styles.lightboxCard}
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.lightboxCloseBtn}
                onClick={() => setActivePhoto(null)}
                aria-label="Close photo preview"
              >
                <X size={18} />
              </button>

              <div className={styles.lightboxImageWrapper}>
                <Image
                  src={activePhoto.src}
                  alt={`AMEYA '25 memory photo ${activePhoto.id} fullscreen`}
                  fill
                  sizes="90vw"
                  className={styles.lightboxImage}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
