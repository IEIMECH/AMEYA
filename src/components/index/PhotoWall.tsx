"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import styles from "./PhotoWall.module.css";

interface PhotoItem {
  id: number;
  src: string;
  title: string;
  tag: string;
  time: string;
  isPrimary?: boolean;
  angle: string;
  offsetY: number;
}

const photoArchive: PhotoItem[] = [
  {
    id: 1,
    src: "/img/Hero/photo-wall-1.webp",
    title: "Keynote & Guest Lecture",
    tag: "GUEST SESSIONS",
    time: "DAY 1",
    angle: "-1.8deg",
    offsetY: 20,
  },
  {
    id: 2,
    src: "/img/Hero/photo-wall-2.webp",
    title: "Hands-on Mechanical Build",
    tag: "PROTOTYPING",
    time: "DAY 1",
    isPrimary: true,
    angle: "0deg",
    offsetY: 0,
  },
  {
    id: 3,
    src: "/img/Hero/photo-wall-3.webp",
    title: "Auditorium Ceremony",
    tag: "MAIN STAGE",
    time: "DAY 2",
    angle: "2.2deg",
    offsetY: 35,
  },
  {
    id: 4,
    src: "/img/Hero/photo-wall-4.webp",
    title: "Robotics Track Run",
    tag: "ARENA ACTION",
    time: "DAY 1",
    angle: "-2.5deg",
    offsetY: -15,
  },
  {
    id: 5,
    src: "/img/Hero/photo-wall-5.webp",
    title: "Student Team Collaboration",
    tag: "TEAMS & SPIRIT",
    time: "DAY 2",
    angle: "1.8deg",
    offsetY: 25,
  },
];

export default function PhotoWall() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section ref={containerRef} className={styles.section} id="experience">
      <div className={styles.innerContainer}>
        {/* Section Header with Staggered Entrance */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
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

        {/* Editorial Photo Grid with Staggered Scale & Fade */}
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
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 24,
                  scale: shouldReduceMotion ? 1 : 0.98,
                }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }
                    : {
                        opacity: 0,
                        y: shouldReduceMotion ? 0 : 24,
                        scale: shouldReduceMotion ? 1 : 0.98,
                      }
                }
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : 0.15 + idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  transform: isHovered
                    ? "scale(1.04) translateY(-6px) rotate(0deg)"
                    : `rotate(${item.angle}) translateY(${item.offsetY}px)`,
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Clean Corner Annotations */}
                <div className={styles.cardHeader}>
                  <div className={styles.frameTag}>
                    <span className={styles.recDot} />
                    <span>PHOTO 0{item.id}</span>
                  </div>
                  <span className={styles.coordStamp}>{item.time}</span>
                </div>

                {/* Photograph Viewport */}
                <div className={styles.imageWrapper} onDragStart={(e) => e.preventDefault()}>
                  <Image
                    src={item.src}
                    alt={`Highlight photo: ${item.title}`}
                    fill
                    sizes={item.isPrimary ? "460px" : "260px"}
                    className={styles.imageElement}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                  <div className={styles.lensOverlay} />
                  <div className={styles.crosshairTL}>+</div>
                  <div className={styles.crosshairBR}>+</div>
                </div>

                {/* Editorial Caption */}
                <div className={styles.captionBlock}>
                  <div className={styles.categoryBadge}>{item.tag}</div>
                  <h3 className={styles.captionTitle}>{item.title}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
