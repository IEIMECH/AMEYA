"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldAlert } from "lucide-react";
import { AnimatedBackground } from "@/components/core/animated-background";
import styles from "./Nav.module.css";

const TABS = ["EVENTS", "AGENDA", "VENUE", "TEAM", "ABOUT", "INFO"];

const navLinks = [
  { href: "/events", label: "EVENTS" },
  { href: "/agenda", label: "AGENDA" },
  { href: "/venue", label: "VENUE" },
  { href: "/team", label: "TEAM" },
  { href: "/about", label: "ABOUT" },
  { href: "/info", label: "INFO" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Determine current active tab based on pathname
  const currentTab = navLinks.find(
    (link) => pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
  )?.label;

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
            defaultValue={currentTab || TABS[0]}
            className={styles.glassBackground}
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.3,
            }}
            enableHover
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-id={link.label}
                className={`${styles.navItem} ${pathname === link.href ? styles.active : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </AnimatedBackground>
        </nav>

        {/* Mobile Hamburger */}
        <button
          suppressHydrationWarning
          className={styles.hamburger}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} color="#ffffff" /> : <Menu size={22} color="#ffffff" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileLinks}>
          <Link
            href="/"
            className={`${styles.mobileLink} ${pathname === "/" ? styles.mobileActive : ""}`}
          >
            HOME
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileActive : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
