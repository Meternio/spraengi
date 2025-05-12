import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { fetchDatasource } from "@/lib/storyblok_utils";
import { DatasourcesStoreProvider } from "@/components/DatasourcesStoreProvider";
import "./globals.css";
import StoryblokProvider from "@/components/StoryblokProvider";
import StoryblokClientProvider from "@/components/StoryblokClientProvider";
import QueryProvider from "@/components/QueryProvider";

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
    "theming",
    "reserve",
    "event-booking",
  ]);

  return (
    <html lang="de">
      <body className={`${inter.variable} font-sans dark`}>
        <StoryblokProvider>
          <StoryblokClientProvider>
            <QueryProvider>
              <DatasourcesStoreProvider
                initialData={{
                  datasources: datasourceData.datasources,
                  isLoading: false,
                }}
              >
                {children}
              </DatasourcesStoreProvider>
            </QueryProvider>
          </StoryblokClientProvider>
        </StoryblokProvider>
      </body>
    </html>
  );
}
