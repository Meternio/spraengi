import { StoryblokStory } from "@storyblok/react/rsc";
import { fetchStory } from "@/lib/storyblok";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Params = Promise<{ slug?: string[] }>;

export default async function Page({ params }: { params: Params }) {
  const slug = (await params).slug;
  const pageData = await fetchStory("draft", slug);

  return (
    <>
      <Header
        pageData={pageData.story}
      />
      <div className="min-h-[200vh]">
        <StoryblokStory story={pageData.story} />
      </div>
      <Footer/>
    </>
  );
}
