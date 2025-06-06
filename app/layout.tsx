import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import StoryblokProvider from "@/components/StoryblokProvider";
import StoryblokClientProvider from "@/components/StoryblokClientProvider";
import QueryProvider from "@/components/QueryProvider";

const klavika = localFont({
  src: '../public/klavika-bold.otf',
  variable: '--font-klavika',
});

const fira_sans = Fira_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fira-sans",
});

export const metadata: Metadata = {
  title: "SPRÄNGI BAR & CAFE - Cocktails & Kaffee in Zürich Oberland",
  description:
    "Entdecken die Bar Sprängi: Wo Kaffeekultur auf Cocktail-Kunst trifft. Erleben außergewöhnliche Getränke, leckere Snacks und eine einzigartige Atmosphäre.",
  applicationName: "SPRÄNGI BAR & CAFE",
  keywords: [
    "Bar Zürich Oberland", "Cafe Zürich Oberland", "Cocktails", "Kaffee", "Restaurant Zürich Oberland",
    "Cocktailbar", "Kaffeespezialitäten", "Reservierung", "Events", 
    "Sprängi", "Bar", "Cafe", "Drinks", "Nightlife Zürich Oberland"
  ],
  authors: [
    { name: "SPRÄNGI BAR & CAFE", url: "https://spraengi.com" }
  ],
  creator: "SPRÄNGI BAR & CAFE",
  publisher: "SPRÄNGI BAR & CAFE",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${fira_sans.variable} ${klavika.variable} font-sans dark max-w-[2000px] mx-auto`}>
        <StoryblokProvider>
          <StoryblokClientProvider>
            <QueryProvider>{children}</QueryProvider>
          </StoryblokClientProvider>
        </StoryblokProvider>
      </body>
    </html>
  );
}
