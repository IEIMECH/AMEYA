import styles from "./page.module.css";
import { Calendar, Clock, MapPin, CheckCircle, Bus, Train, Car, ShieldAlert, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Information & Guidelines — AMEYA '26 | IEI SAME",
  description: "Official participation guidelines, accommodation options, reporting protocols, code of conduct, and transport logistics for AMEYA '26 delegates.",
};

export default function InfoPage() {
  const items = [
    { title: "Dates", main: "October 04–05, 2026", sub: "Friday and Saturday", icon: <Calendar size={18} color="#e61d1d" /> },
    { title: "Timings", main: "09:00 AM – 06:30 PM", sub: "Badge Verification: 08:00 AM", icon: <Clock size={18} color="#ff3b3b" /> },
    { title: "Venue", main: "VVITU Main Campus", sub: "Nambur, Guntur • NH-16", icon: <MapPin size={18} color="#ffffff" /> },
    { title: "Eligibility", main: "Engineering Undergrads", sub: "All Colleges • All Years", icon: <CheckCircle size={18} color="#d8d8d8" /> },
  ];

  const guides = [
    "Carry a valid institutional college identity card for security clearance at the main gate.",
    "Present your digital ticket QR code or registration ID at the Mechanical Department registration desk.",
    "Badging desk opens at 08:00 AM. Keynote address commences promptly at 09:15 AM in the Main Auditorium.",
    "Participants in HackSprint and Robo Rumble must report 45 minutes prior for hardware safety inspection.",
    "High-speed campus Wi-Fi access credentials will be provided upon badge verification.",
    "Complimentary lunch and refreshment passes included for all registered arena participants.",
    "Decisions of faculty adjudicators and technical judges are definitive and irrevocable.",
  ];

  return (
    <div className={styles.page}>
      {/* Ghost Industrial Watermark */}
      <div className="ghost-watermark">LOGISTICS</div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className={styles.header}>
          <div className="section-label">
            <ShieldAlert size={13} />
            OPERATIONS &amp; PROTOCOL // 2026
          </div>
          <h1>
            Event <span className="gradient-text">Information</span>
          </h1>
          <p className={styles.sub}>
            [DIRECTIVE // CONCLAVE]: Essential operational guidelines, schedule parameters, and campus logistics for Ameya &apos;26.
          </p>
        </div>

        {/* Quick Specs Grid */}
        <div className={styles.grid}>
          {items.map((c) => (
            <div key={c.title} className={`glass-card ${styles.specCard}`}>
              <span className={styles.crosshairTL}>+</span>
              <span className={styles.crosshairTR}>+</span>
              <div className={styles.specHead}>
                <span className={styles.specIconBox}>{c.icon}</span>
                <span className={styles.specLabel}>{c.title}</span>
              </div>
              <h3 className={styles.specMain}>{c.main}</h3>
              <p className={styles.specSub}>{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Transit Guide */}
        <div className={`glass-card ${styles.travelCard}`}>
          <span className={styles.crosshairTL}>+</span>
          <span className={styles.crosshairTR}>+</span>
          <div className={styles.cardHeader}>
            <div className="section-label" style={{ marginBottom: "0.5rem" }}>TRANSIT PROTOCOL // ACCESS</div>
            <h2>How to Reach VVITU Campus</h2>
            <p style={{ color: "#888888", fontSize: "0.95rem" }}>
              Vasireddy Venkatadri Institute of Technology is situated directly on the national arterial NH-16 connecting Vijayawada and Guntur.
            </p>
          </div>

          <div className={styles.transitGrid}>
            <div className={styles.transitItem}>
              <div className={styles.transitHead}>
                <Bus size={18} color="#e61d1d" />
                <h4>By Bus (APSRTC)</h4>
              </div>
              <p>
                Board express buses operating between Pandit Nehru Bus Station (Vijayawada) and NTR Bus Station (Guntur). Alight at the designated <strong>VVITU Stage Stop</strong> on NH-16.
              </p>
            </div>

            <div className={styles.transitItem}>
              <div className={styles.transitHead}>
                <Train size={18} color="#ff3b3b" />
                <h4>By Railway</h4>
              </div>
              <p>
                Nearest hubs: Guntur Junction (14 km) and Vijayawada Junction (24 km). College shuttle services and ride-hails operate round-the-clock from both terminals.
              </p>
            </div>

            <div className={styles.transitItem}>
              <div className={styles.transitHead}>
                <Car size={18} color="#ffffff" />
                <h4>By Personal Vehicle / Cabs</h4>
              </div>
              <p>
                Navigate via NH-16 towards Nambur. Dedicated participant parking is allocated adjacent to the Mechanical Engineering Workshop Complex.
              </p>
            </div>
          </div>
        </div>

        {/* Rules & Guidelines */}
        <div className={`glass-card ${styles.rulesCard}`}>
          <span className={styles.crosshairTL}>+</span>
          <span className={styles.crosshairTR}>+</span>
          <div className={styles.cardHeader}>
            <div className="section-label" style={{ marginBottom: "0.5rem" }}>OFFICIAL CONDUCT // RULES</div>
            <h2>General Conclave Regulations</h2>
          </div>
          <ul className={styles.ruleList}>
            {guides.map((g, i) => (
              <li key={i} className={styles.ruleItem}>
                <ShieldCheck size={16} color="#e61d1d" className={styles.ruleIcon} />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
