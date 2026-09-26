import Link from "next/link";
import { ArrowRight, Compass, ShieldAlert, Terminal } from "lucide-react";
import styles from "./not-found.module.css";

export const metadata = {
  title: "404 // Signal Lost — AMEYA '26 | IEI SAME",
  description: "The requested coordinate could not be located in the AMEYA telemetry system.",
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      {/* Background Broken Grid & Monumental 404 Watermark */}
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className={styles.watermark404} aria-hidden="true">404</div>

      <div className={styles.content}>
        {/* Technical Error Label */}
        <div className={styles.errorLabel}>
          <span className={styles.errorDot} />
          ERROR // SIGNAL LOST
        </div>

        {/* Monumental Editorial Heading */}
        <h1 className={styles.heading}>
          This Page<br />Does Not Exist.
        </h1>

        {/* Supporting System Copy */}
        <p className={styles.description}>
          The requested coordinate could not be located in the AMEYA telemetry system.
          The path may have been decommissioned, re-routed, or temporarily severed from the central relay.
        </p>

        {/* Diagnostic Metadata Panel */}
        <div className={styles.diagnosticPanel}>
          <div className={styles.diagItem}>
            <span className={styles.diagKey}>STATUS</span>
            <span className={styles.diagValueOffline}>OFFLINE</span>
          </div>
          <div className={styles.diagItem}>
            <span className={styles.diagKey}>CODE</span>
            <span className={styles.diagValue}>HTTP 404</span>
          </div>
          <div className={styles.diagItem}>
            <span className={styles.diagKey}>NODE</span>
            <span className={styles.diagValue}>UNKNOWN_RELAY</span>
          </div>
          <div className={styles.diagItem}>
            <span className={styles.diagKey}>LATENCY</span>
            <span className={styles.diagValue}>0.00 MS</span>
          </div>
        </div>

        {/* Actions Row */}
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <span>RETURN TO HOME</span>
            <ArrowRight size={14} />
          </Link>
          <Link href="/events" className={styles.secondaryLink}>
            <span>EXPLORE EVENTS</span>
            <Compass size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
