import { fetchDatasource } from "@/lib/storyblok_utils";
import { DatasourcesStoreProvider } from "@/components/DatasourcesStoreProvider";

export default async function DraftLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const datasourceData = await fetchDatasource(
    ["theming", "reserve", "event-booking"],
    "draft"
  );

  const theming = datasourceData.datasources.theming || {};
  const themingVariables = Object.entries(theming)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(" ");

  return (
    <>
      <DatasourcesStoreProvider
        initialData={{
          datasources: datasourceData.datasources,
          version: "draft",
          isLoading: false,
        }}
      >
        {children}
      </DatasourcesStoreProvider>
      <style>{`
        :root, .dark {
          ${themingVariables}
        }
      `}</style>
    </>
  );
}
