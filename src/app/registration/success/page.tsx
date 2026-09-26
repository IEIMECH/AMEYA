import Link from "next/link";
import { Check, Calendar, ArrowRight, ShieldCheck, Terminal, Compass } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
  title: "Registration Confirmed — AMEYA '26 | IEI SAME",
  description: "Your delegate credentials for AMEYA '26 have been generated and confirmed.",
};

export default function RegistrationSuccessPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* System Confirmation Header */}
        <div className={styles.headerLabel}>
          <span className={styles.pulseDot} />
          REGISTRATION // CONFIRMED // AUTH HANDSHAKE SUCCESS
        </div>

        <h1 className={styles.heading}>You&apos;re In.</h1>

        <p className={styles.subtext}>
          Your delegate credentials have been verified and encrypted into the AMEYA &apos;26 conclave register.
          An official confirmation dossier has been dispatched to your communications address.
        </p>

        {/* Technical Confirmation Dossier Panel */}
        <div className={styles.dossierCard}>
          <div className={styles.dossierTop}>
            <div className={styles.dossierBadge}>
              <ShieldCheck size={13} color="#E51D25" />
              <span>IEI SAME COUNCIL VALIDATED</span>
            </div>
            <span className={styles.statusActive}>● ACTIVE CADRE</span>
          </div>

          <div className={styles.dossierGrid}>
            <div className={styles.dossierItem}>
              <span className={styles.dossierKey}>REGISTRATION ID</span>
              <span className={styles.dossierValueHighlight}>AMEYA-2026-REG-8492</span>
            </div>
            <div className={styles.dossierItem}>
              <span className={styles.dossierKey}>CONCLAVE DATES</span>
              <span className={styles.dossierValue}>OCTOBER 04–05, 2026</span>
            </div>
            <div className={styles.dossierItem}>
              <span className={styles.dossierKey}>CAMPUS VENUE</span>
              <span className={styles.dossierValue}>VVITU NAMBUR // MECHANICAL FOYER</span>
            </div>
            <div className={styles.dossierItem}>
              <span className={styles.dossierKey}>SECURITY CLEARANCE</span>
              <span className={styles.dossierValue}>LEVEL-2 DELEGATE</span>
            </div>
          </div>

          <div className={styles.nextStepsBox}>
            <div className={styles.nextStepTitle}>OPERATIONAL PROTOCOL FOR DAY 01:</div>
            <p className={styles.nextStepText}>
              Report to the Central Registration Desk at the Mechanical Engineering Foyer between 08:00 and 09:00 IST on October 04.
              Present your Registration ID or College Identity Card to claim your physical NFC attendee badge and competition briefing pack.
            </p>
          </div>
        </div>

        {/* Action Row */}
        <div className={styles.actions}>
          <Link href="/events" className={styles.primaryBtn}>
            <span>VIEW EVENT ARENAS</span>
            <ArrowRight size={14} />
          </Link>
          <Link href="/agenda" className={styles.secondaryBtn}>
            <Calendar size={14} />
            <span>CONCLAVE SCHEDULE</span>
          </Link>
          <Link href="/" className={styles.tertiaryLink}>
            <span>BACK TO HOMEPAGE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
