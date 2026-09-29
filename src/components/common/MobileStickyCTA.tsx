"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Ticket, Zap } from "lucide-react";
import styles from "./MobileStickyCTA.module.css";

export default function MobileStickyCTA() {
  const pathname = usePathname();

  // Context-aware mobile CTA configuration (Item 11)
  let label = "EXPLORE EVENTS";
  let href = "/events";
  let sub = "10 TECHNICAL ARENAS";

  if (pathname === "/events") {
    label = "REGISTER FOR ARENAS";
    href = "/events#arenas";
    sub = "₹50,000 PRIZE POOL";
    label = "VIEW ARENA SCHEDULE";
    href = "/agenda";
    sub = "CAMPUS TIMETABLE";
  } else if (pathname.startsWith("/team")) {
    label = "EXPLORE ALL EVENTS";
    href = "/events";
    sub = "STUDENT COMPETITIONS";
  } else if (pathname === "/") {
    label = "EXPLORE EVENTS";
    href = "/events";
    sub = "DARE TO DREAM // 2026";
  }

  return (
    <aside className={styles.stickyBar} aria-label="Mobile Action Bar">
      <div className={styles.barInner}>
        <div className={styles.metaInfo}>
          <span className={styles.indicatorDot} />
          <div className={styles.textStack}>
            <span className={styles.actionSub}>{sub}</span>
            <span className={styles.actionTitle}>AMEYA &apos;26 FEST</span>
          </div>
        </div>

        <Link href={href} className={styles.actionBtn}>
          <span>{label}</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </aside>
  );
}
