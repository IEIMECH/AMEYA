"use client";

import Image from "next/image";
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
    category: "TITLE INDUSTRY PATRON",
    name: "Tata Advanced Systems",
    descriptor: "Aerospace Fabrication & Defense Systems",
    logo: "/img/sponsors/tsmc.svg",
    website: "https://www.tataadvancedsystems.com",
    width: 140,
    height: 48,
  },
  {
    id: "lt",
    category: "HEAVY MANUFACTURING ALLIANCE",
    name: "L&T Heavy Engineering",
    descriptor: "Precision Nuclear & Process Equipment",
    logo: "/img/sponsors/amd.svg",
    website: "https://www.larsentoubro.com",
    width: 130,
    height: 44,
  },
  {
    id: "autodesk",
    category: "DIGITAL PROTOTYPING & CAD",
    name: "Autodesk India",
    descriptor: "Generative Design & Simulation Software",
    logo: "/img/sponsors/HIT.svg",
    website: "https://www.autodesk.in",
    width: 125,
    height: 42,
  },
  {
    id: "iei",
    category: "APEX PROFESSIONAL COUNCIL",
    name: "The Institution of Engineers (India)",
    descriptor: "National Conclave Accreditation & Grants",
    logo: "/img/sponsors/SITCON.svg",
    website: "https://www.ieindia.org",
    width: 130,
    height: 45,
  },
];

export default function SponsorSection() {
  return (
    <section className={styles.section} id="sponsors" aria-labelledby="sponsors-heading">
      <div className={styles.container}>
        {/* Section Header */}
        <header className={styles.header}>
          <div className={styles.metaRow}>
            <span className={styles.marker}>[CHAPTER_08]</span>
            <span className={styles.divider}>/</span>
            <span className={styles.metaCategory}>ECOSYSTEM COLLABORATION</span>
            <span className={styles.divider}>/</span>
            <span className={styles.metaYear}>CONCLAVE 2026</span>
          </div>

          <h2 id="sponsors-heading" className={styles.title}>
            SPONSORS &amp; TECHNICAL SUPPORTERS
          </h2>
          <p className={styles.subtitle}>
            Industry leaders, apex institutions, and manufacturing consortiums powering the AMEYA engineering ecosystem.
          </p>
        </header>

        {/* Quiet Logo Exhibition Grid */}
        <div className={styles.exhibitionGrid}>
          {exhibitionPartners.map((partner) => (
            <a
              key={partner.id}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.exhibitionPedestal}
              aria-label={`${partner.name} - ${partner.category}`}
            >
              {/* Category Stamp */}
              <div className={styles.categoryLabel}>{partner.category}</div>

              {/* Logo Frame with Controlled Restrained Proportions */}
              <div className={styles.logoFrame}>
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  className={styles.partnerLogo}
                />
              </div>

              {/* Short Descriptor */}
              <div className={styles.descriptorGroup}>
                <div className={styles.partnerName}>{partner.name}</div>
                <div className={styles.partnerDescriptor}>{partner.descriptor}</div>
              </div>

              {/* Micro Technical Hover Axis Indicator */}
              <div className={styles.pedestalAxis} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
