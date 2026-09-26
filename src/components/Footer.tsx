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

  // On sub-pages (/about, /agenda, /venue, /team, /info, etc.), maintain minimal bar
  if (pathname !== "/") {
    return (
      <footer className={styles.minimalFooter}>
        <div className={`container ${styles.minimalInner}`}>
          <p>© 2026 AMEYA &bull; Department of Mechanical Engineering, VVITU.</p>
          <Link href="/" className={styles.backHome}>
            <span>Back to Home</span>
            <ArrowUp size={14} />
          </Link>
        </div>
      </footer>
    );
  }

  // Master Redesign Guide Section 52: The Final Frame of the Experience
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Final Emotional Brand Statement (Section 52) */}
        <div className={styles.finalBrandFrame}>
          <div className={styles.brandTitle}>AMEYA &apos;26</div>
          <div className={styles.brandMotto}>
            WHERE ENGINEERS<br />
            DARE TO DREAM.
          </div>
          <p className={styles.brandDesc}>
            The National Level Technical Conclave of the Department of Mechanical Engineering,
            Vasireddy Venkatadri Institute of Technology (VVITU), Nambur, Guntur.
          </p>
        </div>

        {/* Technical Sitemap Grid (No grid wallpaper in footer, Section 08) */}
        <div className={styles.sitemapGrid}>
          <div className={styles.linkGroup}>
            <h4 className={styles.groupHeading}>CONCLAVE</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Homepage</Link></li>
              <li><Link href="/about">About Ameya</Link></li>
              <li><Link href="/agenda">Conclave Schedule</Link></li>
              <li><Link href="/venue">3D Campus Map</Link></li>
              <li><Link href="/team">Engineering Cadre</Link></li>
              <li><Link href="/team/explore">Explore Universe</Link></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.groupHeading}>ARENAS</h4>
            <ul className={styles.linkList}>
              <li><Link href="/events">HackSprint 24H</Link></li>
              <li><Link href="/events">Robo Rumble</Link></li>
              <li><Link href="/events">CAD Clash</Link></li>
              <li><Link href="/events">Tech Manuscript</Link></li>
              <li><Link href="/events">Gear Hunt</Link></li>
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
              Nambur, Guntur, Andhra Pradesh &ndash; 522508
            </p>
            <button type="button" onClick={scrollToTop} className={styles.scrollTopBtn}>
              <span>ASCEND TO APEX</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>

        {/* Bottom Legal Baseline */}
        <div className={styles.bottomBar}>
          <p>© 2026 AMEYA &bull; IEI SAME COUNCIL, VVITU. ALL RIGHTS RESERVED.</p>
          <p className={styles.bottomTag}>SYSTEM FOR CLARITY &bull; SURPRISE FOR MEMORY</p>
        </div>
      </div>
    </footer>
  );
}
