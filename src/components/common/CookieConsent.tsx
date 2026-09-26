"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";
import styles from "./CookieConsent.module.css";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ameya:privacy-consent");
    if (!consent) {
      // Show consent after a gentle brief delay
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleDecision = (decision: "accepted" | "rejected") => {
    localStorage.setItem("ameya:privacy-consent", decision);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className={styles.consentOverlay} role="region" aria-label="Privacy Consent Protocol">
      <div className={styles.consentCard}>
        <div className={styles.header}>
          <div className={styles.label}>
            <ShieldCheck size={13} color="#E51D25" />
            <span>PRIVACY PROTOCOL // COOKIES &amp; TELEMETRY</span>
          </div>
          <button 
            type="button" 
            onClick={() => handleDecision("rejected")} 
            className={styles.closeBtn}
            aria-label="Dismiss without consent"
          >
            <X size={14} />
          </button>
        </div>

        <p className={styles.text}>
          AMEYA &apos;26 uses essential session telemetry to synchronize event schedules, track competition registrations,
          and ensure smooth 3D campus performance. No advertising cookies or commercial tracking brokers are deployed.
          Review our <Link href="/privacy" className={styles.policyLink}>Privacy Protocol</Link>.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => handleDecision("accepted")}
            className={styles.acceptBtn}
          >
            ACCEPT PROTOCOL
          </button>
          <button
            type="button"
            onClick={() => handleDecision("rejected")}
            className={styles.rejectBtn}
          >
            REJECT NON-ESSENTIAL
          </button>
          <Link href="/privacy" className={styles.prefLink}>
            MANAGE PREFERENCES
          </Link>
        </div>
      </div>
    </aside>
  );
}
