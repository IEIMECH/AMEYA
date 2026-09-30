import { Bus, Train, Plane } from "lucide-react";
import Venue3DViewer from "@/components/venue/Venue3DViewer";
import styles from "./page.module.css";

export const metadata = {
  title: "Venue & Interactive 3D Map - AMEYA '26 | IEI SAME",
  description: "Interactive 3D campus navigation, seminar hall coordinates, laboratory tracks, and transit directions for AMEYA '26 at Vasireddy Venkatadri Institute of Technology, Nambur.",
};

export default function VenuePage() {
  const halls = [
    {
      name: "MAIN AUDITORIUM",
      zone: "Central Block",
      capacity: "500",
      events: "Keynote · Inauguration · Valedictory",
    },
    {
      name: "KINETIC TRACK ARENA",
      zone: "Mechanical Block",
      capacity: "350",
      events: "RC Car Challenge · Speed Race",
    },
    {
      name: "COMPUTER SIMULATION LAB",
      zone: "Technology Tower",
      capacity: "120",
      events: "AutoCAD Championship",
    },
    {
      name: "DESIGN & DRAFTING STUDIO",
      zone: "Design Block",
      capacity: "80",
      events: "Engineering Drawing Competition",
    },
    {
      name: "MECHANICAL MACHINE SHOP",
      zone: "Workshop Block",
      capacity: "200",
      events: "Assemble & Disassemble · Tools Identification",
    },
    {
      name: "MAKERSPACE & DEMO ARENA",
      zone: "Central Courtyard",
      capacity: "400",
      events: "Treasure Hunt · Interactive Exhibits",
    },
  ];

  return (
    <div className={styles.page}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header: Clean Spatial Pattern with No Red Badge */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            Venue &amp; <span className={styles.titleAccent}>Interactive 3D Map</span>
          </h1>
          <p className={styles.sub}>
            Explore the VVITU Nambur campus in 3D, locate championship arenas, and plan your route.
          </p>
        </header>

        {/* 3D Model Explorer Centerpiece Hero */}
        <Venue3DViewer />

        {/* Arenas & Halls Editorial Cards */}
        <section className={styles.sectionArea} aria-labelledby="arenas-halls-title">
          <h2 id="arenas-halls-title" className={styles.sectionTitle}>
            Event Locations &amp; Facilities
          </h2>

          <div className={styles.hallsGrid}>
            {halls.map((h, i) => (
              <article key={i} className={styles.hallCard}>
                <div className={styles.hallHeader}>
                  <h3 className={styles.hallName}>{h.name}</h3>
                  <span className={styles.hallZone}>{h.zone}</span>
                </div>

                <div className={styles.hallMetaSection}>
                  <div className={styles.hallMetaLabel}>CAPACITY</div>
                  <div className={styles.hallCapacity}>{h.capacity}</div>
                  
                  <div className={styles.hallEventsLabel}>KEY EVENTS</div>
                  <p className={styles.hallEvents}>{h.events}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Directions & Travel Guide */}
        <section className={styles.travelCard} aria-labelledby="travel-guide-title">
          <div className={styles.travelHead}>
            <Bus size={20} color="var(--accent)" />
            <h3 id="travel-guide-title" className={styles.travelTitle}>
              How to Reach VVITU Campus
            </h3>
          </div>
          <p className={styles.travelDesc}>
            Vasireddy Venkatadri Institute of Technology (VVITU) is situated directly along the NH-16 arterial expressway connecting Guntur and Vijayawada.
          </p>

          <div className={styles.transitGrid}>
            <div className={styles.transitItem}>
              <div className={styles.transitItemHead}>
                <Train size={16} color="var(--accent)" />
                <h4 className={styles.transitItemTitle}>By Train</h4>
              </div>
              <p className={styles.transitItemDesc}>
                Guntur Junction (12 km) &amp; Vijayawada Junction (24 km). Direct college express shuttles run every 30 mins from stations.
              </p>
            </div>

            <div className={styles.transitItem}>
              <div className={styles.transitItemHead}>
                <Bus size={16} color="var(--accent)" />
                <h4 className={styles.transitItemTitle}>By Bus</h4>
              </div>
              <p className={styles.transitItemDesc}>
                APSRTC express buses between Vijayawada and Guntur stop directly at the designated Nambur VVIT Bus Stop.
              </p>
            </div>

            <div className={styles.transitItem}>
              <div className={styles.transitItemHead}>
                <Plane size={16} color="var(--accent)" />
                <h4 className={styles.transitItemTitle}>By Flight</h4>
              </div>
              <p className={styles.transitItemDesc}>
                Vijayawada International Airport (Gannavaram - 42 km). Taxis and app rides available directly to campus.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}