import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Terms & Conditions — AMEYA '26 | IEI SAME",
  description: "Official fest regulations, competition safety indemnification, ticket policies, and delegate code of conduct.",
};

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.metaLabel}>
          <span className={styles.metaDot} />
          PROTOCOL // TERMS
        </div>

        <h1 className={styles.heading}>Terms &amp; Conditions</h1>
        <p className={styles.lastUpdated}>OFFICIAL CODE OF REGULATIONS // VVITU 2026</p>

        <div className={styles.article}>
          <section className={styles.sectionBlock}>
            <div className={styles.sectionNumber}>1.0</div>
            <div className={styles.sectionContent}>
              <h2>Admission &amp; Credentials</h2>
              <p>
                Admission to AMEYA &apos;26 requires verified registration through the official portal.
                All delegates must present valid college identification upon entry. Badges are strictly non-transferable
                and must be displayed visibly inside all competition halls and laboratories.
              </p>
            </div>
          </section>

          <section className={styles.sectionBlock}>
            <div className={styles.sectionNumber}>2.0</div>
            <div className={styles.sectionContent}>
              <h2>Arena Safety &amp; Kinetic Indemnification</h2>
              <p>
                High-energy competition arenas (including RoboWars 30kg combat, drone trials, and high-speed CNC tests)
                operate under strict safety protocols. Participants must obey all arena marshals and emergency disconnect procedures.
                Teams bear full responsibility for the mechanical containment and battery charging safety of their entries.
              </p>
            </div>
          </section>

          <section className={styles.sectionBlock}>
            <div className={styles.sectionNumber}>3.0</div>
            <div className={styles.sectionContent}>
              <h2>Intellectual Property &amp; Research Defense</h2>
              <p>
                All designs, source code, CAD assemblies, and research papers presented at AMEYA &apos;26 remain the exclusive
                intellectual property of the respective student creators. By participating, authors grant IEI SAME the non-exclusive
                license to archive and feature abstract summaries in the festival proceedings.
              </p>
            </div>
          </section>

          <section className={styles.sectionBlock}>
            <div className={styles.sectionNumber}>4.0</div>
            <div className={styles.sectionContent}>
              <h2>Jury Rulings &amp; Prize Disbursal</h2>
              <p>
                The evaluations rendered by academic and industrial juries across all 10 arenas are final and binding.
                Cash awards will be disbursed via authorized direct electronic transfer to the designated team lead
                within 14 working days following the closing plenary.
              </p>
            </div>
          </section>

          <section className={styles.sectionBlock}>
            <div className={styles.sectionNumber}>5.0</div>
            <div className={styles.sectionContent}>
              <h2>Delegate Code of Conduct</h2>
              <p>
                AMEYA &apos;26 is committed to an inclusive, respectful, and safe collaborative environment.
                Unethical conduct, equipment tampering, harassment, or deliberate property damage will result in immediate disqualification
                and expulsion from the VVITU campus premises.
              </p>
            </div>
          </section>
        </div>

        <div className={styles.footerLink}>
          <Link href="/privacy">&larr; Review Privacy Protocol</Link>
        </div>
      </div>
    </div>
  );
}
