import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kritvia - AI Business Operating System",
    template: "%s | Kritvia",
  },
  description: "The AI Operating System for Your Entire Business - Transform leads, deals, and revenue with AI",
  keywords: ["AI", "Business", "Operating System", "CRM", "SaaS", "Automation", "Lead Management", "Sales"],
  authors: [{ name: "Kritvia" }],
  creator: "Kritvia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kritvia.com",
    siteName: "Kritvia",
    title: "Kritvia - AI Business Operating System",
    description: "The AI Operating System for Your Entire Business",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kritvia - AI Business OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kritvia - AI Business Operating System",
    description: "The AI Operating System for Your Entire Business",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900`}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
