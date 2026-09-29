"use client";

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
    id: "tata",
    category: "INDUSTRY PARTNER",
    name: "Tata Advanced Systems",
    descriptor: "Aerospace Fabrication & Defense Systems",
    logo: "/img/sponsors/tsmc.svg",
    website: "https://www.tataadvancedsystems.com",
    width: 140,
    height: 48,
  },
  {
    id: "lt",
    category: "MANUFACTURING PARTNER",
    name: "L&T Heavy Engineering",
    descriptor: "Precision Process Equipment",
    logo: "/img/sponsors/amd.svg",
    website: "https://www.larsentoubro.com",
    width: 130,
    height: 44,
  },
  {
    id: "autodesk",
    category: "DESIGN & CAD PARTNER",
    name: "Autodesk India",
    descriptor: "Design & Engineering Simulation",
    logo: "/img/sponsors/HIT.svg",
    website: "https://www.autodesk.in",
    width: 125,
    height: 42,
  },
  {
    id: "iei",
    category: "PROFESSIONAL CHAPTER",
    name: "The Institution of Engineers (India)",
    descriptor: "Student Chapter Accreditation & Grants",
    logo: "/img/sponsors/SITCON.svg",
    website: "https://www.ieindia.org",
    width: 130,
    height: 45,
  },
];

export default function SponsorSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={styles.section} id="sponsors" aria-labelledby="sponsors-heading">
      <div className={styles.container}>
        {/* Section Header: Permanently Visible, Immediate Entrance */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ type: "spring", bounce: 0, duration: 0.45 }}
        >
          <div className={styles.metaRow}>
            <span className={styles.metaCategory}>PARTNERS &amp; SUPPORTERS</span>
          </div>

          <h2 id="sponsors-heading" className={styles.title}>
            SPONSORS &amp; SUPPORTERS
          </h2>
          <p className={styles.subtitle}>
            Industry leaders, institutions, and professional engineering bodies supporting AMEYA &apos;26.
          </p>
        </motion.header>

        {/* Logo Exhibition Grid with Self-Triggering Stagger */}
        <div className={styles.exhibitionGrid}>
          {exhibitionPartners.map((partner, idx) => (
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
                duration: 0.45,
                delay: shouldReduceMotion ? 0 : 0.06 + idx * 0.05,
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
                  onDragStart={(e) => e.preventDefault()}
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
          ))}
        </div>
      </div>
    </section>
  );
}
