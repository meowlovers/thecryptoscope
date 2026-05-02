import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
  title: "The Chart Scope — The Sharpest View in Crypto",
  description:
    "Professional cryptocurrency market analysis. No signals, just pure in-depth research. Technical, fundamental & combined analysis from $5 per report.",
  keywords: ["crypto analysis", "bitcoin analysis", "technical analysis", "cryptocurrency", "BTC", "ETH", "chart scope"],
  openGraph: {
    title: "The Chart Scope — The Sharpest View in Crypto",
    description: "Professional crypto market analysis delivered to your inbox. From $5.",
    type: "website",
    url: "https://thechartscope.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full`}
      >
        <body className="min-h-full flex flex-col bg-[#050a0e] text-[#e8f0f7]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
