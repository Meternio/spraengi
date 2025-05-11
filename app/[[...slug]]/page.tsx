import { StoryblokStory } from "@storyblok/react/rsc";
import { fetchStory } from "@/lib/storyblok";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  return [];
}

type Params = Promise<{ slug?: string[] }>;

export default async function Page({ params }: { params: Params }) {
  const slug = (await params).slug;
  const pageData = await fetchStory("published", slug);

  return (
    <>
      <Header pageData={pageData.story} />
      <StoryblokStory story={pageData.story} />
      <Footer pageData={pageData.story} />
    </>
  );
}
