import { ImageResponse } from "next/og";

export const alt = "AMEYA '26 — National Level Technical Conclave | IEI SAME";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "#080808",
          position: "relative",
          fontFamily: "sans-serif",
          color: "#F2EDE8",
        }}
      >
        {/* Deep burgundy radial ambient glow */}
        <div
          style={{
            position: "absolute",
            right: "-100px",
            top: "-100px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(229, 29, 37, 0.22) 0%, transparent 70%)",
          }}
        />

        {/* Top Header Tag */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#E51D25",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                letterSpacing: "0.2em",
                color: "#96908B",
                textTransform: "uppercase",
                fontFamily: "monospace",
              }}
            >
              IEI SAME // 2026 CONCLAVE CADRE
            </span>
          </div>
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "0.15em",
              color: "#E51D25",
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            OCTOBER 04–05, 2026
          </span>
        </div>

        {/* Central Monumental Brand Statement */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 900,
              letterSpacing: "0.1em",
              color: "#E51D25",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            AMEYA &apos;26
          </div>
          <div
            style={{
              fontSize: "60px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#F2EDE8",
              textTransform: "uppercase",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>WHERE ENGINEERS</span>
            <span>DARE TO DREAM.</span>
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#96908B",
              maxWidth: "680px",
              lineHeight: 1.5,
              marginTop: "12px",
              display: "flex",
            }}
          >
            National Level Technical Conclave · Autonomous Combat Robotics · 24H Prototyping
          </div>
        </div>

        {/* Bottom Technical Metadata */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            fontFamily: "monospace",
            fontSize: "13px",
            letterSpacing: "0.12em",
            color: "#96908B",
          }}
        >
          <span>DEPARTMENT OF MECHANICAL ENGINEERING</span>
          <span style={{ color: "#E51D25" }}>VVIIT // NAMBUR, GUNTUR</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
