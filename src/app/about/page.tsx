import styles from "./page.module.css";
import { Lightbulb, Target, Users, Award, ShieldAlert, Sparkles } from "lucide-react";

export const metadata = {
  title: "About & Engineering Legacy — AMEYA '26 | IEI SAME",
  description: "Discover the engineering heritage and vision of AMEYA — organized by the Department of Mechanical Engineering and IEI Students' Chapter at VVIIT Nambur.",
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Ghost Industrial Watermark */}
      <div className="ghost-watermark">HERITAGE</div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className={styles.header}>
          <div className="section-label">
            <ShieldAlert size={13} />
            HERITAGE &amp; IDENTITY // AMEYA
          </div>
          <h1>
            What is <span className="gradient-text">Ameya</span>?
          </h1>
          <p className={styles.sub}>
            [GENESIS // RECORD]: The chronicle of VVITU&apos;s premier mechanical technical fest, founded under the aegis of IEI SAME.
          </p>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          <div className={`glass-card ${styles.mainCard}`}>
            <span className={styles.crosshairTL}>+</span>
            <span className={styles.crosshairTR}>+</span>
            <div className={styles.hudCorner}>SEC // NOMENCLATURE</div>
            <h2>The Name — Ameya (अमेय)</h2>
            <p>
              Derived from classical Sanskrit, <strong>Ameya</strong> translates to <em>immeasurable</em> or <em>boundless</em>. It embodies the limitless intellectual and creative potential of the mechanical engineer — from forging raw billet steel to architecting autonomous kinematics that transcend textbooks.
            </p>
            <p>
              Since its inception, Ameya has stood as the pinnacle technical conclave of the Department of Mechanical Engineering at Vasireddy Venkatadri Institute of Technology (VVITU) — an authentic proving ground where theoretical mechanics meet physical realization.
            </p>
          </div>

          {/* Two-Column Institutional Grid */}
          <div className={styles.twoCol}>
            <div className={`glass-card ${styles.infoCard}`}>
              <span className={styles.crosshairTL}>+</span>
              <span className={styles.crosshairTR}>+</span>
              <div className={styles.hudCorner}>MECH // IEI SAME</div>
              <h3>What is IEI SAME?</h3>
              <p>
                <strong>IEI SAME</strong> represents the <strong>Institution of Engineers India — Student Activity for Mechanical Engineers</strong>. It is the premier chartered technical student body of the Mechanical Engineering Department at VVITU Nambur, Andhra Pradesh.
              </p>
              <p>
                Affiliated with the prestigious Institution of Engineers (India), IEI SAME bridges academic rigor with industrial reality through hands-on technical symposiums, robotic combat arenas, and national conclaves.
              </p>
            </div>

            <div className={`glass-card ${styles.infoCard}`}>
              <span className={styles.crosshairTL}>+</span>
              <span className={styles.crosshairTR}>+</span>
              <div className={styles.hudCorner}>CONCLAVE // GENESIS</div>
              <h3>Why This Fest?</h3>
              <p>
                Ameya was forged from a singular conviction: that student engineers deserve an arena larger than the lecture hall. A crucible to stress-test designs, debate cutting-edge research, and celebrate the unyielding craft of precision engineering.
              </p>
              <p>
                Every autumn, Ameya convenes hundreds of aspiring innovators, machinists, and coders from across India, entirely directed and orchestrated by student engineers.
              </p>
            </div>
          </div>

          {/* Pillars of Engineering */}
          <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "1rem" }}>
            <div className="section-label">CORE VALUES // DOCTRINE</div>
            <h2 className={styles.centeredH2}>Our Core Pillars</h2>
          </div>

          <div className={styles.pillars}>
            {[
              {
                icon: <Lightbulb size={22} />,
                title: "Innovation",
                desc: "Challenging conventional kinematic paradigms through rapid prototyping and generative CAD modeling.",
                tag: "PILLAR // 01",
              },
              {
                icon: <Target size={22} />,
                title: "Competition",
                desc: "High-octane robotic combat, mechatronic troubleshooting, and timed precision design challenges.",
                tag: "PILLAR // 02",
              },
              {
                icon: <Users size={22} />,
                title: "Community",
                desc: "Uniting collegiate innovators, DRDO scientists, and industry leaders in a shared technical forum.",
                tag: "PILLAR // 03",
              },
              {
                icon: <Award size={22} />,
                title: "Excellence",
                desc: "Rewarding rigor, tight tolerances, and peer-reviewed technical manuscripts with national citations.",
                tag: "PILLAR // 04",
              },
            ].map((p) => (
              <div key={p.title} className={`glass-card ${styles.pillar}`}>
                <span className={styles.crosshairTL}>+</span>
                <span className={styles.crosshairTR}>+</span>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#666666", alignSelf: "flex-start" }}>
                  {p.tag}
                </div>
                <span className={styles.pillarIcon}>
                  {p.icon}
                </span>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className={`glass-card ${styles.statsCard}`}>
            {[
              { num: "05+", label: "Consecutive Editions" },
              { num: "1,200+", label: "Engineers Mobilized" },
              { num: "12+", label: "Technical Arenas" },
              { num: "₹50K+", label: "Validated Prize Pool" },
            ].map((s, i) => (
              <div key={i} className={styles.statItem}>
                <span className={`gradient-text ${styles.statNum}`}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
