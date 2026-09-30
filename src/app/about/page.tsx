import { Lightbulb, Target, Users, Award } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
  title: "About & Engineering Legacy - AMEYA '26 | IEI SAME",
  description: "Discover the engineering heritage and vision of AMEYA - organized by the Department of Mechanical Engineering and IEI Students' Chapter at VVIIT Nambur.",
};

const pillars = [
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Challenging conventional kinematic paradigms through rapid prototyping, generative CAD modeling, and advanced mechanics.",
    tag: "01",
  },
  {
    icon: Target,
    title: "Competition",
    desc: "High-octane obstacle tracks, mechatronic assembly, and timed precision manufacturing challenges under rigorous standards.",
    tag: "02",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Uniting collegiate innovators, practicing researchers, and faculty mentors in an authentic collaborative forum.",
    tag: "03",
  },
  {
    icon: Award,
    title: "Excellence",
    desc: "Rewarding craftsmanship, software mastery, and rigorous engineering problem solving across two championship days.",
    tag: "04",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Editorial Header (No Red Badges) */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            What is <span className={styles.titleAccent}>Ameya</span>?
          </h1>
          <p className={styles.leadIntro}>
            The flagship mechanical engineering technical conclave of VVITU Nambur, forged by the IEI SAME Student Chapter.
          </p>
          <p className={styles.sub}>
            An authentic proving ground where theoretical continuum mechanics meets the physical reality of precision machining, robotics, and design.
          </p>
        </header>

        <div className={styles.editorialDivider} aria-hidden="true" />

        {/* Section 1: The Name - Ameya (Sitting directly on background) */}
        <section className={styles.editorialSection} aria-labelledby="the-name-heading">
          <h2 id="the-name-heading" className={styles.sectionHeading}>
            The Name &mdash; Ameya (अमेय)
          </h2>
          <p className={styles.paragraph}>
            Derived from classical Sanskrit, <strong>Ameya</strong> translates to <em>immeasurable</em> or <em>boundless</em>. It honors the limitless intellectual and creative ambition of the mechanical engineer &mdash; from transforming raw billet steel into precision linkages to architecting automated kinematics that transcend standard textbooks.
          </p>
          <p className={styles.paragraph}>
            Since its founding, Ameya has served as the annual benchmark festival for the Department of Mechanical Engineering at Vasireddy Venkatadri Institute of Technology &mdash; a crucible where engineering rigor is celebrated through hands-on fabrication, algorithmic CAD drafting, and kinetic speed.
          </p>
        </section>

        <div className={styles.editorialDivider} aria-hidden="true" />

        {/* Section 2: Two-Column Institutional Narrative */}
        <section className={styles.editorialSection} aria-labelledby="chapter-vision-heading">
          <div className={styles.twoColGrid}>
            <div>
              <h3 id="chapter-vision-heading" className={styles.colHeading}>
                What is IEI SAME?
              </h3>
              <p className={styles.paragraph}>
                <strong>IEI SAME</strong> represents the <strong>Institution of Engineers India &mdash; Student Activity for Mechanical Engineers</strong>. It is the premier chartered technical student body of the Mechanical Engineering Department at VVITU Nambur, Andhra Pradesh.
              </p>
              <p className={styles.paragraph}>
                Affiliated with the prestigious national Institution of Engineers (India), IEI SAME bridges academic coursework with industrial craft through technical symposiums, hands-on workshop competitions, and national conventions.
              </p>
            </div>

            <div>
              <h3 className={styles.colHeading}>
                Why This Fest?
              </h3>
              <p className={styles.paragraph}>
                Ameya was created from a single conviction: student engineers deserve an arena larger than the lecture hall. A proving ground to stress-test designs against the clock, debate emerging manufacturing methods, and celebrate the unyielding discipline of mechanical craftsmanship.
              </p>
              <p className={styles.paragraph}>
                Every edition convenes hundreds of aspiring innovators, machinists, and designers from across regional colleges, directed and orchestrated entirely by student council engineers.
              </p>
            </div>
          </div>
        </section>

        <div className={styles.editorialDivider} aria-hidden="true" />

        {/* Section 3: Interactive Pillars */}
        <section aria-labelledby="pillars-heading" style={{ marginBottom: "2rem" }}>
          <div className={styles.pillarsHeader}>
            <h2 id="pillars-heading" className={styles.pillarsTitle}>
              Our Core <span className={styles.titleAccent}>Pillars</span>
            </h2>
            <p className={styles.pillarsSubtitle}>Four Foundational Principles</p>
          </div>

          <div className={styles.pillarsGrid}>
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className={styles.pillarCard}>
                  <div className={styles.pillarIconBox}>
                    <Icon size={20} />
                  </div>
                  <div className={styles.pillarIndex}>PILLAR // {pillar.tag}</div>
                  <h3 className={styles.pillarName}>{pillar.title}</h3>
                  <p className={styles.pillarDesc}>{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}