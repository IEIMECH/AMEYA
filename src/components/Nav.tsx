"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldAlert } from "lucide-react";
import { AnimatedBackground } from "@/components/core/animated-background";
import styles from "./Nav.module.css";

const TABS = ["EVENTS", "VENUE", "TEAM", "ABOUT", "INFO"];

const navLinks = [
  { href: "/events", label: "EVENTS" },
  { href: "/venue", label: "VENUE" },
  { href: "/team", label: "TEAM" },
  { href: "/about", label: "ABOUT" },
  { href: "/info", label: "INFO" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeScrollTab, setActiveScrollTab] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Homepage scrollspy section mapping
      if (pathname === "/") {
        const scrollPos = window.scrollY + 250;

        if (window.scrollY < 380) {
          setActiveScrollTab(null);
          return;
        }

        const sections = [
          { id: "intro", tab: "ABOUT" },
          { id: "experience", tab: "EVENTS" },
          { id: "speakers", tab: "EVENTS" },
          { id: "arenas", tab: "EVENTS" },
          { id: "register", tab: "INFO" },
          { id: "sponsors", tab: "ABOUT" },
          { id: "manifesto", tab: "ABOUT" },
        ];

        let matchedTab: string | null = null;
        for (const sec of sections) {
          const el = document.getElementById(sec.id);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
              matchedTab = sec.tab;
              break;
            }
          }
        }

        if (matchedTab) {
          setActiveScrollTab(matchedTab);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Determine current active tab based on pathname and homepage scrollspy
  const pageTab = navLinks.find(
    (link) => pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
  )?.label;

  const currentTab = pathname === "/" ? activeScrollTab : pageTab;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        {/* Editorial Logo */}
        <Link href="/" className={styles.logo} aria-label="Ameya 2026 Home">
          <ShieldAlert size={18} color="#e61d1d" className={styles.logoIcon} />
          <span className={styles.logoText}>
            AMEYA<span className={styles.logoYear}>&apos;26</span>
          </span>
        </Link>

        {/* Desktop Smoked Glass Animated Tabs */}
        <nav className={styles.navItemsContainer} aria-label="Primary Navigation">
          <AnimatedBackground
            defaultValue={currentTab || undefined}
            className={styles.activePill}
            transition={{
              type: "spring",
              bounce: 0.15,
              duration: 0.35,
            }}
            enableHover
          >
            {navLinks.map((link) => {
              const isActive = currentTab === link.label;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-id={link.label}
                  className={`${styles.navItem} ${isActive ? styles.activeNavItem : ""}`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className={styles.activeDot} aria-hidden="true">•</span>}
                </Link>
              );
            })}
          </AnimatedBackground>
        </nav>

        {/* Mobile Hamburger Trigger */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} color="#F2EDE8" /> : <Menu size={20} color="#F2EDE8" />}
        </button>
      </div>

      {/* Mobile Glass Drawer */}
      {menuOpen && (
        <div className={styles.mobileDrawer} role="dialog" aria-modal="true">
          <div className={styles.mobileMetaRow}>
            <span>NAVIGATION CADRE</span>
            <span>AMEYA &bull; 2026</span>
          </div>
          <nav className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`${styles.mobileNavLink} ${
                  pathname === link.href ? styles.mobileActiveLink : ""
                }`}
              >
                <span>{link.label}</span>
                <span className={styles.mobileIndex}>[{link.label.substring(0, 3)}]</span>
              </Link>
            ))}
          </nav>
          <div className={styles.mobileDrawerFooter}>
            <p>DEPARTMENT OF MECHANICAL ENGINEERING</p>
            <p>VVITU &bull; NAMBUR, GUNTUR</p>
          </div>
        </div>
      )}
    </header>
  );
}
