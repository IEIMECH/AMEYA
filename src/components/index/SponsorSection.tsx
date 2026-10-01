"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./SponsorSection.module.css";

interface SponsorItem {
  id: string;
  category: string;
  name: string;
  descriptor: string;
  logo: string;
  website: string;
  width: number;
  height: number;
}

const exhibitionPartners: SponsorItem[] = [
  {
    id: "kc-overseas",
    category: "GLOBAL EDUCATION PARTNER",
    name: "KC Overseas Education",
    descriptor: "Study Abroad Consultants • Guntur",
    logo: "/img/sponsors/kc-overseas.jpg",
    website: "https://www.studies-overseas.com/contact-us/study-abroad-consultants-in-guntur",
    width: 240,
    height: 90,
  },
];

export default function SponsorSection() {
  const shouldReduceMotion = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Bulletproof one-time entrance reveal that NEVER reverts
  useEffect(() => {
    if (isRevealed) return;
    const el = headerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 150) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight + 150)) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isRevealed]);

  const partner = exhibitionPartners[0];

  return (
    <section className={styles.section} id="sponsors" aria-labelledby="sponsors-heading">
      <div className={styles.container}>
        {/* Section Header */}
        <header
          ref={headerRef}
          className={`${styles.header} ${isRevealed ? styles.headerRevealed : styles.headerHidden}`}
        >
          <h2 id="sponsors-heading" className={styles.title}>
            Our Valued Sponsor
          </h2>
          <p className={styles.subtitle}>
            Global education and professional partners supporting AMEYA &apos;26.
          </p>
        </header>

        {/* Featured Sponsor Showcase Pedestal */}
        <div className={styles.exhibitionGrid}>
          <motion.a
            key={partner.id}
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.exhibitionPedestal}
            aria-label={`${partner.name} - ${partner.category}`}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.5,
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Category Stamp */}
            <div className={styles.categoryLabel}>{partner.category}</div>

            {/* Logo Frame */}
            <div className={styles.logoFrame}>
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className={styles.partnerLogo}
                draggable={false}
                priority
              />
            </div>

            {/* Short Descriptor */}
            <div className={styles.descriptorGroup}>
              <div className={styles.partnerName}>{partner.name}</div>
              <div className={styles.partnerDescriptor}>{partner.descriptor}</div>
            </div>

            {/* Micro Technical Hover Axis Indicator */}
            <div className={styles.pedestalAxis} aria-hidden="true" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
