import { StoryblokStory } from "@storyblok/react/rsc";
import { fetchStory, fetchDatasource } from "@/lib/storyblok";
import StoreProvider from "@/components/StoreProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Params = Promise<{ slug?: string[] }>;

export default async function Page({ params }: { params: Params }) {
  const slug = (await params).slug;
  const pageData = await fetchStory("draft", slug);
  const datasourceData = await fetchDatasource([
    "opening-hours",
    "company-details",
    "theming",
  ]);

  return (
    <StoreProvider initialData={datasourceData.datasources}>
      <Header datasources={datasourceData.datasources} />
      <div className="min-h-[200vh]">
        <StoryblokStory story={pageData.story} />
      </div>
      <Footer datasources={datasourceData.datasources}/>
    </StoreProvider>
  );
}
