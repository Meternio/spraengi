import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { fetchDatasource } from "@/lib/storyblok";
import { DatasourcesStoreProvider } from "@/components/DatasourcesStoreProvider";
import "./globals.css";
import StoryblokProvider from "@/components/StoryblokProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  const datasourceData = await fetchDatasource([
    "opening-hours",
    "company-details",
    "theming",
  ]);

  return (
    <html lang="de">
      <body className={`${inter.variable} font-sans dark`}>
        <StoryblokProvider>
          <DatasourcesStoreProvider
            initialData={{
              datasources: datasourceData.datasources,
              isLoading: false,
            }}
          >
            {children}
          </DatasourcesStoreProvider>
        </StoryblokProvider>
      </body>
    </html>
  );
}