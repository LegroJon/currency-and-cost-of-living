import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Currency & Cost of Living",
  description: "FX conversion and cost-of-living adjustments",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-900 text-slate-100 antialiased">
        <ThemeProvider>
          <main className="max-w-3xl mx-auto p-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
