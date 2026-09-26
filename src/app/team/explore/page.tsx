import { Metadata } from "next";
import ExploreUniverse from "@/components/team/ExploreUniverse";

export const metadata: Metadata = {
  title: "Cadre Universe Explorer — AMEYA '26 | IEI SAME",
  description: "Interactive 2.5D draggable universe exploring the engineering council and organizing cadre behind AMEYA '26 at VVIIT Nambur.",
};

export default function TeamExplorePage() {
  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#080808" }}>
      <ExploreUniverse />
    </main>
  );
}
