import { StoryblokStory } from "@storyblok/react/rsc";
import { fetchStory } from "@/lib/storyblok_utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryblokBridge from "@/components/StoryblokBridge";
import { updateStory } from "@/app/actions";

type Params = Promise<{ slug?: string[] }>;

export default async function Page({ params }: { params: Params }) {
  const slug = (await params).slug;
  const pageData = await fetchStory("draft", slug);

  return (
    <StoryblokBridge storyId={pageData.story.id} updateStory={updateStory}>
      <Header pageData={pageData.story} />
      <StoryblokStory story={pageData.story} />
      <Footer pageData={pageData.story} />
    </StoryblokBridge>
  );
}
