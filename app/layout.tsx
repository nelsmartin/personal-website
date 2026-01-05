import type { Metadata } from "next";
import { Geist, Geist_Mono, Jost } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Nels Martin",
  description: "Nels Martin's Personal Website.",
  openGraph: {
    title: 'Nels Martin',
    description: 'Nels Martin Personal Website',
    url: 'https://nelsmartin.com',
    siteName: 'Nels Martin',
    images: [
      {
        url: 'https://nelsmartin.com/og-image.jpeg', // Must be absolute URL
        width: 882,
        height: 882,
        alt: 'Preview image description',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.variable} antialiased`}>{children}</body>
    </html>
  );
}
