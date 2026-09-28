"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./PhotoWall.module.css";

interface PhotoItem {
  id: number;
  src: string;
  title: string;
  tag: string;
  coords: string;
  isPrimary?: boolean;
  angle: string;
  offsetY: number;
}

const photoArchive: PhotoItem[] = [
  {
    id: 1,
    src: "/img/Hero/photo-wall-1.webp",
    title: "Keynote Plenary Session",
    tag: "ACADEMIA // JURY",
    coords: "AUD_01 // 10:15 IST",
    angle: "-1.8deg",
    offsetY: 20,
  },
  {
    id: 2,
    src: "/img/Hero/photo-wall-2.webp",
    title: "24H Prototyping Under Load",
    tag: "FEATURED // PROVING GROUND",
    coords: "LAB_3 // 03:42 IST",
    isPrimary: true,
    angle: "0deg",
    offsetY: 0,
  },
  {
    id: 3,
    src: "/img/Hero/photo-wall-3.webp",
    title: "Auditorium Conclave Address",
    tag: "DIGNITARY // DELEGATES",
    coords: "HALL_A // 11:30 IST",
    angle: "2.2deg",
    offsetY: 35,
  },
  {
    id: 4,
    src: "/img/Hero/photo-wall-4.webp",
    title: "Kinetic Machine Telemetry",
    tag: "ROBOTICS // ARENA 1",
    coords: "PIT_BAY // 14:20 IST",
    angle: "-2.5deg",
    offsetY: -15,
  },
  {
    id: 5,
    src: "/img/Hero/photo-wall-5.webp",
    title: "Cross-College Collaboration",
    tag: "COLLABORATION // TEAMS",
    coords: "DECK_B // 16:50 IST",
    angle: "1.8deg",
    offsetY: 25,
  },
];

export default function PhotoWall() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className={styles.section} id="experience">
      <div className={styles.innerContainer}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.kicker}>
            <span className={styles.kickerDot} />
            CHAPTER_03 // DOCUMENTARY ARCHIVE
          </div>
          <h2 className={styles.title}>
            The People, The Tension, The Breakthroughs
          </h2>
          <p className={styles.subtext}>
            Unscripted moments from the proving grounds &mdash; student engineers building, testing,
            and pushing mechanical limits past the breaking point.
          </p>
        </div>

        {/* Editorial Filmstrip */}
        <div className={styles.filmstripTrack}>
          {photoArchive.map((item, idx) => {
            const isHovered = hoveredId === item.id;
            const isNeighbor =
              hoveredId !== null &&
              Math.abs(photoArchive.findIndex((p) => p.id === hoveredId) - idx) === 1;

            return (
              <div
                key={item.id}
                className={`${styles.photoCard} ${item.isPrimary ? styles.primaryCard : styles.secondaryCard} ${
                  isHovered ? styles.cardHovered : ""
                } ${isNeighbor ? styles.cardNeighbor : ""}`}
                style={{
                  transform: isHovered
                    ? "scale(1.05) translateY(-8px) rotate(0deg)"
                    : `rotate(${item.angle}) translateY(${item.offsetY}px)`,
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Technical Corner Annotations */}
                <div className={styles.cardHeader}>
                  <div className={styles.frameTag}>
                    <span className={styles.recDot} />
                    <span>REC // 0{item.id}</span>
                  </div>
                  <span className={styles.coordStamp}>{item.coords}</span>
                </div>

                {/* Photograph Viewport */}
                <div className={styles.imageWrapper} onDragStart={(e) => e.preventDefault()}>
                  <Image
                    src={item.src}
                    alt={`Documentary capture: ${item.title}`}
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
