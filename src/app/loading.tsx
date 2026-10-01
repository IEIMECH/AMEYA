import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingCard}>
        <div className={styles.reticleRing} aria-hidden="true" />
        <div className={styles.statusLabel}>
          <span className={styles.statusPulse} />
          INITIALIZING TELEMETRY...
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} />
        </div>
        <div className={styles.metaStatus}>
          <span>LOADING AMEYA '26</span>
          <span>NODE: VVITU_APEX</span>
        </div>
      </div>
    </div>
  );
}
