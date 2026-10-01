"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import styles from "./Nav.module.css";

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
      setScrolled(window.scrollY > 30);

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

  // Do not display public floating navbar inside admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const pageTab = navLinks.find(
    (link) => pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
  )?.label;

  const currentTab = pathname === "/" ? activeScrollTab : pageTab;

  return (
    <div className={styles.navWrapper}>
      <header className={`${styles.floatingBar} ${scrolled ? styles.scrolled : ""}`}>
        {/* Brand / Logo */}
        <Link href="/" className={styles.logo} aria-label="AMEYA '26 Home">
          <Image
            src="/same-logo.png"
            alt="SAME Logo"
            width={24}
            height={24}
            className={styles.navLogoImg}
            priority
          />
          <span className={styles.logoAmeya}>AMEYA</span>
          <span className={styles.logoYear}>&apos;26</span>
        </Link>

        {/* Desktop Links */}
        <nav className={styles.navLinks} aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = currentTab === link.label;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ""}`}
              >
                <span>{link.label}</span>
                {isActive && <span className={styles.activeIndicator} aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Trigger */}
        <button
          className={styles.mobileToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} color="#F2EDE8" /> : <Menu size={18} color="#F2EDE8" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className={styles.mobileDrawer} role="dialog" aria-modal="true">
          <div className={styles.mobileDrawerMeta}>
            <span>AMEYA &bull; 2026</span>
            <span>VVITU</span>
          </div>
          <nav className={styles.mobileDrawerLinks}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`${styles.mobileDrawerLink} ${
                  pathname === link.href ? styles.mobileDrawerLinkActive : ""
                }`}
              >
                <span>{link.label}</span>
                <span className={styles.mobileDrawerIndex}>&rarr;</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
