"use client";

import { getStoryblokApi } from "@/lib/storyblok";

export default function StoryblokClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  getStoryblokApi();
  return children;
}