import { Metadata } from "next";
import InteractiveTeamGallery from "@/components/team/InteractiveTeamGallery";

export const metadata: Metadata = {
  title: "The Team - AMEYA '26 | IEI SAME Student Chapter",
  description: "Meet the student council engineers and faculty advisors leading the AMEYA '26 mechanical fest at VVIT.",
};

export default function TeamPage() {
  return <InteractiveTeamGallery />;
}