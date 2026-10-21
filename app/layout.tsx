import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LabSentry — QC Intelligence for Veterinary Diagnostic Labs",
  description: "Automated Levy-Jennings charts, Westgard rules, audit trails, and corrective action workflows. Built specifically for vet labs.",
  openGraph: {
    title: "LabSentry — QC Intelligence for Vet Labs",
    description: "Stop chasing spreadsheets. Start catching instrument drift before it catches you.",
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
