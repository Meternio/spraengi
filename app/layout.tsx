import type { Metadata } from "next";
import { Fira_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import StoryblokProvider from "@/components/StoryblokProvider";
import StoryblokClientProvider from "@/components/StoryblokClientProvider";
import QueryProvider from "@/components/QueryProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-montserrat",
});

const fira_sans = Fira_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fira-sans",
});

export const metadata: Metadata = {
  title: "SPRÄNGI BAR & CAFE - Coming Soon",
  description:
    "Die neue Bar Sprängi öffnet bald ihre Türen. Bleibe auf dem Laufenden!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${fira_sans.variable} ${montserrat.variable} font-sans dark max-w-[2000px] mx-auto`}>
        <StoryblokProvider>
          <StoryblokClientProvider>
            <QueryProvider>{children}</QueryProvider>
          </StoryblokClientProvider>
        </StoryblokProvider>
      </body>
    </html>
  );
}
