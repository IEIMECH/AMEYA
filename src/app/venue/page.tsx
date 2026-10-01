import { Bus, Phone, MapPin } from "lucide-react";
import Venue3DViewer from "@/components/venue/Venue3DViewer";
import BusScheduleViewer from "@/components/venue/BusScheduleViewer";
import { BUS_SCHEDULE_CONFIG } from "@/data/transportation";
import styles from "./page.module.css";

export const metadata = {
  title: "Venue & Interactive 3D Map - AMEYA '26 | IEI SAME",
  description: "Interactive 3D campus navigation, venue coordinates, and college bus transportation information for AMEYA '26 at Vasireddy Venkatadri Institute of Technology, Nambur.",
};

export default function VenuePage() {
  return (
    <div className={styles.page}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            Venue &amp; <span className={styles.titleAccent}>Interactive 3D Map</span>
          </h1>
          <p className={styles.sub}>
            Explore the VVIT Central Campus Complex in 3D, locate championship arenas, and plan your journey with college bus transportation.
          </p>
        </header>

        {/* 3D Model Explorer Centerpiece Hero */}
        <Venue3DViewer />

        {/* Venue Information & Address */}
        <section className={styles.venueInfoCard} aria-label="Campus Venue Information">
          <div className={styles.venueInfoContent}>
            <MapPin size={24} className={styles.venuePinIcon} />
            <div className={styles.venueInfoText}>
              <h3>Vasireddy Venkatadri Institute of Technology (Autonomous)</h3>
              <p>
                NH-16 Bypass Expressway, Nambur (V), Pedakakani (M), Guntur District, Andhra Pradesh - 522508.
                Located conveniently on the primary corridor between Guntur (11 km) and Vijayawada (22 km).
              </p>
            </div>
          </div>
        </section>

        {/* Transportation – College Bus Facility */}
        <section className={styles.transportCard} aria-labelledby="transport-bus-title">
          <div className={styles.transportHead}>
            <Bus size={24} color="var(--accent)" />
            <h2 id="transport-bus-title" className={styles.transportTitle}>
              Transportation &ndash; College Bus Facility
            </h2>
          </div>
          <p className={styles.transportDesc}>
            Convenient transportation facilities will be provided through college buses for registered participants. Participants can board the college buses according to the published bus schedule.
          </p>

          {/* Transport & Hospitality Point of Contact */}
          <div className={styles.pocCallout}>
            <div className={styles.pocCalloutInfo}>
              <span className={styles.pocCalloutTag}>{BUS_SCHEDULE_CONFIG.poc.title}</span>
              <h3 className={styles.pocCalloutName}>{BUS_SCHEDULE_CONFIG.poc.name}</h3>
              <p className={styles.pocCalloutDesc}>{BUS_SCHEDULE_CONFIG.poc.description}</p>
            </div>
            <a href={`tel:${BUS_SCHEDULE_CONFIG.poc.phone.replace(/\s+/g, '')}`} className={styles.pocCalloutLink}>
              <Phone size={14} />
              <span>{BUS_SCHEDULE_CONFIG.poc.phone}</span>
            </a>
          </div>

          {/* College Bus Schedule PDF Viewer */}
          <BusScheduleViewer />
        </section>
      </div>
    </div>
  );
}
