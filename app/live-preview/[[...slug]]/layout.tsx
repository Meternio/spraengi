import { fetchDatasource } from "@/lib/storyblok_utils";
import { DatasourcesStoreProvider } from "@/components/DatasourcesStoreProvider";

export default async function DraftLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const datasourceData = await fetchDatasource([
    "theming",
    "reserve",
    "event-booking",
  ], 'draft');

  return (
    <DatasourcesStoreProvider
      initialData={{
        datasources: datasourceData.datasources,
        version: 'draft',
        isLoading: false,
      }}
    >
      {children}
    </DatasourcesStoreProvider>
  );
}
