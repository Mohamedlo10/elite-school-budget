//"use client";

import { Providers } from '@/providers/providers';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Elite Budgetisation',
  description: 'An intelligent budgetisation platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Providers>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </Providers>
    </html>
  );
}
