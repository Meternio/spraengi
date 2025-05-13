// components/StoryblokBridge.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function StoryblokBridge({ 
  storyId, 
  updateStory, 
  children 
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Only load the bridge in preview mode
    if (!window.location.search.includes("_storyblok")) {
      return;
    }

    // Load the Storyblok Bridge script
    const script = document.createElement("script");
    script.src = "//app.storyblok.com/f/storyblok-v2-latest.js";
    script.async = true;
    document.body.appendChild(script);

    let bridge;

    script.onload = () => {
      const { StoryblokBridge } = window;
      if (StoryblokBridge) {
        bridge = new StoryblokBridge({
          preventClicks: false,
        });

        // Listen for input events
        bridge.on(["input"], async (payload) => {
            if (payload && payload.story) {
              console.log("Storyblok input event received", payload.story);
              await updateStory(payload.story, pathname);
            }
          });

        // Listen for publish events
        bridge.on(["published"], async () => {
          console.log("Storyblok publish event received");
          window.location.reload();
        });
      }
    };

    return () => {    
      // Remove script if it exists
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [storyId, updateStory, pathname]);

  return <>{children}</>;
}