import type { Metadata, Viewport } from "next";
import { Syne, Plus_Jakarta_Sans, Space_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/common/MobileStickyCTA";
import CookieConsent from "@/components/common/CookieConsent";
import MotionBackground from "@/components/common/MotionBackground";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#E51D25",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://ameyafest.vercel.app"),
  title: {
    default: "Home — AMEYA '26 | IEI SAME",
    template: "%s",
  },
  description:
    "Explore AMEYA '26 at VVIIT Nambur — premier national mechanical engineering technical conclave featuring autonomous robotics, CAD design sprints, research symposiums, and engineering championships.",
  keywords: [
    "AMEYA 2026",
    "IEI SAME",
    "VVIIT Nambur",
    "Mechanical Engineering Conclave",
    "RoboWars India",
    "CAD Clash",
    "Paper Presentation",
    "Autonomous Robotics",
  ],
  authors: [{ name: "IEI SAME Student Chapter, VVIIT" }],
  creator: "Department of Mechanical Engineering, VVIIT Nambur",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/icon-192.svg", type: "image/svg+xml", sizes: "192x192" },
      { url: "/icon-512.svg", type: "image/svg+xml", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.svg", type: "image/svg+xml", sizes: "180x180" },
    ],
  },
  openGraph: {
    title: "AMEYA '26 — National Technical Conclave | IEI SAME",
    description: "Where Engineers Dare to Dream. October 04–05, 2026 at VVIIT Nambur, Guntur.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://ameyafest.vercel.app",
    siteName: "AMEYA '26",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AMEYA '26 — National Technical Conclave | IEI SAME",
    description: "Where Engineers Dare to Dream. Autonomous Robotics, 24H Prototyping & CAD at VVIIT Nambur.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${syne.variable} ${plusJakarta.variable} ${spaceMono.variable} ${playfair.variable}`}
    >
      <body suppressHydrationWarning>
        <Nav />
        <MotionBackground />
        <main>{children}</main>
        <MobileStickyCTA />
        <CookieConsent />
        <Footer />
      </body>
    </html>
  );
}
