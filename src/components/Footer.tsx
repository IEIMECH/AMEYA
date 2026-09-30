"use client";

import Link from "next/link";
import { ArrowUp, Phone } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer} aria-label="Site Footer">
      <div className={`container ${styles.footerContainer}`}>
        {/* Student Points of Contact (POCs) Section */}
        <section className={styles.pocsSection} aria-labelledby="pocs-title">
          <div className={styles.pocsHeading}>
            <span className={styles.pocsBadge}>STUDENT COORDINATION</span>
            <h3 id="pocs-title" className={styles.pocsTitle}>
              Points of Contact (POCs)
            </h3>
          </div>

          <div className={styles.pocsGrid}>
            {/* 1. General Queries */}
            <div className={styles.pocCard}>
              <span className={styles.pocCategory}>FOR ANY QUERIES</span>
              <div className={styles.pocMembers}>
                <div className={styles.pocMember}>
                  <span className={styles.pocName}>S. Sai Kumar</span>
                  <a href="tel:+917732014762" className={styles.pocPhone}>
                    <Phone size={12} className={styles.pocPhoneIcon} />
                    <span>+91 77320 14762</span>
                  </a>
                </div>
                <div className={styles.pocMember}>
                  <span className={styles.pocName}>S. Sameer Basha</span>
                  <a href="tel:+919676419146" className={styles.pocPhone}>
                    <Phone size={12} className={styles.pocPhoneIcon} />
                    <span>+91 96764 19146</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Events Coordinator */}
            <div className={styles.pocCard}>
              <span className={styles.pocCategory}>EVENTS COORDINATOR</span>
              <div className={styles.pocMembers}>
                <div className={styles.pocMember}>
                  <span className={styles.pocName}>T. Jaya Kumar</span>
                  <a href="tel:+917416532304" className={styles.pocPhone}>
                    <Phone size={12} className={styles.pocPhoneIcon} />
                    <span>+91 74165 32304</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Transport and Hospitality */}
            <div className={styles.pocCard}>
              <span className={styles.pocCategory}>TRANSPORT &amp; HOSPITALITY</span>
              <div className={styles.pocMembers}>
                <div className={styles.pocMember}>
                  <span className={styles.pocName}>S. Durga Sai Ram</span>
                  <a href="tel:+919392458746" className={styles.pocPhone}>
                    <Phone size={12} className={styles.pocPhoneIcon} />
                    <span>+91 93924 58746</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand */}
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brandLink} aria-label="AMEYA '26 Home">
            <span className={styles.brandName}>AMEYA</span>
            <span className={styles.brandYear}>&apos;26</span>
          </Link>
        </div>

        {/* Copyright & Back to Top */}
        <div className={styles.metaRow}>
          <p className={styles.copyright}>
            &copy; 2026 AMEYA &bull; Department of Mechanical Engineering, VVITU.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className={styles.backToTop}
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={13} className={styles.arrowIcon} />
          </button>
        </div>
      </div>
    </footer>
  );
}
