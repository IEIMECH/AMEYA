import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Arenas — AMEYA '26 | IEI SAME",
  description: "Participate in 10+ precision engineering competitions, CAD modeling clashes, RC robotics battles, and technical paper defenses at AMEYA '26, VVIIT Nambur.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
