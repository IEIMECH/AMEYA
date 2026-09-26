import Link from "next/link";
import { Mail, MapPin, Phone, ArrowRight, ExternalLink, ShieldCheck, Clock } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
  title: "Operations & Contact — AMEYA '26 | IEI SAME",
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
        {/* Header */}
        <div className={styles.metaLabel}>
          <span className={styles.metaDot} />
          COMMS // OPERATIONS DESK
        </div>

        <h1 className={styles.heading}>Connect With The AMEYA Team</h1>
        <p className={styles.subtext}>
          Direct communication channels to the organizing cadre, arena directors, and secretariat at VVITU.
        </p>

        {/* Communication Channels Grid */}
        <div className={styles.channelsGrid}>
          {channels.map((ch, idx) => (
            <div key={idx} className={styles.channelCard}>
              <div className={styles.channelTop}>
                <span className={styles.channelCode}>{ch.code}</span>
                <span className={styles.activeDot}>● ONLINE</span>
              </div>
              <h2 className={styles.channelTitle}>{ch.label}</h2>
              <p className={styles.channelDesc}>{ch.desc}</p>
              <a href={`mailto:${ch.email}`} className={styles.emailLink}>
                <Mail size={13} />
                <span>{ch.email}</span>
                <ArrowRight size={12} className={styles.arrowIcon} />
              </a>
            </div>
          ))}
        </div>

        {/* Campus Location & Coordinates Panel */}
        <div className={styles.campusCard}>
          <div className={styles.campusInfo}>
            <div className={styles.campusBadge}>
              <MapPin size={14} color="#E51D25" />
              <span>PHYSICAL CAMPUS COORDINATES</span>
            </div>
            <h3 className={styles.campusTitle}>Department of Mechanical Engineering</h3>
            <p className={styles.campusAddress}>
              Vasireddy Venkatadri Institute of Technology (VVITU)<br />
              Nambur, Guntur District, Andhra Pradesh &ndash; 522508
            </p>
            <div className={styles.campusMeta}>
              <span>LAT: 16.3685° N</span>
              <span>LONG: 80.5284° E</span>
              <span>ELEVATION: 24M</span>
            </div>
          </div>

          <div className={styles.campusActions}>
            <a
              href="https://maps.google.com/?q=VVIT+Guntur"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapBtn}
            >
              <span>OPEN GOOGLE MAPS</span>
              <ExternalLink size={13} />
            </a>
            <Link href="/venue" className={styles.venueBtn}>
              <span>LAUNCH 3D DIGITAL TWIN</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
