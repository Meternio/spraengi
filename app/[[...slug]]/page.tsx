import { StoryblokStory } from "@storyblok/react/rsc";
import { fetchStory } from "@/lib/storyblok_utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { getStoryblokApi } from "@/lib/storyblok";

export async function generateStaticParams() {
  return [];
}

type Params = Promise<{ slug?: string[] }>;

export default async function Page({ params }: { params: Params }) {
  getStoryblokApi();
  const slug = (await params).slug;
  const pageData = await fetchStory("published", slug);

  if (!pageData?.story || !pageData?.story?.content) {
    notFound();
  }

  return (
    <>
      <Header pageData={pageData.story} />
      <StoryblokStory story={pageData.story} />
      <Footer pageData={pageData.story} />
    </>
  );
}
