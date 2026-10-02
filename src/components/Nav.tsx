"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatedBackground } from "@/components/core/animated-background";
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Do not display public floating navbar inside admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Active page tab (only active when on that specific page route, never on homepage scroll)
  const activePageTab =
    pathname === "/"
      ? undefined
      : navLinks.find(
          (link) => pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
        )?.label;

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

        {/* Desktop Links with Framer Motion Animated Hover Pill */}
        <nav className={styles.navLinks} aria-label="Main Navigation">
          <AnimatedBackground
            defaultValue={activePageTab}
            className={styles.hoverBackground}
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.3,
            }}
            enableHover
          >
            {navLinks.map((link) => {
              const isActive = activePageTab === link.label;
              return (
                <Link
                  key={link.href}
                  data-id={link.label}
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.activeNavLink : ""}`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className={styles.activeIndicator} aria-hidden="true" />}
                </Link>
              );
            })}
          </AnimatedBackground>
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
