import { fetchDatasource } from "@/lib/storyblok_utils";
import { DatasourcesStoreProvider } from "@/components/DatasourcesStoreProvider";

export default async function PublishedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const datasourceData = await fetchDatasource([
    "theming",
    "reserve",
    "event-booking",
  ], 'published');

  return (
    <DatasourcesStoreProvider
      initialData={{
        datasources: datasourceData.datasources,
        version: 'published',
        isLoading: false,
      }}
    >
      {children}
    </DatasourcesStoreProvider>
  );
}
