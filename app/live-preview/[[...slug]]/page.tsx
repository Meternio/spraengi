import { StoryblokStory } from "@storyblok/react/rsc";
import { fetchStory } from "@/lib/storyblok";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Params = Promise<{ slug?: string[] }>;

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "edge";
export const maxDuration = 0;

export default async function Page({ params }: { params: Params }) {
  const slug = (await params).slug;
  const pageData = await fetchStory("draft", slug);

  return (
    <>
      <Header
        pageData={pageData.story}
      />
      <StoryblokStory story={pageData.story} />
      <Footer 
        pageData={pageData.story}/>
    </>
  );
}
