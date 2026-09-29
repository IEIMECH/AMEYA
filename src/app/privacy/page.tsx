import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Privacy Protocol — AMEYA '26 | IEI SAME",
  description: "Data protection and privacy guidelines governing delegate registration, badge credentials, and event communications.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.metaLabel}>
          <span className={styles.metaDot} />
          PROTOCOL // PRIVACY
        </div>

        <h1 className={styles.heading}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>LAST UPDATED: OCTOBER 2026 // REVISION 2.6</p>

        <div className={styles.article}>
          <section className={styles.sectionBlock}>
            <div className={styles.sectionNumber}>1.0</div>
            <div className={styles.sectionContent}>
              <h2>Scope &amp; Data Governance</h2>
              <p>
                This Privacy Protocol governs how the AMEYA &apos;26 Organizing Cadre, Department of Mechanical Engineering,
                and the Institution of Engineers India (SAME Student Chapter) at Vasireddy Venkatadri Institute of Technology (VVITU)
                collect, store, and process delegate information.
              </p>
            </div>
          </section>

          <section className={styles.sectionBlock}>
            <div className={styles.sectionNumber}>2.0</div>
            <div className={styles.sectionContent}>
              <h2>Information Collected</h2>
              <p>
                We only collect data strictly necessary for festival accreditation and competition adjudication:
              </p>
              <ul>
                <li>Full Delegate Name and Academic Year.</li>
                <li>Institutional Affiliation (College / University name).</li>
                <li>Direct Communications Address (Email &amp; Mobile Phone Number).</li>
                <li>Competition Team Rosters and Hardware Category registrations.</li>
              </ul>
            </div>
          </section>

          <section className={styles.sectionBlock}>
            <div className={styles.sectionNumber}>3.0</div>
            <div className={styles.sectionContent}>
              <h2>Telemetry &amp; Event Badging</h2>
              <p>
                During the two days of AMEYA &apos;26 (October 04–05, 2026), physical badge taps and RFID checkpoints are used
                exclusively for campus crowd telemetry, arena occupancy management, and verified certificate generation.
                We do not sell, rent, or distribute delegate telemetry to third-party marketing brokers.
              </p>
            </div>
          </section>

          <section className={styles.sectionBlock}>
            <div className={styles.sectionNumber}>4.0</div>
            <div className={styles.sectionContent}>
              <h2>Institutional Sponsors &amp; Industry Alliances</h2>
              <p>
                Certain industry challenge arenas (e.g., Bosch Mechatronics, Tata Technologies Powertrain) offer direct recruitment
                and internship opportunities. Delegate profiles are only shared with corporate partners with explicit delegate consent.
              </p>
            </div>
          </section>

          <section className={styles.sectionBlock}>
            <div className={styles.sectionNumber}>5.0</div>
            <div className={styles.sectionContent}>
              <h2>Data Retention &amp; Erasure</h2>
              <p>
                Accreditation data is retained for 90 days post-event for verification of merit certificates and cash prize disbursement.
                Delegates may request complete erasure of contact records by transmitting a request to <code>ieisame@vvitu.edu.in</code>.
              </p>
            </div>
          </section>
        </div>

        <div className={styles.footerLink}>
          <Link href="/terms">&larr; Review Terms &amp; Conditions</Link>
        </div>
      </div>
    </div>
  );
}
