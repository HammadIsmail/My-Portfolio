import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { PortfolioProvider } from "@/context/PortfolioContext";

import QueryProvider from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
  ),
  title: "Hammad's Portfolio",
  description:
    "Muhammad Hammad — Backend & Full-Stack Developer specializing in Java, Spring Boot, TypeScript, React, Next.js, React Native, Python, FastAPI, and AI-powered applications.",
  openGraph: {
    title: "Hammad's Portfolio",
    description:
      "Muhammad Hammad — Backend & Full-Stack Developer specializing in Java, Spring Boot, TypeScript, React, Next.js, React Native, Python, FastAPI, and AI-powered applications.",
    type: "website",
    images: [
      {
        url: "/profile.webp",
        width: 800,
        height: 800,
        alt: "Muhammad Hammad - Backend & Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hammad's Portfolio",
    description:
      "Muhammad Hammad — Backend & Full-Stack Developer specializing in Java, Spring Boot, TypeScript, React, Next.js, React Native, Python, FastAPI, and AI-powered applications.",
    images: ["/profile.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <PortfolioProvider>
              {children}
            </PortfolioProvider>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
