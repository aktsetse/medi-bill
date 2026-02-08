"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalysisProvider } from "./context/AnalysisContext";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <AnalysisProvider>
            {children}
          </AnalysisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
