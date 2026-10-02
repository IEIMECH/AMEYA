import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team & Organizing Cadre — AMEYA '26 | IEI SAME",
  description: "Meet the student convenors, faculty coordinators, and technical core committee orchestrating AMEYA '26 under the aegis of IEI SAME at VVIT Nambur.",
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
