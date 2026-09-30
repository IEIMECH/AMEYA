"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import styles from "./PhotoWall.module.css";

interface PhotoItem {
  id: number;
  src: string;
  caption: string;
}

const photoArchive: PhotoItem[] = [
  { id: 1, src: "/img/Hero/photo-wall-1.webp", caption: "Precision CNC Machine Calibration" },
  { id: 2, src: "/img/Hero/photo-wall-2.webp", caption: "Kinetic RC Car Obstacle Track" },
  { id: 3, src: "/img/Hero/photo-wall-3.webp", caption: "AutoCAD 3D Modeling Arena" },
  { id: 4, src: "/img/Hero/photo-wall-4.webp", caption: "High-Speed Mechanical Teardown" },
  { id: 5, src: "/img/Hero/photo-wall-5.webp", caption: "Department Assembly & Awards" },
];

export default function PhotoWall() {
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(2); // Default center (index 2)
  const trackRef = useRef<HTMLDivElement>(null);
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

  // Handle pointer movement across strip to calculate center focus
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const targetIdx = Math.min(Math.max(Math.floor(relativeX * photoArchive.length), 0), photoArchive.length - 1);
    setHoveredIdx(targetIdx);
  };

  const handleMouseLeave = () => {
    setHoveredIdx(2); // Return smoothly to center image
  };

  return (
    <section ref={containerRef} className={styles.section} id="experience">
      <div className={styles.innerContainer}>
        {/* Section Header (Req 5: A Look Back) */}
        <div className={styles.header}>
          <h2 className={styles.title}>A Look Back</h2>
          <p className={styles.subtitle}>
            A glimpse into the adrenaline, craft, and championship arenas of our previous national conclave.
          </p>
        </div>

        {/* Interactive Image Strip (Item 6) */}
        <div
          ref={trackRef}
          className={styles.imageStrip}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {photoArchive.map((item, idx) => {
            const isCenter = hoveredIdx === idx;
            const distance = hoveredIdx !== null ? Math.abs(hoveredIdx - idx) : 0;

            let scale = 1.05;
            let opacity = 1.0;
            let zIndex = 5;

            if (distance === 1) {
              scale = 0.96;
              opacity = 0.75;
              zIndex = 3;
            } else if (distance >= 2) {
              scale = 0.90;
              opacity = 0.50;
              zIndex = 1;
            }

            if (shouldReduceMotion) {
              scale = 1;
              opacity = 1;
            }

            return (
              <motion.div
                key={item.id}
                className={styles.photoItem}
                animate={{
                  scale,
                  opacity,
                  zIndex,
                }}
                transition={{
                  type: "spring",
                  damping: 24,
                  stiffness: 240,
                  mass: 0.6,
                }}
                onClick={() => setActivePhoto(item)}
                role="button"
                tabIndex={0}
                aria-label={`View photo: ${item.caption}`}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.src}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 768px) 240px, 320px"
                    className={styles.imageElement}
                    priority={idx === 2}
                  />
                  <div className={styles.vignetteOverlay} />
                  {isCenter && (
                    <div className={styles.captionTag}>
                      <span>{item.caption}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            className={styles.lightboxBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActivePhoto(null)}
          >
            <motion.div
              className={styles.lightboxCard}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.lightboxCloseBtn}
                onClick={() => setActivePhoto(null)}
                aria-label="Close preview"
              >
                <X size={18} />
              </button>

              <div className={styles.lightboxImageWrapper}>
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.caption}
                  fill
                  sizes="90vw"
                  className={styles.lightboxImage}
                  priority
                />
              </div>

              <div className={styles.lightboxFooter}>
                <p className={styles.lightboxCaption}>{activePhoto.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}