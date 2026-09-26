import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda & Schedule — AMEYA '26 | IEI SAME",
  description: "Two-day chronological timeline of technical competitions, keynote addresses, hardware hackathons, and valedictory awards at AMEYA '26, VVIIT Nambur.",
};

export default function AgendaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
