"use client";

import { useRef, useState, MouseEvent } from "react";
import {
  ArrowRight,
  Compass,
  Wrench,
  Gauge,
  Sparkles,
  PenTool,
  Hammer,
  MapPin,
  Timer,
  Layers,
} from "lucide-react";
import type { Event } from "@/data/events";
import styles from "./EventCard.module.css";

interface Props {
  event: Event;
  index?: number;
  onRegister: () => void;
}

const iconMap: Record<string, typeof Compass> = {
  Compass,
  Wrench,
  Gauge,
  Sparkles,
  PenTool,
  Hammer,
  MapPin,
  Timer,
};

export default function EventCard({ event, onRegister }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [reflectionStyle, setReflectionStyle] = useState<string>("");
  const [tiltTransform, setTiltTransform] = useState<string>("");

  const IconComponent = (event.icon && iconMap[event.icon]) || Layers;
  const isTechnical = event.category.toLowerCase() === "technical";

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 2-3 degree max tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -2.5;
    const rotateY = ((x - centerX) / centerX) * 2.5;

    setTiltTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale(1.01)`
    );

    // Subtle specular light reflection following cursor
    setReflectionStyle(
      `radial-gradient(circle 260px at ${x}px ${y}px, rgba(255, 255, 255, 0.09) 0%, transparent 65%), radial-gradient(circle 340px at ${x}px ${y}px, rgba(229, 29, 37, 0.08) 0%, transparent 75%)`
    );
  };

  const handleMouseLeave = () => {
    setTiltTransform("");
    setReflectionStyle("");
  };

  return (
    <div className={styles.cardWrapper}>
      <article
        ref={cardRef}
        id={event.id}
        className={styles.card}
        style={{ transform: tiltTransform }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onRegister}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRegister();
          }
        }}
        aria-label={`Register for ${event.name} - ${event.category} - Day ${event.day}`}
      >
        {/* Dynamic Light Reflection Layer */}
        <div
          className={styles.specularReflection}
          style={{ background: reflectionStyle }}
          aria-hidden="true"
        />

        <div className={styles.cardContent}>
          {/* Top Bar: TECHNICAL ........ DAY 01 */}
          <div className={styles.metaRow}>
            <span className={styles.categoryTag}>
              <span
                className={styles.categoryDot}
                style={{
                  background: isTechnical ? "var(--accent)" : "#C7C2BC",
                }}
              />
              {event.category}
            </span>
            <span className={styles.dayTag}>DAY 0{event.day}</span>
          </div>

          {/* Centered Event Icon with soft glow on hover */}
          <div className={styles.iconContainer} aria-hidden="true">
            <IconComponent size={20} />
          </div>

          {/* Title & Editorial Descriptions */}
          <h3 className={styles.title}>{event.name}</h3>
          {event.tagline && <p className={styles.tagline}>{event.tagline}</p>}
          <p className={styles.description}>
            {event.description || "Technical championship arena."}
          </p>

          <div className={styles.divider} aria-hidden="true" />

          {/* Bottom Bar: SOLO ........ REGISTER -> */}
          <div className={styles.cardFooter}>
            <span className={styles.participationTag}>SOLO</span>
            <button
              type="button"
              className={styles.registerBtn}
              onClick={(e) => {
                e.stopPropagation();
                onRegister();
              }}
              aria-label={`Register for ${event.name}`}
            >
              <span>REGISTER</span>
              <ArrowRight size={13} className={styles.registerArrow} />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}