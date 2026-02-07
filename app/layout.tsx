import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookForge — AI English Workbook Generator",
  description:
    "Generate print-ready English learning workbooks for Amazon KDP in minutes, not weeks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
