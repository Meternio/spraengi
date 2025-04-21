import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

storyblokInit({
  accessToken: process.env.STORYBLOK_API_KEY,
  use: [apiPlugin],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "SPRÄNGI BAR & CAFE - Coming Soon",
  description: "Die neue Bar Sprängi öffnet bald ihre Türen. Bleibe auf dem Laufenden!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${inter.variable} font-sans dark`}
      >
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
