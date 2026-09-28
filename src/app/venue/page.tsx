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
    <div className={styles.venuePage} style={{ background: "transparent", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Ghost Industrial Watermark */}
      <div className="ghost-watermark">CAMPUS_3D</div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="section-label">
            <ShieldAlert size={13} />
            SPATIAL TELEMETRY // VVITU NAMBUR
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", fontWeight: 800, color: "#ffffff", margin: "0.5rem 0 1rem" }}>
            Venue &amp; <span className="gradient-text">Interactive 3D Map</span>
          </h1>
          <p style={{ color: "#888888", fontSize: "0.95rem", maxWidth: "650px", margin: "0 auto", fontFamily: "var(--font-mono)" }}>
            [GEO // COORDINATES]: Explore the VVITU Nambur campus in full interactive 3D, inspect mechanical workshops, and navigate arenas.
          </p>
        </div>

        {/* 3D Model Explorer */}
        <Venue3DViewer />

        {/* Arenas & Halls */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.75rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>
              Event Arenas &amp; Facilities
            </h2>
            <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.08)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {halls.map((h, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  position: "relative",
                  padding: "1.65rem",
                  borderRadius: "4px",
                  background: "#111111",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.85)",
                }}
              >
                <span style={{ position: "absolute", top: 2, left: 4, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", fontSize: 9 }}>+</span>
                <span style={{ position: "absolute", top: 2, right: 4, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", fontSize: 9 }}>+</span>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#666666", letterSpacing: "0.1em" }}>
                      ARENA // {h.id}
                    </div>
                    <h3 style={{ margin: "2px 0 0 0", fontSize: "1.15rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "#ffffff" }}>
                      {h.name}
                    </h3>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      color: "#ff3b3b",
                      background: "rgba(230, 29, 29, 0.08)",
                      border: "1px solid rgba(230, 29, 29, 0.3)",
                      padding: "2px 8px",
                      borderRadius: "2px",
                      fontWeight: 700,
                    }}
                  >
                    CAP: {h.capacity}
                  </span>
                </div>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#e61d1d", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  {h.events}
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#888888", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={12} color="#e61d1d" />
                  {h.floor}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Directions & Travel Guide */}
        <div
          className="glass-card"
          style={{
            position: "relative",
            padding: "2.75rem",
            borderRadius: "4px",
            background: "#111111",
            border: "1px solid rgba(230, 29, 29, 0.35)",
            marginBottom: "4rem",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.9)",
          }}
        >
          <span style={{ position: "absolute", top: 4, left: 6, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)", fontSize: 10 }}>+</span>
          <span style={{ position: "absolute", top: 4, right: 6, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)", fontSize: 10 }}>+</span>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <Bus size={22} color="#e61d1d" />
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>
              How to Reach VVITU Campus
            </h3>
          </div>
          <p style={{ color: "#888888", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "2rem" }}>
            Vasireddy Venkatadri Institute of Technology (VVITU) is located directly along the Guntur – Vijayawada NH-16 highway in Nambur, Andhra Pradesh.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            <div style={{ background: "rgba(0,0,0,0.5)", padding: "1.4rem", borderRadius: "3px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Train size={16} color="#e61d1d" />
                <h4 style={{ color: "#ff3b3b", margin: 0, fontSize: "0.95rem", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>By Train</h4>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#888888", lineHeight: 1.6 }}>
                Guntur Junction (12 km) &amp; Vijayawada Junction (24 km). Direct college express shuttles run every 30 mins from stations.
              </p>
            </div>

            <div style={{ background: "rgba(0,0,0,0.5)", padding: "1.4rem", borderRadius: "3px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Bus size={16} color="#e61d1d" />
                <h4 style={{ color: "#ff3b3b", margin: 0, fontSize: "0.95rem", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>By Bus</h4>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#888888", lineHeight: 1.6 }}>
                APSRTC buses running between Vijayawada and Guntur stop directly at Nambur VVIT Bus Stop.
              </p>
            </div>

            <div style={{ background: "rgba(0,0,0,0.5)", padding: "1.4rem", borderRadius: "3px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Plane size={16} color="#e61d1d" />
                <h4 style={{ color: "#ff3b3b", margin: 0, fontSize: "0.95rem", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>By Flight</h4>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#888888", lineHeight: 1.6 }}>
                Vijayawada International Airport (Gannavaram - 42 km). Taxis and ride-shares available on arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
