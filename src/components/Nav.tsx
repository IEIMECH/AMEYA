"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldAlert } from "lucide-react";
import styles from "./Nav.module.css";

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/agenda", label: "Agenda" },
  { href: "/venue", label: "Venue" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "About" },
  { href: "/info", label: "Info" },
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

        {/* Desktop SITCON Pill Links */}
        <div className={styles.navItemsContainer}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navItem} ${pathname === link.href ? styles.active : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

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
            Home
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
