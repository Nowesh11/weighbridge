import type { Metadata } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--barlow-condensed",
});
const inter = Inter({ subsets: ["latin"], variable: "--inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--jetbrains-mono" });

export const metadata: Metadata = {
  title: "Weighbridge Ticketing — Eng Heng Steel",
  description: "Key in weighbridge tickets, print slips, and search past records.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        <div className="no-print sticky top-0 z-20 border-b border-line bg-graphite-900 text-steel-50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber-500 font-display text-lg font-bold text-graphite-900">
                W
              </span>
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold tracking-wide">Weighbridge Ticketing</p>
                <p className="text-[11px] uppercase tracking-[0.15em] text-steel-300">Eng Heng Steel Sdn Bhd</p>
              </div>
            </div>
            <nav className="flex items-center gap-1 font-display text-sm uppercase tracking-wide">
              <Link
                href="/"
                className="rounded-sm px-4 py-2 text-steel-100 transition hover:bg-graphite-700 hover:text-white"
              >
                New Ticket
              </Link>
              <Link
                href="/receipts"
                className="rounded-sm px-4 py-2 text-steel-100 transition hover:bg-graphite-700 hover:text-white"
              >
                Records
              </Link>
            </nav>
          </div>
        </div>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
