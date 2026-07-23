import type { Metadata } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import NavBar from "@/components/NavBar";

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
        <Providers>
          <NavBar />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
