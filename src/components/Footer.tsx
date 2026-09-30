"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import styles from "./Footer.module.css";

const navLinks = [
  { href: "/events", label: "EVENTS" },
  { href: "/venue", label: "VENUE" },
  { href: "/team", label: "TEAM" },
  { href: "/about", label: "ABOUT" },
  { href: "/info", label: "INFO" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer} aria-label="Site Footer">
      <div className={`container ${styles.footerContainer}`}>
        {/* Brand */}
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brandLink} aria-label="AMEYA '26 Home">
            <span className={styles.brandName}>AMEYA</span>
            <span className={styles.brandYear}>&apos;26</span>
          </Link>
        </div>

        {/* Clean Minimal Navigation Links */}
        <nav className={styles.navRow} aria-label="Footer Navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright & Back to Top */}
        <div className={styles.metaRow}>
          <p className={styles.copyright}>&copy; 2026 AMEYA &bull; Department of Mechanical Engineering, VVITU.</p>
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