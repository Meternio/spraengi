// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { cache } from "react";
import type { ISbStoryData } from "@storyblok/react/rsc";

// Create a cache to store the latest story data
const storyCache = new Map<string, ISbStoryData>();

// Server action to update story
export async function updateStory(story: ISbStoryData, path: string) {
  // Store the updated story in the cache
  storyCache.set(story.uuid, story);
  
  // Revalidate the current path to reflect changes
  revalidatePath(path);
}

// Function to get story (either from cache or from Storyblok)
export const getStory = cache(async (slug?: string[], version: "draft" | "published" = "published") => {
  // For draft mode, check if we have a cached version
  if (version === "draft") {
    const cachedStory = Array.from(storyCache.values()).find(story => {
      const storySlug = story.full_slug === 'home' ? '' : story.full_slug;
      const requestSlug = !slug || slug.length === 0 ? 'home' : slug.join('/');
      return storySlug === requestSlug;
    });
    
    if (cachedStory) {
      return { story: cachedStory };
    }
  }
  
  // If not in cache or not in draft mode, fetch from API
  const correctSlug = `/${slug ? slug.join("/") : "home"}`;

  const response = await fetch(
    `https://api.storyblok.com/v2/cdn/stories${correctSlug}?version=${version}&token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`,
    {
      next: { tags: ["cms"] },
      cache: version === "published" ? "default" : "no-store",
    }
  );
  
  const data = await response.json();
  
  // If in draft mode, store in cache for future use
  if (version === "draft" && data.story) {
    storyCache.set(data.story.uuid, data.story);
  }
  
  return data as { story: ISbStoryData };
});
