import { MapPin, Navigation, Compass, Bus, Train, Plane, ShieldAlert, Activity } from "lucide-react";
import Venue3DViewer from "@/components/venue/Venue3DViewer";
import styles from "./page.module.css";

export const metadata = {
  title: "Venue & 3D Campus Map — AMEYA '26 | IEI SAME",
  description: "Interactive 3D campus navigation, seminar hall coordinates, laboratory tracks, and transit directions for AMEYA '26 at Vasireddy Venkatadri Institute of Technology, Nambur.",
};

export default function VenuePage() {
  const halls = [
    { name: "Main Auditorium (Central)", events: "Keynotes, Inauguration, Valedictory", capacity: 800, floor: "Ground Floor, Admin Block", id: "01" },
    { name: "Kinetic Track Arena", events: "RC Car Challenge, Nuts & Bolts Speed Race", capacity: 350, floor: "Ground Floor, Mechanical Workshop Block", id: "02" },
    { name: "Computer Simulation Lab", events: "AutoCAD Competition", capacity: 120, floor: "2nd Floor, Technology Towers", id: "03" },
    { name: "Design & Drafting Studio", events: "Engineering Drawing Competition", capacity: 80, floor: "1st Floor, Design Block", id: "04" },
    { name: "Mechanical Machine Shop", events: "Assemble & Disassemble, Identify the Tools", capacity: 200, floor: "Ground Floor, Workshop Block", id: "05" },
    { name: "Makerspace & Demo Arena", events: "Live Demo Showcase, Prototype Exhibits", capacity: 400, floor: "Central Open Courtyard", id: "06" },
  ];

  return (
    <div className={styles.page}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header className={styles.header}>
          <div className="section-label">
            <ShieldAlert size={13} />
            SPATIAL TELEMETRY // VVITU NAMBUR
          </div>
          <h1 className={styles.title}>
            Venue &amp; <span className="gradient-text">Interactive 3D Map</span>
          </h1>
          <p className={styles.sub}>
            Explore the VVITU Nambur campus in 3D, find workshop locations, and check event venues.
          </p>
        </header>

        {/* 3D Model Explorer */}
        <Venue3DViewer />

        {/* Arenas & Halls */}
        <section style={{ marginBottom: "4.5rem" }} aria-labelledby="arenas-halls-title">
          <div className={styles.sectionDivider}>
            <h2 id="arenas-halls-title" className={styles.sectionTitle}>
              Event Locations &amp; Facilities
            </h2>
            <div className={styles.dividerLine} aria-hidden="true" />
          </div>

          <div className={styles.hallsGrid}>
            {halls.map((h, i) => (
              <article key={i} className={styles.hallCard}>
                <span className={styles.crosshairTL} aria-hidden="true">+</span>
                <span className={styles.crosshairTR} aria-hidden="true">+</span>

                <div className={styles.hallMeta}>
                  <div>
                    <div className={styles.hallId}>VENUE // {h.id}</div>
                    <h3 className={styles.hallName}>{h.name}</h3>
                  </div>
                  <span className={styles.hallCapacity}>CAP: {h.capacity}</span>
                </div>
                <p className={styles.hallEvents}>{h.events}</p>
                <p className={styles.hallFloor}>
                  <MapPin size={13} color="var(--crimson-core, #E51D25)" />
                  <span>{h.floor}</span>
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Directions & Travel Guide */}
        <section className={styles.travelCard} aria-labelledby="travel-guide-title">
          <span className={styles.crosshairTL} aria-hidden="true">+</span>
          <span className={styles.crosshairTR} aria-hidden="true">+</span>

          <div className={styles.travelHead}>
            <Bus size={22} color="var(--crimson-core, #E51D25)" />
            <h3 id="travel-guide-title" className={styles.travelTitle}>
              How to Reach VVITU Campus
            </h3>
          </div>
          <p className={styles.travelDesc}>
            Vasireddy Venkatadri Institute of Technology (VVITU) is located directly along the Guntur – Vijayawada NH-16 highway in Nambur, Andhra Pradesh.
          </p>

          <div className={styles.transitGrid}>
            <div className={styles.transitItem}>
              <div className={styles.transitItemHead}>
                <Train size={16} color="var(--crimson-core, #E51D25)" />
                <h4 className={styles.transitItemTitle}>By Train</h4>
              </div>
              <p className={styles.transitItemDesc}>
                Guntur Junction (12 km) &amp; Vijayawada Junction (24 km). Direct college express shuttles run every 30 mins from stations.
              </p>
            </div>

            <div className={styles.transitItem}>
              <div className={styles.transitItemHead}>
                <Bus size={16} color="var(--crimson-core, #E51D25)" />
                <h4 className={styles.transitItemTitle}>By Bus</h4>
              </div>
              <p className={styles.transitItemDesc}>
                APSRTC buses running between Vijayawada and Guntur stop directly at Nambur VVIT Bus Stop.
              </p>
            </div>

            <div className={styles.transitItem}>
              <div className={styles.transitItemHead}>
                <Plane size={16} color="var(--crimson-core, #E51D25)" />
                <h4 className={styles.transitItemTitle}>By Flight</h4>
              </div>
              <p className={styles.transitItemDesc}>
                Vijayawada International Airport (Gannavaram - 42 km). Taxis and ride-shares available on arrival.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
