"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, ExternalLink, ArrowUp } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // On sub-pages (/about, /events, /venue, /team, /info, etc.), maintain minimal bar
  if (pathname !== "/") {
    return (
      <footer className={styles.minimalFooter}>
        <div className={`container ${styles.minimalInner}`}>
          <p>© 2026 AMEYA • Department of Mechanical Engineering, VVITU.</p>
          <Link href="/" className={styles.backHome} aria-label="Return to conclave homepage">
            <span>Back to Home</span>
            <ArrowUp size={14} />
          </Link>
        </div>
      </footer>
    );
  }

  // Master Redesign: On Homepage, ClosingManifesto handles the chapter title sequence.
  // Footer provides the technical sitemap, apex navigation, and legal registry.
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Technical Sitemap Grid */}
        <div className={styles.sitemapGrid}>
          <div className={styles.linkGroup}>
            <h4 className={styles.groupHeading}>CONCLAVE</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Homepage</Link></li>
              <li><Link href="/events">Official Arenas</Link></li>
              <li><Link href="/venue">3D Campus Map</Link></li>
              <li><Link href="/team">Engineering Cadre</Link></li>
              <li><Link href="/about">About Ameya</Link></li>
              <li><Link href="/info">Conclave Protocols</Link></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.groupHeading}>ARENAS</h4>
            <ul className={styles.linkList}>
              <li><Link href="/events">AutoCAD (Day 1)</Link></li>
              <li><Link href="/events">Assemble &amp; Disassemble (Day 1)</Link></li>
              <li><Link href="/events">RC Car Challenge (Day 1)</Link></li>
              <li><Link href="/events">Engineering Drawing (Day 2)</Link></li>
              <li><Link href="/events">Treasure Hunt (Day 2)</Link></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.groupHeading}>INSTITUTION</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="https://www.vvitguntur.com" target="_blank" rel="noopener noreferrer">
                  VVITU Official <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://www.ieindia.org" target="_blank" rel="noopener noreferrer">
                  IEI India <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="mailto:ieisame@vvitu.edu.in">
                  Council Secretariat <Mail size={11} />
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.groupHeading}>COMMUNICATIONS</h4>
            <p className={styles.commText}>
              Department of Mechanical Engineering, VVITU<br />
              Nambur, Guntur, Andhra Pradesh – 522508
            </p>
            <button type="button" onClick={scrollToTop} className={styles.scrollTopBtn} aria-label="Scroll back to top">
              <span>ASCEND TO APEX</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>

        {/* Bottom Legal Baseline */}
        <div className={styles.bottomBar}>
          <p>© 2026 AMEYA • IEI SAME COUNCIL, VVITU. ALL RIGHTS RESERVED.</p>
          <p className={styles.bottomTag}>SYSTEM FOR CLARITY • SURPRISE FOR MEMORY</p>
        </div>
      </div>
    </footer>
  );
}
