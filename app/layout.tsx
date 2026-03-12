import type { Metadata } from "next";
import { Geist, Geist_Mono, Jost, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
    variable: "--font-cormorant-garamond",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
  });

export const metadata: Metadata = {
  title: "Nels Martin",
  description: "Nels Martin's Personal Website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorantGaramond.variable} antialiased`}>{children}</body>
    </html>
  );
}
