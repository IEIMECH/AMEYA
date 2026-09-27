import { Metadata } from "next";
import OversizedArcOrbit from "@/components/team/OversizedArcOrbit";

export const metadata: Metadata = {
  title: "Organizing Cadre — AMEYA '26 | IEI SAME Student Chapter",
  description: "Interactive oversized arc orbit showcase of the 18 student council engineers driving AMEYA '26 mechanical fest at VVIT.",
};

export default function TeamPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#080808", position: "relative", overflow: "hidden" }}>
      <OversizedArcOrbit />
    </main>
  );
}
