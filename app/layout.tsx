import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LabSentry — Investigate why QC keeps shifting",
  description: "LabSentry is exploring a service that connects analyzer QC patterns with calibration, reagent changes, maintenance, and confirmed service findings.",
  openGraph: {
    title: "LabSentry — Investigate why QC keeps shifting",
    description: "Seeking input from independent analyzer service professionals.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
