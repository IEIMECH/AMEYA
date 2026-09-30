import Link from "next/link";
import { Mail, MapPin, ArrowRight, ExternalLink } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
  title: "Operations & Contact - AMEYA '26 | IEI SAME",
  description: "Official festival operations desk, direct inquiry channels, and physical location coordinates at VVITU Nambur.",
};

const channels = [
  {
    code: "SEC // 01",
    label: "GENERAL ENQUIRIES",
    email: "ieisame@vvitu.edu.in",
    desc: "Festival schedule, university permissions, and general delegate inquiries.",
  },
  {
    code: "SEC // 02",
    label: "EVENT REGISTRATION",
    email: "register@ameyafest.org",
    desc: "Team slots, eligibility verification, arena entry fees, and certificate re-issues.",
  },
  {
    code: "SEC // 03",
    label: "SPONSORSHIP & PARTNERS",
    email: "sponsor@ameyafest.org",
    desc: "Corporate branding, recruitment stalls, challenge problem statements, and awards.",
  },
  {
    code: "SEC // 04",
    label: "PUBLICITY & MEDIA",
    email: "publicity@ameyafest.org",
    desc: "Campus ambassador network, collegiate invitations, and press passes.",
  },
  {
    code: "SEC // 05",
    label: "TECHNICAL ARENA SUPPORT",
    email: "tech@ameyafest.org",
    desc: "Hardware specifications, arena power supplies, robot dimensions, and weigh-in.",
  },
];

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header: Functional Pattern without Red Badge */}
        <h1 className={styles.heading}>
          Connect With <span className={styles.headingAccent}>The AMEYA Team</span>
        </h1>
        <p className={styles.subtext}>
          Direct communication channels to the organizing cadre, arena directors, and secretariat at VVITU.
        </p>

        {/* Communication Channels Grid */}
        <div className={styles.channelsGrid}>
          {channels.map((ch, idx) => (
            <div key={idx} className={styles.channelCard}>
              <div className={styles.channelHeader}>
                <span className={styles.channelCode}>{ch.code}</span>
                <span className={styles.channelLabel}>{ch.label}</span>
              </div>
              <p className={styles.channelDesc}>{ch.desc}</p>
              <a href={`mailto:${ch.email}`} className={styles.channelEmail}>
                <Mail size={13} color="var(--accent)" />
                <span>{ch.email}</span>
                <ArrowRight size={12} className={styles.arrow} />
              </a>
            </div>
          ))}
        </div>

        {/* Campus Location & Coordinates Panel */}
        <div className={styles.inquirySection}>
          <h2 className={styles.inquiryTitle}>Department of Mechanical Engineering</h2>
          <p className={styles.inquirySub}>
            Vasireddy Venkatadri Institute of Technology (VVITU)<br />
            NH-16, Nambur, Guntur District, Andhra Pradesh &ndash; 522508
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <a
              href="https://maps.google.com/?q=VVIT+Guntur"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <span>OPEN GOOGLE MAPS</span>
              <ExternalLink size={13} />
            </a>
            <Link href="/venue" className="btn-secondary">
              <span>EXPLORE 3D CAMPUS MAP</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}