import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticket Accreditation Dossier — AMEYA '26 | IEI SAME",
  description: "Official cryptographic ticket pass and campus gate clearance for AMEYA '26 delegates at VVIIT Nambur.",
};

export default function TicketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
