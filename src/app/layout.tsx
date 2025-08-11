import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Currency & Cost of Living",
  description: "FX conversion and cost-of-living adjustments",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <main className="max-w-3xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
