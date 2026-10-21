import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LabSentry — Keep lab records organized",
  description: "LabSentry is exploring a shared workspace for small to medium labs managing QC and maintenance in spreadsheets.",
  openGraph: {
    title: "LabSentry — Keep lab records organized",
    description: "Speaking with lab staff about missing records, overdue tasks, and audit preparation.",
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
